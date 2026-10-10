import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildToc } from './toc.ts';

const h = (depth: number, slug: string) => ({ depth, slug, text: slug });

test('hiérarchie nominale', () => {
  const t = buildToc([h(2, 'a'), h(3, 'a1'), h(3, 'a2'), h(2, 'b')]);
  assert.deepEqual(t.map((n) => n.slug), ['a', 'b']);
  assert.deepEqual(t[0].children.map((n) => n.slug), ['a1', 'a2']);
});

test('h1 et h6 exclus', () => {
  const t = buildToc([h(1, 'titre'), h(2, 'a'), h(6, 'x')]);
  assert.deepEqual(t.map((n) => n.slug), ['a']);
  assert.equal(t[0].children.length, 0);
});

test('saut de niveau : h4 directement sous h2, sans nœud vide', () => {
  const t = buildToc([h(2, 'a'), h(4, 'a-deep'), h(3, 'a3')]);
  assert.deepEqual(t[0].children.map((n) => n.slug), ['a-deep', 'a3']);
});

test('retour à un niveau supérieur depuis h5', () => {
  const t = buildToc([h(2, 'a'), h(3, 'b'), h(5, 'c'), h(3, 'd'), h(2, 'e')]);
  assert.deepEqual(t.map((n) => n.slug), ['a', 'e']);
  assert.deepEqual(t[0].children.map((n) => n.slug), ['b', 'd']);
  assert.equal(t[0].children[0].children[0].slug, 'c');
});

test('entrée Références ajoutée en dernier au niveau h2', () => {
  const t = buildToc([h(2, 'a'), h(3, 'a1')], [h(2, 'references')]);
  assert.equal(t[t.length - 1].slug, 'references');
});

test('liste vide', () => {
  assert.deepEqual(buildToc([]), []);
});
