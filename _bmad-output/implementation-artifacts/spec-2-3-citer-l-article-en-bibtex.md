---
title: 'Story 2.3 : Citer l''article en BibTeX'
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

**Problem:** Un lecteur qui veut citer l'article doit composer lui-même la référence.

**Approach:** Générer à la construction une entrée BibTeX `@misc` depuis la configuration et le titre de la langue, l'afficher dans un bloc « Citer » repliable (`<details>`) et ajouter un bouton Copier (îlot React) avec confirmation visible.

## Boundaries & Constraints

**Always:** Entrée construite uniquement depuis la configuration (2.1), le titre de l'article et l'URL canonique de la langue (2.2) ; année tirée de `publishedDate` ; note d'accès fondée sur `modifiedDate`, jamais sur l'horloge ; caractères spéciaux BibTeX échappés ; texte de l'entrée lisible sans JavaScript (seule la copie demande JS) ; libellés via `t()`.

**Ask First:** Ajouter une dépendance de validation BibTeX ; imposer une clé de citation autre que `<nom><année><mot>` sans accent.

**Never:** Dates ou année calculées à l'exécution ; adresse email dans l'entrée ; entrée construite à la main dans le HTML.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Nominal | Config + titre fr | `@misc{mortas2026…, author = {Mortas, Felix}, title = {…}, year = {2026}, url = {…/fr/}, note = {…}}` | N/A |
| Caractères spéciaux | Titre avec `&`, `%`, `_`, `#`, accents | Échappés (`\&`, `\%`, `\_`, `\#`) ou protégés par `{}` ; accents conservés | N/A |
| Copier | Clic sur Copier | Entrée complète dans le presse-papiers ; « Entrée copiée » visible | Échec : message visible |
| Sans JavaScript | JS désactivé | Entrée consultable via `<details>`, sans bouton Copier | N/A |
| Changement de config | Nom modifié puis rebuild | Entrée mise à jour | N/A |
| Compilation | Entrée collée dans un `.bib` | Se compile sans erreur avec biblatex | N/A |

</frozen-after-approval>

## Code Map

- `src/lib/bibtex.ts`, `src/lib/bibtex.test.ts` -- à créer : `buildCitation(config, title, lang)`, échappement, clé.
- `src/components/CiteBlock.astro` -- à créer : `<details>` + `<pre>` + îlot de copie.
- `src/components/CopyButton.tsx` -- à créer : bouton Copier réutilisant `CopyFeedback` (2.2).
- `src/lib/urls.ts`, `src/lib/config.ts` -- utilisés (créés en 2.1 et 2.2).
- `src/locales/fr.json` -- `cite.label`, `cite.copy`, `cite.copied`, `cite.accessNote`.

## Tasks & Acceptance

**Execution:**
- [x] `src/lib/bibtex.ts` -- entrée `@misc` valide, échappement, clé stable -- FR5
- [x] `src/components/CiteBlock.astro`, `src/components/CopyButton.tsx` -- affichage et copie avec confirmation -- FR5, UX-DR3
- [x] `src/locales/fr.json` -- libellés et modèle de note d'accès -- FR5
- [x] Tests de structure : champs obligatoires, accolades équilibrées, échappements ; si LaTeX est disponible, compilation biblatex en vérification manuelle -- FR5
- [x] `README.md` -- expliquer d'où viennent les champs de la citation

**Acceptance Criteria:**
- Given `dist/fr/index.html`, when on lit le bloc Citer, then il contient une entrée `@misc` avec auteur, titre localisé, année, URL canonique de `/fr/` et note d'accès.
- Given le bouton Copier, when on l'active, then le texte exact de l'entrée est dans le presse-papiers et une confirmation visible apparaît.
- Given l'entrée collée dans un fichier `.bib` d'un document biblatex, when on compile, then aucune erreur n'est produite.
- Given une modification du nom dans `config.json`, when on rebuild, then l'entrée reflète le changement.
- Given deux builds sans changement, when on compare `dist/`, then ils sont identiques.

## Spec Change Log

## Design Notes

`<details>` donne gratuitement l'affichage sans JavaScript ; seul Copier nécessite un îlot. Note d'accès en pur gabarit localisé, par exemple « Consulté en ligne ; dernière modification : {date} », pour rester déterministe. Le titre localisé viendra des `main.md` de chaque langue (2.6).

## Verification

**Commands:**
- `npm test` -- expected: tests verts
- `npm run check:idempotence` -- expected: « OK : builds identiques »

## Suggested Review Order

**Génération de l'entrée**

- Point d'entrée : construction `@misc` depuis config, titre et URL canonique.
  [`bibtex.ts:44`](../../src/lib/bibtex.ts#L44)

- Échappement LaTeX et clé de citation sans accent.
  [`bibtex.ts:17`](../../src/lib/bibtex.ts#L17)

**Affichage et copie**

- `<details>` lisible sans JS, entrée dans un `<pre>`.
  [`CiteBlock.astro:11`](../../src/components/CiteBlock.astro#L11)

- Îlot Copier avec confirmation ou message d'échec.
  [`CopyButton.tsx:12`](../../src/components/CopyButton.tsx#L12)

- Intégration dans le bloc auteur.
  [`AuthorBlock.astro:30`](../../src/components/AuthorBlock.astro#L30)

**Tests et documentation**

- Champs, échappements, clé, déterminisme, date invalide.
  [`bibtex.test.ts:1`](../../src/lib/bibtex.test.ts#L1)

- Rendu : entrée dans le HTML et texte copié identique.
  [`rendu.test.ts:227`](../../src/rendu.test.ts#L227)

- Origine des champs de la citation.
  [`README.md:72`](../../README.md#L72)
