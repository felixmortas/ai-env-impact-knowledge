import type { Config } from './config.ts';
import { canonicalUrl } from './urls.ts';
import { formatDate } from './format-date.ts';

const SPECIAL: Record<string, string> = {
  '\\': '\\textbackslash{}',
  '&': '\\&',
  '%': '\\%',
  '$': '\\$',
  '#': '\\#',
  '_': '\\_',
  '{': '\\{',
  '}': '\\}',
  '~': '\\textasciitilde{}',
  '^': '\\textasciicircum{}',
};

/** Échappe les caractères spéciaux (La)TeX d'une valeur de champ ; les accents sont conservés. */
export function escapeBibtex(value: string): string {
  return value.replace(/[\\&%$#_{}~^]/g, (c) => SPECIAL[c]);
}

/** Dans un champ `url`, biblatex n'exige que l'échappement de `%` et `#`. */
function escapeUrl(url: string): string {
  return url.replace(/[%#]/g, (c) => `\\${c}`);
}

const STOP_WORDS = new Set(['le', 'la', 'les', 'l', 'un', 'une', 'des', 'du', 'de', 'd', 'the', 'a', 'an', 'of', 'el', 'los', 'las']);

function ascii(value: string): string {
  return value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

/** Clé de citation stable `<nom><année><mot>` : minuscules, sans accent ni espace. */
export function citationKey(lastName: string, year: string, title: string): string {
  const words = title.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  const word = words.map(ascii).find((w) => w && !STOP_WORDS.has(w)) ?? '';
  return `${ascii(lastName)}${year}${word}`;
}

/** Construit l'entrée `@misc` à partir de la config, du titre et de l'URL canonique de la langue. */
export function buildCitation(config: Config, title: string, lang: string, accessNoteTemplate: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(config.publishedDate)) throw new Error(`publishedDate invalide : ${config.publishedDate}`);
  const year = config.publishedDate.slice(0, 4);
  const key = citationKey(config.lastName, year, title);
  const note = accessNoteTemplate.replace('{date}', () => formatDate(config.modifiedDate, lang));
  return [
    `@misc{${key},`,
    `  author = {${escapeBibtex(config.lastName)}, ${escapeBibtex(config.firstName)}},`,
    `  title = {${escapeBibtex(title)}},`,
    `  year = {${year}},`,
    `  url = {${escapeUrl(canonicalUrl(lang, config.siteUrl))}},`,
    `  note = {${escapeBibtex(note)}}`,
    '}',
  ].join('\n');
}
