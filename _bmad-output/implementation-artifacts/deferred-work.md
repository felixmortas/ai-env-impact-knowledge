- source_spec: `_bmad-output/implementation-artifacts/spec-1-1-socle-de-build-et-commande-unique.md`
  summary: Typer les clés de `t()` (keyof fr.json) et nommer la locale dans le message d'erreur quand EN/ES arriveront.
  evidence: `Messages` est `Record<string, string>` et le message cite `fr.json` en dur (revue Blind Hunter) ; à traiter avec la story 2.6.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-1-socle-de-build-et-commande-unique.md`
  summary: Ajouter un script de typecheck (`@astrojs/check`, `typescript`), un `.nvmrc` et un layout partagé avec `<meta description>`/canonique.
  evidence: aucun contrôle de types ni gabarit commun n'existe ; la redirection racine générée par Astro est en anglais ("Redirecting from…").
- source_spec: `_bmad-output/implementation-artifacts/spec-1-1-socle-de-build-et-commande-unique.md`
  summary: Mettre en place un workflow GitHub Actions de build/déploiement si le déploiement n'est pas géré depuis l'interface GitHub.
  evidence: le README décrit une publication manuelle de `dist/` ; l'epic 3 indique que le déploiement relève de l'interface GitHub.

- source_spec: `_bmad-output/implementation-artifacts/spec-1-4-tableaux.md`
  summary: Le numéro de ligne de l'erreur `Table:` est décalé par le retrait des commentaires multi-lignes et le `trim()`.
  evidence: `markTableCaptions` s'exécute après `stripComments` dans `src/lib/assemble-article.ts`.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-4-tableaux.md`
  summary: Le conteneur `.table-scroll` n'est pas accessible au clavier (`tabindex`, `role="region"`, nom accessible) et la légende n'a pas de style.
  evidence: relevé par la revue ; relève de la mise en page et de l'accessibilité (story 1.7).
- source_spec: `_bmad-output/implementation-artifacts/spec-1-5-images-et-legendes.md`
  summary: markImages ne protège pas les blocs de code et les images ne sont pas servies sous astro dev.
  evidence: signalé par les relecteurs ; sans effet sur le contenu actuel (aucun bloc de code contenant une image, build statique seul).

- source_spec: `_bmad-output/implementation-artifacts/spec-1-6-citations-cliquables-et-liste-de-references.md`
  summary: Le parseur BibTeX maison ne gère pas les macros `@string`, la concaténation `#`, les accents LaTeX ni un `@` hors entrée.
  evidence: Signalé par deux relecteurs ; sans effet sur le `.bib` actuel (build et tests verts).
- source_spec: `_bmad-output/implementation-artifacts/spec-1-6-citations-cliquables-et-liste-de-references.md`
  summary: Les numéros de ligne des erreurs de citation peuvent être décalés après `markImages` ; les `[@…]` dans des blocs de code font échouer le build.
  evidence: Aucune occurrence aujourd'hui dans les sections ; échec explicite et non silencieux.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-7-lecture-integrale-et-mise-en-page-sobre.md`
  summary: Le non-débordement à 375 px n'est vérifié que manuellement (README) ; aucun outil navigateur automatisé n'est installé.
  evidence: Spec : outil navigateur soumis à accord (Ask First) ; trois relecteurs signalent l'absence de protection de non-régression.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-7-lecture-integrale-et-mise-en-page-sobre.md`
  summary: Le test de complétude ne compare que les 60 premiers caractères de chaque ligne et ignore les lignes courtes et les titres ; `npm test` n'exécute pas `src/rendu.test.ts` (seulement `test:rendu`).
  evidence: Relecteurs Blind Hunter et Verification Gap ; limites connues, build préalable requis pour le rendu.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-7-lecture-integrale-et-mise-en-page-sobre.md`
  summary: Gabarit : pas de lien d'évitement, de balise `<article>`, de `description`/`lang` en prop, de styles `pre`/`blockquote`/`h5-h6` ni d'impression.
  evidence: Hors périmètre de la story (métadonnées et blocs prévus aux epics 2 et 3) ; aucun `pre`/`blockquote` dans le rendu actuel.
