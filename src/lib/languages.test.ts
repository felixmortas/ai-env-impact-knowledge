import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { discoverLanguages } from './languages.ts';

/** Construit un `src/` temporaire : `md` = langues avec dossier, `locales` = langue -> chaînes. */
function fixture(md: string[], locales: Record<string, Record<string, string>>): string {
  const dir = mkdtempSync(join(tmpdir(), 'langs-'));
  for (const lang of md) {
    mkdirSync(join(dir, lang));
    writeFileSync(join(dir, lang, 'main.md'), '# Titre\n');
  }
  mkdirSync(join(dir, 'locales'));
  for (const [lang, messages] of Object.entries(locales)) writeFileSync(join(dir, 'locales', `${lang}.json`), JSON.stringify(messages));
  // Dossiers non linguistiques ignorés.
  mkdirSync(join(dir, 'lib'));
  mkdirSync(join(dir, 'pages'));
  return dir;
}
const msgs = { a: 'A', b: 'B' };

function withFixture(md: string[], locales: Record<string, Record<string, string>>, fn: (dir: string) => void) {
  const dir = fixture(md, locales);
  try {
    fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test('fr seul : une langue', () => {
  withFixture(['fr'], { fr: msgs }, (dir) => assert.deepEqual(discoverLanguages(dir), ['fr']));
});

test('ajout de langue sans changement de code', () => {
  withFixture(['fr', 'en'], { fr: msgs, en: { a: 'x', b: 'y' } }, (dir) => assert.deepEqual(discoverLanguages(dir), ['en', 'fr']));
});

test('chaîne manquante : nomme la langue et la clé', () => {
  withFixture(['fr', 'en'], { fr: msgs, en: { a: 'x' } }, (dir) => assert.throws(() => discoverLanguages(dir), /"en".*"b"/));
});

test('Markdown sans locale : nomme la langue', () => {
  withFixture(['fr', 'es'], { fr: msgs }, (dir) => assert.throws(() => discoverLanguages(dir), /"es".*locales\/es\.json/));
});

test('locale sans Markdown : nomme la langue', () => {
  withFixture(['fr'], { fr: msgs, es: msgs }, (dir) => assert.throws(() => discoverLanguages(dir), /"es".*src\/es\//));
});

test('langue de référence absente', () => {
  withFixture(['en'], { en: msgs }, (dir) => assert.throws(() => discoverLanguages(dir), /"fr"/));
});

test('main.md absent : nomme la langue', () => {
  withFixture(['fr'], { fr: msgs }, (dir) => {
    mkdirSync(join(dir, 'es'));
    writeFileSync(join(dir, 'locales', 'es.json'), JSON.stringify(msgs));
    assert.throws(() => discoverLanguages(dir), /"es".*main\.md/);
  });
});
