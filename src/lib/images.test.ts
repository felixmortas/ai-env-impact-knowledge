import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { markImages } from './images.ts';

// PNG minimal : signature + IHDR 3x2.
const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 13]),
  Buffer.from('IHDR'),
  Buffer.from([0, 0, 0, 3, 0, 0, 0, 2, 8, 6, 0, 0, 0]),
]);

function root() {
  const dir = mkdtempSync(join(tmpdir(), 'img-'));
  mkdirSync(join(dir, 'images'));
  writeFileSync(join(dir, 'images/x.png'), png);
  writeFileSync(join(dir, 'images/x.svg'), '<svg/>');
  writeFileSync(join(dir, 'images/x.pdf'), '');
  return { root: dir, base: '/site' };
}

test('nominal : figure, alt = figcaption, largeur 80 %, base préfixée, dimensions', () => {
  const out = markImages("![L'a & <b>](images/x.png){width=80%}", 'a.md', root());
  assert.match(out, /<figure class="figure" style="width: 80%">/);
  assert.match(out, /src="\/site\/images\/x\.png" alt="L'a &amp; &lt;b&gt;" width="3" height="2"/);
  assert.match(out, /<figcaption>L'a &amp; &lt;b&gt;<\/figcaption>/);
  assert.doesNotMatch(out, /\{width/);
});

test('sans attribut : 100 %', () => {
  assert.match(markImages('![L](images/x.svg)', 'a.md', root()), /width: 100%/);
});

test('légende vide : erreur nommant fichier et image', () => {
  assert.throws(() => markImages('![](images/x.png)', 'sections/a.md', root()), /sections\/a\.md.*images\/x\.png/);
});

test('fichier absent et format non web : erreurs explicites', () => {
  assert.throws(() => markImages('![L](images/nope.png)', 'a.md', root()), /introuvable.*images\/nope\.png/);
  assert.throws(() => markImages('![L](images/x.pdf)', 'a.md', root()), /non web.*images\/x\.pdf/);
});

test('largeur invalide, syntaxe non reconnue, URL externe : erreurs explicites', () => {
  const r = root();
  assert.throws(() => markImages('![L](images/x.png){width=150%}', 'a.md', r), /Largeur invalide/);
  assert.throws(() => markImages('![L](images/x.png){width=80}', 'a.md', r), /Syntaxe d'image non reconnue/);
  assert.throws(() => markImages('![L](images/x.png "t")', 'a.md', r), /Syntaxe d'image non reconnue/);
  assert.throws(() => markImages('![L](https://x.org/a.png)', 'a.md', r), /externe/);
  assert.throws(() => markImages('![L](../x.png)', 'a.md', r), /hors du dépôt|introuvable/);
});
