import type { Config } from './config.ts';
import { canonicalUrl } from './urls.ts';

export interface PageMetadata {
  title: string;
  description: string;
  author: string;
  siteName: string;
  /** Propriétés Open Graph / article, dans l'ordre d'émission. */
  og: { property: string; content: string }[];
}

type Translate = (key: string) => string;

function required(t: Translate, lang: string, key: string): string {
  const value = t(key);
  if (value.trim() === '') throw new Error(`Métadonnées : chaîne "${key}" vide dans ${lang}.json`);
  return value.trim();
}

/** Construit les métadonnées de la page d'une langue depuis la config et les chaînes ; échoue en nommant la clé et la langue. */
export function buildMetadata(config: Config, lang: string, title: string, t: Translate): PageMetadata {
  const description = required(t, lang, 'meta.description');
  const siteName = required(t, lang, 'meta.siteName');
  const url = canonicalUrl(lang, config.siteUrl);
  return {
    title,
    description,
    author: `${config.firstName} ${config.lastName}`,
    siteName,
    og: [
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'article' },
      { property: 'og:url', content: url },
      { property: 'og:locale', content: lang },
      { property: 'og:site_name', content: siteName },
      { property: 'article:published_time', content: config.publishedDate },
      { property: 'article:modified_time', content: config.modifiedDate },
      { property: 'article:author', content: `${config.firstName} ${config.lastName}` },
    ],
  };
}
