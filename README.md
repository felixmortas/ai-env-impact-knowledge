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

## Chaînes d'interface

Toutes les chaînes d'interface sont dans `src/locales/fr.json` et lues via `src/i18n.ts`. Une clé absente fait échouer le build en nommant la clé.

## Choix techniques

- **Astro** : sortie HTML statique par défaut (lisible sans JavaScript), pipeline Markdown remark/rehype extensible.
- **React en îlots** : réservé aux interactions ultérieures (partage, copie, table des matières) ; absent du texte de l'article.
- **Syntaxe Pandoc** (`[@clé]`, `{width=80%}`, `Table:`) : gérée par du code maison (plugins remark) dans les stories 1.2 à 1.6, pas par Pandoc.

## Déploiement (GitHub Pages)

Le site est servi à `https://felixmortas.com/ai-env-impact-knowledge` (`site` et `base` dans `astro.config.mjs`). Publier le contenu de `dist/` sur GitHub Pages après `npm ci && npm run build`.
