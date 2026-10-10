import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const html = readFileSync('dist/fr/index.html', 'utf8');
const sources = ['src/fr/main.md', ...readdirSync('src/fr/sections').map((f) => join('src/fr/sections', f))]
  .map((f) => readFileSync(f, 'utf8'))
  .join('\n');

const decode = (s: string) => s.replace(/&(#38|amp);/g, '&').replace(/&(#39|apos);/g, "'");

test('gras et italique', () => {
  assert.match(html, /<strong>Plus un modèle compte de paramètres/);
  assert.match(html, /<em>one-shot<\/em>/);
});

test('titres de paragraphe : <strong> dans un <p>, jamais un titre', () => {
  const titres = [
    'Pourquoi ?',
    'Cas particulier : les petites corrections',
    'Exemple concret :',
    "Cas d'usage optimisés avec le cache",
    'Exemple',
    'Modèle simplifié',
    'Règle générale',
    'Formule :',
    'Transparence des fournisseurs',
  ];
  for (const titre of titres) {
    assert.ok(html.includes(`<p><strong>${titre}</strong>`), `absent ou hors <p><strong> : ${titre}`);
    assert.doesNotMatch(html, new RegExp(`<h[1-6][^>]*>[^<]*${titre.replace(/[?]/g, '\\?')}`), `rendu en titre : ${titre}`);
  }
});

test('listes ul / ol conservées, items présents', () => {
  assert.ok((html.match(/<ul/g) ?? []).length >= 1);
  assert.ok((html.match(/<ol/g) ?? []).length >= 1);
  const attendus = (sources.match(/^\s*(?:[-*]|\d+\.)\s+\S/gm) ?? []).length;
  const obtenus = (html.match(/<li[ >]/g) ?? []).length;
  assert.equal(obtenus, attendus, 'nombre de <li> différent du nombre d\'items source');
});

test('20 liens avec href identique à la source', () => {
  const attendus = [...sources.matchAll(/\]\((https?:[^)\s]+)\)|<(https?:[^>\s]+)>/g)].map((m) => m[1] ?? m[2]);
  assert.equal(attendus.length, 20);
  const obtenus = [...html.matchAll(/<a [^>]*href="(https?:[^"]+)"/g)].map((m) => decode(m[1]));
  assert.deepEqual(obtenus.sort(), attendus.sort());
});

test('URL longue présente, avec règle anti-débordement', () => {
  assert.ok(html.includes('https://01.me/research/ikp/#/calibration#proprietary'));
  const css = readFileSync('src/styles/article.css', 'utf8');
  assert.match(css, /overflow-wrap:\s*anywhere/);
});

test('caractères spéciaux littéraux', () => {
  for (const s of ['CO₂e', 'm³', '~0,3 Wh']) assert.ok(html.includes(s), s);
  const typo = (t: string) => (t.match(/[‘’“”]/g) ?? []).length;
  assert.equal(typo(html), typo(sources), 'guillemets typographiques ajoutés ou perdus');
});
