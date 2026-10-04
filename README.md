# Tarley Travel website

Marketing site for Tarley Travel LLC, Monrovia, Liberia. Static Astro site; every quote goes to WhatsApp as a prefilled message.

## Run it

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # dist/ + _headers + robots.txt, then checks the JS and image budgets
npm run serve        # serve dist/ the way Cloudflare Pages does (headers, 404s)
```

## Project layout

| Path                     | What lives there                                                                                                  |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `src/content/site.ts`    | Every word on the site: contact details, hours, copy, services, visa destinations, photo slots, placeholders      |
| `src/pages/`             | One file per page; `visa/[country].astro` renders the six destination pages                                       |
| `src/layouts/Base.astro` | Page shell: head, header, footer, floating WhatsApp button                                                        |
| `src/components/`        | Page sections and building blocks; `quote/` holds the quote card and its fields                                   |
| `src/lib/`               | Logic: types, SEO helpers, icons, and `quote/` (validation, message templates, WhatsApp link, browser controller) |
| `src/styles/`            | `tokens.css` (brand colors, type scale, spacing) and `site.css` (fonts and component utilities)                   |
| `assets/photos/`         | Source photos; `npm run assets` turns them into `public/img/`                                                     |
| `scripts/`               | Build helpers and checks (headers, budgets, placeholders, credits, Lighthouse, links, preview copy)               |
| `tests/`                 | Vitest unit tests, Playwright end-to-end tests, screenshot capture                                                |

## Change content

Components never hard-code copy; edit `src/content/site.ts`.

- **Placeholders**: bracketed text like `[ABOUT: ...]` shows shaded on the page until Tarley supplies it. `npm run build && npm run placeholders` regenerates `PLACEHOLDERS.md`.
- **Photos**: put a photo in `assets/photos/{slot}.jpg`, set `file` (and `credit` for stock) on the slot in `site.ts`, then `npm run assets` and `npm run credits`.
- **Testimonials**: add real quotes to `testimonials` and set `features.testimonials = true`.
- **Analytics**: set `analytics.token` (Cloudflare Web Analytics) and `features.analytics = true`; the CSP opens up for it automatically.

## Checks

```bash
npm run check        # types, lint, project rules, format, unit tests, build, Playwright (+ axe)
npm run lighthouse -- / /visa /contact   # Lighthouse mobile with the brief's budgets
npm run check:links  # official visa links and social profiles
npm run screenshots  # HD screenshots of every page into screenshots/{desktop|mobile}/
npm run preview:copy -- <dir>            # copy of the build with relative links, for hosted previews
```

Playwright uses `CHROMIUM_PATH` (or `/opt/pw-browsers/chromium` when `PLAYWRIGHT_BROWSERS_PATH` is set); otherwise run `npx playwright install chromium` once.

## Deploy to Cloudflare

The repo includes `wrangler.jsonc`, which tells Cloudflare to serve the built `dist/` folder as a static site. Keep it: without it, `wrangler deploy` runs an auto-setup that converts the project to a server app and breaks the build.

**Workers & Pages, connected to GitHub (current setup):**

1. Build command `npm run build`, deploy command `npx wrangler deploy`, root directory `/`, environment variable `NODE_VERSION=22`.
2. Add the custom domain `www.tarleytravel.com` under the Worker's Settings, Domains & Routes (and redirect the bare domain to it).

From your own computer, `npm run deploy` builds and uploads (log in once with `npx wrangler login`).

`dist/_headers` sets the security headers: strict CSP with hashed styles, HSTS, nosniff, Referrer-Policy, Permissions-Policy, X-Frame-Options. Unknown URLs get `404.html` with a real 404 status.

## Fonts

Subset WOFF2 files (Playfair Display, Poppins, Cinzel digits) are committed in `src/assets/fonts`. To regenerate: `pip install fonttools brotli`, then `npm run fonts`.
