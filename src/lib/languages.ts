import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

/** Langue de référence : ses clés d'interface font foi pour les autres langues. */
export const REFERENCE_LANG = 'fr';
const LANG_CODE = /^[a-z]{2}(?:-[A-Za-z0-9]+)*$/;

/** Dossier `src/` du projet (le build et les scripts s'exécutent depuis la racine). */
export function defaultSrcDir(): string {
  return resolve(process.cwd(), 'src');
}

function sorted(values: Iterable<string>): string[] {
  return [...values].sort();
}

/** Langues ayant un dossier Markdown `<srcDir>/<lang>/`. */
export function markdownLanguages(srcDir: string): string[] {
  if (!existsSync(srcDir)) return [];
  return sorted(
    readdirSync(srcDir).filter((name) => LANG_CODE.test(name) && statSync(join(srcDir, name)).isDirectory()),
  );
}

/** Langues ayant un fichier de chaînes `<srcDir>/locales/<lang>.json`. */
export function localeLanguages(srcDir: string): string[] {
  const dir = join(srcDir, 'locales');
  if (!existsSync(dir)) return [];
  return sorted(
    readdirSync(dir)
      .filter((name) => name.endsWith('.json') && LANG_CODE.test(name.slice(0, -5)))
      .map((name) => name.slice(0, -5)),
  );
}

/** Lit et valide un fichier de chaînes (objet plat de chaînes). */
export function readLocale(srcDir: string, lang: string): Record<string, string> {
  const file = join(srcDir, 'locales', `${lang}.json`);
  if (!existsSync(file)) throw new Error(`Langue "${lang}" : fichier de chaînes introuvable (locales/${lang}.json)`);
  let data: unknown;
  try {
    data = JSON.parse(readFileSync(file, 'utf8'));
  } catch (e) {
    throw new Error(`Langue "${lang}" : locales/${lang}.json illisible (${(e as Error).message})`);
  }
  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error(`Langue "${lang}" : locales/${lang}.json doit être un objet de chaînes`);
  }
  for (const [key, value] of Object.entries(data)) {
    if (typeof value !== 'string') throw new Error(`Langue "${lang}" : la valeur de la clé "${key}" n'est pas une chaîne`);
  }
  return data as Record<string, string>;
}

/**
 * Découvre les langues et valide la cohérence dossiers / fichiers de chaînes / clés.
 * Échoue en nommant la langue (et la clé) ; ne compare jamais le contenu des Markdown.
 */
export function discoverLanguages(srcDir: string = defaultSrcDir()): string[] {
  const md = markdownLanguages(srcDir);
  const loc = localeLanguages(srcDir);
  for (const lang of md) {
    if (!loc.includes(lang)) throw new Error(`Langue "${lang}" : src/${lang}/ existe mais locales/${lang}.json est absent`);
  }
  for (const lang of loc) {
    if (!md.includes(lang)) throw new Error(`Langue "${lang}" : locales/${lang}.json existe mais src/${lang}/ est absent`);
  }
  if (!md.includes(REFERENCE_LANG)) throw new Error(`Langue de référence "${REFERENCE_LANG}" absente (src/${REFERENCE_LANG}/)`);
  for (const lang of md) {
    if (!existsSync(join(srcDir, lang, 'main.md'))) throw new Error(`Langue "${lang}" : src/${lang}/main.md introuvable`);
  }
  const reference = readLocale(srcDir, REFERENCE_LANG);
  for (const lang of md) {
    const messages = lang === REFERENCE_LANG ? reference : readLocale(srcDir, lang);
    for (const key of Object.keys(reference)) {
      if (!Object.hasOwn(messages, key)) throw new Error(`Langue "${lang}" : chaîne d'interface manquante "${key}" dans ${lang}.json`);
    }
  }
  return md;
}
