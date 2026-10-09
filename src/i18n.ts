import fr from './locales/fr.json' with { type: 'json' };

export type Messages = Record<string, string>;

/** Crée un accesseur qui lève une erreur nommant la clé si elle est absente. */
export function createT(messages: Messages) {
  return (key: string): string => {
    const value = Object.hasOwn(messages, key) ? messages[key] : undefined;
    if (typeof value !== 'string') {
      throw new Error(`Chaîne d'interface manquante dans fr.json : "${key}"`);
    }
    return value;
  };
}

export const t = createT(fr);
