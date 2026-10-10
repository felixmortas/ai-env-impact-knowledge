import { existsSync, openSync, readSync, closeSync } from 'node:fs';
import { extname, resolve, sep } from 'node:path';

const IMAGE = /!\[([^\]]*)\]\(([^)\s]*)\)(?:\{width=(\d+(?:\.\d+)?)%\})?/g;
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const WEB_FORMATS = new Set(['.png', '.svg', '.webp']);

export interface ImageOptions {
  /** Racine du dépôt : les chemins sources `images/x.png` sont relatifs à ce dossier. */
  root: string;
  /** Base de déploiement (ex. `/ai-env-impact-knowledge`), sans slash final. */
  base?: string;
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Dimensions d'un PNG lues dans l'en-tête IHDR (sans dépendance) ; `undefined` pour les autres formats. */
export function pngSize(file: string): { width: number; height: number } | undefined {
  if (extname(file).toLowerCase() !== '.png') return undefined;
  const buf = Buffer.alloc(24);
  const fd = openSync(file, 'r');
  let read = 0;
  try {
    read = readSync(fd, buf, 0, 24, 0);
  } finally {
    closeSync(fd);
  }
  if (read < 24 || !buf.subarray(0, 8).equals(PNG_SIGNATURE) || buf.toString('latin1', 12, 16) !== 'IHDR') return undefined;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

/**
 * Remplace chaque `![légende](chemin){width=N%}` par un bloc HTML `figure` / `img` / `figcaption`.
 * Échoue sur légende vide, fichier absent ou format non web.
 */
export function markImages(markdown: string, file: string, { root, base = '' }: ImageOptions): string {
  return markdown
    .split('\n')
    .map((line, i) =>
      line.replace(IMAGE, (_all, caption: string, path: string, width?: string) => {
        const where = `${file}, ligne ${i + 1}, image "${path}"`;
        const text = caption.trim();
        if (/^[a-z][a-z0-9+.-]*:|^\/\//i.test(path)) throw new Error(`Image externe non prise en charge : ${where}`);
        if (width !== undefined && !(Number(width) > 0 && Number(width) <= 100)) {
          throw new Error(`Largeur invalide (1 à 100 % attendu) : ${where}`);
        }
        if (text === '') throw new Error(`Légende d'image vide : ${where}`);
        if (!WEB_FORMATS.has(extname(path).toLowerCase())) {
          throw new Error(`Format d'image non web (PNG, SVG ou WebP attendu) : ${where}`);
        }
        const absolute = resolve(root, path);
        if (!absolute.startsWith(resolve(root) + sep)) throw new Error(`Image hors du dépôt : ${where}`);
        if (!existsSync(absolute)) throw new Error(`Image introuvable : ${where}`);
        const size = pngSize(absolute);
        const dims = size ? ` width="${size.width}" height="${size.height}"` : '';
        const safe = escapeHtml(text);
        const src = `${base}/${path.replace(/^\/+/, '')}`;
        return (
          `\n\n<figure class="figure" style="width: ${width ?? '100'}%">` +
          `<img src="${escapeHtml(src)}" alt="${safe}"${dims} loading="lazy">` +
          `<figcaption>${safe}</figcaption></figure>\n\n`
        );
      }),
    )
    .map((line, i) => {
      if (line.includes('![') || /\{width=/.test(line)) {
        throw new Error(`Syntaxe d'image non reconnue (attendu : ![légende](images/x.png){width=N%}) : ${file}, ligne ${i + 1}`);
      }
      return line;
    })
    .join('\n');
}
