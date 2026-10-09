#!/usr/bin/env bash
# Lance deux builds successifs, vérifie le contenu clé de dist/ puis que les deux sorties sont identiques octet par octet.
set -euo pipefail
cd "$(dirname "$0")/.."
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

rm -rf dist
npm run build

# Sortie attendue : redirection racine vers /fr/ et page française localisée.
grep -q 'url=/ai-env-impact-knowledge/fr/' dist/index.html \
  || { echo "ECHEC : dist/index.html ne redirige pas vers /ai-env-impact-knowledge/fr/" >&2; exit 1; }
grep -q '<html lang="fr"' dist/fr/index.html \
  || { echo "ECHEC : dist/fr/index.html absent ou sans lang=\"fr\"" >&2; exit 1; }

cp -r dist "$tmp/a"
rm -rf dist
npm run build
diff -r dist "$tmp/a" && echo "OK : builds identiques" \
  || { echo "ECHEC : les deux builds diffèrent" >&2; exit 1; }
