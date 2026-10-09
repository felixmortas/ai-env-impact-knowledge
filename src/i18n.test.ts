import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createT, t } from './i18n.ts';

test('retourne la chaîne quand la clé est présente', () => {
  assert.equal(createT({ a: 'bonjour' })('a'), 'bonjour');
  assert.equal(t('page.lang'), 'fr');
});

test('échoue en nommant la clé quand elle est absente', () => {
  assert.throws(() => createT({})('cle.absente'), /cle\.absente/);
  assert.throws(() => t('cle.absente'), /cle\.absente/);
});
