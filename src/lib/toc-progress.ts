/** Mesures injectées : tout est en pixels, relatif au viewport ou au document selon le champ. */
export interface Measures {
  /** `top` (viewport) de chaque titre de la table, dans l'ordre de l'article. */
  tops: number[];
  scrollY: number;
  viewportHeight: number;
  documentHeight: number;
  /** Position verticale (document) du début et de la fin de l'article. */
  articleTop: number;
  articleBottom: number;
}

/** Part du viewport, depuis le haut, qui constitue la zone de lecture. */
export const READING_LINE_RATIO = 0.3;

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/** Indice du titre actif : le dernier dont le haut a franchi la ligne de lecture ; -1 avant le premier ; le dernier en fin de page. */
export function activeIndex(m: Measures): number {
  if (m.tops.length === 0) return -1;
  if (m.scrollY + m.viewportHeight >= m.documentHeight - 1 && m.scrollY > 0) return m.tops.length - 1;
  const line = m.viewportHeight * READING_LINE_RATIO;
  let active = -1;
  for (let i = 0; i < m.tops.length; i++) {
    if (Number.isFinite(m.tops[i]) && m.tops[i] <= line) active = i;
  }
  return active;
}

/** Progression de lecture de l'article, de 0 (haut) à 1 (bas de l'article atteint au bas du viewport). */
export function progressRatio(m: Measures): number {
  const span = m.articleBottom - m.articleTop - m.viewportHeight;
  if (!Number.isFinite(span)) return 0;
  if (span <= 0) return m.scrollY + m.viewportHeight >= m.articleBottom ? 1 : 0;
  return clamp((m.scrollY - m.articleTop) / span, 0, 1);
}
