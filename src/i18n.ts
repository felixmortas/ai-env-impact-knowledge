import type fr from './locales/fr.json' with { type: 'json' };
import { defaultSrcDir, readLocale } from './lib/languages.ts';

export type Messages = Record<string, string>;
/** Clés d'interface, typées d'après la langue de référence (`fr.json`). */
export type MessageKey = keyof typeof fr;

/** Crée un accesseur qui lève une erreur nommant la langue et la clé si elle est absente. */
export function createT(lang: string, messages: Messages) {
  return (key: MessageKey | (string & {})): string => {
    const value = Object.hasOwn(messages, key) ? messages[key] : undefined;
    if (typeof value !== 'string') {
      throw new Error(`Chaîne d'interface manquante dans ${lang}.json : "${key}"`);
    }
    return value;
  };
}

const cache = new Map<string, ReturnType<typeof createT>>();

/** Chaîne d'interface `key` dans la langue `lang` (fichier `src/locales/<lang>.json`). */
export function t(lang: string, key: MessageKey): string {
  let translate = cache.get(lang);
  if (!translate) {
    translate = createT(lang, readLocale(defaultSrcDir(), lang));
    cache.set(lang, translate);
  }
  return translate(key);
}
