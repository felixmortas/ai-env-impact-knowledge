# Impact environnemental de l'IA

Site statique de l'article, généré à partir du Markdown (`src/fr/`), de `src/references.bib` et de `images/`. Le Markdown reste la source de vérité : le build ne modifie, ne reformule ni ne traduit rien.

## Installation

Prérequis : Node.js 22 (testé avec 22.19.0) et npm.

```sh
npm ci
```

## Commande de build

```sh
npm run build
```

Le site statique est produit dans `dist/` (aucun backend, aucun script serveur). La page de lecture est `dist/fr/index.html` ; la racine redirige vers `/fr/`.

Autres commandes :

- `npm run dev` : serveur de développement ;
- `npm run preview` : aperçu de `dist/` ;
- `npm test` : tests unitaires (chaînes d'interface, assemblage de l'article) ;
- `npm run test:rendu` : construit le site puis vérifie le HTML de `dist/fr/index.html` (gras/italique, titres de paragraphe, listes, liens, caractères spéciaux) ;
- `npm run check:idempotence` : deux builds successifs, comparaison octet par octet de `dist/`.

## Contenu de l'article

`src/content.config.ts` charge `src/fr/main.md` via `src/lib/assemble-article.ts` : chaque lien `[sections/x](sections/x.md)` est remplacé par le contenu du fichier (titres `#`→`h2`, `##`→`h3`…), les commentaires HTML sont retirés, une inclusion introuvable fait échouer le build. Le rendu est fait par Astro, sans conversion typographique (`smartypants: false`) pour rester fidèle à la source.

Les tableaux pipe sont légendés par une ligne `Table: légende {#tab:id}` placée **sous** le tableau (convention Pandoc) : `src/lib/tables.ts` la convertit en `<caption>` (sans l'identifiant) et enveloppe le tableau dans un conteneur à défilement horizontal local. Un `Table:` sans tableau juste au-dessus fait échouer le build. La ligne `Source : …` qui suit reste un paragraphe sous le tableau.

## Citations et références

`src/lib/citations.ts` remplace chaque `[@clé]` (et `[@a; @b]`) par un lien numérique `[n]` (n = rang de première citation) vers l'entrée `#ref-clé` de la section « Références » en fin de page ; chaque entrée a un lien de retour (↩) par appel. `src/lib/bibliography.ts` lit `src/references.bib` (parseur maison, sans dépendance). Le `.bib` n'est jamais modifié.

- **Le build échoue** sur une clé citée absente du `.bib` (message : clé, fichier, ligne), sur une syntaxe de citation non gérée (par ex. `[@a, p. 3]`) et sur une entrée `.bib` mal formée ou en double.
- Une entrée du `.bib` jamais citée n'est pas affichée ; un avertissement de build la nomme.

## Mise en page et vérifications

Le gabarit partagé `src/layouts/Base.astro` fournit `<html lang>` (via `t('page.lang')`), le `<head>` et `<main>`, avec des emplacements nommés (`head`, `before-main`, `after-main`) pour les métadonnées et blocs des epics suivants. `src/styles/article.css` porte la mise en page : colonne de 70 caractères centrée, variables de couleur claires/sombres (`prefers-color-scheme`), aucune police ni ressource distante. Le texte ne dépend d'aucun JavaScript ; `npm run test:rendu` vérifie qu'aucun bouton n'est rendu côté serveur et la complétude du contenu (paragraphes, nombres, 2 tableaux, 8 figures).

Vérification manuelle à 375 px (aucun outil de test navigateur n'est installé) : `npm run build && npm run preview`, ouvrir `/fr/` dans un navigateur, activer le mode appareil (375 px de large) et exécuter dans la console `document.documentElement.scrollWidth <= window.innerWidth` : le résultat doit être `true` ; les tableaux défilent dans leur conteneur. Pour le thème sombre, émuler `prefers-color-scheme: dark` dans les outils de développement.

## Table des matières qui suit la lecture

`src/components/TocProgress.tsx` est un îlot `client:load` : la liste de liens ancrés est rendue au build (donc présente sans JavaScript), puis l'hydratation ajoute `aria-current="true"` sur l'entrée de la section visible et une jauge de progression (`role="progressbar"`). Les calculs (section active, ratio) sont des fonctions pures dans `src/lib/toc-progress.ts`, testées avec des mesures injectées. Dès 1200 px la table est fixée dans la marge gauche ; jusqu'à 640 px elle devient une barre collante de points non nommés (taille selon le niveau `h2` à `h5`, `aria-label` = titre, texte masqué visuellement) ; la transition de la jauge est désactivée avec `prefers-reduced-motion: reduce`.

Vérification navigateur : `npm run build && npm run preview`, ouvrir `/fr/`. (1) Desktop : faire défiler, l'entrée active est en gras et la jauge avance de 0 à 100 %. (2) 375 px (mode appareil) : la table est une ligne de points, `document.documentElement.scrollWidth <= window.innerWidth`, Tab puis Entrée sur un point mène à la section et le lecteur d'écran annonce le titre. (3) Désactiver JavaScript (outils de développement) : la liste de liens ancrés fonctionne, sans jauge. (4) Émuler `prefers-reduced-motion: reduce` : plus de transition sur la jauge.

## Configuration et bloc auteur

`src/config.json` est la seule source des informations d'auteur, de dates et de licence (bloc affiché sous le titre, puis métadonnées et BibTeX dans les stories suivantes). Champs à éditer à la main : `firstName`, `lastName`, `email`, `githubUrl`, `linkedinUrl`, `publishedDate`, `modifiedDate` (format `AAAA-MM-JJ`), `license` (`name`, `url`) et `siteUrl`. Les dates sont globales à toutes les langues, jamais déduites de git ni de l'horloge : `publishedDate` ne change plus après publication ; mettre à jour `modifiedDate` à la main à chaque correction publiée de l'article.

`src/lib/config.ts` valide strictement la configuration : le build échoue, en nommant le champ, si une valeur est absente, vide, reste le placeholder `À_RENSEIGNER` ou si une date est invalide. L'email n'apparaît que dans le `href` du lien `mailto:` (texte visible neutre).

## Chaînes d'interface

Toutes les chaînes d'interface sont dans `src/locales/fr.json` et lues via `src/i18n.ts`. Une clé absente fait échouer le build en nommant la clé.

## Choix techniques

- **Astro** : sortie HTML statique par défaut (lisible sans JavaScript), pipeline Markdown remark/rehype extensible.
- **React en îlots** : réservé aux interactions ultérieures (partage, copie, table des matières) ; absent du texte de l'article.
- **Syntaxe Pandoc** (`[@clé]`, `{width=80%}`, `Table:`) : gérée par du code maison (plugins remark) dans les stories 1.2 à 1.6, pas par Pandoc.

## Déploiement (GitHub Pages)

Le site est servi à `https://felixmortas.com/ai-env-impact-knowledge` (`site` et `base` dans `astro.config.mjs`). Publier le contenu de `dist/` sur GitHub Pages après `npm ci && npm run build`.

## Partage

Le JavaScript n'est utilisé que pour partager (îlot React `src/components/ShareButton.tsx`, `client:only` : le bouton n'existe pas dans le HTML statique, donc rien de cassé sans JS). Le bouton appelle la Web Share API avec le titre et l'URL canonique (`siteUrl` + `/fr/`, `src/lib/urls.ts`, indépendante de l'URL courante) ; sans Web Share, il copie cette URL et affiche « Lien copié » dans une région `aria-live`. Si la copie est refusée, un message d'échec s'affiche avec l'URL sélectionnable. La logique est dans `src/lib/share.ts` (testée avec `npm test`).

## Citation BibTeX

Le bloc « Citer » (`src/components/CiteBlock.astro`, `<details>` lisible sans JavaScript) affiche une entrée `@misc` construite à la compilation par `src/lib/bibtex.ts` : `author` (nom, prénom) et l'année (extraite de `publishedDate`) viennent de `src/config.json` ; `title` est le titre de l'article de la langue ; `url` est l'URL canonique (`siteUrl` + `/fr/`) ; `note` est le gabarit `cite.accessNote` de `src/locales/fr.json` rempli avec `modifiedDate` (jamais l'horloge). La clé est `<nom><année><premier mot significatif du titre>`, sans accent. Les caractères spéciaux (`& % _ # $ { } ~ ^ \`) sont échappés ; aucune adresse email n'entre dans l'entrée. Modifier `config.json` puis rebuild met l'entrée à jour. Le bouton Copier (îlot React `src/components/CopyButton.tsx`) copie l'entrée exacte et affiche « Entrée copiée ». Tests : `src/lib/bibtex.test.ts`.

## Table des matières

La table (`src/components/Toc.astro`, `<nav>` étiqueté par `toc.label`) est générée à la compilation depuis les titres `h2` à `h5` rendus (`src/lib/toc.ts`), avec les mêmes `id` que le contenu, plus l'entrée « Références ». Le `h1` et les titres de paragraphe en gras n'y figurent pas. Liste `ol` imbriquée de liens ancrés, placée sous le bloc auteur, fonctionnelle sans JavaScript. Tests : `src/lib/toc.test.ts` et `src/rendu.test.ts`.
