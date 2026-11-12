#!/usr/bin/env bash
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
expo="$root/expo"
out="$root/static/app"

cd "$expo"
# app.config.js maps this to experiments.baseUrl, which prefixes the HTML shell,
# async chunks, and /assets files together. SvelteKit serves this tree at /app.
EXPO_WEB_BASE=/app CI=1 npx expo export -p web

rm -rf "$out"
mkdir -p "$out"
cp -a "$expo/dist/." "$out/"

bundle=$(basename "$out"/_expo/static/js/web/index-*.js)
echo "Published web bundle: $bundle"
