import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseBibtex, formatEntry } from './bibliography.ts';
import { createCitations } from './citations.ts';

const bib = parseBibtex(`
@article{a, author = {Doe, Jane and {ACME Corp}}, title = {Un {GPU} titre}, year = {2024}, journal = {Revue}, doi = {10.1/x}}
@misc{b, author = "Bob", title = "B", year = 2023, url = {https://b.org}}
@misc{c, author = {C}, title = {C}, year = {2022}}
`);

test('parseBibtex et formatEntry : auteurs, titre, année, DOI/URL, sans champ inventé', () => {
  assert.equal(bib.size, 3);
  assert.deepEqual(formatEntry(bib.get('a')!), { text: 'Jane Doe, ACME Corp (2024). Un GPU titre. Revue.', url: 'https://doi.org/10.1/x' });
  assert.equal(formatEntry(bib.get('b')!).url, 'https://b.org');
  assert.equal(formatEntry(bib.get('c')!).url, undefined);
});

test('entrée mal formée : erreur nommant l\'entrée', () => {
  assert.throws(() => parseBibtex('@misc{x1, title = {A}, url = {u}](v)}'), /"x1"/);
  assert.throws(() => parseBibtex('@misc{x2, title = {A'), /"x2"/);
  assert.throws(() => parseBibtex('@misc{x3, title {A}}'), /"x3"/);
  assert.throws(() => parseBibtex('@misc{x4, title = {A}}\n@misc{x4, title = {B}}'), /double.*"x4"/);
});

test('nominal, clé répétée (même numéro, appels distincts), ordre de première citation', () => {
  const c = createCitations(bib);
  const out = c.cite('Un [@b] puis [@a] puis [@b].', 'f.md');
  assert.equal(
    out,
    'Un <a class="cite" id="cite-1-1" href="#ref-b">[1]</a> puis <a class="cite" id="cite-2-1" href="#ref-a">[2]</a> puis <a class="cite" id="cite-1-2" href="#ref-b">[1]</a>.',
  );
  const { references } = c.finish();
  assert.deepEqual(references.map((r) => [r.key, r.number, r.calls]), [['b', 1, 2], ['a', 2, 1]]);
});

test('citations groupées : appels séparés, pas de clé brute', () => {
  const out = createCitations(bib).cite('x [@a; @c] y', 'f.md');
  assert.match(out, /\[1\]<\/a> <a class="cite" id="cite-2-1" href="#ref-c">\[2\]/);
  assert.doesNotMatch(out, /@/);
});

test('légende de tableau : appel numéroté', () => {
  assert.match(createCitations(bib).cite('Table: Légende [@a] {#tab:x}', 'f.md'), /Table: Légende <a class="cite"[^>]*>\[1\]<\/a> \{#tab:x\}/);
});

test('clé absente : erreur nommant clé et fichier', () => {
  assert.throws(() => createCitations(bib).cite('a\nb [@inconnue]', 'src/fr/sections/x.md'), /"inconnue".*x\.md, ligne 2/);
  assert.throws(() => createCitations(bib).cite('[@a; @inconnue]', 'x.md'), /"inconnue"/);
});

test('syntaxe non gérée : échec', () => {
  assert.throws(() => createCitations(bib).cite('[@a, p. 3]', 'x.md'), /non gérée/);
  assert.throws(() => createCitations(bib).cite('[voir @a]', 'x.md'), /non gérée/);
});

test('entrée jamais citée : avertissement, pas d\'échec', (t) => {
  const warn = t.mock.method(console, 'warn', () => {});
  const c = createCitations(bib);
  c.cite('[@a]', 'f.md');
  const { uncited } = c.finish();
  assert.deepEqual(uncited, ['b', 'c']);
  assert.equal(warn.mock.callCount(), 2);
  assert.match(String(warn.mock.calls[0].arguments[0]), /"b"/);
});

test('citation dans le texte alternatif d\'une image : échec explicite', () => {
  assert.throws(() => createCitations(bib).cite('<img alt="Légende [@a]">', 'x.md'), /texte alternatif/);
});
