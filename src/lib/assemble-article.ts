import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { markImages, type ImageOptions } from './images.ts';
import { markTableCaptions } from './tables.ts';

const INCLUDE = /^\[sections\/[^\]\n]+\]\((sections\/[^)\n]+\.md)\)\s*$/;
const COMMENT = /<!--[\s\S]*?-->/g;
const HEADING = /^(#{1,4})(\s)/;

/** Retire les commentaires HTML (`<!-- -->`), mono ou multi-ligne (les sources n'ont pas de bloc de code). */
export function stripComments(markdown: string): string {
  return markdown.replace(COMMENT, '');
}

export interface Article {
  title: string;
  markdown: string;
}

/** Décale d'un niveau les titres `#` à `####` (les sections n'ont pas de bloc de code). */
export function shiftHeadings(markdown: string): string {
  return markdown
    .split('\n')
    .map((line) => line.replace(HEADING, '#$1$2'))
    .join('\n');
}

/** Assemble `main.md` : chaque ligne d'inclusion est remplacée par le contenu du fichier, titres décalés. */
export function assembleArticle(mainPath: string, images: ImageOptions = { root: resolve(dirname(mainPath), '../..') }): Article {
  const dir = dirname(mainPath);
  const prepare = (md: string, file: string) => markImages(markTableCaptions(md, file), file, images);
  const main = prepare(stripComments(readFileSync(mainPath, 'utf8')), mainPath);
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
    return prepare(shiftHeadings(stripComments(content).trim()), file);
  });
  const markdown = lines.join('\n');
  const title = /^# (.+)$/m.exec(markdown)?.[1].trim();
  if (!title) throw new Error(`Titre "# …" introuvable dans ${mainPath}`);
  return { title, markdown };
}
