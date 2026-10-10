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
