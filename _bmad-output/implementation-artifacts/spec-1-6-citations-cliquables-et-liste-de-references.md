---
title: 'Story 1.6 : Citations cliquables et liste de références'
type: 'feature'
created: '2026-10-10'
status: 'ready-for-dev'
baseline_commit: 'deae351a893b409ace3e6a49f9228fc9a196e522'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Les 75 appels `[@clé]` restent du texte brut et la bibliographie `src/references.bib` n'est pas exploitée : le lecteur ne peut pas vérifier les sources.

**Approach:** Lire `src/references.bib`, remplacer chaque `[@clé]` par un appel numéroté (ordre de première citation) vers une entrée de la liste de références générée en fin de page, avec lien de retour vers l'appel ; échouer au build sur toute clé absente du `.bib`.

## Boundaries & Constraints

**Always:** Markdown et `.bib` en lecture seule ; sortie statique, appels et liste fonctionnels sans JavaScript (ancres) ; numérotation déterministe ; titre de la liste via `t()` ; les citations dans les légendes de tableau (par ex. `[@li2026…]`) sont résolues comme les autres.

**Ask First:** Ajouter une dépendance npm pour parser le BibTeX (par ex. `@retorquere/bibtex-parser`) ou écrire un parseur maison ; changer le style de citation (numérique `[1]` est le défaut).

**Never:** Corriger ou reformater une entrée du `.bib` ; fabriquer un champ manquant ; masquer une clé non résolue ; afficher une clé brute `[@…]` dans la page ; inventer un style bibliographique non demandé.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Nominal | `[@clé]` présente dans le `.bib` | `<a href="#ref-clé">[n]</a>` ; `n` = rang de première citation | N/A |
| Clé répétée | Même clé citée deux fois | Même numéro ; la référence a un lien de retour par appel | N/A |
| Clé absente | `[@inconnue]` | Build en échec nommant la clé et le fichier source | Erreur explicite |
| Citations groupées | `[@a; @b]` s'il existe | Appels séparés vers chaque entrée, sans clé brute | Build en échec si syntaxe non gérée |
| Entrée jamais citée | 66 entrées, 65 clés distinctes | Non affichée dans la liste ; avertissement de build la nommant | Avertissement, pas d'échec |
| Entrée mal formée | `.bib` invalide | Build en échec nommant l'entrée | Erreur explicite |
| Citation dans légende | `Table: … [@li2026…] {#…}` | Appel numéroté dans le `caption` | N/A |

</frozen-after-approval>

## Code Map

- `src/references.bib` -- 66 entrées.
- `src/fr/sections/*.md` -- 75 appels `[@clé]`, 65 clés distinctes, dont un dans une légende de tableau (`understand.md`, après 1.4).
- `src/lib/citations.ts`, `src/lib/citations.test.ts` -- à créer : extraction des clés, numérotation, rendu des appels.
- `src/lib/bibliography.ts` -- à créer : lecture et mise en forme d'une entrée (auteurs, titre, année, URL/DOI).
- `src/pages/fr/index.astro` -- ajouter la section « Références » en fin d'article (titre `h2` via `t('references.title')`).
- `src/locales/fr.json` -- clés `references.title`, `references.backlink`.

## Tasks & Acceptance

**Execution:**
- [ ] `src/lib/bibliography.ts` -- parser le `.bib`, mettre en forme chaque entrée, signaler les entrées mal formées -- FR2
- [ ] `src/lib/citations.ts` -- remplacer chaque `[@clé]` par un appel numéroté cliquable (après 1.4/1.5 pour les légendes) ; échouer sur clé absente ; avertir sur entrée non citée -- FR2
- [ ] `src/pages/fr/index.astro`, `src/locales/fr.json` -- liste de références ordonnée avec lien de retour -- FR2
- [ ] Tests : matrice ci-dessus, 0 `[@` dans `dist/fr/index.html`, tous les `href="#ref-…"` ont une cible -- FR2
- [ ] `README.md` -- décrire l'échec sur clé absente
- [ ] Mettre à jour l'attente de `scripts/check-idempotence.sh` / tests de titres : la page compte désormais un `h2` de plus (« Références »)

**Acceptance Criteria:**
- Given `dist/fr/index.html`, when on cherche `[@`, then aucune occurrence n'existe.
- Given les 75 appels, when on suit chaque lien, then il mène à une entrée de la liste de références existante.
- Given une clé retirée du `.bib` dans une copie temporaire, when on lance le build, then il échoue en nommant la clé.
- Given une référence citée, when on clique sur son lien de retour, then on revient à l'appel d'origine.
- Given deux builds sans changement, when on compare `dist/`, then ils sont identiques.

## Spec Change Log

## Design Notes

**À confirmer par l'auteur :** l'epic dit « les entrées du .bib (66) sont affichées » alors que seules 65 clés sont citées. Parti pris ici : la liste ne montre que les références citées (standard bibliographique), l'entrée orpheline est signalée par un avertissement. Si l'auteur préfère afficher les 66, ajouter les non citées à la suite, non numérotées par ordre de citation.

Cette story clôt la chaîne de transformations de texte (1.4, 1.5, 1.6) : passer par un seul module d'orchestration pour éviter les conflits d'ordre.

## Verification

**Commands:**
- `npm test` -- expected: tests verts
- `npm run test:rendu` -- expected: tests de rendu verts
- `npm run check:idempotence` -- expected: « OK : builds identiques »
