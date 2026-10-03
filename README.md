# Tarley Travel website

Marketing site for Tarley Travel LLC, Monrovia, Liberia. Static Astro site; every quote goes to WhatsApp as a prefilled message. Two designs share one content layer: Design A at `/`, Design B mirrored under `/b/` (not indexed).

## Run it

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # dist/ + _headers + robots.txt, then checks the JS and image budgets
npm run serve        # serve dist/ the way Cloudflare Pages does (headers, 404s)
```

## Change content

Everything a visitor reads lives in `src/content/site.ts`: contact details, hours, copy, services, visa destinations, photo slots and placeholders. Components never hard-code copy.

- **Placeholders**: bracketed text like `[ABOUT: ...]` shows shaded on the page until Tarley supplies it. `npm run build && npm run placeholders` regenerates `PLACEHOLDERS.md`.
- **Photos**: put a photo in `assets/photos/{slot}.jpg`, set `file` (and `credit` for stock) on the slot in `site.ts`, then `npm run assets` and `npm run credits`.
- **Testimonials**: add real quotes to `testimonials` and set `features.testimonials = true`.
- **Analytics**: set `analytics.token` (Cloudflare Web Analytics) and `features.analytics = true`; the CSP opens up for it automatically.

## Checks

```bash
npm run check        # types, lint, project rules, format, unit tests, build, Playwright (+ axe)
npm run lighthouse -- / /visa /b     # Lighthouse mobile with the budgets from the brief
npm run check:links  # official visa links and social profiles
npm run check:remove-b               # proves Design B can be deleted cleanly
npm run screenshots  # HD screenshots of every page in both designs + screenshots/index.html
```

Playwright uses `CHROMIUM_PATH` (or `/opt/pw-browsers/chromium` when `PLAYWRIGHT_BROWSERS_PATH` is set); otherwise run `npx playwright install chromium` once.

## Deploy to Cloudflare Pages

1. Cloudflare dashboard, Workers & Pages, Create, Pages, connect this GitHub repository.
2. Build command `npm run build`, output directory `dist`, environment variable `NODE_VERSION=22`.
3. Add the custom domain `www.tarleytravel.com` (and redirect the bare domain to it).

`dist/_headers` sets the security headers (strict CSP with hashed styles, HSTS, nosniff, Referrer-Policy, Permissions-Policy) and `noindex` on `/b/*`.

## Remove Design B

Delete `src/designs/b`, `src/pages/b` and `src/styles/b.css` (and optionally the `board` export in `site.ts`). Nothing else references them.

## Fonts

Subset WOFF2 files are committed in `src/assets/fonts`. To regenerate: `pip install fonttools brotli`, then `npm run fonts`.
