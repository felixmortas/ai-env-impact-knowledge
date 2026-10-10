import { getConfig } from './config.ts';

/** URL canonique d'une langue : `siteUrl` + `/<lang>/` (jamais déduite de l'URL courante). */
export function canonicalUrl(lang: string, siteUrl: string = getConfig().siteUrl): string {
  if (!/^[a-z]{2}(?:-[A-Za-z0-9]+)*$/.test(lang)) throw new Error(`Code de langue invalide : "${lang}"`);
  return `${siteUrl.replace(/\/+$/, '')}/${lang}/`;
}
