import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

/** Tous les fichiers de `dist/` dont le nom finit par `ext`. */
function walk(dir: string, ext: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p, ext) : p.endsWith(ext) ? [p] : [];
  });
}

const strip = (s: string) => s.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
const pages = walk('dist', '.html').map((file) => ({ file, html: readFileSync(file, 'utf8') }));
// Les pages de redirection (meta refresh) n'ont pas de contenu à contrôler.
const articles = pages.filter((p) => !/<meta[^>]+http-equiv="refresh"/i.test(p.html));

test('au moins une page article est construite', () => {
  assert.ok(articles.length >= 1, 'aucune page dans dist/ : lancer npm run build');
});

test('titres : un seul h1, aucun saut de niveau', () => {
  for (const { file, html } of articles) {
    const hs = [...html.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/g)].map((m) => ({ level: Number(m[1]), text: strip(m[2]) }));
    assert.equal(hs.filter((h) => h.level === 1).length, 1, `${file} : il doit y avoir exactement un h1`);
    assert.equal(hs[0].level, 1, `${file} : le premier titre doit être le h1 (« ${hs[0].text} »)`);
    for (let i = 1; i < hs.length; i++) {
      assert.ok(hs[i].level <= hs[i - 1].level + 1, `${file} : saut de niveau h${hs[i - 1].level} -> h${hs[i].level} avant « ${hs[i].text} »`);
    }
  }
});

test('images : alt non vide', () => {
  for (const { file, html } of articles) {
    for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
      const src = /\ssrc="([^"]*)"/.exec(tag)?.[1] ?? '(sans src)';
      const alt = /\salt="([^"]*)"/.exec(tag)?.[1];
      assert.ok(alt !== undefined && alt.trim() !== '', `${file} : image sans alt « ${src} »`);
    }
  }
});

test('repères : un seul main, lien d\'évitement vers lui', () => {
  for (const { file, html } of articles) {
    assert.equal((html.match(/<main\b/g) ?? []).length, 1, `${file} : il doit y avoir exactement un main`);
    const id = /<main\b[^>]*\sid="([^"]+)"/.exec(html)?.[1];
    assert.ok(id, `${file} : main sans id`);
    const skip = /<a\b[^>]*class="skip-link"[^>]*>/.exec(html)?.[0];
    assert.ok(skip && skip.includes(`href="#${id}"`), `${file} : lien d'évitement absent ou ne ciblant pas #${id}`);
    assert.ok(html.indexOf('skip-link') < html.indexOf('<nav'), `${file} : le lien d'évitement doit précéder la navigation`);
  }
});

test('identifiants uniques et cibles d\'ancres existantes', () => {
  for (const { file, html } of articles) {
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
    const seen = new Set<string>();
    for (const id of ids) {
      assert.ok(!seen.has(id), `${file} : id en double « ${id} »`);
      seen.add(id);
    }
    for (const [, target] of html.matchAll(/\shref="#([^"]+)"/g)) {
      assert.ok(seen.has(decodeURIComponent(target)), `${file} : ancre sans cible « #${target} »`);
    }
  }
});

test('aucune ressource externe ni cookie', () => {
  const external = /^(?:https?:)?\/\//i;
  for (const { file, html } of pages) {
    for (const [tag] of html.matchAll(/<(?:script|img|iframe|source|video|audio|embed|object|link)\b[^>]*>/gi)) {
      if (/^<link\b/i.test(tag) && /\srel="(?:canonical|alternate)"/i.test(tag)) continue;
      for (const [, attr, url] of tag.matchAll(/\s(src|href|data|poster)="([^"]*)"/gi)) {
        assert.ok(!external.test(url), `${file} : ressource externe ${attr}=${url}`);
      }
    }
    for (const [, url] of html.matchAll(/url\(\s*["']?((?:https?:)?\/\/[^)"']+)/gi)) {
      assert.fail(`${file} : ressource externe url(${url})`);
    }
  }
  for (const file of [...walk('dist', '.css'), ...walk('dist', '.js')]) {
    const src = readFileSync(file, 'utf8');
    for (const [, url] of src.matchAll(/(?:@import\s+(?:url\()?|url\()\s*["']?((?:https?:)?\/\/[^)"';\s]+)/gi)) {
      assert.fail(`${file} : ressource externe ${url}`);
    }
    assert.ok(!/document\.cookie/.test(src), `${file} : accès à document.cookie`);
  }
});
