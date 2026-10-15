import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { applySectionAnchors, assembleArticle, shiftHeadings, stripComments } from './assemble-article.ts';

function fixture(main: string, sections: Record<string, string>) {
  const dir = mkdtempSync(join(tmpdir(), 'article-'));
  mkdirSync(join(dir, 'sections'));
  writeFileSync(join(dir, 'main.md'), main);
  for (const [name, content] of Object.entries(sections)) writeFileSync(join(dir, 'sections', name), content);
  return join(dir, 'main.md');
}

test('inclusions dans l\'ordre, lien absent, titres décalés', () => {
  const path = fixture('# Titre\n\nIntro.\n\n[sections/b](sections/b.md)\n\n[sections/a](sections/a.md)\n', {
    'a.md': '# A\n\n## A1\n',
    'b.md': '# B\n\n#### B4\n',
  });
  const { title, markdown } = assembleArticle(path);
  assert.equal(title, 'Titre');
  assert.ok(markdown.indexOf('## B') < markdown.indexOf('## A'));
  assert.match(markdown, /^### A1$/m);
  assert.match(markdown, /^##### B4$/m);
  assert.doesNotMatch(markdown, /sections\//);
  assert.equal(markdown.match(/^# /gm)?.length, 1);
});

test('inclusion cassée : erreur nommant le fichier', () => {
  const path = fixture('# T\n\n[sections/x](sections/x.md)\n', {});
  assert.throws(() => assembleArticle(path), /sections\/x\.md/);
});

test('shiftHeadings ne touche pas le texte courant', () => {
  assert.equal(shiftHeadings('# H\ntexte # non\n'), '## H\ntexte # non\n');
});

test('commentaires HTML retirés (mono et multi-ligne, dans main et sections)', () => {
  assert.equal(stripComments('a <!-- x\ny --> b'), 'a  b');
  const path = fixture('# T\n\n<!-- note -->\n[sections/a](sections/a.md)\n', { 'a.md': '# A\n<!-- c\nd -->\ntexte\n' });
  assert.doesNotMatch(assembleArticle(path).markdown, /<!--|-->/);
});

test('le titre principal de chaque section reçoit le nom du fichier comme ancre (HTML et table des matières)', () => {
  const path = fixture('# T\n\n[sections/understand](sections/understand.md)\n', {
    'understand.md': "# Facteurs d'impact\n\n## Sous-partie\n",
  });
  const { markdown, anchors } = assembleArticle(path);
  assert.deepEqual(anchors, [{ text: "Facteurs d'impact", id: 'understand' }]);
  assert.match(markdown, /^## Facteurs d'impact$/m);
  const headings = [{ depth: 2, slug: 'facteurs-dimpact', text: "Facteurs d'impact" }, { depth: 3, slug: 'sous-partie', text: 'Sous-partie' }];
  const out = applySectionAnchors('<h2 id="facteurs-dimpact">x</h2><h3 id="sous-partie">y</h3>', headings, anchors);
  assert.equal(out.html, '<h2 id="understand">x</h2><h3 id="sous-partie">y</h3>');
  assert.deepEqual(out.headings.map((h) => h.slug), ['understand', 'sous-partie']);
});
