import { useEffect, useMemo, useRef, useState } from 'react';
import type { TocNode } from '../lib/toc';
import { activeIndex, progressRatio, type Measures } from '../lib/toc-progress';

interface Props { nodes: TocNode[]; label: string; progressLabel: string }

function flatten(nodes: TocNode[]): string[] {
  return nodes.flatMap((n) => [n.slug, ...flatten(n.children)]);
}

/** Suivi du défilement : titre actif et progression. Aucun effet côté serveur. */
function useReadingState(slugs: string[]) {
  const [state, setState] = useState<{ active: string | null; ratio: number; ready: boolean }>({ active: null, ratio: 0, ready: false });
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const els = slugs.map((s) => document.getElementById(s));
      const main = document.querySelector('main');
      const rect = main?.getBoundingClientRect();
      const scrollY = window.scrollY;
      const m: Measures = {
        tops: els.map((e) => (e ? e.getBoundingClientRect().top : Number.POSITIVE_INFINITY)),
        scrollY,
        viewportHeight: window.innerHeight,
        documentHeight: document.documentElement.scrollHeight,
        articleTop: rect ? rect.top + scrollY : 0,
        articleBottom: rect ? rect.bottom + scrollY : document.documentElement.scrollHeight,
      };
      const i = activeIndex(m);
      const next = { active: i >= 0 ? slugs[i] : null, ratio: Math.round(progressRatio(m) * 1000) / 1000, ready: true };
      setState((prev) => (prev.active === next.active && prev.ratio === next.ratio && prev.ready ? prev : next));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('hashchange', schedule);
    window.addEventListener('load', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('hashchange', schedule);
      window.removeEventListener('load', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [slugs]);
  return state;
}

function Items({ nodes, active }: { nodes: TocNode[]; active: string | null }) {
  return (
    <ol>
      {nodes.map((n) => (
        <li key={n.slug}>
          <a href={`#${n.slug}`} aria-label={n.text} data-depth={n.depth} aria-current={n.slug === active ? 'true' : undefined}>{n.text}</a>
          {n.children.length > 0 && <Items nodes={n.children} active={active} />}
        </li>
      ))}
    </ol>
  );
}

/** Îlot `client:load` : la liste de liens est rendue au build, le suivi s'ajoute à l'hydratation. */
export default function TocProgress({ nodes, label, progressLabel }: Props) {
  const slugs = useMemo(() => flatten(nodes), [nodes]);
  const { active, ratio, ready } = useReadingState(slugs);
  const nav = useRef<HTMLElement>(null);

  // Garde l'entrée active visible dans la table (défilement local, jamais celui de la page).
  useEffect(() => {
    const box = nav.current;
    const el = box?.querySelector<HTMLElement>('[aria-current]');
    if (!box || !el) return;
    const b = box.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    if (b.width === 0 || b.height === 0) return;
    if (box.scrollWidth > box.clientWidth && (r.left < b.left || r.right > b.right)) box.scrollLeft += r.left - b.left - (b.width - r.width) / 2;
    if (box.scrollHeight > box.clientHeight && (r.top < b.top || r.bottom > b.bottom)) box.scrollTop += r.top - b.top - (b.height - r.height) / 2;
  }, [active]);

  const percent = Math.round(ratio * 100);
  return (
    <nav className="toc" aria-label={label} ref={nav}>
      {ready && (
        <div className="toc-gauge" role="progressbar" aria-label={progressLabel} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
          <div className="toc-gauge-fill" style={{ transform: `scaleX(${ratio})` }} />
        </div>
      )}
      <Items nodes={nodes} active={active} />
    </nav>
  );
}
