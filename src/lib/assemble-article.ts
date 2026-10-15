import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { markImages, type ImageOptions } from './images.ts';
import { markTableCaptions } from './tables.ts';
import type { createCitations } from './citations.ts';

const INCLUDE = /^\[sections\/[^\]\n]+\]\((sections\/([^)\n/]+)\.md)\)\s*$/;
const COMMENT = /<!--[\s\S]*?-->/g;
const HEADING = /^(#{1,4})(\s)/;

/** Retire les commentaires HTML (`<!-- -->`), mono ou multi-ligne (les sources n'ont pas de bloc de code). */
export function stripComments(markdown: string): string {
  return markdown.replace(COMMENT, '');
}

export interface Article {
  title: string;
  markdown: string;
  anchors: SectionAnchor[];
}

/** Décale d'un niveau les titres `#` à `####` (les sections n'ont pas de bloc de code). */
export function shiftHeadings(markdown: string): string {
  return markdown
    .split('\n')
    .map((line) => line.replace(HEADING, '#$1$2'))
    .join('\n');
}

export interface SectionAnchor { text: string; id: string }

/** Relève le titre principal d'une section (le `#` d'origine, devenu `##`) : son ancre sera le nom du fichier, identique dans toutes les langues. */
function sectionAnchor(shifted: string, id: string): SectionAnchor | undefined {
  const text = /^## (.+)$/m.exec(shifted)?.[1].trim();
  return text ? { text, id } : undefined;
}

/** Remplace l'ancre automatique des titres principaux par celle du fichier, dans le HTML et dans la liste des titres (table des matières). */
export function applySectionAnchors<H extends { depth: number; slug: string; text: string }>(
  html: string,
  headings: H[],
  anchors: SectionAnchor[],
): { html: string; headings: H[] } {
  let out = html;
  const result = headings.map((h) => {
    const anchor = h.depth === 2 ? anchors.find((a) => a.text === h.text) : undefined;
    if (!anchor || anchor.id === h.slug) return h;
    out = out.replace(`id="${h.slug}"`, `id="${anchor.id}"`);
    return { ...h, slug: anchor.id };
  });
  return { html: out, headings: result };
}

/** Assemble `main.md` : chaque ligne d'inclusion est remplacée par le contenu du fichier, titres décalés. */
export function assembleArticle(
  mainPath: string,
  images: ImageOptions = { root: resolve(dirname(mainPath), '../..') },
  citations?: ReturnType<typeof createCitations>,
): Article {
  const dir = dirname(mainPath);
  const prepare = (md: string, file: string) => {
    const prepared = markImages(markTableCaptions(md, file), file, images);
    return citations ? citations.cite(prepared, file) : prepared;
  };
  const main = prepare(stripComments(readFileSync(mainPath, 'utf8')), mainPath);
  const anchors: SectionAnchor[] = [];
  const lines = main.split('\n').map((line) => {
    const match = INCLUDE.exec(line);
    if (!match) return line;
    const file = resolve(dir, match[1]);
    let content: string;
    try {
      content = readFileSync(file, 'utf8');
    } catch {
      throw new Error(`Inclusion introuvable : "${match[1]}" (référencée dans ${mainPath})`);
    }
    const shifted = shiftHeadings(stripComments(content).trim());
    const anchor = sectionAnchor(shifted, match[2]);
    if (anchor) anchors.push(anchor);
    return prepare(shifted, file);
  });
  const markdown = lines.join('\n');
  const title = /^# (.+)$/m.exec(markdown)?.[1].trim();
  if (!title) throw new Error(`Titre "# …" introuvable dans ${mainPath}`);
  return { title, markdown, anchors };
}
