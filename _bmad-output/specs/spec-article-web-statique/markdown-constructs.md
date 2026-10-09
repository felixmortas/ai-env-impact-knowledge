# Constructions Markdown à rendre

Le build doit rendre explicitement chacune des constructions ci-dessous, déjà présentes dans l'article actuel (inventaire tiré de la version LaTeX : 5 sections, 66 références, 8 images, 2 tableaux).

| Construction | Rendu attendu |
|---|---|
| Titres `#` à `####` (article, section, sous-section, sous-sous-section) | `h1` à `h4` avec ancres stables, source de la table des matières |
| Titres de paragraphe (4 dans l'article actuel) | Titre en gras ou `h5`, hors table des matières |
| Citation `[@clé]` (78 appels dans l'article actuel) | Appel numéroté cliquable vers la liste de références générée depuis `references.bib` (66 entrées) |
| Gras, italique, souligné de lien | `strong`, `em`, lien |
| Liens externes (19 dans l'article actuel) | Lien ; URL longue sans débordement horizontal |
| Listes à puces et numérotées (80 items) | `ul` / `ol` |
| Tableaux avec légende et ligne de source (2) | `table` avec légende ; défilement horizontal local sur mobile |
| Images avec légende (8) | `figure` / `figcaption`, `alt` obligatoire, largeur relative au conteneur |
| Indices et exposants (CO₂e, m³) | Rendu typographique correct |
| Caractères spéciaux (`>`, `~`, `_`) | Affichés littéralement |

Exclusions : commentaires HTML (`<!-- -->`) du Markdown n'apparaissent jamais dans la page.
