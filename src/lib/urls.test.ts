import { test } from 'node:test';
import assert from 'node:assert/strict';
import { canonicalUrl } from './urls.ts';

test('siteUrl + /<lang>/', () => {
  assert.equal(canonicalUrl('fr', 'https://exemple.org/site'), 'https://exemple.org/site/fr/');
});

test('barre finale de siteUrl non dupliquée', () => {
  assert.equal(canonicalUrl('fr', 'https://exemple.org/site/'), 'https://exemple.org/site/fr/');
});

test('langue invalide : erreur', () => {
  assert.throws(() => canonicalUrl('../x', 'https://exemple.org'), /langue/);
});
