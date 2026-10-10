import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateConfig, PLACEHOLDER } from './config.ts';
import { formatDate } from './format-date.ts';

const ok = () => ({
  firstName: 'Ada',
  lastName: 'Lovelace',
  email: 'ada@example.org',
  githubUrl: 'https://github.com/ada',
  linkedinUrl: 'https://www.linkedin.com/in/ada',
  publishedDate: '2026-10-09',
  modifiedDate: '2026-10-10',
  license: { name: 'CC BY-NC 4.0', url: 'https://creativecommons.org/licenses/by-nc/4.0/' },
  siteUrl: 'https://felixmortas.com/ai-env-impact-knowledge',
});

test('configuration complète acceptée', () => {
  assert.equal(validateConfig(ok()).lastName, 'Lovelace');
});

test('placeholder : erreur nommant le champ', () => {
  const c = ok();
  c.linkedinUrl = PLACEHOLDER;
  assert.throws(() => validateConfig(c), /"linkedinUrl"/);
  const d = ok();
  d.license.name = PLACEHOLDER;
  assert.throws(() => validateConfig(d), /"license\.name"/);
});

test('champ absent ou vide : erreur nommant le champ', () => {
  const c: Record<string, unknown> = ok();
  delete c.email;
  assert.throws(() => validateConfig(c), /"email"/);
  const d = ok();
  d.firstName = '  ';
  assert.throws(() => validateConfig(d), /"firstName"/);
  const e: Record<string, unknown> = ok();
  delete e.license;
  assert.throws(() => validateConfig(e), /"license\.name"/);
});

test('date invalide : erreur nommant le champ', () => {
  for (const bad of ['2026-13-40', '2026-02-30', '09/10/2026']) {
    const c = ok();
    c.modifiedDate = bad;
    assert.throws(() => validateConfig(c), /"modifiedDate"/);
  }
  const p = ok();
  p.publishedDate = '2026-13-40';
  assert.throws(() => validateConfig(p), /"publishedDate"/);
});

test('email, URL https et cohérence des dates', () => {
  const e = ok();
  e.email = 'pas-un-email';
  assert.throws(() => validateConfig(e), /"email"/);
  const u = ok();
  u.githubUrl = 'javascript:alert(1)';
  assert.throws(() => validateConfig(u), /"githubUrl"/);
  const d = ok();
  d.modifiedDate = '2026-10-08';
  assert.throws(() => validateConfig(d), /"modifiedDate"/);
});

test('date localisée', () => {
  assert.equal(formatDate('2026-10-09', 'fr'), '9 octobre 2026');
  assert.equal(formatDate('2026-01-01', 'fr'), '1 janvier 2026');
  assert.throws(() => formatDate('2026-13-40x', 'fr'));
  assert.throws(() => formatDate('2026-02-30', 'fr'));
});

test('config.json réel : champs attendus et licence CC BY-NC 4.0', () => {
  const raw = JSON.parse(readFileSync('src/config.json', 'utf8'));
  assert.deepEqual(raw.license, { name: 'CC BY-NC 4.0', url: 'https://creativecommons.org/licenses/by-nc/4.0/' });
  assert.equal(raw.siteUrl, 'https://felixmortas.com/ai-env-impact-knowledge');
});
