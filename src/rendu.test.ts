import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const full = readFileSync('dist/fr/index.html', 'utf8');
// `html` = corps de l'article, sans la section « Références » (générée depuis le .bib).
assert.ok(full.includes('<section class="references"'), 'section Références absente');
const html = full.split('<section class="references"')[0].replace(/<aside class="author-block"[\s\S]*?<\/aside>/, '').replace(/<nav class="toc"[\s\S]*?<\/nav>/, '');
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

test('sans JavaScript : seuls les îlots de partage, de copie et de suivi de la table sont scriptés, aucun bouton rendu, aucune ressource tierce', () => {
  // Astro n'injecte ses scripts d'hydratation que pour l'îlot ; les îlots sont les boutons Partager et Copier et la table des matières (rendue au build, liste de liens présente sans JS).
  assert.equal((full.match(/<astro-island/g) ?? []).length, 3);
  assert.match(full, /component-export="default"[^>]*client="only"/);
  assert.match(full, /<astro-island[^>]*TocProgress[^>]*client="load"/);
  assert.match(full, /<nav class="toc"[^>]*><ol>/);
  assert.doesNotMatch(full, /role="progressbar"/, 'jauge rendue sans JavaScript');
  assert.doesNotMatch(full, /<button/i);
  assert.doesNotMatch(full, /<script[^>]+src="https?:/i);
  assert.match(full, /&quot;https:\/\/[^&]*\/fr\/&quot;/);
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

test('bloc auteur : valeurs visibles, email absent du texte visible, lien mailto', () => {
  const config = JSON.parse(readFileSync('src/config.json', 'utf8'));
  const bloc = full.match(/<aside class="author-block"[\s\S]*?<\/aside>/)?.[0] ?? '';
  assert.ok(bloc, 'bloc auteur absent');
  assert.equal((full.match(/<h1[ >]/g) ?? []).length, 1, 'un seul h1');
  assert.match(full, /<\/h1>\s*<aside class="author-block"/, 'bloc juste après le h1');
  const visible = bloc.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  assert.ok(visible.includes(`${config.firstName} ${config.lastName}`));
  assert.ok(visible.includes('GitHub') && visible.includes('LinkedIn'));
  assert.ok(visible.includes(config.license.name));
  assert.ok(!visible.includes(config.email), 'email en clair dans le texte visible');
  assert.match(bloc, /<a href="mailto:[^"]+">Écrire à l(?:'|&#39;)auteur<\/a>/);
  assert.ok(bloc.includes(`href="${config.license.url}"`));
  assert.equal((bloc.match(/<time datetime="\d{4}-\d{2}-\d{2}">[^<]+<\/time>/g) ?? []).length, 2);
});

test('citation : bloc <details> avec entrée @misc lisible sans JavaScript', () => {
  const m = /<details class="cite-block"[\s\S]*?<\/details>/.exec(full);
  assert.ok(m);
  assert.match(m[0], /<pre[^>]*><code>@misc\{mortas2026impact,/);
  assert.match(m[0], /author = \{Mortas, Felix\}/);
  assert.match(m[0], /url = \{https:\/\/[^}]*\/fr\/\}/);
  assert.match(m[0], /note = \{Consulté en ligne/);
  assert.doesNotMatch(m[0], /@felixmortas|contact@/);
});

test('citation : le bouton Copier reçoit exactement l\'entrée affichée', () => {
  const pre = /<pre[^>]*><code>([\s\S]*?)<\/code><\/pre>/.exec(full);
  assert.ok(pre);
  const entry = pre[1].replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
  const island = [...full.matchAll(/<astro-island[^>]*props="([^"]*)"/g)].map((m) => m[1]).find((p) => p.includes('&quot;text&quot;'));
  assert.ok(island);
  const props = JSON.parse(island.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&'));
  assert.equal(props.text[1], entry);
});

test('table des matières : liens ancrés vers des id existants, ordre de l\'article, sans titres de paragraphe', () => {
  const m = /<nav class="toc" aria-label="Table des matières">([\s\S]*?)<\/nav>/.exec(full);
  assert.ok(m, 'nav de la table absent');
  const hrefs = [...m[1].matchAll(/(<a href="#([^"]+)"[^>]*>)([^<]*)<\/a>/g)].map((x) => [x[1], x[2], x[3]] as [string, string, string]);
  assert.ok(hrefs.length >= 6);
  const ids = [...full.matchAll(/\sid="([^"]+)"/g)].map((x) => x[1]);
  let last = -1;
  for (const [, id] of hrefs) {
    assert.ok(ids.includes(id), `id manquant : ${id}`);
    const pos = full.indexOf(`id="${id}"`, full.indexOf('</nav>'));
    assert.ok(pos > last, `ordre non respecté : ${id}`);
    last = pos;
  }
  assert.equal(hrefs[hrefs.length - 1][1], 'references');
  // Nom accessible (points mobiles) et niveau de titre (taille des points) présents dans le HTML servi.
  for (const [a, id, text] of hrefs) {
    assert.ok(a.includes(`aria-label="${text}"`), `aria-label absent ou différent : ${id}`);
    assert.match(a, /data-depth="[2-5]"/, `data-depth absent : ${id}`);
  }
  assert.doesNotMatch(m[1], /aria-current/, 'aria-current rendu sans JavaScript');
  assert.match(m[1], /<ol>[\s\S]*<ol>/, 'pas d\'imbrication');
  assert.doesNotMatch(m[1], /<li>\s*<\/li>|<ol>\s*<\/ol>/);
  assert.doesNotMatch(m[1], /Pourquoi \?|Exemple concret|Règle générale/);
  const h1Id = /<h1 id="([^"]+)"/.exec(full)![1];
  assert.ok(!hrefs.some(([, id]) => id === h1Id), 'le h1 figure dans la table');
});

test('table des matières : correspond exactement aux titres h2 à h5 de l\'article, avec la bonne imbrication', () => {
  const m = /<nav class="toc" aria-label="Table des matières">([\s\S]*?)<\/nav>/.exec(full)!;
  const heads = [...html.matchAll(/<h([2-5]) id="([^"]+)"/g)].map((x) => ({ depth: Number(x[1]), id: x[2] }));
  assert.ok(heads.length > 0);
  const links = [...m[1].matchAll(/<a href="#([^"]+)"[^>]*>/g)].map((x) => x[1]);
  assert.deepEqual(links, [...heads.map((x) => x.id), 'references']);
  // Profondeur d'imbrication des <ol> = rang de niveau dans l'article (h2 → 1, h3 → 2, h4 → 3…) lorsqu'il n'y a pas de saut.
  let depth = 0;
  const nesting = new Map<string, number>();
  for (const tok of m[1].matchAll(/<ol>|<\/ol>|<a href="#([^"]+)"[^>]*>/g)) {
    if (tok[0] === '<ol>') depth++;
    else if (tok[0] === '</ol>') depth--;
    else nesting.set(tok[1], depth);
  }
  let prev = 1;
  for (const { depth: d, id } of heads) {
    const n = nesting.get(id)!;
    assert.ok(n >= 1 && n <= d - 1, `imbrication incohérente pour ${id}`);
    assert.ok(n <= prev + 1, `saut d'imbrication pour ${id}`);
    prev = n;
  }
  assert.equal(heads.find((x) => x.depth === 3) && nesting.get(heads.find((x) => x.depth === 3)!.id), 2);
});
