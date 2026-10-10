---
title: 'Story 1.5 : Images et légendes'
type: 'feature'
created: '2026-10-10'
status: 'ready-for-dev'
baseline_commit: 'deae351a893b409ace3e6a49f9228fc9a196e522'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Les 8 images `![légende](images/x.png){width=80%}` sont rendues brutes : `{width=80%}` reste du texte, il n'y a ni `figure` ni `figcaption`, et les fichiers du dossier partagé `images/` ne sont pas publiés.

**Approach:** Transformer chaque image en `figure` / `img` / `figcaption`, la légende servant aussi d'`alt`, interpréter `{width=N%}` comme largeur relative au conteneur, publier `images/` dans `dist/` et échouer au build si une légende est vide ou si un fichier est introuvable.

## Boundaries & Constraints

**Always:** Markdown source en lecture seule ; sortie statique ; build déterministe ; images au format web (PNG, SVG, WebP) ; légende = `alt` (même texte) ; `img` avec `width`/`height` ou ratio pour éviter le décalage de mise en page si possible sans dépendance.

**Ask First:** Ajouter une dépendance npm (par ex. lecture des dimensions d'image) ; produire ou convertir moi-même une image manquante.

**Never:** Modifier `src/fr/` ou `images/` ; laisser `{width=…}` visible ; supposer une largeur par défaut silencieuse si l'attribut manque (utiliser 100 %) ; dupliquer le dossier `images/` dans `src/` ; style global (1.7).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Nominal | `![Légende](images/x.png){width=80%}` | `<figure>` avec `<img src alt="Légende">` à 80 % du conteneur et `<figcaption>Légende</figcaption>` | N/A |
| Sans attribut | `![Légende](images/x.png)` | Largeur 100 % du conteneur | N/A |
| Légende vide | `![](images/x.png)` | Build en échec nommant le fichier source et le chemin d'image | Erreur explicite |
| Fichier absent | Chemin inexistant dans `images/` | Build en échec nommant le chemin | Erreur explicite |
| Format non web | Extension `.pdf`, `.tif`… | Build en échec nommant le fichier | Erreur explicite |
| Base de déploiement | Site sous `/ai-env-impact-knowledge` | `src` préfixé du `base` ; l'image se charge en local et déployée | N/A |

</frozen-after-approval>

## Code Map

- `src/fr/sections/{measure,reduce}.md` -- 8 images : `small-prompt-1..3`, `big-prompt-1..3`, `conv-branching-diagram`, `Major-Large-Language-Models`, toutes en `images/…png`.
- `images/` -- dossier partagé. **Précondition : `conv-branching-diagram.png` est absent** (seul `conv-branching-diagram.pdf` existe). Le Markdown fait foi : l'auteur doit fournir l'export PNG avant la fin de la story ; sans lui, le build échoue comme prévu.
- `src/lib/images.ts`, `src/lib/images.test.ts` -- à créer : parsing `![…](…){width=N%}`, validations.
- `astro.config.mjs` ou script de copie -- publier `images/` vers `dist/images/` (déterministe).
- `src/styles/article.css` -- `figure`, `img { max-width: 100%; height: auto }`.

## Tasks & Acceptance

**Execution:**
- [ ] `src/lib/images.ts` -- transformer chaque image en `figure`/`img`/`figcaption`, calculer la largeur, échouer sur légende vide, fichier absent ou format non web -- FR18, NFR9
- [ ] Brancher la transformation dans l'assemblage / le rendu ; publier `images/` dans `dist/images/` -- FR18
- [ ] `src/styles/article.css` -- `figure` centrée, `img` fluide -- UX-DR5
- [ ] `src/lib/images.test.ts`, `src/rendu.test.ts` -- couvrir la matrice, 8 `figure` dans la page -- FR18
- [ ] Obtenir de l'auteur `images/conv-branching-diagram.png` (export du PDF existant) avant de clore la story

**Acceptance Criteria:**
- Given `dist/fr/index.html`, when on compte les `figure`, then il y en a 8, chacune avec `img` dont l'`alt` égale le texte du `figcaption`.
- Given une image `{width=80%}`, when on lit son style, then sa largeur vaut 80 % du conteneur ; aucun `{width` n'est visible dans la page.
- Given une légende vide dans une copie temporaire, when on lance le build, then il échoue en nommant l'image.
- Given les 8 `src`, when on teste chaque fichier dans `dist/`, then il existe et est un PNG, SVG ou WebP.
- Given deux builds sans changement, when on compare `dist/`, then ils sont identiques.

## Spec Change Log

## Design Notes

Le chemin source `images/x.png` est relatif à la racine du dépôt (et non à `src/fr/`) : il faut le résoudre explicitement. Une copie de dossier suffit ; l'optimisation d'images d'Astro est facultative et ne doit pas rendre la sortie non déterministe.

## Verification

**Commands:**
- `npm test` -- expected: tests verts
- `npm run test:rendu` -- expected: tests de rendu verts
- `npm run check:idempotence` -- expected: « OK : builds identiques »
