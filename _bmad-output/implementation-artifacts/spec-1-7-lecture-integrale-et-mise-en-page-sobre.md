---
title: 'Story 1.7 : Lecture intégrale et mise en page sobre'
type: 'feature'
created: '2026-10-10'
status: 'done'
baseline_commit: 'deae351a893b409ace3e6a49f9228fc9a196e522'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Une fois les constructions rendues (1.2 à 1.6), la page n'a pas de gabarit commun ni de mise en page lisible, et rien ne prouve qu'aucun contenu du Markdown ne manque ou ne déborde.

**Approach:** Créer un gabarit de page partagé et une feuille de style sobre (colonne de lecture, typographie, thème clair/sombre automatique), puis ajouter un contrôle de complétude du contenu et de non-débordement à 375 px.

## Boundaries & Constraints

**Always:** Pas de JavaScript requis pour lire ; CSS seulement, sans police ni ressource tierce ; thème via `prefers-color-scheme` ; contraste suffisant en clair et en sombre ; gabarit prêt à recevoir `lang`, métadonnées et blocs des epics 2 et 3 ; chaînes d'interface via `t()`.

**Ask First:** Ajouter une dépendance (framework CSS, outil de test navigateur comme Playwright) ; choisir une identité visuelle marquée (couleurs de marque, illustrations).

**Never:** Table des matières, bloc auteur, boutons (epic 2) ; analytics, cookies, polices distantes ; masquer du contenu en mobile ; modifier `src/fr/`.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Complétude | Markdown assemblé | Chaque paragraphe, tableau (2), image (8) et chiffre de la source est présent dans le HTML | Test en échec listant l'élément manquant |
| 375 px | Viewport étroit | `document.scrollWidth <= innerWidth` ; tableaux défilent localement | N/A |
| Thème | `prefers-color-scheme: dark` | Fond et texte sombres lisibles ; clair par défaut | N/A |
| Sans JavaScript | JS désactivé | Article entier lisible | N/A |
| Grand écran | ≥ 1440 px | Colonne de lecture bornée (≈ 70 caractères) centrée | N/A |

</frozen-after-approval>

## Code Map

- `src/pages/fr/index.astro` -- remplacer le document HTML inline par le gabarit.
- `src/layouts/Base.astro` -- à créer : `<html lang>`, `<head>` (charset, viewport, titre), `<main>` ; emplacements pour les métadonnées futures.
- `src/styles/article.css` -- étendre (créé en 1.3) : variables de couleur claires/sombres, typographie, espacements, colonne, `table`, `figure`.
- `src/rendu.test.ts` -- test de complétude (paragraphes, 2 tables, 8 figures, nombre de citations résolues) ; test de non-débordement si outil navigateur accepté, sinon vérification manuelle documentée.
- `README.md` -- documenter la vérification à 375 px.

## Tasks & Acceptance

**Execution:**
- [ ] `src/layouts/Base.astro` -- gabarit partagé avec `lang` issu de `t('page.lang')` -- FR1
- [ ] `src/styles/article.css` -- mise en page sobre, thème clair/sombre automatique, aucun débordement -- NFR4, NFR7, UX-DR5
- [ ] `src/rendu.test.ts` -- complétude du contenu : comparaison source assemblée / HTML (paragraphes, chiffres) -- FR1
- [ ] Vérification à 375 px (outil navigateur accepté ou procédure manuelle dans le README) -- NFR4
- [ ] Vérification sans JavaScript : le build ne livre aucun script indispensable à la lecture -- NFR2

**Acceptance Criteria:**
- Given `dist/fr/index.html`, when on compare avec le Markdown assemblé, then chaque paragraphe, les 2 tableaux, les 8 images et chaque nombre de la source sont présents.
- Given un viewport de 375 px, when on affiche la page, then la page ne défile pas horizontalement.
- Given un système en thème sombre, when on affiche la page, then les couleurs passent en sombre sans action de l'utilisateur.
- Given JavaScript désactivé, when on ouvre `/fr/`, then l'article se lit intégralement.
- Given deux builds sans changement, when on compare `dist/`, then ils sont identiques.

## Spec Change Log

## Design Notes

Le gabarit est le point d'extension des epics 2 et 3 (bloc auteur, table des matières, métadonnées, `hreflang`). Il règle aussi une dette notée dans `deferred-work.md` (« layout partagé »). Rester minimal : une colonne, une échelle typographique, des variables CSS.

## Verification

**Commands:**
- `npm test` -- expected: tests verts
- `npm run test:rendu` -- expected: tests de rendu verts
- `npm run check:idempotence` -- expected: « OK : builds identiques »

## Suggested Review Order

**Gabarit partagé**

- Point d'extension des epics 2 et 3 : `lang` via `t()`, emplacements nommés.
  [`Base.astro:1`](../../src/layouts/Base.astro#L1)

- La page française délègue son document HTML au gabarit.
  [`index.astro:4`](../../src/pages/fr/index.astro#L4)

**Mise en page sobre**

- Variables claires/sombres, colonne de 70ch, typographie système.
  [`article.css:27`](../../src/styles/article.css#L27)

**Vérifications**

- Complétude du contenu, absence de script, CSS livré dans la page.
  [`rendu.test.ts:128`](../../src/rendu.test.ts#L128)

- Procédure manuelle de contrôle à 375 px.
  [`README.md:42`](../../README.md#L42)
