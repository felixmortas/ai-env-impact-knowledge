import { readFileSync } from 'node:fs';

export interface BibEntry {
  key: string;
  type: string;
  fields: Record<string, string>;
}

export interface FormattedEntry {
  /** Texte brut (non échappé) de la référence, sans l'URL. */
  text: string;
  url?: string;
}

const SKIPPED_TYPES = new Set(['comment', 'string', 'preamble']);

/**
 * Lit un fichier BibTeX (entrées `@type{clé, champ = {…} | "…" | nombre | macro}`).
 * Échoue en nommant l'entrée (clé ou ligne) si elle est mal formée ou dupliquée.
 */
export function parseBibtex(source: string, file = 'références.bib'): Map<string, BibEntry> {
  const entries = new Map<string, BibEntry>();
  const lineAt = (pos: number) => source.slice(0, pos).split('\n').length;
  let i = 0;
  while ((i = source.indexOf('@', i)) !== -1) {
    const start = i;
    const head = /^@\s*([A-Za-z]+)\s*([{(])/.exec(source.slice(i, i + 80));
    if (!head) throw new Error(`Entrée BibTeX mal formée (type ou "{" attendu) : ${file}, ligne ${lineAt(start)}`);
    const type = head[1].toLowerCase();
    if (head[2] !== '{') throw new Error(`Entrée BibTeX mal formée (seul le délimiteur "{" est géré) : ${file}, ligne ${lineAt(start)}`);
    i += head[0].length;
    const bodyStart = i;
    // Corps jusqu'à l'accolade fermante correspondante.
    let depth = 1;
    for (; i < source.length && depth > 0; i++) {
      const c = source[i];
      if (c === '\\') i++;
      else if (c === '{') depth++;
      else if (c === '}') depth--;
    }
    if (depth > 0) {
      const name = /^\s*([^,\s]+)\s*,/.exec(source.slice(bodyStart, bodyStart + 200))?.[1] ?? `ligne ${lineAt(start)}`;
      throw new Error(`Entrée BibTeX mal formée (accolade non fermée) : "${name}" dans ${file}`);
    }
    if (SKIPPED_TYPES.has(type)) continue;
    const body = source.slice(bodyStart, i - 1);
    const entry = parseBody(type, body, file, lineAt(start));
    if (entries.has(entry.key)) throw new Error(`Entrée BibTeX en double : "${entry.key}" dans ${file}`);
    entries.set(entry.key, entry);
  }
  return entries;
}

function parseBody(type: string, body: string, file: string, line: number): BibEntry {
  const keyMatch = /^\s*([^,\s{}"=]+)\s*,/.exec(body);
  if (!keyMatch) throw new Error(`Entrée BibTeX mal formée (clé absente) : ${file}, ligne ${line}`);
  const key = keyMatch[1];
  const fail = (why: string): never => {
    throw new Error(`Entrée BibTeX mal formée (${why}) : "${key}" dans ${file}`);
  };
  const fields: Record<string, string> = {};
  let p = keyMatch[0].length;
  const skipSpace = () => {
    while (p < body.length && /\s/.test(body[p])) p++;
  };
  for (;;) {
    skipSpace();
    while (body[p] === ',') {
      p++;
      skipSpace();
    }
    if (p >= body.length) break;
    const name = /^[A-Za-z][A-Za-z0-9_-]*/.exec(body.slice(p))?.[0];
    if (!name) return fail(`nom de champ attendu près de "${body.slice(p, p + 20).trim()}"`);
    p += name.length;
    skipSpace();
    if (body[p] !== '=') return fail(`"=" attendu après le champ "${name}"`);
    p++;
    skipSpace();
    let value: string;
    if (body[p] === '{') {
      let depth = 0;
      const from = p;
      for (; p < body.length; p++) {
        if (body[p] === '\\') p++;
        else if (body[p] === '{') depth++;
        else if (body[p] === '}' && --depth === 0) break;
      }
      if (depth !== 0) return fail(`valeur non fermée pour "${name}"`);
      value = body.slice(from + 1, p);
      p++;
    } else if (body[p] === '"') {
      const from = ++p;
      let depth = 0;
      for (; p < body.length; p++) {
        if (body[p] === '\\') p++;
        else if (body[p] === '{') depth++;
        else if (body[p] === '}') depth--;
        else if (body[p] === '"' && depth === 0) break;
      }
      if (p >= body.length) return fail(`guillemet non fermé pour "${name}"`);
      value = body.slice(from, p);
      p++;
    } else {
      const bare = /^[A-Za-z0-9_:.-]+/.exec(body.slice(p))?.[0];
      if (!bare) return fail(`valeur attendue pour "${name}"`);
      value = bare;
      p += bare.length;
    }
    skipSpace();
    if (p < body.length && body[p] !== ',') return fail(`"," attendue après le champ "${name}"`);
    fields[name.toLowerCase()] = value;
  }
  return { key, type, fields };
}

export function loadBibliography(path: string): Map<string, BibEntry> {
  return parseBibtex(readFileSync(path, 'utf8'), path);
}

/** Retire les accolades de protection BibTeX et normalise les espaces ; le texte n'est pas reformulé. */
const clean = (s: string) => s.replace(/\\&/g, '&').replace(/[{}]/g, '').replace(/\s+/g, ' ').trim();

function splitAuthors(raw: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = '';
  const tokens = raw.split(/(\s+)/);
  for (const tok of tokens) {
    for (const c of tok) depth += c === '{' ? 1 : c === '}' ? -1 : 0;
    if (depth === 0 && tok === 'and') {
      parts.push(current);
      current = '';
    } else current += tok;
  }
  parts.push(current);
  return parts.map((a) => a.trim()).filter(Boolean);
}

function formatAuthor(raw: string): string {
  const braced = /^\{(.*)\}$/.exec(raw.trim());
  if (braced && !braced[1].includes('{')) return clean(braced[1]);
  const comma = raw.split(',');
  if (comma.length === 2) return clean(`${comma[1]} ${comma[0]}`);
  return clean(raw);
}

/** Met en forme une entrée : « Auteurs (année). Titre. Source. » + lien (url, sinon DOI). Aucun champ n'est inventé. */
export function formatEntry(entry: BibEntry): FormattedEntry {
  const f = entry.fields;
  const authors = f.author ? splitAuthors(f.author).map(formatAuthor).join(', ') : '';
  const year = f.year ? clean(f.year) : '';
  const parts: string[] = [];
  const lead = [authors, year ? `(${year})` : ''].filter(Boolean).join(' ');
  if (lead) parts.push(lead);
  if (f.title) parts.push(clean(f.title));
  const source = [f.journal, f.booktitle, f.organization, f.publisher]
    .filter((v): v is string => Boolean(v))
    .map(clean)
    .filter((v, idx, all) => v !== '' && all.indexOf(v) === idx);
  if (source.length) parts.push(source.join(', '));
  if (f.note) parts.push(clean(f.note));
  const text = parts.map((p) => (/[.?!]$/.test(p) ? p : `${p}.`)).join(' ');
  const doi = f.doi;
  const how = f.howpublished ? /\\url\{([^}]+)\}/.exec(f.howpublished)?.[1] : undefined;
  const url = f.url ? clean(f.url) : doi ? `https://doi.org/${clean(doi)}` : how;
  if (url && !/^https?:\/\//.test(url)) throw new Error(`URL non http(s) dans l'entrée "${entry.key}" : ${url}`);
  return url ? { text, url } : { text };
}
