# Constructions Markdown à rendre

Le build doit rendre explicitement chacune des constructions ci-dessous, déjà présentes dans l'article actuel (inventaire tiré des fichiers Markdown : `main.md` + 5 sections, 65 clés de citation distinctes, 66 entrées `references.bib`, 8 images, 2 tableaux). La syntaxe source est celle de Pandoc.

| Construction | Syntaxe source | Rendu attendu |
|---|---|---|
| Titre de l'article (`main.md`, `#`) | `# Titre` | `h1` unique de la page |
| Titres de section (`#` dans chaque fichier de section : 5) | `# Section` | `h2` : le build décale d'un niveau les titres des sections pour qu'il n'y ait qu'un seul `h1` |
| Sous-titres (`##`, `###`, `####`) | `## …` | `h3` à `h5` après décalage, avec ancres stables, source de la table des matières |
| Titres de paragraphe (9 dans l'article actuel) | Ligne débutant par `**Texte**` ou `**Texte :**`, seule ou suivie de texte sur la même ligne (`**Formule :** …`) | Gras, ni titre ni entrée de table des matières |
| Citation (75 appels dans l'article actuel) | `[@clé]` | Appel numéroté cliquable vers la liste de références générée depuis `references.bib` (66 entrées) |
| Gras, italique | `**…**`, `*…*` | `strong`, `em` |
| Liens externes (20 dans l'article actuel) | `[texte](url)` (16) et autoliens `<url>` (4) | Lien ; URL longue sans débordement horizontal |
| Inclusion de section (`main.md`) | `[sections/intro](sections/intro.md)` | Remplacée par le contenu du fichier `.md`, dans l'ordre ; le lien n'apparaît pas dans la page |
| Listes à puces et numérotées (87 items) | `- …`, `1. …` | `ul` / `ol` |
| Tableaux (2) | Tableau pipe, ligne `Table: légende {#tab:id}` sous le tableau, puis paragraphe `Source : …` | `table` avec `caption` (sans l'identifiant `{#…}`, non référencé dans le texte) et ligne de source ; défilement horizontal local sur mobile |
| Images (8, toutes légendées) | `![légende](chemin){width=80%}` | `figure` / `figcaption`, la légende sert aussi d'`alt` (build en échec si vide) ; largeur relative au conteneur (l'attribut `width` est interprété, 80 % ici) |
| Indices et exposants (CO₂e, m³) | Caractères Unicode directement dans le texte : `CO₂e`, `m³` | Affichés tels quels, sans traitement du build |
| Caractères spéciaux | `~` (ex. `~0,3 Wh`), `--` (cellule « sans valeur »), `_`, `>` | `~` et `_` littéraux ; `--` affiché tel quel dans les tableaux, sans conversion en tiret long |

## Exclusions

Les commentaires HTML (`<!-- -->`) du Markdown (4 dans `main.md`) n'apparaissent jamais dans la page.
