import { test } from 'node:test';
import assert from 'node:assert/strict';
import { headLinks, hrefForRank, languageLinks, sectionRank } from './language-links.ts';

const langs = [
  { lang: 'en', name: 'English', sections: ['a', 'b'] },
  { lang: 'es', name: 'Español', sections: ['a', 'b', 'c'] },
  { lang: 'fr', name: 'Français', sections: ['a', 'b', 'c'] },
];
const links = languageLinks(langs, 'fr', '/site/');
const get = (l: string) => links.find((x) => x.lang === l)!;

test('liens statiques vers le haut de chaque langue, langue courante marquée', () => {
  assert.deepEqual(links.map((l) => l.href), ['/site/en/', '/site/es/', '/site/fr/']);
  assert.deepEqual(links.map((l) => l.current), [false, false, true]);
});

test('correspondance par rang : 3e section -> id de la 3e section', () => {
  assert.equal(hrefForRank(get('es'), 2), '/site/es/#c');
});

test('section absente dans l\'autre langue : haut de page', () => {
  assert.equal(hrefForRank(get('en'), 2), '/site/en/');
});

test('avant la première section : haut de page', () => {
  assert.equal(hrefForRank(get('es'), -1), '/site/es/');
});

test('sectionRank : les références ne comptent pas comme section', () => {
  assert.equal(sectionRank(1, 3), 1);
  assert.equal(sectionRank(3, 3), -1);
  assert.equal(sectionRank(-1, 3), -1);
});

test('head : canonical, alternate par langue et x-default vers fr', () => {
  const h = headLinks(['en', 'es', 'fr'], 'en', 'https://x.org/s');
  assert.deepEqual(h[0], { rel: 'canonical', href: 'https://x.org/s/en/' });
  assert.deepEqual(h.filter((l) => l.rel === 'alternate').map((l) => [l.hreflang, l.href]), [
    ['en', 'https://x.org/s/en/'], ['es', 'https://x.org/s/es/'], ['fr', 'https://x.org/s/fr/'], ['x-default', 'https://x.org/s/fr/'],
  ]);
});

test('une seule langue : canonical seul', () => {
  assert.deepEqual(headLinks(['fr'], 'fr', 'https://x.org'), [{ rel: 'canonical', href: 'https://x.org/fr/' }]);
});
