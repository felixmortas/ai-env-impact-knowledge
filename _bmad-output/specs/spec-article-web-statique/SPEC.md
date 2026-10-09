---
id: SPEC-article-web-statique
companions:
  - markdown-constructs.md
sources: []
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# Page web statique de l'article « L'impact environnemental de l'IA générative »

## Why

Opportunité à saisir : l'article de Felix Mortas (5 sections, 66 références) doit atteindre le grand public (utilisateurs de chatbots, PME, collectivités) et des professionnels, en français, anglais et espagnol, sous forme d'une page lisible, partageable et citable depuis un simple lien, avec l'identité de l'auteur, les dates d'édition et une licence visibles. L'article sera corrigé après publication.

## Capabilities

- **CAP-1**
  - **intent:** Un lecteur peut lire l'intégralité de l'article, dans une langue donnée, dans un navigateur, sur mobile comme sur desktop, avec le contenu du Markdown de cette langue.
  - **success:** Toutes les constructions de `markdown-constructs.md` s'affichent ; chaque paragraphe, tableau, image et chiffre du Markdown est présent dans la page ; aucun défilement horizontal de la page à 375 px de large.

- **CAP-2**
  - **intent:** Un lecteur peut suivre chaque appel de citation jusqu'à sa référence complète.
  - **success:** Chaque `[@clé]` du Markdown devient un appel cliquable vers une entrée de la liste de références générée depuis `references.bib` ; une clé absente du .bib fait échouer le build ; zéro clé non résolue dans la page.

- **CAP-3**
  - **intent:** Le lecteur voit en tête d'article qui l'a écrit, quand, et sous quelle licence : prénom nom, email, GitHub, LinkedIn, date de publication, date de dernière modification, licence.
  - **success:** Ces sept valeurs proviennent d'un unique fichier de configuration édité à la main ; modifier une valeur puis rebuild suffit à la changer partout (bloc visible, métadonnées, BibTeX). Les deux dates sont uniques (globales à toutes les langues) et ne changent jamais sans édition manuelle. L'email est un lien `mailto:` sans adresse en clair dans le texte. La licence s'affiche avec son nom et un lien vers son texte. Les dates s'affichent au format de la langue.

- **CAP-4**
  - **intent:** Le lecteur peut partager l'article en un geste.
  - **success:** Sur un navigateur mobile exposant la Web Share API, le bouton ouvre le partage système avec titre et URL canonique de la langue affichée ; ailleurs, il copie l'URL canonique dans le presse-papiers et affiche une confirmation visible.

- **CAP-5**
  - **intent:** Le lecteur peut citer l'article en BibTeX.
  - **success:** Le bouton Citer affiche une entrée BibTeX valide (auteur, titre localisé, année, URL canonique de la langue affichée) construite depuis la config ; le bouton Copier la place dans le presse-papiers ; l'entrée se compile sans erreur avec biblatex.

- **CAP-6**
  - **intent:** Le mainteneur peut régénérer le site après toute correction du Markdown, du .bib ou de la config.
  - **success:** Une seule commande documentée produit le site complet à partir de `src/<lang>/`, `references.bib`, `images/` et de la config ; deux exécutions successives sans changement donnent une sortie identique ; la sortie est déployable telle quelle sur GitHub Pages.

- **CAP-7**
  - **intent:** La page est découvrable et utilisable par tous, y compris au clavier et avec un lecteur d'écran.
  - **success:** Balises `title`, `description`, Open Graph et lien canonique présentes ; chaque image a un `alt` ; hiérarchie de titres sans saut ; un audit Lighthouse accessibilité ≥ 95.

- **CAP-8**
  - **intent:** Un lecteur peut lire la page en français, anglais ou espagnol, et passer de l'une à l'autre.
  - **success:** Chaque langue a sa propre URL (`/fr/`, `/en/`, `/es/`) avec `lang` et `hreflang` corrects ; boutons, libellés, messages et dates sont localisés ; un sélecteur de langue renvoie vers la même section quand elle existe ; la racine mène au français ; le build échoue si une chaîne d'interface manque dans une langue ou si les squelettes (titres hiérarchisés, nombre de figures, de tableaux) divergent entre langues.

- **CAP-9**
  - **intent:** Le lecteur se repère dans l'article grâce à une table des matières épurée qui suit sa progression de lecture.
  - **success:** Pendant le défilement, l'entrée correspondant à la section visible est mise en évidence et une jauge de progression avance ; un clic sur une entrée mène à la section ; au clavier, chaque entrée est atteignable ; sur mobile, la table se replie sous forme de ligne et points pas nommés et subtilement de différentes taille en fonction de la hiérarchie du titre pour ne pas masquer texte ; sans JavaScript, elle reste une liste de liens ancrés.

## Constraints

- Site 100 % statique hébergé sur GitHub Pages ; aucun backend, aucune base de données, aucun service tiers requis à l'exécution.
- Le texte se lit entièrement sans JavaScript ; JS réservé au partage, à la copie et au suivi de progression de la table des matières.
- Le Markdown est la source de vérité : aucune correction de contenu faite dans le HTML généré.
- Le contenu n'est ni reformulé ni traduit par le build : chaque langue vient de ses propres fichiers Markdown.
- Les dates de publication et de dernière modification sont saisies manuellement, jamais déduites de git ni de l'horloge.
- L'outil de build s'installe en une étape documentée ou est conteneurisé.
- Les constructions de `markdown-constructs.md` doivent toutes avoir un rendu explicite.
- Les trois langues ont la même structure : mêmes titres hiérarchisés, mêmes figures et tableaux ; le build le vérifie.
- Ajouter une langue ne demande aucun changement de code : uniquement ses Markdown, ses chaînes d'interface et ses valeurs d'édition localisées.
- Aucune chaîne d'interface n'est écrite en dur dans les gabarits.
- Les images sont au format web (PNG, SVG ou WebP).
- Licence : CC BY-NC 4.0, qui interdit tout usage commercial même en vous citant

## Non-goals

- Pas de commentaires, d'analytics ni de cookies.
- Pas de traduction automatique.
- Pas de CMS ni d'édition en ligne.
- Pas de génération PDF.
- Pas de support LaTeX : les anciens .tex sont hors build.
- Pas de boutons de partage par réseau social.
- Pas de site multi-pages : une page par langue.

## Success signal

Une personne sans connaissance technique ouvre `https://felixmortas.com/ai-env-impact-knowledge` sur son téléphone, lit l'article complet dans sa langue en s'aidant de la table des matières, partage le lien via le partage système et copie une entrée BibTeX valide ; Felix corrige une phrase dans un Markdown, lance la commande de build, pousse, et la correction apparaît en ligne sans toucher au HTML.

## Assumptions

- Une page longue par langue.
- URL de base `https://felixmortas.com/`, valeur de config ; URLs de langue sous cette base.
- Source : un fichier `.md` par section dans `src/<lang>/`, préfixé d'un numéro d'ordre ; titre de l'article en front matter ; `references.bib` et `images/` partagés, sauf image à texte localisé placée dans `src/<lang>/images/`.
- Citations au format `[@clé]` (convention pandoc).
- Indices et exposants (CO₂e, m³) en Unicode ou en syntaxe Markdown.
- L'entrée BibTeX est de type `@misc` (auteur, titre, année, URL, note d'accès) générée depuis la config.
- Prénom, nom, email, URL GitHub et URL LinkedIn sont saisis par Felix dans la config ; le build échoue tant qu'une valeur reste un placeholder, date de publication comprise.
- Mise en page sobre, thème clair/sombre automatique.