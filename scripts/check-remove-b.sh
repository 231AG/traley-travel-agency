#!/usr/bin/env bash
# Proves Design B can be removed by deleting its folders: copies the repo,
# deletes src/designs/b, src/pages/b and src/styles/b.css, then builds.
set -euo pipefail
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
tar --exclude=./node_modules --exclude=./dist --exclude=./.git --exclude=./.astro -cf - . | tar -xf - -C "$TMP"
ln -s "$PWD/node_modules" "$TMP/node_modules"
rm -rf "$TMP/src/designs/b" "$TMP/src/pages/b" "$TMP/src/styles/b.css"
(cd "$TMP" && npx astro build >/dev/null && test ! -e dist/b.html && test -e dist/index.html)
echo "Design B removed cleanly: the site still builds without it."
