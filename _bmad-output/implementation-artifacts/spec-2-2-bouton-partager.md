---
title: 'Story 2.2 : Bouton Partager'
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

**Problem:** Le lecteur ne peut pas partager l'article en un geste.

**Approach:** Ajouter un îlot React `ShareButton` qui appelle la Web Share API avec le titre et l'URL canonique de la langue affichée ; à défaut, il copie cette URL dans le presse-papiers et affiche une confirmation visible et annoncée aux lecteurs d'écran.

## Boundaries & Constraints

**Always:** React uniquement en îlot ; l'article reste intégralement lisible sans JavaScript (le bouton n'apparaît que si JS actif) ; URL canonique construite depuis `siteUrl` + langue, jamais depuis `location` ; libellés et messages via `t()` ; confirmation dans une région `aria-live="polite"`.

**Ask First:** Ajouter une dépendance (bibliothèque de toasts, d'icônes) ; changer l'emplacement du bouton défini avec le bloc auteur.

**Never:** Boutons de partage par réseau social ; analytics ou suivi des partages ; appel réseau ; échec silencieux de la copie.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Web Share disponible | `navigator.share` défini | Ouvre le partage système avec `{ title, url }` canoniques | N/A |
| Partage annulé | Utilisateur ferme la feuille (`AbortError`) | Aucun message d'erreur | Ignorer `AbortError` |
| Web Share absent | `navigator.share` indéfini | Copie l'URL canonique ; « Lien copié » visible ~3 s | N/A |
| Copie refusée | `clipboard.writeText` rejette | Message d'échec visible, URL sélectionnable en repli | Message via `t()` |
| Sans JavaScript | JS désactivé | Aucun bouton cassé ; article intact | N/A |
| Clavier | Tab + Entrée/Espace | Bouton atteignable, focus visible, activable | N/A |

</frozen-after-approval>

## Code Map

- `src/lib/urls.ts`, `src/lib/urls.test.ts` -- à créer : `canonicalUrl(lang)` = `siteUrl` + `/<lang>/` (réutilisé par 2.3, 2.7, 3.1).
- `src/components/ShareButton.tsx` -- à créer : îlot React.
- `src/components/CopyFeedback.tsx` -- à créer : état « copié » + région `aria-live`, partagé avec 2.3.
- `src/components/AuthorBlock.astro` ou zone d'actions du gabarit -- hébergement du bouton (`client:load`).
- `src/locales/fr.json` -- `share.label`, `share.copied`, `share.failed`.
- `src/styles/article.css` -- style du bouton et de la confirmation.

## Tasks & Acceptance

**Execution:**
- [ ] `src/lib/urls.ts` -- URL canonique par langue, avec test -- FR4
- [ ] `src/components/CopyFeedback.tsx` -- confirmation visible et annoncée -- UX-DR3
- [ ] `src/components/ShareButton.tsx` -- Web Share API puis repli presse-papiers ; gérer `AbortError` et refus -- FR4
- [ ] Intégration au gabarit avec hydratation minimale ; chaînes dans `fr.json` -- FR4
- [ ] Tests unitaires de la logique (fonction pure `share(deps)` avec doubles de `navigator`) -- FR4
- [ ] `README.md` -- noter que JS n'est utilisé que pour partager

**Acceptance Criteria:**
- Given un navigateur avec Web Share, when on active le bouton, then `navigator.share` reçoit le titre de l'article et l'URL canonique de `/fr/`.
- Given un navigateur sans Web Share, when on active le bouton, then l'URL canonique est copiée et « Lien copié » s'affiche visiblement et dans la région `aria-live`.
- Given JavaScript désactivé, when on ouvre la page, then tout le texte est lisible et aucun contrôle inopérant n'est affiché.
- Given la navigation au clavier, when on tabule, then le bouton est atteignable avec un focus visible.
- Given deux builds sans changement, when on compare `dist/`, then ils sont identiques.

## Spec Change Log

## Design Notes

Isoler la logique dans une fonction pure injectant `navigator` pour la tester avec `node:test` sans navigateur. L'URL canonique ne change pas selon l'URL courante (aperçu local, pull request) : c'est voulu.

## Verification

**Commands:**
- `npm test` -- expected: tests verts
- `npm run check:idempotence` -- expected: « OK : builds identiques »
