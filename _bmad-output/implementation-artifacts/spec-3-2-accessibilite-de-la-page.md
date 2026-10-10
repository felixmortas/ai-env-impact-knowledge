---
title: 'Story 3.2 : Accessibilité de la page'
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

**Problem:** Rien ne garantit que la page terminée (epics 1 et 2) soit utilisable au clavier et avec un lecteur d'écran, ni qu'elle atteigne le score d'accessibilité visé.

**Approach:** Auditer et corriger la page : hiérarchie de titres sans saut, `alt` sur chaque image, repères (landmarks), lien d'évitement, navigation complète au clavier avec focus visible, contrastes ; ajouter des contrôles automatiques sur `dist/` et mesurer Lighthouse ≥ 95.

## Boundaries & Constraints

**Always:** Corriger dans les gabarits, composants et styles, jamais dans le Markdown source ; contrôles exécutables par commande ; chaînes (par ex. « Aller au contenu ») via `t()` ; vérification finale de l'absence de défilement horizontal à 375 px (UX-DR5) et de l'absence de cookie, analytics ou ressource tierce (NFR8).

**Ask First:** Ajouter une dépendance de test d'accessibilité (par exemple `axe-core`) ; exécuter Lighthouse via `npx` (outil non ajouté aux dépendances) ; modifier la hiérarchie de titres imposée par le Markdown (c'est la source de vérité).

**Never:** Masquer un défaut par `aria-hidden` ou `role` superflu ; supprimer le focus visible ; corriger le contenu éditorial ; supprimer des éléments pour améliorer un score.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Titres | Toutes les pages de `dist/` | Un seul `h1`, aucun saut de niveau | Test en échec nommant la page et le titre |
| Images | `figure > img` | `alt` non vide sur chaque image | Test en échec nommant l'image |
| Repères | Page | `header`/`nav`/`main`/`footer` selon besoin ; un seul `main` ; lien d'évitement | N/A |
| Clavier | Tab depuis le haut | Ordre logique : évitement, langue, partage, citer, table, contenu ; focus visible partout | N/A |
| Contraste | Thèmes clair et sombre | Ratio ≥ 4,5:1 (texte normal) | Correction CSS |
| Lecteur d'écran | Confirmations de copie, état actif de la table | Annoncés via `aria-live` / `aria-current` | N/A |
| Lighthouse | Page `/fr/` construite | Accessibilité ≥ 95 | Corriger puis remesurer |
| Ressources tierces | Tout `dist/` | Aucun script/ressource externe, aucun cookie | Test en échec nommant l'URL |

</frozen-after-approval>

## Code Map

- `src/layouts/Base.astro` -- landmarks, lien d'évitement, `lang`.
- `src/components/*` -- noms accessibles des boutons, `aria-live`, `aria-current`, `aria-label` des points mobiles.
- `src/styles/article.css` -- `:focus-visible`, contrastes, tailles de cibles tactiles.
- `src/a11y.test.ts` -- à créer : lit tout `dist/**/*.html` (titres, `alt`, `main` unique, ressources externes).
- `package.json` -- script `test:a11y` (`npm run build && node --test src/a11y.test.ts`).
- `README.md` -- procédure Lighthouse et vérification clavier / 375 px.

## Tasks & Acceptance

**Execution:**
- [ ] `src/a11y.test.ts` -- contrôles automatiques : hiérarchie de titres, `alt`, `main` unique, ressources externes -- FR7, NFR8
- [ ] Lien d'évitement, landmarks et focus visible dans le gabarit et les styles -- FR7
- [ ] Revue clavier complète et lecteur d'écran des composants des epics 1 et 2 ; corrections -- FR7
- [ ] Mesure Lighthouse (accessibilité) sur `/fr/` en clair et en sombre ; consigner le score dans le README -- NFR3
- [ ] Vérification finale 375 px sans défilement horizontal -- UX-DR5

**Acceptance Criteria:**
- Given `dist/`, when `npm run test:a11y` s'exécute, then la hiérarchie des titres est sans saut, chaque image a un `alt`, chaque page a un seul `main` et aucune ressource externe n'est référencée.
- Given la page `/fr/`, when on navigue uniquement au clavier, then chaque contrôle et lien est atteignable, dans un ordre logique, avec un focus visible.
- Given un audit Lighthouse sur la page construite, when on lit la catégorie accessibilité, then le score est ≥ 95.
- Given 375 px de large, when on affiche la page, then aucun défilement horizontal de la page n'existe.
- Given deux builds sans changement, when on compare `dist/`, then ils sont identiques.

## Spec Change Log

## Design Notes

Le déploiement GitHub Pages n'est pas une story : l'audit Lighthouse s'exécute sur `dist/` servi en local (`npm run preview`). Si le Markdown impose un saut de niveau (non constaté dans la source actuelle : h1 puis h2 à h5), le signaler à l'auteur au lieu de le masquer.

## Verification

**Commands:**
- `npm test` -- expected: tests verts
- `npm run test:a11y` -- expected: contrôles verts
- `npm run check:idempotence` -- expected: « OK : builds identiques »
