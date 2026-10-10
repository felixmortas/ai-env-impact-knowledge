---
title: 'Story 1.3 : Texte courant, listes, liens et caractères'
type: 'feature'
created: '2026-10-10'
status: 'ready-for-dev'
baseline_commit: 'deae351a893b409ace3e6a49f9228fc9a196e522'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** La page `/fr/` assemble l'article (1.2) mais rien ne garantit que le gras, l'italique, les « titres de paragraphe », les listes, les liens et les caractères spéciaux soient rendus fidèlement, ni que les URL longues restent dans la page.

**Approach:** S'appuyer sur le rendu Markdown d'Astro, le verrouiller par des tests sur le HTML construit, et ajouter la seule feuille de style nécessaire (`src/styles/article.css`) pour que les URL longues ne débordent pas.

## Boundaries & Constraints

**Always:** Markdown source en lecture seule, aucune correction de contenu ; sortie statique lisible sans JavaScript ; build déterministe ; chaînes d'interface via `t()` ; code et README en français.

**Ask First:** Ajouter une dépendance npm hors Astro/React (par ex. un parseur HTML pour les tests : préférer `node:test` + expressions régulières ou DOM minimal maison).

**Never:** Transformer les « titres de paragraphe » en `h*` ou en entrée de table des matières ; traiter `[@clé]`, `Table:`, `{width=…}` (1.4 à 1.6, restent bruts) ; mise en page globale, thème, largeur de colonne (1.7) ; modifier `src/fr/`, `images/`, `data/` ; convertir `--`, `~`, `_`, `>` ou les indices Unicode.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Gras / italique | `**Plus un modèle…**`, `*one-shot*`, `***x***` | `strong`, `em`, `strong>em` | N/A |
| Titre de paragraphe | `**Pourquoi ?**`, `**Exemple** :`, `**Formule :** WUE = …` | `<p><strong>…</strong>…</p>`, jamais `h1`–`h6`, absent de la liste des titres (`headings`) | N/A |
| Listes | `- …` et `1. …` (87 items) | `ul` / `ol` avec `li` ; listes imbriquées conservées | N/A |
| Liens | `[texte](url)` (16) et `<url>` (4) | `a href` exact ; URL longue sans débordement horizontal | N/A |
| Caractères | `CO₂e`, `m³`, `~0,3 Wh`, `_`, `>`, `'` | Identiques à la source (pas de `’`, pas d'entité inattendue) | N/A |

</frozen-after-approval>

## Code Map

- `src/fr/sections/*.md` -- 9 titres de paragraphe (`**Texte**`, `**Texte** :`, `**Texte :** suite`), listes, 20 liens, indices Unicode.
- `src/pages/fr/index.astro` -- importer `../../styles/article.css`.
- `src/styles/article.css` -- à créer (le dossier existe, vide) ; règle `overflow-wrap: anywhere` sur `a` et contenu courant.
- `src/rendu.test.ts` -- à créer : lit `dist/fr/index.html` et vérifie la matrice.
- `package.json` -- script `test:rendu` (`npm run build && node --test src/rendu.test.ts`).

## Tasks & Acceptance

**Execution:**
- [ ] `src/styles/article.css` -- règle anti-débordement pour liens et texte ; importée dans la page -- FR14
- [ ] `src/rendu.test.ts` -- tests sur `dist/fr/index.html` : gras/italique, titres de paragraphe sans balise de titre, nombre de `ul`/`ol`, 20 liens externes avec `href` exact, caractères spéciaux littéraux -- FR12, FR13, FR14, FR16, FR19
- [ ] `package.json`, `README.md` -- script `test:rendu` ; décrire les tests de rendu
- [ ] Si un test échoue à cause du rendu d'Astro (par ex. `**Exemple** :` avec espace), corriger côté pipeline de rendu, jamais dans le Markdown

**Acceptance Criteria:**
- Given `dist/fr/index.html`, when on cherche chacun des 9 titres de paragraphe, then chacun est dans un `<strong>` à l'intérieur d'un `<p>` et aucun `h1`–`h6` ne porte ce texte.
- Given la page, when on compte les liens, then les 16 liens `[texte](url)` et les 4 autoliens ont un `href` identique à la source.
- Given une URL longue (par ex. `https://01.me/research/ikp/#/calibration#proprietary`), when la page est affichée à 375 px, then elle ne provoque aucun défilement horizontal de la page.
- Given le texte « CO₂e », « m³ » et « ~0,3 Wh », when on lit le HTML, then ils apparaissent tels quels.
- Given deux builds sans changement, when on compare `dist/`, then ils sont identiques (`npm run check:idempotence`).

## Spec Change Log

## Design Notes

Astro rend déjà ces constructions nativement ; la valeur de la story est la garantie (tests) et le garde-fou d'affichage (CSS). Ne pas ajouter de plugin si les tests passent.

## Verification

**Commands:**
- `npm test` -- expected: tests verts
- `npm run test:rendu` -- expected: tests de rendu verts
- `npm run check:idempotence` -- expected: « OK : builds identiques »
