---
title: 'Story 2.5 : Table des matières qui suit la lecture'
type: 'feature'
created: '2026-10-10'
status: 'ready-for-dev'
baseline_commit: 'deae351a893b409ace3e6a49f9228fc9a196e522'
context:
  - '{project-root}/_bmad-output/planning-artifacts/epics.md'
  - '{project-root}/_bmad-output/specs/spec-article-web-statique/SPEC.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Dans un article long, le lecteur ne sait pas où il en est ; sur mobile, une table des matières complète prend trop de place.

**Approach:** Enrichir la table 2.4 avec un îlot React qui met en évidence l'entrée de la section visible et affiche une jauge de progression ; sur mobile, la table se replie en ligne de points non nommés dont la taille reflète le niveau de titre.

## Boundaries & Constraints

**Always:** Balisage rendu côté serveur par l'îlot (liste de liens présente sans JavaScript) ; JavaScript limité au suivi (IntersectionObserver / scroll) ; chaque point mobile reste un lien avec nom accessible (`aria-label` = titre, masqué visuellement) ; `aria-current` sur l'entrée active ; `prefers-reduced-motion` respecté ; aucun texte de l'article masqué.

**Ask First:** Ajouter une dépendance ; changer le point de rupture mobile (≈ 640 px par défaut).

**Never:** Dépendre de JS pour que les liens fonctionnent ; animations non désactivables ; intercepter ou casser les ancres natives ; masquer du contenu en mobile.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Défilement | Section X occupe la zone de lecture | Entrée X mise en évidence, `aria-current="true"` | N/A |
| Progression | Défilement de 0 à 100 % | Jauge croît de 0 à 100 % de l'article | N/A |
| Mobile | Largeur ≤ 640 px | Table repliée en ligne de points ; taille décroissante de `h2` à `h5` ; texte non masqué | N/A |
| Point mobile | Clic ou Entrée | Mène à la section ; nom accessible = titre | N/A |
| Sans JavaScript | JS désactivé | Liste de liens ancrés (2.4) intacte | N/A |
| Début / fin de page | Avant la première section / après la dernière | Aucune entrée incorrecte ; dernière entrée active en fin de page | N/A |

</frozen-after-approval>

## Code Map

- `src/components/Toc.astro` (2.4) -- remplacé ou enveloppé par un îlot.
- `src/components/TocProgress.tsx` -- à créer : rendu SSR de la liste + suivi (hook `useActiveHeading`).
- `src/lib/toc.ts` -- arbre de 2.4, avec profondeur par entrée.
- `src/styles/article.css` -- état actif, jauge, mode points mobile.
- `src/locales/fr.json` -- `toc.progress` (libellé accessible de la jauge si exposée).

## Tasks & Acceptance

**Execution:**
- [ ] `src/components/TocProgress.tsx` -- îlot : entrée active et jauge de progression -- FR9, UX-DR1
- [ ] CSS responsive : repli en points, tailles selon la profondeur, `aria-label` masqué visuellement -- UX-DR2
- [ ] Tests unitaires de la logique de calcul (section active, progression) avec des mesures injectées -- FR9
- [ ] Vérification navigateur : desktop et 375 px, avec et sans JavaScript (procédure dans le README) -- FR9
- [ ] Vérifier la compatibilité avec `prefers-reduced-motion`

**Acceptance Criteria:**
- Given un défilement dans l'article, when une section entre dans la zone de lecture, then son entrée est mise en évidence et la jauge reflète la progression.
- Given 375 px de large, when on affiche la page, then la table apparaît en points de tailles variables selon le niveau, sans nom visible, et le texte de l'article n'est pas masqué.
- Given un point de la ligne, when on l'active au clavier, then la page atteint la section et le lecteur d'écran annonce son titre.
- Given JavaScript désactivé, when on ouvre la page, then la table est une liste de liens ancrés fonctionnelle.
- Given deux builds sans changement, when on compare `dist/`, then ils sont identiques.

## Spec Change Log

## Design Notes

Isoler les calculs (entrée active, ratio de progression) dans des fonctions pures testables hors navigateur. L'îlot doit se rendre en HTML au build (`client:load` avec SSR) : c'est ce qui préserve la liste sans JS.

## Verification

**Commands:**
- `npm test` -- expected: tests verts
- `npm run check:idempotence` -- expected: « OK : builds identiques »
