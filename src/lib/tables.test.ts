import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applyTableCaptions, markTableCaptions } from './tables.ts';

const TABLE = '| a | b |\n|:--|--:|\n| 1 | -- |';

test('légende sous le tableau : identifiant retiré, légende conservée avec citation', () => {
  const out = markTableCaptions(`${TABLE}\n\nTable: Titre [@cle2026] {#tab:x}\n\nSource : s`, 'f.md');
  assert.doesNotMatch(out, /Table:|\{#/);
  assert.match(out, /Titre \[@cle2026\]/);
  assert.match(out, /Source : s$/);
});

test('Table: orphelin : erreur avec fichier et ligne', () => {
  assert.throws(() => markTableCaptions('Texte\n\nTable: Orpheline {#tab:y}', 'sections/a.md'), /sections\/a\.md, ligne 3/);
  assert.throws(() => markTableCaptions('Table: Début {#tab:y}', 'a.md'), /a\.md, ligne 1/);
});

test('caption premier enfant de table, conteneur de défilement, Source conservée', () => {
  const marked = markTableCaptions(`${TABLE}\n\nTable: Légende {#tab:x}`, 'f.md');
  const caption = marked.split('\n').at(-1);
  const html = `<table>\n<thead></thead>\n</table>\n<p>${caption}</p>\n<p>Source : s</p>`;
  assert.equal(
    applyTableCaptions(html),
    '<div class="table-scroll"><table>\n<caption>Légende</caption>\n<thead></thead>\n</table></div>\n<p>Source : s</p>',
  );
});

test('tableau sans légende : seulement enveloppé', () => {
  assert.equal(applyTableCaptions('<table>\n<tr></tr>\n</table>'), '<div class="table-scroll"><table>\n<tr></tr>\n</table></div>');
});

test('légende vide ou sans identifiant : erreurs distinctes', () => {
  assert.throws(() => markTableCaptions(`${TABLE}\n\nTable: {#tab:x}`, 'a.md'), /vide : a\.md, ligne 5/);
  assert.throws(() => markTableCaptions(`${TABLE}\n\nTable: Sans id`, 'a.md'), /sans identifiant/);
});

test('marqueur de légende resté hors tableau dans le HTML : erreur', () => {
  const marked = markTableCaptions(`${TABLE}\n\nTable: Légende {#tab:x}`, 'f.md').split('\n').at(-1);
  assert.throws(() => applyTableCaptions(`<p>${marked}</p>`), /non associée/);
});
