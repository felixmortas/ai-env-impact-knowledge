---
title: 'Story 1.1 : Socle de build et commande unique'
type: 'feature'
created: '2026-10-09'
status: 'done'
baseline_commit: '1ef761da5af43957de6e116b35c3627aa7b1f3e1'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Le dépôt ne contient que du Markdown et du BibTeX ; aucun outil ne produit un site. Sans socle, les stories 1.2 à 1.7 ne peuvent pas être construites.

**Approach:** Initialiser un projet Astro (React uniquement en îlots, non utilisé ici), configurer `site`/`base` pour GitHub Pages, ajouter un fichier de localisation lu par les gabarits, une page `/fr/` minimale et une redirection racine, et documenter l'installation et la commande de build dans le README.

## Boundaries & Constraints

**Always:** Sortie 100 % statique (`output: 'static'`) ; versions de dépendances épinglées (lockfile commité) ; aucune chaîne d'interface en dur dans les gabarits ; build reproductible (aucun horodatage ni valeur aléatoire dans la sortie) ; textes et README en français.

**Ask First:** Remplacer Astro par un autre outil ; ajouter une dépendance autre que Astro, `@astrojs/react`/React et leurs pairs requis.

**Never:** Rendre le contenu de `src/fr/` (stories 1.2+) ; modifier `src/`, `images/`, `data/` ; implémenter les plugins Pandoc (`[@clé]`, `{width=80%}`, `Table:`) ; ajouter analytics, cookies ou service tiers ; traiter l'anglais ou l'espagnol.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Build nominal | `npm ci && npm run build` | `dist/` statique, `dist/fr/index.html` et redirection racine | N/A |
| Idempotence | Deux builds sans changement | Sorties `dist/` identiques octet par octet | N/A |
| Chaîne manquante | Clé d'UI utilisée absente de `locales/fr.json` | Build en échec avec la clé nommée | Message d'erreur explicite |

</frozen-after-approval>

## Code Map

- `src/fr/main.md`, `src/fr/sections/*.md`, `src/references.bib`, `images/` -- contenu existant, lu en lecture seule par les stories suivantes
- `package.json`, `package-lock.json` -- scripts `build`, `dev` ; Astro épinglé ; Node 22 (v22.19.0 local)
- `astro.config.mjs` -- `site: 'https://felixmortas.com'`, `base: '/ai-env-impact-knowledge'`, `output: 'static'`, intégration React
- `src/locales/fr.json` -- chaînes d'interface (titre de page, libellés) ; `src/i18n.ts` -- accès typé, lève une erreur si clé absente
- `src/pages/index.astro` -- redirection racine vers `/fr/`
- `src/pages/fr/index.astro` -- page minimale utilisant uniquement des chaînes localisées
- `README.md` -- installation, `npm run build`, aperçu, déploiement GitHub Pages
- `.gitignore` -- ajouter `node_modules/`, `dist/`, `.astro/`

## Tasks & Acceptance

**Execution:**
- [x] `package.json`, `astro.config.mjs`, `tsconfig.json` -- initialiser Astro + React (îlots), épingler les versions, `site`/`base` -- socle statique
- [x] `src/locales/fr.json`, `src/i18n.ts` -- fichier de localisation et accesseur qui échoue sur clé manquante -- aucune chaîne en dur
- [x] `src/pages/index.astro`, `src/pages/fr/index.astro` -- redirection racine et page `/fr/` minimale -- prouver la chaîne de build
- [x] `src/i18n.ts` -- test unitaire (clé présente / manquante) -- couvre la ligne « Chaîne manquante » de la matrice
- [x] `README.md`, `.gitignore` -- documenter installation, build, justification du choix Astro et plan Pandoc (plugins remark maison aux stories 1.2–1.6) -- NFR6
- [x] `package.json` -- optionnel : script de vérif d'idempotence (deux builds + comparaison) -- NFR5

**Acceptance Criteria:**
- Given un clone propre, when `npm ci && npm run build`, then `dist/` est produit sans backend ni script serveur.
- Given aucune modification des sources, when le build est lancé deux fois, then les deux `dist/` sont identiques.
- Given le build, when on inspecte les liens, then ils respectent la base `/ai-env-impact-knowledge` et la racine mène à `/fr/`.
- Given une clé absente de `fr.json`, when le build s'exécute, then il échoue en nommant la clé.
- Given le README, when on le lit, then installation, commande de build et choix d'Astro (React en îlots, syntaxe Pandoc par code maison) y figurent.

## Spec Change Log

## Design Notes

Le choix d'Astro tient à la sortie HTML statique par défaut (lisible sans JavaScript), au pipeline Markdown remark/rehype extensible pour la syntaxe Pandoc, et aux îlots React réservés aux interactions des epics 2 et 3. Le comparatif d'idempotence : `npm run build && cp -r dist /tmp/a && npm run build && diff -r dist /tmp/a`.

## Verification

**Commands:**
- `npm ci && npm run build` -- expected: succès, `dist/fr/index.html` existe
- `npm test` -- expected: tests de `src/i18n.ts` verts
- `diff -r` entre deux builds -- expected: aucune différence

## Suggested Review Order

**Configuration du build**

- Point d'entrée : site, base GitHub Pages et sortie statique.
  [`astro.config.mjs:6`](../../astro.config.mjs#L6)

- Scripts `build`, `test` et vérification d'idempotence ; versions épinglées.
  [`package.json:5`](../../package.json#L5)

**Chaînes d'interface**

- Accesseur qui échoue en nommant la clé manquante.
  [`i18n.ts:6`](../../src/i18n.ts#L6)

- Chaînes françaises, lues par les gabarits.
  [`fr.json:1`](../../src/locales/fr.json#L1)

**Pages**

- Page `/fr/` minimale, uniquement des chaînes localisées.
  [`index.astro:1`](../../src/pages/fr/index.astro#L1)

- Redirection racine vers `/fr/` en tenant compte de la base.
  [`index.astro:2`](../../src/pages/index.astro#L2)

**Vérification et documentation**

- Deux builds, contrôle de la sortie, comparaison octet par octet.
  [`check-idempotence.sh:1`](../../scripts/check-idempotence.sh#L1)

- Tests de la clé présente et absente.
  [`i18n.test.ts:5`](../../src/i18n.test.ts#L5)

- Installation, commande de build, choix d'Astro.
  [`README.md:1`](../../README.md#L1)
