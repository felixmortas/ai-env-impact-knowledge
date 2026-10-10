export interface Heading { depth: number; slug: string; text: string }
export interface TocNode { slug: string; text: string; depth: number; children: TocNode[] }

export const TOC_MIN_DEPTH = 2;
export const TOC_MAX_DEPTH = 5;

/** Transforme la liste plate de titres (h2 à h5) en arbre. Un saut de niveau n'engendre aucun nœud vide. */
export function buildToc(headings: Heading[], extra: Heading[] = []): TocNode[] {
  const roots: TocNode[] = [];
  const stack: TocNode[] = [];
  for (const h of [...headings, ...extra]) {
    if (h.depth < TOC_MIN_DEPTH || h.depth > TOC_MAX_DEPTH) continue;
    const node: TocNode = { slug: h.slug, text: h.text, depth: h.depth, children: [] };
    while (stack.length && stack[stack.length - 1].depth >= h.depth) stack.pop();
    (stack.length ? stack[stack.length - 1].children : roots).push(node);
    stack.push(node);
  }
  return roots;
}
