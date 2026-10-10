import { test } from 'node:test';
import assert from 'node:assert/strict';
import { activeIndex, progressRatio, type Measures } from './toc-progress.ts';

const base: Measures = { tops: [], scrollY: 0, viewportHeight: 1000, documentHeight: 5000, articleTop: 100, articleBottom: 4900 };
const m = (o: Partial<Measures>): Measures => ({ ...base, ...o });

test('avant la première section : aucune entrée active', () => {
  assert.equal(activeIndex(m({ tops: [800, 1500, 2500] })), -1);
});

test('la section qui a franchi la ligne de lecture est active', () => {
  assert.equal(activeIndex(m({ tops: [-1200, 200, 900, 1800] })), 1);
  assert.equal(activeIndex(m({ tops: [-1200, 200, 300, 1800] })), 2);
});

test('titre exactement sur la ligne de lecture', () => {
  assert.equal(activeIndex(m({ tops: [-50, 300] })), 1);
});

test('fin de page : la dernière entrée est active', () => {
  assert.equal(activeIndex(m({ tops: [-3000, -2000, 700], scrollY: 4000 })), 2);
});

test('table vide', () => {
  assert.equal(activeIndex(m({ tops: [] })), -1);
});

test('progression : 0 en haut, 1 en bas, bornée', () => {
  assert.equal(progressRatio(m({ scrollY: 0 })), 0);
  assert.equal(progressRatio(m({ scrollY: 100 })), 0);
  assert.equal(progressRatio(m({ scrollY: 2000 })), (2000 - 100) / (4900 - 100 - 1000));
  assert.equal(progressRatio(m({ scrollY: 3900 })), 1);
  assert.equal(progressRatio(m({ scrollY: 9999 })), 1);
});

test('article plus court que le viewport', () => {
  assert.equal(progressRatio(m({ articleBottom: 800, scrollY: 0 })), 1);
  assert.equal(progressRatio(m({ articleBottom: 1800, scrollY: 0 })), 0);
});

test('titre introuvable (top infini) : les suivants restent activables', () => {
  assert.equal(activeIndex(m({ tops: [-500, Number.POSITIVE_INFINITY, -100, 900] })), 2);
});

test('mesures invalides : progression nulle', () => {
  assert.equal(progressRatio(m({ articleBottom: Number.NaN })), 0);
});
