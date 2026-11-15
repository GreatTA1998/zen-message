#!/usr/bin/env bash
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
expo="$root/expo"
out="$root/static/app"

cd "$expo"
CI=1 npx expo export -p web

rm -rf "$out"
mkdir -p "$out"
cp -a "$expo/dist/." "$out/"

# Expo HTML references /_expo/...; SvelteKit serves this tree at /app/_expo/...
if [[ -f "$out/index.html" ]]; then
  sed -i 's|src="/_expo/|src="/app/_expo/|g' "$out/index.html"
  sed -i 's|href="/favicon.ico"|href="/app/favicon.ico"|g' "$out/index.html"
fi

bundle=$(ls -S "$out"/_expo/static/js/web/index-*.js 2>/dev/null | head -1 | xargs -n1 basename)
# Expo may emit extra small index-*.js chunks; keep only the HTML entry bundle.
for f in "$out"/_expo/static/js/web/index-*.js; do
  [[ "$(basename "$f")" == "$bundle" ]] || rm -f "$f"
done
echo "Published web bundle: $bundle"
