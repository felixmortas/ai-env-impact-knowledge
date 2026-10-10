import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildCitation, citationKey, escapeBibtex } from './bibtex.ts';
import type { Config } from './config.ts';

const config: Config = {
  firstName: 'Felix', lastName: 'Mortas', email: 'a@b.fr',
  githubUrl: 'https://github.com/x', linkedinUrl: 'https://linkedin.com/x',
  publishedDate: '2026-10-10', modifiedDate: '2026-11-02',
  license: { name: 'CC', url: 'https://c.org/' }, siteUrl: 'https://exemple.org/site',
};
const tpl = 'Consulté en ligne ; dernière modification : {date}';

function balanced(s: string): boolean {
  let depth = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '\\') { i++; continue; }
    if (s[i] === '{') depth++;
    if (s[i] === '}' && --depth < 0) return false;
  }
  return depth === 0;
}

test('entrée nominale : champs obligatoires', () => {
  const out = buildCitation(config, "Impact environnemental de l'IA", 'fr', tpl);
  assert.match(out, /^@misc\{mortas2026impact,/);
  assert.match(out, /author = \{Mortas, Felix\}/);
  assert.match(out, /title = \{Impact environnemental de l'IA\}/);
  assert.match(out, /year = \{2026\}/);
  assert.match(out, /url = \{https:\/\/exemple\.org\/site\/fr\/\}/);
  assert.match(out, /note = \{Consulté en ligne ; dernière modification : 2 novembre 2026\}/);
  assert.ok(balanced(out));
  assert.ok(!out.includes('@b.fr'));
});

test('échappements des caractères spéciaux, accents conservés', () => {
  assert.equal(escapeBibtex('R&D 50% a_b #1 é $'), 'R\\&D 50\\% a\\_b \\#1 é \\$');
  const out = buildCitation(config, 'IA & énergie : 100% #vert_', 'fr', tpl);
  assert.match(out, /title = \{IA \\& énergie : 100\\% \\#vert\\_\}/);
  assert.ok(balanced(out));
});

test('clé sans accent, sans article', () => {
  assert.equal(citationKey('Mortas', '2026', "L'énergie de l'IA"), 'mortas2026energie');
  assert.equal(citationKey('Müller-Éon', '2026', 'Été'), 'mullereon2026ete');
});

test('déterministe et reflète la config', () => {
  const a = buildCitation(config, 'Titre', 'fr', tpl);
  assert.equal(a, buildCitation(config, 'Titre', 'fr', tpl));
  assert.match(buildCitation({ ...config, lastName: 'Dupont' }, 'Titre', 'fr', tpl), /^@misc\{dupont2026titre,[\s\S]*author = \{Dupont, Felix\}/);
});

test('échappements \\ { } ~ ^ et URL avec % et #', () => {
  assert.equal(escapeBibtex('a\\b {x} ~ ^'), 'a\\textbackslash{}b \\{x\\} \\textasciitilde{} \\textasciicircum{}');
  const out = buildCitation({ ...config, siteUrl: 'https://e.org/a%20b#x_&' }, 'T {x} ~', 'fr', tpl);
  assert.match(out, /url = \{https:\/\/e\.org\/a\\%20b\\#x_&\/fr\/\}/);
  assert.ok(balanced(out));
});

test('date de modification avec motif $& et publishedDate invalide', () => {
  assert.match(buildCitation(config, 'Titre', 'fr', 'x {date} $&'), /note = \{x 2 novembre 2026 \\\$\\&\}/);
  assert.throws(() => buildCitation({ ...config, publishedDate: '26-10-10' }, 'Titre', 'fr', tpl), /publishedDate/);
});
