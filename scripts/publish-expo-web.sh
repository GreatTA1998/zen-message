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

bundle=$(basename "$out"/_expo/static/js/web/index-*.js)
echo "Published web bundle: $bundle"
