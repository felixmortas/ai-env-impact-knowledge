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
# Chaque langue (src/<lang>/) doit produire dist/<lang>/index.html localisé.
langs=()
for d in src/*/; do
  l="$(basename "$d")"
  [[ "$l" =~ ^[a-z]{2}(-[A-Za-z0-9]+)*$ && -f "$d/main.md" ]] && langs+=("$l")
done
[ "${#langs[@]}" -gt 0 ] || { echo "ECHEC : aucune langue trouvée dans src/" >&2; exit 1; }
for l in "${langs[@]}"; do
  grep -q "<html lang=\"$l\"" "dist/$l/index.html" \
    || { echo "ECHEC : dist/$l/index.html absent ou sans lang=\"$l\"" >&2; exit 1; }
  grep -q '<h2 id="references">' "dist/$l/index.html" \
    || { echo "ECHEC : section Références absente de dist/$l/index.html" >&2; exit 1; }
  ! grep -q '\[@' "dist/$l/index.html" \
    || { echo "ECHEC : clé de citation brute [@ dans dist/$l/index.html" >&2; exit 1; }
done

cp -r dist "$tmp/a"
rm -rf dist
npm run build
diff -r dist "$tmp/a" && echo "OK : builds identiques" \
  || { echo "ECHEC : les deux builds diffèrent" >&2; exit 1; }
