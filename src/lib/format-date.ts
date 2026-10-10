/** Formate une date ISO AAAA-MM-JJ selon la langue, sans dépendre du fuseau ni de l'horloge. */
export function formatDate(iso: string, lang: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) throw new Error(`Date ISO invalide : "${iso}"`);
  const date = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  if (date.getUTCMonth() !== Number(m[2]) - 1 || date.getUTCDate() !== Number(m[3])) throw new Error(`Date ISO invalide : "${iso}"`);
  return new Intl.DateTimeFormat(lang, { dateStyle: 'long', timeZone: 'UTC' }).format(date);
}
