---
title: 'Story 1.2 : Page française : titre, sections incluses et titres'
type: 'feature'
created: '2026-10-09'
status: 'done'
baseline_commit: '1a553c0a70114defb411a297ef9516379a2ca284'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `/fr/` n'affiche qu'un texte provisoire ; le contenu de `src/fr/` n'est pas lu, les sections ne sont pas assemblées et la structure de titres n'existe pas.

**Approach:** Lire `src/fr/main.md`, remplacer chaque lien d'inclusion par le contenu du fichier (titres de section décalés d'un niveau), retirer les commentaires HTML, puis rendre le tout en HTML statique via le pipeline Markdown d'Astro, avec ancres de titres stables.

## Boundaries & Constraints

**Always:** Markdown source en lecture seule, aucune correction de contenu ; sortie statique lisible sans JavaScript ; build déterministe ; chaînes d'interface via `t()` ; code et README en français.

**Ask First:** Ajouter une dépendance npm hors Astro/React ; changer la structure de `src/fr/`.

**Never:** Rendre les citations `[@clé]`, `{width=80%}`, `Table:` ou le style des tableaux/images (stories 1.3–1.6, ils restent bruts) ; table des matières ; mise en page avancée (1.7) ; modifier `src/fr/`, `images/`, `data/` ; traiter EN/ES.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Nominal | `main.md` + 5 inclusions | `dist/fr/index.html` : un `h1`, 5 `h2` dans l'ordre d'inclusion, aucun lien `sections/…` | N/A |
| Décalage | `#`…`####` d'une section | `h2`…`h5`, `id` stables et uniques | N/A |
| Commentaires | `<!-- … -->` (mono ou multi-ligne) | Absents du HTML et du texte | N/A |
| Inclusion cassée | Lien vers fichier inexistant | Build en échec nommant le fichier | Erreur explicite |
| Racine | `/` | Mène à `/fr/` (déjà en place) | N/A |

</frozen-after-approval>

## Code Map

- `src/fr/main.md` -- titre `#`, texte d'introduction, 5 liens `[sections/x](sections/x.md)` isolés sur leur ligne, commentaires HTML ; aucun bloc de code (pas de risque de fausse détection de titre).
- `src/fr/sections/*.md` -- chacun commence par `#` ; sous-titres `##` à `####` (max h5 après décalage).
- `src/pages/fr/index.astro` -- page minimale actuelle (1.1) à remplacer par le rendu de l'article.
- `src/pages/index.astro` -- redirection racine, inchangée.
- `src/i18n.ts`, `src/locales/fr.json` -- chaînes d'interface ; retirer les clés provisoires `home.*` devenues inutiles.
- `astro.config.mjs` -- point d'accroche pour un plugin remark local (`markdown.remarkPlugins`).
- `scripts/check-idempotence.sh` -- greps de sortie à garder valides.

## Tasks & Acceptance

**Execution:**
- [x] `src/lib/assemble-article.ts` -- lire `main.md`, remplacer chaque ligne d'inclusion par le contenu du fichier avec titres décalés d'un niveau (`#`→`##`), échouer si fichier absent ; retourner le titre et le Markdown assemblé -- FR15, FR11
- [x] `src/lib/assemble-article.ts` -- `stripComments` retire les commentaires (plugin remark impossible : Astro 7 utilise Sätteri) -- FR20
- [x] `src/pages/fr/index.astro` -- rendre l'article assemblé (`h1` unique, `<title>` issu du titre) ; nettoyer `fr.json` -- FR10
- [x] `astro.config.mjs` -- `smartypants: false` (sinon `'` devient `’`) ; ancres générées par Astro -- FR11
- [x] `src/lib/assemble-article.test.ts` -- tests : ordre des inclusions, décalage de niveaux, fichier manquant, commentaires retirés -- couvre la matrice
- [x] `package.json`, `README.md` -- script `test` étendu ; décrire la source de contenu et l'assemblage

**Acceptance Criteria:**
- Given `dist/fr/index.html`, when on compte les titres, then il y a exactement un `h1`, cinq `h2` (intro, understand, measure, reduce, conclusion dans cet ordre) et aucun saut de niveau.
- Given la page, when on cherche `sections/` ou `<!--`, then aucune occurrence n'est visible dans le HTML rendu.
- Given deux builds sans changement, when on compare `dist/`, then ils sont identiques (`npm run check:idempotence`).

## Spec Change Log

## Design Notes

L'assemblage se fait au niveau texte avant le rendu pour laisser Astro (remark/rehype, `github-slugger`) produire HTML et ancres. Le décalage s'applique aux seules lignes `^#{1,4} ` des sections ; le `h1` vient de `main.md`.

## Verification

**Commands:**
- `npm test` -- expected: tests verts
- `npm run check:idempotence` -- expected: « OK : builds identiques »
- `grep -o '<h[1-6]' dist/fr/index.html | sort | uniq -c` -- expected: 1 `h1`, 5 `h2`, puis `h3`–`h5`
