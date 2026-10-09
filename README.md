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
- `npm test` : tests unitaires de l'accès aux chaînes d'interface ;
- `npm run check:idempotence` : deux builds successifs, comparaison octet par octet de `dist/`.

## Chaînes d'interface

Toutes les chaînes d'interface sont dans `src/locales/fr.json` et lues via `src/i18n.ts`. Une clé absente fait échouer le build en nommant la clé.

## Choix techniques

- **Astro** : sortie HTML statique par défaut (lisible sans JavaScript), pipeline Markdown remark/rehype extensible.
- **React en îlots** : réservé aux interactions ultérieures (partage, copie, table des matières) ; absent du texte de l'article.
- **Syntaxe Pandoc** (`[@clé]`, `{width=80%}`, `Table:`) : gérée par du code maison (plugins remark) dans les stories 1.2 à 1.6, pas par Pandoc.

## Déploiement (GitHub Pages)

Le site est servi à `https://felixmortas.com/ai-env-impact-knowledge` (`site` et `base` dans `astro.config.mjs`). Publier le contenu de `dist/` sur GitHub Pages après `npm ci && npm run build`.
