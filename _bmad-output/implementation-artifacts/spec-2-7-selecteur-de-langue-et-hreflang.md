---
title: 'Story 2.7 : Sélecteur de langue et hreflang'
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

**Problem:** Un lecteur qui change de langue repart du haut de l'article, et les moteurs de recherche ne savent pas que les pages `/fr/`, `/en/`, `/es/` sont des versions d'un même article.

**Approach:** Ajouter un sélecteur de langue (liens statiques, amélioré par un îlot) qui renvoie vers la même section dans l'autre langue quand elle existe, et déclarer `rel="canonical"` et `rel="alternate" hreflang` pour chaque langue.

## Boundaries & Constraints

**Always:** Sans JavaScript, chaque langue est un lien vers `/<lang>/` ; correspondance des sections par **rang de section de premier niveau** (`h2`, donc N-ième fichier de section) car les titres traduits produisent des `id` différents ; si la section de même rang n'existe pas dans l'autre langue, lien vers le haut de page ; nom de chaque langue écrit dans sa propre langue (« Français », « English », « Español ») ; `hreflang` pour chaque langue disponible + `x-default` vers `/fr/` ; titre BibTeX (2.3) et dates localisés par langue.

**Ask First:** Ajouter une dépendance ; changer la règle de correspondance par rang (par exemple ancres explicites dans le Markdown).

**Never:** Vérifier la structure entre langues ; deviner la section par traduction de titre ; modifier les Markdown ; lister une langue sans page.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Sans JavaScript | Clic sur « English » | Ouvre `/en/` en haut de page | N/A |
| Avec JavaScript | Lecteur dans la 3ᵉ section `h2` | Lien EN pointe vers `/en/#<id de la 3ᵉ section>` | N/A |
| Section absente | EN n'a que 2 sections `h2` | Lien vers `/en/` (haut) | N/A |
| Langue courante | Page `/fr/` | `fr` marqué `aria-current="page"`, non cliquable ou inerte | N/A |
| `hreflang` | Langues fr, en, es | Une balise `alternate` par langue (+ `x-default` → fr) sur chaque page ; `canonical` = URL de la page | N/A |
| Une seule langue | Seul `fr` | Pas de sélecteur affiché (ou un seul élément), `canonical` seul | N/A |
| Localisation | Page `/en/` | Dates et titre de l'entrée BibTeX en anglais | N/A |

</frozen-after-approval>

## Code Map

- `src/layouts/Base.astro` -- `<link rel="canonical">`, `<link rel="alternate" hreflang>` dans `<head>`.
- `src/components/LanguageSwitcher.tsx` -- à créer : îlot SSR avec liens statiques, enrichi en JS par la section courante.
- `src/lib/language-links.ts`, `src/lib/language-links.test.ts` -- à créer : liens par langue et correspondance par rang de section `h2`.
- `src/lib/languages.ts`, `src/lib/urls.ts` -- langues disponibles (2.6) et URL canoniques (2.2).
- `src/locales/<lang>.json` -- `language.name` (autonyme), `language.switcher.label`.

## Tasks & Acceptance

**Execution:**
- [ ] `src/lib/language-links.ts` -- liens statiques et calcul du lien par rang de section -- FR8, UX-DR4
- [ ] `src/components/LanguageSwitcher.tsx` -- sélecteur accessible, amélioration par la section visible -- UX-DR4
- [ ] `src/layouts/Base.astro` -- `canonical`, `alternate` / `hreflang`, `x-default` -- FR8
- [ ] Vérifier que la citation BibTeX et les dates sont localisées dans chaque langue (fixtures de 2.6) -- FR8
- [ ] Tests : correspondance par rang, section absente, une seule langue, balises `head` -- FR8
- [ ] `README.md` -- documenter la règle de correspondance par rang

**Acceptance Criteria:**
- Given une page quelconque, when on lit son `<head>`, then elle contient un `canonical` vers sa propre URL et un `alternate hreflang` pour chaque langue plus `x-default`.
- Given JavaScript désactivé, when on active une langue, then on arrive en haut de la page de cette langue.
- Given JavaScript actif et une section de rang N visible, when on lit le lien d'une autre langue qui a au moins N sections, then il mène à l'`id` de la N-ième section de cette langue.
- Given une langue avec moins de sections, when on lit le lien, then il mène au haut de page.
- Given deux builds sans changement, when on compare `dist/`, then ils sont identiques.

## Spec Change Log

## Design Notes

**Décision de conception à confirmer :** le SPEC dit « renvoie vers la même section quand elle existe » sans définir « même ». Les titres traduits donnant des `id` distincts et aucune vérification de structure n'étant voulue, le rang de la section de premier niveau est la seule correspondance sans convention supplémentaire ; elle s'appuie sur le prefixe numérique d'ordre des fichiers de section. Les sous-sections (`h3` et plus) retombent sur leur section `h2` parente.

## Verification

**Commands:**
- `npm test` -- expected: tests verts
- `npm run check:idempotence` -- expected: « OK : builds identiques »
