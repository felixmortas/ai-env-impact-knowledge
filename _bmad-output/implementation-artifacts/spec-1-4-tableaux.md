---
title: 'Story 1.4 : Tableaux'
type: 'feature'
created: '2026-10-10'
status: 'done'
baseline_commit: 'deae351a893b409ace3e6a49f9228fc9a196e522'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Les deux tableaux pipe sont rendus bruts : la ligne `Table: légende {#tab:id}` (placée **sous** le tableau) reste un paragraphe avec son identifiant, `Source : …` n'est pas associé au tableau et un tableau large peut faire défiler la page.

**Approach:** Transformer, avant le rendu, chaque tableau suivi de `Table: …` en `table` + `caption` (identifiant retiré), garder le paragraphe `Source : …` juste dessous, et envelopper le tableau dans un conteneur à défilement horizontal local.

## Boundaries & Constraints

**Always:** Markdown source en lecture seule ; sortie statique sans JavaScript ; build déterministe ; `--` et autres caractères des cellules affichés tels quels ; légende conservée intégralement, y compris une éventuelle citation `[@clé]` (rendue plus tard par 1.6) ; chaînes d'interface via `t()`.

**Ask First:** Ajouter une dépendance npm (Astro 7 utilise Sätteri : un plugin remark/rehype n'est pas utilisable, voir 1.2) ; choisir entre transformation du texte avant rendu ou post-traitement du HTML si l'une des deux impose une dépendance.

**Never:** Conserver `{#tab:…}` dans le HTML ; convertir `--` en tiret long ; référencer les tableaux dans le texte (non demandé) ; style global de la page (1.7) ; modifier `src/fr/`.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Nominal | Tableau pipe + ligne `Table: … {#tab:x}` + `Source : …` | `<table>` avec `<caption>` (légende sans `{#tab:x}`), puis le paragraphe `Source : …` | N/A |
| Cellule vide de valeur | Cellule `--` | `--` littéral | N/A |
| Alignement | `:---`, `---:` | Alignement conservé dans les cellules | N/A |
| Légende avec citation | `… [@li2026…] {#tab:…}` | Texte `[@li2026…]` conservé dans la légende (résolu en 1.6) | N/A |
| `Table:` orphelin | Ligne `Table:` sans tableau juste au-dessus | Build en échec nommant le fichier et la ligne | Erreur explicite |
| Mobile 375 px | Tableau plus large que l'écran | Défilement horizontal dans le conteneur du tableau seulement | N/A |

</frozen-after-approval>

## Code Map

- `src/fr/sections/understand.md` -- deux tableaux (l. 105-145) : WUE (4 colonnes, `--`) et paramètres de modèles ; chacun suivi de `Table: …` puis `Source : …`.
- `src/lib/assemble-article.ts` -- point d'entrée du texte assemblé ; hôte possible de la transformation ou d'une nouvelle étape de traitement du Markdown.
- `src/lib/tables.ts`, `src/lib/tables.test.ts` -- à créer : détection tableau + `Table:` et sortie `caption`.
- `src/styles/article.css` -- conteneur `.table-scroll { overflow-x: auto }` (fichier créé en 1.3).
- `src/rendu.test.ts` -- cas tableaux sur `dist/fr/index.html` (fichier créé en 1.3).

## Tasks & Acceptance

**Execution:**
- [x] `src/lib/tables.ts` -- associer chaque `Table: légende {#id}` au tableau qui le précède ; produire `table`/`caption` sans identifiant ; échouer si `Table:` est orphelin -- FR17
- [x] `src/lib/assemble-article.ts` ou pipeline de rendu -- brancher la transformation, `Source : …` reste le paragraphe suivant -- FR17
- [x] `src/styles/article.css` -- conteneur à défilement horizontal local -- UX-DR5
- [x] `src/lib/tables.test.ts`, `src/rendu.test.ts` -- couvrir la matrice -- FR17, FR19
- [x] `README.md` -- documenter la convention `Table:`

**Acceptance Criteria:**
- Given `dist/fr/index.html`, when on cherche `{#` ou `Table:`, then aucune occurrence n'est visible.
- Given les deux tableaux, when on lit le HTML, then chacun a un `<caption>` portant la légende source et un paragraphe `Source : …` immédiatement après.
- Given le tableau WUE, when on lit ses cellules, then les `--` sont littéraux.
- Given une largeur de 375 px, when on affiche la page, then le tableau défile dans son conteneur et la page ne défile pas horizontalement.
- Given deux builds sans changement, when on compare `dist/`, then ils sont identiques.

## Spec Change Log

## Design Notes

La légende est **sous** le tableau dans la source (convention Pandoc) ; `caption` doit pourtant être le premier enfant de `table` (HTML valide). Les libellés d'en-têtes en gras (`| **WUE (L/kWh)** |`) restent en `strong` dans `th`.

## Verification

**Commands:**
- `npm test` -- expected: tests verts
- `npm run test:rendu` -- expected: tests de rendu verts
- `npm run check:idempotence` -- expected: « OK : builds identiques »

## Suggested Review Order

**Transformation des légendes**

- Marque `Table:` avant rendu, échoue si orphelin (fichier et ligne).
  [`tables.ts:15`](../../src/lib/tables.ts#L15)

- Après rendu : `<caption>` en premier enfant, tableau enveloppé.
  [`tables.ts:44`](../../src/lib/tables.ts#L44)

**Branchement**

- Marquage appliqué à chaque section incluse.
  [`assemble-article.ts:41`](../../src/lib/assemble-article.ts#L41)

- Post-traitement du HTML rendu par le loader.
  [`content.config.ts:18`](../../src/content.config.ts#L18)

**Style et tests**

- Défilement horizontal local du tableau.
  [`article.css:8`](../../src/styles/article.css#L8)

- Cas de la matrice sur le module.
  [`tables.test.ts:1`](../../src/lib/tables.test.ts#L1)

- Cas de rendu sur `dist/fr/index.html`.
  [`rendu.test.ts:63`](../../src/rendu.test.ts#L63)
