---
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - _bmad-output/specs/spec-article-web-statique/SPEC.md
  - _bmad-output/specs/spec-article-web-statique/markdown-constructs.md
---

# ai-env-impact-knowledge - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for ai-env-impact-knowledge, decomposing the requirements from the SPEC (contrat canonique tenant lieu de PRD et d'Architecture) into implementable stories. Aucun document UX séparé : les exigences UX sont tirées du SPEC.

## Requirements Inventory

### Functional Requirements

FR1 (CAP-1): Un lecteur peut lire l'intégralité de l'article, dans une langue donnée, dans un navigateur mobile ou desktop, avec le contenu du Markdown de cette langue ; chaque paragraphe, tableau, image et chiffre est présent ; aucun défilement horizontal de la page à 375 px.
FR2 (CAP-2): Chaque `[@clé]` du Markdown devient un appel numéroté cliquable vers une entrée de la liste de références générée depuis `references.bib` ; une clé absente du .bib fait échouer le build ; zéro clé non résolue dans la page.
FR3 (CAP-3): Un bloc en tête d'article affiche prénom nom, email (lien `mailto:` sans adresse en clair), GitHub, LinkedIn, date de publication, date de dernière modification et licence (nom + lien vers son texte), toutes issues d'un unique fichier de configuration édité à la main ; les dates sont globales à toutes les langues, jamais déduites de git ni de l'horloge, et affichées au format de la langue ; modifier une valeur puis rebuild la change partout (bloc visible, métadonnées, BibTeX).
FR4 (CAP-4): Un bouton de partage ouvre le partage système (Web Share API) avec titre et URL canonique de la langue affichée ; sinon il copie l'URL canonique dans le presse-papiers et affiche une confirmation visible.
FR5 (CAP-5): Un bouton Citer affiche une entrée BibTeX `@misc` valide (auteur, titre localisé, année, URL canonique de la langue, note d'accès) construite depuis la config ; un bouton Copier la place dans le presse-papiers ; l'entrée se compile sans erreur avec biblatex.
FR6 (CAP-6): Une seule commande documentée produit le site complet à partir de `src/<lang>/`, `src/references.bib`, `images/` et de la config ; deux exécutions sans changement donnent une sortie identique ; la sortie est déployable telle quelle sur GitHub Pages.
FR7 (CAP-7): Balises `title`, `description`, Open Graph et lien canonique présentes ; chaque image a un `alt` ; hiérarchie de titres sans saut ; utilisable au clavier et avec un lecteur d'écran.
FR8 (CAP-8): Chaque langue (fr, en, es) a sa propre URL (`/fr/`, `/en/`, `/es/`) avec `lang` et `hreflang` corrects ; boutons, libellés, messages et dates localisés ; un sélecteur de langue renvoie vers la même section quand elle existe ; la racine mène au français ; le build échoue si une chaîne d'interface manque dans une langue. Les traductions EN et ES seront fournies plus tard ; aucune vérification de structure entre langues (le Markdown livré fait foi).
FR9 (CAP-9): Une table des matières épurée met en évidence la section visible pendant le défilement et affiche une jauge de progression ; un clic mène à la section ; chaque entrée est atteignable au clavier ; sur mobile elle se replie en ligne de points non nommés, de tailles différentes selon le niveau de titre, sans masquer le texte ; sans JavaScript, elle reste une liste de liens ancrés.
FR10: Le titre de l'article (`# Titre` de `main.md`, titre en front matter) est rendu comme `h1` unique de la page.
FR11: Les titres `#` des 5 fichiers de section sont rendus en `h2` ; les `##`, `###`, `####` en `h3` à `h5` (décalage d'un niveau), avec ancres stables, et alimentent la table des matières.
FR12: Les « titres de paragraphe » (ligne débutant par `**Texte**` ou `**Texte :**`) sont rendus en gras, ni titre ni entrée de table des matières.
FR13: Gras (`**…**`) et italique (`*…*`) sont rendus en `strong` et `em`.
FR14: Les liens externes (`[texte](url)` et autoliens `<url>`) sont rendus en liens ; les URL longues ne débordent pas horizontalement.
FR15: Les inclusions de section de `main.md` (`[sections/x](sections/x.md)`) sont remplacées, dans l'ordre, par le contenu du fichier ; le lien n'apparaît pas dans la page.
FR16: Les listes à puces et numérotées sont rendues en `ul` / `ol`.
FR17: Les tableaux pipe avec ligne `Table: légende {#tab:id}` sont rendus en `table` + `caption` (sans l'identifiant) puis ligne `Source : …` ; défilement horizontal local sur mobile.
FR18: Les images `![légende](chemin){width=80%}` sont rendues en `figure`/`figcaption`, la légende servant d'`alt` (build en échec si vide) ; largeur relative au conteneur selon l'attribut `width`.
FR19: Les caractères Unicode (CO₂e, m³) et spéciaux (`~`, `_`, `>`, `--` dans les cellules de tableau) sont affichés tels quels, sans conversion.
FR20: Les commentaires HTML (`<!-- -->`) n'apparaissent jamais dans la page.

### NonFunctional Requirements

NFR1: Site 100 % statique hébergé sur GitHub Pages ; aucun backend, base de données ou service tiers requis à l'exécution.
NFR2: Le texte se lit entièrement sans JavaScript ; JS réservé au partage, à la copie et au suivi de progression de la table des matières.
NFR3: Accessibilité : audit Lighthouse ≥ 95.
NFR4: Aucun défilement horizontal de la page à 375 px de large.
NFR5: Build déterministe et idempotent (deux exécutions sans changement → sortie identique).
NFR6: L'outil de build s'installe en une étape documentée ou est conteneurisé.
NFR7: Mise en page sobre, thème clair/sombre automatique.
NFR8: Pas de commentaires, d'analytics ni de cookies.
NFR9: Images au format web (PNG, SVG ou WebP).

### Additional Requirements

- Le Markdown est la source de vérité : aucune correction de contenu dans le HTML généré ; le build ne reformule ni ne traduit (pas de traduction automatique).
- Syntaxe source Pandoc ; citations `[@clé]` ; entrées au format `references.bib` (66 entrées, 65 clés distinctes dans l'article actuel).
- Structure source : un `.md` par section dans `src/<lang>/` préfixé d'un numéro d'ordre ; titre de l'article en front matter ; `src/references.bib` et un unique dossier `images/` partagés par toutes les langues.
- Migration : le contenu actuel (`main.md` + `sections/*.md`) est déjà dans `src/fr/` (`references.bib` dans `src/`) ; `main.md` inclut les sections par `[sections/x](sections/x.md)` et porte le titre `#` ; le build décale les titres des sections d'un niveau. À reconcilier avec la convention « fichier numéroté par section ».
- Configuration unique éditée à la main : prénom, nom, email, URL GitHub, URL LinkedIn, date de publication, date de dernière modification (+ licence, URL de base `https://felixmortas.com/`) ; le build échoue tant qu'une valeur reste un placeholder.
- Licence CC BY-NC 4.0 (usage commercial interdit même en citant l'auteur).
- Échecs de build obligatoires : clé de citation absente du .bib ; image sans légende ; chaîne d'interface manquante dans une langue ; placeholder de config.
- Aucune chaîne d'interface en dur dans les gabarits ; ajouter une langue = uniquement ses Markdown, ses chaînes d'interface et ses valeurs d'édition localisées, sans changement de code.
- Aucun template de démarrage imposé. Astro est autorisé comme outil de build, avec React uniquement en îlots pour le partage, la copie et la table des matières (le texte reste du HTML statique, lisible sans JavaScript). La Story 1.1 confirme le choix et devra gérer la syntaxe Pandoc (`[@clé]`, `{width=80%}`, `Table:`) par des plugins ou du code maison.
- Hors périmètre : LaTeX (anciens .tex hors build), PDF, CMS, boutons de partage par réseau social, site multi-pages (une page par langue).
- Déploiement GitHub Pages sous `https://felixmortas.com/ai-env-impact-knowledge`.

### UX Design Requirements

UX-DR1: Table des matières épurée avec entrée active mise en évidence et jauge de progression pendant le défilement.
UX-DR2: Table des matières repliée sur mobile en ligne de points non nommés, de tailles variant selon la hiérarchie des titres, sans masquer le texte.
UX-DR3: Confirmation visible de la copie (URL ou BibTeX) dans le presse-papiers.
UX-DR4: Sélecteur de langue conservant la section courante quand elle existe dans l'autre langue.
UX-DR5: Tableaux à défilement horizontal local sur mobile ; images en `figure` à largeur relative ; mise en page sobre avec thème clair/sombre automatique.

### FR Coverage Map

FR1: Epic 1 - Lecture intégrale de l'article
FR2: Epic 1 - Citations cliquables et références
FR3: Epic 2 - Bloc auteur, dates, licence depuis la config
FR4: Epic 2 - Bouton Partager
FR5: Epic 2 - Citer en BibTeX
FR6: Epic 1 - Build en une commande, reproductible
FR7: Epic 3 - SEO, métadonnées, accessibilité
FR8: Epic 2 - Trilinguisme et sélecteur de langue
FR9: Epic 2 - Table des matières avec progression
FR10: Epic 1 - Titre h1
FR11: Epic 1 - Titres h2 à h5 et ancres
FR12: Epic 1 - Titres de paragraphe en gras
FR13: Epic 1 - Gras et italique
FR14: Epic 1 - Liens externes
FR15: Epic 1 - Inclusion de sections
FR16: Epic 1 - Listes
FR17: Epic 1 - Tableaux
FR18: Epic 1 - Images et légendes
FR19: Epic 1 - Unicode et caractères spéciaux
FR20: Epic 1 - Exclusion des commentaires HTML

## Epic List

### Epic 1: Lire l'article complet en français sur une page statique

Le lecteur ouvre `/fr/` et lit tout l'article, constructions Markdown rendues et citations cliquables ; le mainteneur régénère le site en une commande. Les chaînes d'interface passent par un fichier de localisation dès cet epic. Les critères d'acceptation détaillés de ces stories seront rédigés à l'implémentation avec bmad-build.

**Couverture :** FR1, FR2, FR6, FR10, FR11, FR12, FR13, FR14, FR15, FR16, FR17, FR18, FR19, FR20 ; NFR1, NFR2, NFR4, NFR5, NFR6, NFR7, NFR9 ; UX-DR5.

### Story 1.1: Socle de build et commande unique

As a mainteneur,
I want générer le site complet avec une seule commande documentée,
So that je republie l'article après chaque correction sans toucher au HTML.

- Choix de l'outil de build confirmé (Astro, React uniquement en îlots) et justifié, avec la gestion de la syntaxe Pandoc (`[@clé]`, `{width=80%}`, `Table:`) par plugins ou code maison.
- Installation en une étape documentée ou conteneurisée ; la commande de build est documentée dans le README.
- Sortie 100 % statique, sans backend ni service tiers, déployable telle quelle sur GitHub Pages sous `https://felixmortas.com/ai-env-impact-knowledge`.
- Deux exécutions sans changement de source donnent une sortie identique.
- Chaînes d'interface lues dans un fichier de localisation, jamais en dur dans les gabarits.
- Couvre FR6, NFR1, NFR5 et NFR6.

### Story 1.2: Page française : titre, sections incluses et titres

As a lecteur,
I want une page `/fr/` qui assemble l'article dans l'ordre avec une structure de titres claire,
So that je puisse le lire de la première à la dernière ligne et m'y repérer.

- Le contenu de `src/fr/` (`main.md` + `sections/*.md`) est lu tel quel ; la racine du site mène à `/fr/`.
- Le titre de `main.md` est rendu en `h1` unique.
- Chaque lien `[sections/x](sections/x.md)` est remplacé, dans l'ordre, par le contenu du fichier ; le lien n'apparaît pas dans la page.
- Les titres `#` des 5 sections deviennent des `h2` ; les `##` à `####` deviennent des `h3` à `h5`, avec ancres stables.
- Les commentaires HTML (`<!-- -->`) n'apparaissent jamais dans la page.
- Couvre FR10, FR11, FR15 et FR20.

### Story 1.3: Texte courant, listes, liens et caractères

As a lecteur,
I want que le texte courant soit rendu fidèlement,
So that je lise l'article tel que l'auteur l'a écrit.

- Gras et italique rendus en `strong` et `em`.
- Les « titres de paragraphe » (`**Texte**`, `**Texte :**`, seuls ou suivis de texte) sont rendus en gras, sans devenir titre ni entrée de table des matières.
- Listes à puces et numérotées rendues en `ul` / `ol`.
- Liens `[texte](url)` et autoliens `<url>` rendus en liens ; les URL longues ne débordent pas horizontalement.
- Unicode (CO₂e, m³) et caractères spéciaux (`~`, `_`, `>`) affichés tels quels.
- Couvre FR12, FR13, FR14, FR16 et FR19.

### Story 1.4: Tableaux

As a lecteur,
I want lire les tableaux avec leur légende et leur source, même sur mobile,
So that je consulte les chiffres sans casser la mise en page.

- Tableau pipe rendu en `table` ; la ligne `Table: légende {#tab:id}` devient un `caption` sans l'identifiant.
- Paragraphe `Source : …` affiché sous le tableau.
- `--` dans les cellules affiché tel quel, sans conversion en tiret long.
- Défilement horizontal local au tableau sur mobile, sans défilement horizontal de la page.
- Couvre FR17, FR19 et UX-DR5.

### Story 1.5: Images et légendes

As a lecteur,
I want voir les images avec leur légende,
So that je comprenne les exemples de messages et leurs résultats.

- `![légende](chemin){width=80%}` rendu en `figure` / `figcaption` ; la légende sert aussi d'`alt`.
- Le build échoue si une légende est vide.
- Largeur relative au conteneur selon l'attribut `width` ; les 8 images du dossier `images/` partagé sont affichées.
- Images au format web (PNG, SVG ou WebP).
- Couvre FR18, NFR9 et UX-DR5.

### Story 1.6: Citations cliquables et liste de références

As a lecteur,
I want suivre chaque citation jusqu'à sa référence complète,
So that je vérifie les sources des chiffres avancés.

- Chaque `[@clé]` devient un appel numéroté cliquable vers une entrée de la liste de références générée depuis `src/references.bib`.
- Le build échoue si une clé est absente du .bib ; zéro clé non résolue dans la page.
- Les entrées du .bib (66) sont lues et affichées dans la liste de références.
- Lien de retour de la référence vers l'appel.
- Couvre FR2.

### Story 1.7: Lecture intégrale et mise en page sobre

As a lecteur sur mobile ou desktop,
I want lire tout l'article dans une mise en page sobre et confortable,
So that rien ne manque et rien ne déborde.

- Chaque paragraphe, tableau, image et chiffre du Markdown est présent dans la page.
- Aucun défilement horizontal de la page à 375 px de large.
- Mise en page sobre, thème clair/sombre automatique.
- La page se lit entièrement sans JavaScript.
- Couvre FR1, NFR2, NFR4, NFR7 et UX-DR5.

### Epic 2: Intégration du texte sur un vrai site web

Le texte devient un vrai site : identité de l'auteur, dates et licence visibles, partage et citation BibTeX, table des matières qui suit la lecture, et lecture en français, anglais et espagnol avec sélecteur de langue. Les critères d'acceptation détaillés de ces stories seront rédigés à l'implémentation avec bmad-build. Les traductions EN et ES seront fournies plus tard.

**Couverture :** FR3, FR4, FR5, FR8, FR9 ; NFR2 (JavaScript limité au partage, à la copie et au suivi de la table des matières) ; UX-DR1, UX-DR2, UX-DR3, UX-DR4.

### Story 2.1: Configuration unique et bloc auteur

As a lecteur,
I want voir en tête d'article qui l'a écrit, quand et sous quelle licence,
So that je puisse juger de la source et la contacter.

- Fichier de config unique : prénom, nom, email, GitHub, LinkedIn, date de publication, date de dernière modification, licence, URL de base.
- Bloc en tête d'article : email en lien `mailto:` sans adresse en clair, licence CC BY-NC 4.0 avec son nom et un lien vers son texte, dates au format de la langue.
- Les deux dates sont globales à toutes les langues et saisies à la main, jamais déduites de git ni de l'horloge.
- Le build échoue tant qu'une valeur reste un placeholder.
- Couvre FR3.

### Story 2.2: Bouton Partager

As a lecteur,
I want partager l'article en un geste,
So that je puisse le faire connaître facilement.

- Web Share API avec titre et URL canonique de la langue affichée.
- À défaut, copie de l'URL canonique dans le presse-papiers avec confirmation visible.
- La lecture reste complète sans JavaScript.
- Couvre FR4 et UX-DR3.

### Story 2.3: Citer l'article en BibTeX

As a lecteur,
I want copier une entrée BibTeX valide,
So that je puisse citer l'article dans mes travaux.

- Bouton Citer qui affiche une entrée `@misc` (auteur, titre, année, URL canonique, note d'accès) générée depuis la config.
- Bouton Copier avec confirmation visible.
- L'entrée se compile sans erreur avec biblatex.
- Couvre FR5 et UX-DR3.

### Story 2.4: Table des matières sans JavaScript

As a lecteur,
I want une table des matières de liens ancrés,
So that je puisse aller directement à une section, même sans JavaScript.

- Liste de liens issue des titres `h2` à `h5`, atteignable au clavier.
- Un clic mène à la section.
- Couvre FR9 (base).

### Story 2.5: Table des matières qui suit la lecture

As a lecteur,
I want que la table des matières me montre où j'en suis,
So that je me repère dans un article long, y compris sur mobile.

- Entrée de la section visible mise en évidence et jauge de progression pendant le défilement.
- Sur mobile, repli en ligne de points non nommés, de tailles variant selon le niveau de titre, sans masquer le texte.
- Sans JavaScript, la table reste une liste de liens ancrés.
- Couvre FR9, UX-DR1 et UX-DR2.

### Story 2.6: Arborescence multilingue

As a lecteur,
I want lire l'article dans ma langue à une URL dédiée,
So that je le lise en français, anglais ou espagnol.

- Pages `/fr/`, `/en/`, `/es/` générées depuis `src/<lang>/`, avec `lang` correct ; la racine mène au français.
- Boutons, libellés, messages et dates localisés par fichier de chaînes ; le build échoue si une chaîne d'interface manque dans une langue.
- Ajouter une langue ne demande aucun changement de code.
- Pas de vérification de structure entre langues : le Markdown livré fait foi.
- Couvre FR8.

### Story 2.7: Sélecteur de langue et `hreflang`

As a lecteur,
I want passer d'une langue à l'autre sans perdre ma place,
So that je retrouve la même section dans une autre langue.

- Sélecteur qui renvoie vers la même section quand elle existe.
- `hreflang` et URL canonique correctes par langue.
- Titre BibTeX et dates localisés.
- Couvre FR8 et UX-DR4.

## Epic 3: Découvrabilité et accessibilité

La page est trouvable et utilisable par tous, y compris au clavier et avec un lecteur d'écran. Le déploiement sur GitHub Pages est géré depuis l'interface de GitHub et n'est pas une story. Les critères d'acceptation détaillés seront rédigés à l'implémentation avec bmad-build.

**Couverture :** FR7 ; NFR3 ; NFR8 (aucun cookie, analytics ni commentaire) ; UX-DR5 (vérification finale).

### Story 3.1: Métadonnées de page

As a visiteur arrivant depuis un moteur de recherche ou un partage,
I want une page correctement décrite,
So that elle soit trouvable et affichée proprement.

- `title`, `description`, Open Graph et lien canonique, par langue, depuis la config et le fichier de localisation.
- Couvre FR7.

### Story 3.2: Accessibilité de la page

As a lecteur au clavier ou avec un lecteur d'écran,
I want une page pleinement utilisable,
So that je lise et navigue sans obstacle.

- Hiérarchie de titres sans saut, `alt` sur chaque image, navigation complète au clavier, focus visible.
- Audit Lighthouse accessibilité ≥ 95.
- Couvre FR7 et NFR3.
