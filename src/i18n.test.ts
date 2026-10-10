import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createT, t } from './i18n.ts';

test('retourne la chaîne quand la clé est présente', () => {
  assert.equal(createT('fr', { a: 'bonjour' })('a'), 'bonjour');
  assert.equal(t('fr', 'toc.label'), 'Table des matières');
});

test("l'erreur nomme la langue et la clé", () => {
  assert.throws(() => createT('en', {})('cle.absente'), /en\.json.*cle\.absente/);
  assert.throws(() => t('fr', 'cle.absente' as never), /fr\.json.*cle\.absente/);
});

test('langue sans fichier de chaînes : erreur nommant la langue', () => {
  assert.throws(() => t('zz', 'toc.label'), /"zz"/);
});
