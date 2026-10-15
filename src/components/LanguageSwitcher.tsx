import { useEffect, useState } from 'react';
import { hrefForRank, sectionRank, type LanguageLink } from '../lib/language-links';
import { activeIndex, type Measures } from '../lib/toc-progress';

interface Props {
  links: LanguageLink[];
  label: string;
  /** Ids des titres suivis : sections `h2` de la langue courante, puis les références. */
  trackedIds: string[];
}

/** Rang de la section `h2` visible, ou -1. Mesure seulement dans le navigateur. */
function useVisibleRank(trackedIds: string[]): number {
  const [rank, setRank] = useState(-1);
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const m: Measures = {
        tops: trackedIds.map((id) => document.getElementById(id)?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY),
        scrollY: window.scrollY,
        viewportHeight: window.innerHeight,
        documentHeight: document.documentElement.scrollHeight,
        articleTop: 0,
        articleBottom: 0,
      };
      setRank(sectionRank(activeIndex(m), trackedIds.length - 1));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('hashchange', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('hashchange', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [trackedIds]);
  return rank;
}

/** Îlot `client:load` : liens vers le haut de chaque langue au build, puis vers la section de même rang. */
export default function LanguageSwitcher({ links, label, trackedIds }: Props) {
  const rank = useVisibleRank(trackedIds);
  if (links.length < 2) return null;
  return (
    <nav className="lang-switcher" aria-label={label}>
      <ul>
        {links.map((l) => (
          <li key={l.lang}>
            {l.current ? (
              <span lang={l.lang} aria-current="page">{l.name}</span>
            ) : (
              <a href={hrefForRank(l, rank)} lang={l.lang} hrefLang={l.lang}>{l.name}</a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
