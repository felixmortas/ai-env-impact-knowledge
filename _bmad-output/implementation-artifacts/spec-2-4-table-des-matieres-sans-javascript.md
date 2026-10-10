---
title: 'Story 2.4 : Table des matières sans JavaScript'
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

**Problem:** L'article est long (5 sections, plusieurs niveaux) et le lecteur ne peut pas aller directement à une section.

**Approach:** Générer à la construction une table des matières imbriquée de liens ancrés à partir des titres `h2` à `h5` (y compris « Références »), dans un `<nav>` étiqueté, entièrement fonctionnelle sans JavaScript.

## Boundaries & Constraints

**Always:** Liste produite au build depuis les titres réellement rendus (mêmes `id` que le contenu) ; HTML sémantique `nav` > `ol`/`ul` imbriquées ; libellé du `nav` via `t()` ; atteignable et utilisable au clavier avec focus visible.

**Ask First:** Position (colonne latérale fixe ou bloc en tête) si le gabarit 1.7 laisse le choix ; ajouter une dépendance.

**Never:** Inclure le `h1` ou les « titres de paragraphe » ; suivi de défilement, jauge, repli en points (2.5) ; JavaScript requis ; masquer du texte de l'article.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Nominal | Titres `h2` à `h5` | Liste imbriquée respectant la hiérarchie ; chaque lien `href="#id"` vers un `id` existant | N/A |
| Titre de paragraphe | `**Pourquoi ?**` | Absent de la table | N/A |
| Références | Section finale ajoutée en 1.6 | Présente comme entrée `h2` | N/A |
| Saut de niveau | `h2` suivi de `h4` | Imbrication correcte sans élément vide | N/A |
| Clavier | Tab / Entrée | Chaque entrée atteignable ; Entrée amène à la section | N/A |
| Sans JavaScript | JS désactivé | Table intacte et opérationnelle | N/A |

</frozen-after-approval>

## Code Map

- `src/pages/fr/index.astro` -- `render(entry)` retourne `headings` (`depth`, `slug`, `text`) ; ajouter l'entrée « Références ».
- `src/lib/toc.ts`, `src/lib/toc.test.ts` -- à créer : transformer la liste plate de titres en arbre.
- `src/components/Toc.astro` -- à créer : rendu statique de l'arbre.
- `src/layouts/Base.astro` -- emplacement de la table.
- `src/locales/fr.json` -- `toc.label`.
- `src/styles/article.css` -- style sobre, focus visible.

## Tasks & Acceptance

**Execution:**
- [ ] `src/lib/toc.ts` -- construire l'arbre depuis `headings` (h2–h5) ; ajouter Références -- FR9
- [ ] `src/components/Toc.astro` + intégration au gabarit -- FR9
- [ ] Styles : lisibles, focus visible, aucune perte de texte de l'article -- FR9
- [ ] Tests : arbre, `href` ↔ `id`, absence des titres de paragraphe -- FR9
- [ ] `README.md` -- indiquer que la table est générée des titres

**Acceptance Criteria:**
- Given `dist/fr/index.html`, when on liste les liens de la table, then chaque `href="#…"` correspond à un `id` du document et l'ordre suit celui de l'article.
- Given les titres de paragraphe (`**Pourquoi ?**`…), when on lit la table, then aucun n'y figure.
- Given JavaScript désactivé et la navigation clavier, when on active une entrée, then la page atteint la section.
- Given deux builds sans changement, when on compare `dist/`, then ils sont identiques.

## Spec Change Log

## Design Notes

Cette story garantit la base FR9 sans JS. 2.5 réutilisera le même balisage : conserver des `id` stables et ne pas coupler la structure à une implémentation d'îlot.

## Verification

**Commands:**
- `npm test` -- expected: tests verts
- `npm run test:rendu` -- expected: tests de rendu verts
- `npm run check:idempotence` -- expected: « OK : builds identiques »
