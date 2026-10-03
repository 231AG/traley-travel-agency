#!/usr/bin/env bash
# Subsets the self-hosted fonts to the characters the site uses and writes WOFF2 files
# to src/assets/fonts. Needs fonttools (`pip install fonttools brotli`). Output is committed,
# so builds (including Cloudflare Pages) do not need fonttools.
set -euo pipefail
SRC=node_modules/@fontsource
OUT=src/assets/fonts
TEXT="U+0020-007E,U+00A0-00FF,U+2013-2014,U+2018-201D,U+2022,U+2026,U+20AC"
mkdir -p "$OUT"

subset() { # family weight unicodes outname
  pyftsubset "$SRC/$1/files/$1-latin-$2-normal.woff2" --unicodes="$3" \
    --flavor=woff2 --layout-features='kern,liga,lnum,tnum' --output-file="$OUT/$4.woff2"
}

subset playfair-display 600 "$TEXT" playfair-600
subset poppins 400 "$TEXT" poppins-400
subset poppins 500 "$TEXT" poppins-500
subset poppins 600 "$TEXT" poppins-600
subset cinzel 700 "U+0030-0039" cinzel-700-digits
subset big-shoulders-display 700 "$TEXT" big-shoulders-700
subset atkinson-hyperlegible 400 "$TEXT" atkinson-400
subset atkinson-hyperlegible 700 "$TEXT" atkinson-700
ls -l "$OUT"
