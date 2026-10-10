import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const full = readFileSync('dist/fr/index.html', 'utf8');
// `html` = corps de l'article, sans la section « Références » (générée depuis le .bib).
assert.ok(full.includes('<section class="references"'), 'section Références absente');
const html = full.split('<section class="references"')[0];
const sources = ['src/fr/main.md', ...readdirSync('src/fr/sections').map((f) => join('src/fr/sections', f))]
  .map((f) => readFileSync(f, 'utf8'))
  .join('\n');

const decode = (s: string) => s.replace(/&(#38|amp);/g, '&').replace(/&(#39|apos);/g, "'");

test('gras et italique', () => {
  assert.match(html, /<strong>Plus un modèle compte de paramètres/);
  assert.match(html, /<em>one-shot<\/em>/);
});

test('titres de paragraphe : <strong> dans un <p>, jamais un titre', () => {
  const titres = [
    'Pourquoi ?',
    'Cas particulier : les petites corrections',
    'Exemple concret :',
    "Cas d'usage optimisés avec le cache",
    'Exemple',
    'Modèle simplifié',
    'Règle générale',
    'Formule :',
    'Transparence des fournisseurs',
  ];
  for (const titre of titres) {
    assert.ok(html.includes(`<p><strong>${titre}</strong>`), `absent ou hors <p><strong> : ${titre}`);
    assert.doesNotMatch(html, new RegExp(`<h[1-6][^>]*>[^<]*${titre.replace(/[?]/g, '\\?')}`), `rendu en titre : ${titre}`);
  }
});

test('listes ul / ol conservées, items présents', () => {
  assert.ok((html.match(/<ul/g) ?? []).length >= 1);
  assert.ok((html.match(/<ol/g) ?? []).length >= 1);
  const attendus = (sources.match(/^\s*(?:[-*]|\d+\.)\s+\S/gm) ?? []).length;
  const obtenus = (html.match(/<li[ >]/g) ?? []).length;
  assert.equal(obtenus, attendus, 'nombre de <li> différent du nombre d\'items source');
});

test('20 liens avec href identique à la source', () => {
  const attendus = [...sources.matchAll(/\]\((https?:[^)\s]+)\)|<(https?:[^>\s]+)>/g)].map((m) => m[1] ?? m[2]);
  assert.equal(attendus.length, 20);
  const obtenus = [...html.matchAll(/<a [^>]*href="(https?:[^"]+)"/g)].map((m) => decode(m[1]));
  assert.deepEqual(obtenus.sort(), attendus.sort());
});

test('URL longue présente, avec règle anti-débordement', () => {
  assert.ok(html.includes('https://01.me/research/ikp/#/calibration#proprietary'));
  const css = readFileSync('src/styles/article.css', 'utf8');
  assert.match(css, /overflow-wrap:\s*anywhere/);
});

test('caractères spéciaux littéraux', () => {
  for (const s of ['CO₂e', 'm³', '~0,3 Wh']) assert.ok(html.includes(s), s);
  const typo = (t: string) => (t.match(/[‘’“”]/g) ?? []).length;
  assert.equal(typo(html), typo(sources), 'guillemets typographiques ajoutés ou perdus');
});

test('tableaux : légende en <caption>, identifiant retiré, Source juste après', () => {
  assert.doesNotMatch(html, /\{#|Table:/);
  const tableaux = [...html.matchAll(/<div class="table-scroll"><table>\s*<caption>([\s\S]+?)<\/caption>[\s\S]*?<\/table><\/div>\s*<p>(Source : [\s\S]*?)<\/p>/g)];
  const legendes = [...sources.matchAll(/^Table: (.*?) \{#tab:[^}]+\}$/gm)].map((m) => m[1]);
  assert.equal(tableaux.length, legendes.length);
  // Les appels de citation sont rendus en liens `[n]` : on compare avec le numéro neutralisé.
  const norm = (t: string) => decode(t.replace(/<[^>]+>/g, '').replace(/\[@[^\]]*\]|\[\d+\]/g, '[#]'));
  assert.deepEqual(tableaux.map((m) => norm(m[1])), legendes.map(norm));
  assert.match(tableaux[0][2], /^Source : Rapports environnementaux$/);
});

test('tableaux : -- littéral et alignements conservés', () => {
  assert.equal((html.match(/<td style="text-align: right">--<\/td>/g) ?? []).length, 2);
  assert.ok(html.includes('<th style="text-align: left"><strong>WUE (L/kWh)</strong></th>'));
  assert.ok(html.includes('<td style="text-align: right">8 170 000</td>'));
  assert.doesNotMatch(html, /<td[^>]*>[–—]<\/td>/);
});

test('tableaux : conteneur à défilement horizontal local', () => {
  assert.match(readFileSync('src/styles/article.css', 'utf8'), /\.table-scroll\s*{[^}]*overflow-x:\s*auto/);
});

test('images : 8 figure, alt = figcaption, largeur 80 %, fichiers publiés, pas de {width', () => {
  assert.doesNotMatch(html, /\{width/);
  const figures = [...html.matchAll(/<figure class="figure" style="width: (\d+)%"><img src="([^"]+)" alt="([^"]*)"[^>]*><figcaption>([^<]*)<\/figcaption><\/figure>/g)];
  assert.equal(figures.length, 8);
  assert.equal((html.match(/<figure/g) ?? []).length, 8);
  for (const [, width, src, alt, legende] of figures) {
    assert.equal(width, '80');
    assert.equal(alt, legende);
    assert.ok(src.startsWith('/ai-env-impact-knowledge/images/'), src);
    const fichier = join('dist', src.replace('/ai-env-impact-knowledge/', ''));
    assert.match(fichier, /\.(png|svg|webp)$/);
    assert.ok(existsSync(fichier), fichier);
  }
});

test('citations : aucune clé brute, chaque lien #ref-… a une cible, retours valides', () => {
  assert.ok(!full.includes('[@'), 'clé brute [@ présente');
  const ids = new Set([...full.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  const refs = [...full.matchAll(/href="#(ref-[^"]+)"/g)].map((m) => m[1]);
  assert.ok(refs.length >= 75, `appels attendus >= 75, obtenus ${refs.length}`);
  for (const r of refs) assert.ok(ids.has(r), `cible absente : ${r}`);
  const backs = [...full.matchAll(/href="#(cite-[^"]+)"/g)].map((m) => m[1]);
  assert.equal(backs.length, refs.length, 'un lien de retour par appel');
  for (const b of backs) assert.ok(ids.has(b), `appel d'origine absent : ${b}`);
});

test('section Références : h2 final et appel numéroté dans une légende de tableau', () => {
  assert.match(full, /<h2 id="references">Références<\/h2>/);
  assert.match(full, /<caption>[^]*?<a class="cite"[^>]*>\[\d+\]<\/a>[^]*?<\/caption>/);
});

test('citations : numéros de première occurrence croissants dans l\'ordre de lecture', () => {
  let max = 0;
  for (const m of full.matchAll(/class="cite" id="cite-(\d+)-1"/g)) {
    assert.equal(Number(m[1]), max + 1, `numéro hors ordre : ${m[1]}`);
    max++;
  }
  assert.ok(max > 0);
});

// ---- Story 1.7 : complétude, gabarit, thème, absence de JavaScript ----

const texteHtml = (s: string) =>
  decode(s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&#x26;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')).replace(/\s+/g, ' ');

// Source sans commentaires, clés de citation, images, légendes, URL et syntaxe de lien/tableau.
const sourceNue = sources
  .replace(/<!--[\s\S]*?-->/g, '')
  .replace(/^\[sections\/[^\]]+\]\([^)]*\)$/gm, '')
  .replace(/^!\[.*$/gm, '')
  .replace(/^Table: .*$/gm, '')
  .replace(/\[@[^\]]*\]/g, '')
  .replace(/\]\(https?:[^)]*\)/g, ']')
  .replace(/<https?:[^>]*>/g, '');

test('complétude : chaque paragraphe de la source est présent dans le HTML', () => {
  // Comparaison sur les seuls caractères alphanumériques : insensible aux espaces, ponctuation et balisage.
  const alnum = (t: string) => t.normalize('NFC').replace(/[^\p{L}\p{N}]/gu, '');
  const corps = alnum(texteHtml(html.replace(/<a class="cite"[^>]*>\[\d+\]<\/a>/g, '')));
  const manquants: string[] = [];
  let total = 0;
  for (const bloc of sourceNue.split(/\n\s*\n/)) {
    const lignes = bloc.split('\n').filter((l) => l.trim() && !/^\s*\|/.test(l) && !/^#{1,6}\s/.test(l));
    for (const ligne of lignes) {
      const brut = ligne.replace(/^\s*(?:[-*]|\d+\.)\s+/, '').replace(/[*_`\[\]]/g, '').replace(/\s+/g, ' ').trim();
      if (brut.length < 15) continue;
      total++;
      // Les 60 premiers caractères de chaque ligne suffisent à détecter une perte.
      const extrait = brut.slice(0, 60).trim();
      if (!corps.includes(alnum(extrait))) manquants.push(extrait);
    }
  }
  assert.ok(total > 50, `trop peu de paragraphes comparés : ${total}`);
  assert.deepEqual(manquants, [], `paragraphes manquants :\n${manquants.join('\n')}`);
});

test('complétude : chaque nombre de la source est présent dans le HTML', () => {
  const corps = texteHtml(html);
  const nombres = new Set(
    [...sourceNue.replace(/\|/g, ' ').matchAll(/\d+(?:[ ,.]\d+)*/g)].map((m) => m[0].trim()),
  );
  // Frontières de nombre : « 5 » ne doit pas être satisfait par « 15 » ou « 2005 ».
  const manquants = [...nombres].filter(
    (n) => !new RegExp(`(?<![\\d])${n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\d])`).test(corps),
  );
  assert.deepEqual(manquants, [], `nombres manquants : ${manquants.join(', ')}`);
});

test('complétude : 2 tableaux, 8 images, titres de section', () => {
  assert.equal((html.match(/<table/g) ?? []).length, 2);
  assert.equal((html.match(/<figure/g) ?? []).length, 8);
  assert.equal((html.match(/<h1/g) ?? []).length, 1);
});

test('sans JavaScript : aucun script ni ressource tierce dans la page', () => {
  assert.doesNotMatch(full, /<script/i);
  assert.doesNotMatch(full, /\s(?:src|href)="https?:\/\/[^"]*(?:fonts\.|cdn|analytics)/i);
  assert.doesNotMatch(full, /<link[^>]+rel="stylesheet"[^>]+href="https?:/i);
});

test('gabarit : lang, viewport, un seul <main>', () => {
  assert.match(full, /<html lang="fr"/);
  assert.match(full, /<meta name="viewport" content="width=device-width, initial-scale=1"/);
  assert.equal((full.match(/<main[ >]/g) ?? []).length, 1);
});

test('mise en page : thème sombre automatique, colonne bornée, pas de ressource distante', () => {
  const css = readFileSync('src/styles/article.css', 'utf8');
  assert.match(css, /@media \(prefers-color-scheme: dark\)/);
  assert.match(css, /max-width:\s*var\(--measure\)/);
  assert.match(css, /--measure:\s*70ch/);
  assert.doesNotMatch(css, /@import|url\(\s*['"]?https?:/);
});

test('mise en page : la feuille de style est livrée dans la page', () => {
  assert.match(full, /<style[^>]*>[\s\S]*--measure[\s\S]*prefers-color-scheme:\s*dark/);
  assert.match(full, /<meta name="color-scheme" content="light dark"/);
});
