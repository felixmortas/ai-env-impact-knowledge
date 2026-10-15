import { canonicalUrl } from './urls.ts';

/** Langue par défaut des moteurs de recherche (`x-default`). */
export const DEFAULT_LANG = 'fr';

export interface LanguageLink {
  lang: string;
  /** Nom de la langue dans sa propre langue. */
  name: string;
  current: boolean;
  /** Lien sans JavaScript : le haut de la page de la langue. */
  href: string;
  /** Ids des sections `h2` de cette langue, dans l'ordre des fichiers de section (références exclues). */
  sections: string[];
}

export interface LanguageInfo { lang: string; name: string; sections: string[] }

/** Un lien par langue disponible, en pointant vers le haut de page (`<base>/<lang>/`). */
export function languageLinks(languages: LanguageInfo[], current: string, base: string): LanguageLink[] {
  const prefix = base.replace(/\/+$/, '');
  return languages.map((l) => ({ ...l, current: l.lang === current, href: `${prefix}/${l.lang}/` }));
}

/**
 * Lien vers la section de même rang dans une autre langue : `<href>#<id>` si cette langue a au moins
 * `rank + 1` sections, sinon le haut de page. Un rang négatif (avant la première section) ou hors de la
 * langue courante (références) mène aussi au haut de page.
 */
export function hrefForRank(link: LanguageLink, rank: number): string {
  const id = rank >= 0 ? link.sections[rank] : undefined;
  return id ? `${link.href}#${id}` : link.href;
}

/**
 * Rang (dans la langue courante) de la section visible à partir de l'indice du titre actif parmi
 * `[...sections, références]`. -1 si aucune, ou si on est dans les références.
 */
export function sectionRank(activeIndex: number, sectionCount: number): number {
  return activeIndex >= 0 && activeIndex < sectionCount ? activeIndex : -1;
}

export interface HeadLink { rel: 'canonical' | 'alternate'; href: string; hreflang?: string }

/** Balises `<link>` du `<head>` : `canonical` vers la page, puis `alternate hreflang` par langue et `x-default`. Une seule langue : `canonical` seul. */
export function headLinks(languages: string[], current: string, siteUrl?: string): HeadLink[] {
  const links: HeadLink[] = [{ rel: 'canonical', href: canonicalUrl(current, siteUrl) }];
  if (languages.length < 2) return links;
  for (const lang of languages) links.push({ rel: 'alternate', hreflang: lang, href: canonicalUrl(lang, siteUrl) });
  const fallback = languages.includes(DEFAULT_LANG) ? DEFAULT_LANG : languages[0];
  links.push({ rel: 'alternate', hreflang: 'x-default', href: canonicalUrl(fallback, siteUrl) });
  return links;
}
