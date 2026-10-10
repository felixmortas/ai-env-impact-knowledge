---
title: 'Story 3.1 : Métadonnées de page'
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

**Problem:** La page n'a qu'un `<title>` : les moteurs de recherche et les aperçus de partage ne disposent ni de description, ni d'Open Graph, ni de méta-informations d'auteur et de date.

**Approach:** Compléter le `<head>` du gabarit avec `title`, `meta description`, Open Graph (`og:title`, `og:description`, `og:type`, `og:url`, `og:locale`, `og:site_name`), dates de publication/modification et lien canonique, par langue, depuis la configuration et les fichiers de localisation.

## Boundaries & Constraints

**Always:** Valeurs issues de `config.json` et de `locales/<lang>.json` (aucune chaîne en dur) ; description localisée rédigée par l'auteur dans la locale ; URL absolues construites avec `siteUrl` ; build en échec si une donnée requise manque ; dates issues de la config, jamais de l'horloge ; `og:locale` aligné sur la langue de la page.

**Ask First:** Ajouter une image Open Graph (non demandée) ; rédiger la description à la place de l'auteur (la demander).

**Never:** Analytics, balises de suivi, cookies ; données structurées non demandées ; métadonnées tirées du texte par heuristique ; contenu généré de la description sans validation de l'auteur.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Nominal | Page `/fr/` | `title`, `description`, `og:*` renseignés en français ; `canonical` = `…/fr/` | N/A |
| Description absente | Clé `meta.description` manquante | Build en échec nommant la clé et la langue | Erreur explicite |
| Autre langue | Page `/en/` | Valeurs de `en.json`, `og:locale` = `en` | N/A |
| Dates | Config | `article:published_time` et `article:modified_time` reflètent la config | N/A |
| Canonique | Déjà posé en 2.7 | Présent et unique ; pas de doublon | N/A |
| Auteur | Config | `meta name="author"` = prénom nom | N/A |

</frozen-after-approval>

## Code Map

- `src/layouts/Base.astro` -- `<head>` : complété (créé en 1.7, `canonical` et `hreflang` ajoutés en 2.7).
- `src/lib/metadata.ts`, `src/lib/metadata.test.ts` -- à créer : construire l'objet de métadonnées depuis config + chaînes + langue, valider.
- `src/locales/fr.json` -- `meta.description`, `meta.siteName`.
- `src/config.json` -- source de l'auteur, des dates et de `siteUrl`.

## Tasks & Acceptance

**Execution:**
- [ ] `src/lib/metadata.ts` -- construire et valider les métadonnées -- FR7
- [ ] `src/layouts/Base.astro` -- émettre les balises ; ne pas dupliquer `canonical` -- FR7
- [ ] `src/locales/fr.json` -- description de l'article (à faire valider par l'auteur) -- FR7
- [ ] Tests : présence de chaque balise dans `dist/fr/index.html`, échec sans description -- FR7
- [ ] `README.md` -- indiquer où modifier titre, description et auteur

**Acceptance Criteria:**
- Given `dist/fr/index.html`, when on lit le `<head>`, then `title`, `meta description`, `og:title`, `og:description`, `og:type`, `og:url`, `og:locale` et `link rel="canonical"` sont présents, une seule fois chacun.
- Given une modification du nom ou de la date dans `config.json`, when on rebuild, then les métadonnées changent en conséquence.
- Given la clé de description retirée dans une copie temporaire, when on construit, then le build échoue en la nommant.
- Given les URL des métadonnées, when on les lit, then elles sont absolues et commencent par `siteUrl`.
- Given deux builds sans changement, when on compare `dist/`, then ils sont identiques.

## Spec Change Log

## Design Notes

Le dépôt n'a pas d'image de partage : ne pas déclarer `og:image` plutôt que pointer vers un fichier inexistant. Le lien canonique est posé par 2.7 ; cette story le vérifie et complète le reste.

## Verification

**Commands:**
- `npm test` -- expected: tests verts
- `npm run check:idempotence` -- expected: « OK : builds identiques »
