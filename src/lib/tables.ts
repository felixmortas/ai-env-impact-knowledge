const CAPTION_LINE = /^Table:\s*(.*?)\s*\{#tab:[^}\s]+\}\s*$/;
// Marqueurs en caractères privés Unicode (écrits en échappements : ils sont invisibles).
const START = '\uE000CAPTION\uE001';
const END = '\uE002';
const TABLE_ROW = /^\s*\|/;
const RENDERED = new RegExp(
  `(<table[^>]*>)([\\s\\S]*?</table>)(?:\\s*<p>${START}([\\s\\S]*?)${END}</p>)?`,
  'g',
);

/**
 * Remplace chaque ligne `Table: légende {#tab:id}` (placée sous un tableau pipe) par un paragraphe repéré
 * par des marqueurs, afin que la légende soit rendue comme du Markdown puis déplacée par `applyTableCaptions`.
 * Un `Table:` sans tableau juste au-dessus fait échouer le build.
 */
export function markTableCaptions(markdown: string, file: string): string {
  const lines = markdown.split('\n');
  let previous = '';
  return lines
    .map((line, i) => {
      const isCaption = /^Table:/.test(line);
      const result = isCaption ? captionParagraph(line, previous, file, i + 1) : line;
      if (line.trim() !== '') previous = line;
      return result;
    })
    .join('\n');
}

function captionParagraph(line: string, previous: string, file: string, lineNumber: number): string {
  const match = CAPTION_LINE.exec(line);
  if (!TABLE_ROW.test(previous)) {
    throw new Error(`Légende "Table:" sans tableau juste au-dessus : ${file}, ligne ${lineNumber}`);
  }
  if (!match) {
    throw new Error(`Légende "Table:" sans identifiant {#tab:…} : ${file}, ligne ${lineNumber}`);
  }
  if (match[1] === '') {
    throw new Error(`Légende "Table:" vide : ${file}, ligne ${lineNumber}`);
  }
  return `${START}${match[1]}${END}`;
}

/** Place la légende en `<caption>` (premier enfant du tableau) et enveloppe chaque tableau dans un conteneur à défilement local. */
export function applyTableCaptions(html: string): string {
  const result = html.replace(RENDERED, (_all, open: string, rest: string, caption?: string) => {
    const withCaption = caption === undefined ? '' : `<caption>${caption}</caption>\n`;
    return `<div class="table-scroll">${open}\n${withCaption}${rest.replace(/^\n/, '')}</div>`;
  });
  if (result.includes(START)) throw new Error('Légende de tableau non associée à un tableau dans le HTML rendu');
  return result;
}
