---
title: 'Story 2.1 : Configuration unique et bloc auteur'
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

**Problem:** La page n'indique ni qui a écrit l'article, ni quand, ni sous quelle licence, et aucune configuration centrale n'existe pour ces valeurs.

**Approach:** Créer un unique fichier de configuration édité à la main, le charger avec validation stricte (échec sur placeholder), et afficher en tête d'article un bloc auteur : nom, email en lien `mailto:`, GitHub, LinkedIn, dates localisées, licence CC BY-NC 4.0 avec lien.

## Boundaries & Constraints

**Always:** Les dates sont saisies à la main, globales à toutes les langues, jamais déduites de git ni de l'horloge ; format de date selon la langue de la page ; libellés du bloc via `t()` ; bloc visible et lisible sans JavaScript ; la configuration est la seule source de ces valeurs (bloc, et plus tard métadonnées et BibTeX).

**Ask First:** Les valeurs réelles à saisir (email, URL LinkedIn, dates) : les demander à l'auteur plutôt que les inventer ; ajouter une dépendance de validation de schéma.

**Never:** Afficher l'adresse email en clair dans le texte visible ; laisser le build passer avec une valeur de placeholder ; lire la date système ; modifier `src/fr/`.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Nominal | Config complète | Bloc auteur avec 7 valeurs affichées ; email = lien `mailto:` au texte neutre (« Écrire à l'auteur ») | N/A |
| Placeholder | Une valeur reste `À_RENSEIGNER` | Build en échec nommant le champ | Erreur explicite |
| Champ absent / vide | Clé manquante | Build en échec nommant le champ | Erreur explicite |
| Date invalide | `2026-13-40` | Build en échec nommant le champ | Erreur explicite |
| Date localisée | `2026-10-09` en `fr` | « 9 octobre 2026 » | N/A |
| Licence | CC BY-NC 4.0 | Nom « CC BY-NC 4.0 » + lien `https://creativecommons.org/licenses/by-nc/4.0/` | N/A |
| Modification | Changer le nom puis rebuild | Le nouveau nom apparaît dans le bloc | N/A |

</frozen-after-approval>

## Code Map

- `src/config.json` -- à créer : `firstName`, `lastName`, `email`, `githubUrl`, `linkedinUrl`, `publishedDate`, `modifiedDate`, `license` (`name`, `url`), `siteUrl` (`https://felixmortas.com/ai-env-impact-knowledge`).
- `src/lib/config.ts`, `src/lib/config.test.ts` -- à créer : chargement typé, validation, détection de placeholder.
- `src/lib/format-date.ts` -- à créer : `Intl.DateTimeFormat` selon la langue (date ISO sans fuseau, pour rester déterministe).
- `src/components/AuthorBlock.astro` -- à créer : bloc auteur.
- `src/layouts/Base.astro`, `src/pages/fr/index.astro` -- insérer le bloc sous le `h1`.
- `src/locales/fr.json` -- libellés : `author.by`, `author.published`, `author.modified`, `author.license`, `author.contact`, `author.github`, `author.linkedin`.

## Tasks & Acceptance

**Execution:**
- [ ] `src/config.json`, `src/lib/config.ts` -- configuration unique, validation stricte, rejet des placeholders -- FR3
- [ ] `src/lib/format-date.ts` -- dates au format de la langue -- FR3
- [ ] `src/components/AuthorBlock.astro` + intégration à la page -- FR3
- [ ] `src/locales/fr.json` -- libellés du bloc -- FR3
- [ ] Tests de config (placeholder, champ absent, date invalide) et de rendu (email non visible en clair) -- FR3
- [ ] `README.md` -- expliquer quels champs éditer à la main et quand mettre à jour `modifiedDate`
- [ ] Demander à l'auteur les valeurs réelles avant de clore (sinon le build échoue, par conception)

**Acceptance Criteria:**
- Given `dist/fr/index.html`, when on lit le texte visible du bloc, then il contient nom, dates, licence et liens GitHub/LinkedIn, et l'adresse email n'y apparaît pas en clair.
- Given le lien email, when on lit son `href`, then il commence par `mailto:`.
- Given une valeur de placeholder dans la configuration, when on lance le build, then il échoue en nommant le champ.
- Given `publishedDate` ou `modifiedDate` modifiée à la main, when on rebuild, then la date affichée change ; sans modification, elle ne change jamais.
- Given deux builds sans changement, when on compare `dist/`, then ils sont identiques.

## Spec Change Log

## Design Notes

Le build ne doit contenir aucune date calculée (`new Date()` sans argument, `git log`) : cela casserait le déterminisme et la règle « jamais déduite ». L'épic 3.1 et la story 2.3 réutilisent `config.ts`.

L'email dans le HTML source reste dans le `href` (inévitable pour un `mailto:`) ; l'exigence porte sur le texte visible.

## Verification

**Commands:**
- `npm test` -- expected: tests verts
- `npm run check:idempotence` -- expected: « OK : builds identiques »
