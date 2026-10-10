---
title: 'Story 2.6 : Arborescence multilingue'
type: 'feature'
created: '2026-10-10'
status: 'done'
baseline_commit: 'deae351a893b409ace3e6a49f9228fc9a196e522'
context:
  - '{project-root}/_bmad-output/planning-artifacts/epics.md'
  - '{project-root}/_bmad-output/specs/spec-article-web-statique/SPEC.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Le code est câblé en dur sur le français (`src/pages/fr/index.astro`, loader `article-fr`, `t()` sans langue) ; les traductions EN et ES, fournies plus tard, ne pourraient pas être ajoutées sans modifier le code.

**Approach:** Généraliser le site à toute langue disposant de `src/<lang>/` : loader de contenu, route `/<lang>/`, fichiers de chaînes `src/locales/<lang>.json`, `t(lang, clé)` typé, et échec du build si une chaîne d'interface manque dans une langue.

## Boundaries & Constraints

**Always:** Ajouter une langue = ses Markdown + son `locales/<lang>.json` + ses valeurs d'édition localisées, sans changement de code ; `references.bib`, `images/` et `config.json` restent partagés ; le Markdown livré fait foi (aucune vérification de structure entre langues, aucune traduction automatique) ; la racine mène toujours à `/fr/` ; `<html lang>` correct par page.

**Ask First:** Ajouter une dépendance ; ajouter des fichiers EN/ES de contenu factice au dépôt (préférer des fixtures de test temporaires).

**Never:** Générer ou compléter des traductions ; comparer la structure des Markdown entre langues ; chaîne d'interface en dur ; commiter de faux contenu EN/ES.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Langue présente | `src/fr/` + `locales/fr.json` | `dist/fr/index.html`, `lang="fr"` | N/A |
| Ajout de langue (fixture) | `src/en/` + `locales/en.json` complets | `dist/en/index.html`, `lang="en"`, sans changer le code | N/A |
| Chaîne manquante | Clé de `fr.json` absente de `en.json` | Build en échec nommant la langue et la clé | Erreur explicite |
| Markdown sans locale | `src/es/` sans `locales/es.json` | Build en échec nommant `es` | Erreur explicite |
| Locale sans Markdown | `locales/es.json` sans `src/es/` | Build en échec nommant `es` | Erreur explicite |
| Racine | `/` | Mène à `/fr/` | N/A |
| Dates | Config unique | Formatées selon la langue de la page | N/A |

</frozen-after-approval>

## Code Map

- `src/content.config.ts` -- loader `article-fr` en dur à généraliser en une entrée par `src/<lang>/main.md`.
- `src/pages/fr/index.astro` -- remplacer par `src/pages/[lang]/index.astro` avec `getStaticPaths`.
- `src/i18n.ts`, `src/i18n.test.ts` -- `t(lang, key)`, clés typées, message d'erreur nommant la locale (dette de `deferred-work.md`).
- `src/lib/languages.ts`, `src/lib/languages.test.ts` -- à créer : détection des langues, validation croisée dossiers / locales / clés.
- `src/locales/fr.json` -- référence des clés ; `en.json`, `es.json` ajoutés lors de la livraison des traductions.
- `src/lib/assemble-article.ts` -- reçoit le chemin de la langue ; inchangé hors paramètre.
- `src/pages/index.astro` -- redirection inchangée.
- `scripts/check-idempotence.sh` -- greps à adapter à `dist/<lang>/`.

## Tasks & Acceptance

**Execution:**
- [x] `src/lib/languages.ts` -- découvrir les langues, valider dossiers, fichiers de chaînes et clés -- FR8
- [x] `src/i18n.ts` -- `t(lang, clé)` ; tous les appelants mis à jour ; clés typées -- FR8
- [x] `src/content.config.ts`, `src/pages/[lang]/index.astro` -- une page par langue, `lang` correct -- FR8
- [x] Tests avec fixtures temporaires (ajout d'une langue sans changement de code ; chaîne manquante ; dossier ou locale orphelin) -- FR8
- [x] `README.md` -- procédure « ajouter une langue »
- [x] Adapter `scripts/check-idempotence.sh` au nouveau découpage

**Acceptance Criteria:**
- Given `src/fr/` seul, when on construit, then `dist/fr/index.html` existe avec `lang="fr"` et le comportement de l'epic 1 est inchangé.
- Given une fixture `en` complète ajoutée en copie temporaire, when on construit, then `dist/en/index.html` existe avec `lang="en"` sans modifier le code.
- Given une clé absente d'une locale, when on construit, then le build échoue en nommant la langue et la clé.
- Given la racine du site, when on l'ouvre, then elle mène à `/fr/`.
- Given deux builds sans changement, when on compare `dist/`, then ils sont identiques.

## Spec Change Log

## Design Notes

Les valeurs d'édition localisées (par exemple la description de la page, 3.1) vivent dans `locales/<lang>.json`. Les contenus EN/ES arriveront plus tard : toute la validation se teste donc avec des fixtures. Cette story solde l'élément « typer les clés de `t()` » de `deferred-work.md`.

## Verification

**Commands:**
- `npm test` -- expected: tests verts
- `npm run check:idempotence` -- expected: « OK : builds identiques »

## Suggested Review Order

**Découverte et validation des langues**

- Point d'entrée : découverte des langues et validation croisée dossiers, locales et clés.
  [`languages.ts:59`](../../src/lib/languages.ts#L59)

- `t(lang, clé)` avec clés typées d'après `fr.json`.
  [`i18n.ts:22`](../../src/i18n.ts#L22)

**Une page par langue**

- Le loader crée une entrée de contenu par langue découverte.
  [`content.config.ts:16`](../../src/content.config.ts#L16)

- Route dynamique `/<lang>/` générée par `getStaticPaths`.
  [`index.astro:10`](../../src/pages/[lang]/index.astro#L10)

- `lang` transmis au gabarit et aux composants.
  [`Base.astro`](../../src/layouts/Base.astro)

**Vérifications et documentation**

- Builds réels avec fixture `en` temporaire.
  [`langues-build.test.ts`](../../src/langues-build.test.ts)

- Validation unitaire avec fixtures temporaires.
  [`languages.test.ts`](../../src/lib/languages.test.ts)

- Idempotence bouclée sur chaque langue.
  [`check-idempotence.sh`](../../scripts/check-idempotence.sh)

- Procédure « Ajouter une langue ».
  [`README.md`](../../README.md)
