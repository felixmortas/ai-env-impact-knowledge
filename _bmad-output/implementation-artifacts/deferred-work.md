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

- source_spec: `_bmad-output/implementation-artifacts/spec-2-1-configuration-unique-et-bloc-auteur.md`
  summary: Valider la config dès le démarrage du serveur de dev (intégration Astro) plutôt qu'au premier rendu du bloc auteur.
  evidence: `getConfig()` n'est appelé que dans `AuthorBlock.astro` ; l'erreur apparaît tardivement.
- source_spec: `_bmad-output/implementation-artifacts/spec-2-1-configuration-unique-et-bloc-auteur.md`
  summary: Remplacer la liste manuelle de fichiers de test dans `package.json` par un glob.
  evidence: chaque story ajoute un fichier à la main ; risque d'oubli.

- source_spec: `_bmad-output/implementation-artifacts/spec-2-5-table-des-matieres-qui-suit-la-lecture.md`
  summary: Vérifier au navigateur que `display: contents` sur `ol`/`li` (mode points mobile) conserve la sémantique de liste pour les lecteurs d'écran.
  evidence: Certains navigateurs retirent les rôles list/listitem avec `display: contents` ; aucun test automatisé ne le couvre.
- source_spec: `_bmad-output/implementation-artifacts/spec-2-5-table-des-matieres-qui-suit-la-lecture.md`
  summary: Réserver la hauteur de la jauge avant hydratation (décalage de mise en page) et ajouter styles `forced-colors` et `print` pour la table fixe/points.
  evidence: La jauge n'est rendue qu'après hydratation ; les points utilisent un fond `::before` invisible en mode contraste forcé.
- source_spec: `_bmad-output/implementation-artifacts/spec-2-5-table-des-matieres-qui-suit-la-lecture.md`
  summary: Aucun test navigateur/hydratation de l'îlot (aria-current, aria-valuenow) ; cibles tactiles des points < 44 px.
  evidence: Seuls les tests purs et le HTML SSR sont automatisés ; points de 1,5 × 2,25 rem.

- source_spec: `_bmad-output/implementation-artifacts/spec-2-6-arborescence-multilingue.md`
  summary: `defaultSrcDir()` et `getStaticPaths` dépendent de `process.cwd()` alors que le loader utilise `import.meta.url`.
  evidence: un build ou des tests lancés hors de la racine du projet ne trouveraient pas `src/locales`.
- source_spec: `_bmad-output/implementation-artifacts/spec-2-6-arborescence-multilingue.md`
  summary: `t()` met les locales en cache sans invalidation, et l'ajout d'une langue n'est pas pris en compte par `astro dev` sans redémarrage.
  evidence: cache `Map` au niveau du module dans `src/i18n.ts`.
- source_spec: `_bmad-output/implementation-artifacts/spec-2-6-arborescence-multilingue.md`
  summary: `test:langues` (builds réels, environ 40 s) n'est pas inclus dans `npm test`, et `check:idempotence` ne couvre qu'une langue dans le dépôt.
  evidence: `package.json` ; aucune langue autre que `fr` n'est versionnée.
