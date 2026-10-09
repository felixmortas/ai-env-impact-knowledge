# Epic 1 Context: Lire l'article complet en français sur une page statique

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Le lecteur ouvre `/fr/` et lit tout l'article (constructions Markdown rendues, citations cliquables) ; le mainteneur régénère le site en une commande sans jamais toucher au HTML. Les chaînes d'interface passent par un fichier de localisation dès cet epic.

## Stories

- Story 1.1: Socle de build et commande unique
- Story 1.2: Page française : titre, sections incluses et titres
- Story 1.3: Texte courant, listes, liens et caractères
- Story 1.4: Tableaux
- Story 1.5: Images et légendes
- Story 1.6: Citations cliquables et liste de références
- Story 1.7: Lecture intégrale et mise en page sobre

## Requirements & Constraints

- Le Markdown est la source de vérité : le build ne corrige, ne reformule ni ne traduit rien.
- Site 100 % statique (GitHub Pages), sans backend ni service tiers ; le texte se lit sans JavaScript.
- Build déterministe et idempotent ; installation en une étape documentée ou conteneurisée.
- Aucun défilement horizontal de page à 375 px ; thème clair/sombre automatique ; images PNG/SVG/WebP.
- Le build doit échouer sur : clé de citation absente du .bib, image sans légende, chaîne d'interface manquante, placeholder de config.
- Aucune chaîne d'interface en dur dans les gabarits.

## Technical Decisions

- Source Pandoc : `[@clé]`, `![légende](chemin){width=80%}`, `Table: légende {#tab:id}`, commentaires HTML à ignorer, Unicode tel quel.
- Astro comme outil de build, React uniquement en îlots (partage, copie, table des matières) ; syntaxe Pandoc gérée par plugins ou code maison.
- Sources : `src/fr/main.md` (titre `#`, inclusions `[sections/x](sections/x.md)`) + `src/fr/sections/*.md` ; `src/references.bib` (66 entrées) et `images/` partagés.
- Titres de section décalés d'un niveau (`#` → `h2`) ; `main.md` fournit l'unique `h1`.
- Déploiement : `https://felixmortas.com/ai-env-impact-knowledge`.

## UX & Interaction Patterns

- Tableaux : défilement horizontal local sur mobile ; images en `figure`/`figcaption` à largeur relative.

## Cross-Story Dependencies

- 1.1 pose le socle (Astro, localisation, README) dont dépendent toutes les autres stories.
- 1.2 (assemblage des sections) précède 1.3 à 1.6 ; 1.7 vérifie l'ensemble.
