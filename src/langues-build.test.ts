// Tests de bout en bout dans une copie temporaire du projet : aucune fixture EN/ES n'entre dans le dépôt.
// Lancer avec `npm run test:langues`.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { formatDate } from './lib/format-date.ts';

const root = resolve(import.meta.dirname, '..');
let tmp: string;

/** Ajoute une fixture `en` (copie du français) avec une locale complète et un `cite.accessNote` distinct. */
function addEnglish(): Record<string, string> {
  rmSync(join(tmp, 'src/en'), { recursive: true, force: true });
  cpSync(join(tmp, 'src/fr'), join(tmp, 'src/en'), { recursive: true });
  const fr = JSON.parse(readFileSync(join(tmp, 'src/locales/fr.json'), 'utf8'));
  const en = { ...fr, 'author.published': 'Published on', 'cite.accessNote': 'Read online; last modified: {date}' };
  writeFileSync(join(tmp, 'src/locales/en.json'), JSON.stringify(en));
  return en;
}

const build = () => spawnSync('npx', ['astro', 'build'], { cwd: tmp, encoding: 'utf8' });

before(() => {
  tmp = mkdtempSync(join(tmpdir(), 'site-langs-'));
  for (const item of ['src', 'images', 'public', 'astro.config.mjs', 'package.json', 'tsconfig.json']) {
    if (existsSync(join(root, item))) cpSync(join(root, item), join(tmp, item), { recursive: true });
  }
  symlinkSync(join(root, 'node_modules'), join(tmp, 'node_modules'));
});
after(() => rmSync(tmp, { recursive: true, force: true }));

test('fr seul, puis ajout de en sans changer le code, puis chaîne manquante', () => {
  let r = build();
  assert.equal(r.status, 0, r.stderr + r.stdout);
  assert.match(readFileSync(join(tmp, 'dist/fr/index.html'), 'utf8'), /<html lang="fr"/);
  assert.ok(!existsSync(join(tmp, 'dist/en/index.html')));

  const en = addEnglish();
  r = build();
  assert.equal(r.status, 0, r.stderr + r.stdout);
  const html = readFileSync(join(tmp, 'dist/en/index.html'), 'utf8');
  assert.match(html, /<html lang="en"/);
  assert.match(html, /Published on/);
  const { modifiedDate } = JSON.parse(readFileSync(join(tmp, 'src/config.json'), 'utf8'));
  const dateEn = formatDate(modifiedDate, 'en');
  const dateFr = formatDate(modifiedDate, 'fr');
  assert.match(html, new RegExp(dateEn));
  assert.ok(readFileSync(join(tmp, 'dist/fr/index.html'), 'utf8').includes(dateFr));
  // URL de partage et url BibTeX de la langue affichée ; note BibTeX issue de en.json.
  assert.match(html, /&quot;https:\/\/[^&]*\/en\/&quot;/);
  assert.match(html, /url = \{https:\/\/[^}]*\/en\/\}/);
  assert.ok(html.includes(`note = {Read online; last modified: ${dateEn}}`));
  assert.ok(!html.includes('Consulté en ligne'));

  delete (en as Record<string, string>)['share.label'];
  writeFileSync(join(tmp, 'src/locales/en.json'), JSON.stringify(en));
  r = build();
  assert.notEqual(r.status, 0);
  assert.match(r.stderr + r.stdout, /"en".*"share\.label"/);
});

test('locale sans Markdown : le build échoue en nommant la langue', () => {
  addEnglish();
  rmSync(join(tmp, 'src/en'), { recursive: true });
  const r = build();
  assert.notEqual(r.status, 0);
  assert.match(r.stderr + r.stdout, /"en"/);
});
