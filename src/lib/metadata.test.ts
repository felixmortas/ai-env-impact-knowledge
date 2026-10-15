import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildMetadata } from './metadata.ts';
import { createT } from '../i18n.ts';
import type { Config } from './config.ts';

const config: Config = {
  firstName: 'Ada', lastName: 'LOVELACE', email: 'a@b.fr', githubUrl: 'https://g.io/a', linkedinUrl: 'https://l.io/a',
  publishedDate: '2026-01-02', modifiedDate: '2026-03-04', license: { name: 'X', url: 'https://x.io' }, siteUrl: 'https://exemple.org/site/',
};
const messages = { 'meta.description': 'Une description.', 'meta.siteName': 'Mon site' };
const og = (m: ReturnType<typeof buildMetadata>, p: string) => m.og.filter((x) => x.property === p).map((x) => x.content);

test('nominal fr : valeurs issues de la config et des chaînes, URL absolue', () => {
  const m = buildMetadata(config, 'fr', 'Titre', createT('fr', messages));
  assert.equal(m.description, 'Une description.');
  assert.equal(m.author, 'Ada LOVELACE');
  assert.deepEqual(og(m, 'og:url'), ['https://exemple.org/site/fr/']);
  assert.deepEqual(og(m, 'og:title'), ['Titre']);
  assert.deepEqual(og(m, 'og:type'), ['article']);
  assert.deepEqual(og(m, 'og:site_name'), ['Mon site']);
});

test('autre langue : og:locale aligné', () => {
  const m = buildMetadata(config, 'en', 'Title', createT('en', messages));
  assert.deepEqual(og(m, 'og:locale'), ['en']);
  assert.deepEqual(og(m, 'og:url'), ['https://exemple.org/site/en/']);
});

test('dates issues de la config', () => {
  const m = buildMetadata(config, 'fr', 'T', createT('fr', messages));
  assert.deepEqual(og(m, 'article:published_time'), ['2026-01-02']);
  assert.deepEqual(og(m, 'article:modified_time'), ['2026-03-04']);
});

test('description absente : erreur nommant la clé et la langue', () => {
  assert.throws(() => buildMetadata(config, 'es', 'T', createT('es', { 'meta.siteName': 'S' })), /es\.json.*meta\.description/);
});

test('description vide : erreur', () => {
  assert.throws(() => buildMetadata(config, 'fr', 'T', createT('fr', { ...messages, 'meta.description': ' ' })), /meta\.description/);
});
