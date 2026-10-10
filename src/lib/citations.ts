import type { BibEntry } from './bibliography.ts';

const GROUP = /\[(@[^\[\]]*)\]/g;
const KEY = /^@([A-Za-z0-9_][A-Za-z0-9_:.+/-]*)$/;

export interface CitedReference {
  key: string;
  number: number;
  /** Nombre d'appels vers cette référence (autant de liens de retour `#cite-<n>-<k>`). */
  calls: number;
}

const escapeAttr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/**
 * Suit les citations rencontrées dans l'ordre de lecture : numéro = rang de première citation.
 * `cite` remplace chaque `[@clé]` / `[@a; @b]` par des liens `<a href="#ref-clé">[n]</a>`.
 */
export function createCitations(bibliography: Map<string, BibEntry>) {
  const cited = new Map<string, CitedReference>();

  function cite(markdown: string, file: string): string {
    markdown.split('\n').forEach((line, i) => {
      if (/alt="[^"]*\[@/.test(line)) throw new Error(`Citation non gérée dans le texte alternatif d'une image : ${file}, ligne ${i + 1}`);
    });
    const out = markdown
      .split('\n')
      .map((line, i) =>
        line.replace(GROUP, (_all, inner: string) =>
          inner
            .split(';')
            .map((part) => {
              const key = KEY.exec(part.trim())?.[1];
              const where = `${file}, ligne ${i + 1}`;
              if (!key) throw new Error(`Syntaxe de citation non gérée "[${inner}]" : ${where}`);
              if (!bibliography.has(key)) throw new Error(`Clé de citation absente de references.bib : "${key}" (${where})`);
              let ref = cited.get(key);
              if (!ref) cited.set(key, (ref = { key, number: cited.size + 1, calls: 0 }));
              ref.calls++;
              const id = `cite-${ref.number}-${ref.calls}`;
              return `<a class="cite" id="${id}" href="#ref-${escapeAttr(key)}">[${ref.number}]</a>`;
            })
            .join(' '),
        ),
      );
    out.forEach((line, i) => {
      if (/\[@|\[[^\]]*\s@[A-Za-z0-9_]/.test(line)) {
        throw new Error(`Syntaxe de citation non gérée : ${file}, ligne ${i + 1} : ${line.trim().slice(0, 80)}`);
      }
    });
    return out.join('\n');
  }

  /** Références citées, par numéro croissant ; clés du `.bib` jamais citées (avertissement émis). */
  function finish() {
    const references = [...cited.values()];
    const uncited = [...bibliography.keys()].filter((k) => !cited.has(k));
    for (const key of uncited) console.warn(`[references] Entrée de references.bib jamais citée (non affichée) : "${key}"`);
    return { references, uncited };
  }

  return { cite, finish };
}
