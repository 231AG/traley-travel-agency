# Tarley Travel website

Marketing site for Tarley Travel LLC, Monrovia, Liberia. Static Astro site; every quote goes to WhatsApp as a prefilled message.

## Run it

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # dist/ + _headers + robots.txt, then checks the JS and image budgets
npm run serve        # serve dist/ the way the hosts do (headers, clean URLs, 404s)
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

- **Placeholders**: each entry in `placeholders` has the real-content request (`token`) and the interim copy shown on the site meanwhile (`interim`, built only from confirmed facts). Put Tarley's text in `interim` when it arrives. Any bracketed text like `[ABOUT: ...]` used directly in copy shows shaded on the page. `npm run build && npm run placeholders` regenerates `PLACEHOLDERS.md`.
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

## Deploy

`npm run build` produces a plain static site in `dist/`. The same build deploys to Cloudflare, Netlify or Vercel; each host gets the same security headers (strict CSP with hashed styles, HSTS, nosniff, Referrer-Policy, Permissions-Policy, X-Frame-Options), clean URLs (`/about` serves `about.html`) and the custom 404 page with a real 404 status. Node 22 is pinned in `.nvmrc` and `package.json`.

| Host                                   | Config in this repo                                                                                      | What to enter in the dashboard                                                                                                                        |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Cloudflare Pages**                   | none needed (reads `dist/_headers`)                                                                      | Workers & Pages, Create, Pages, connect GitHub. Build command `npm run build`, output directory `dist`.                                               |
| **Cloudflare Workers** (static assets) | `wrangler.jsonc`                                                                                         | Build command `npm run build`, deploy command `npx wrangler deploy`. Keep `wrangler.jsonc`: without it Wrangler converts the project to a server app. |
| **Netlify**                            | `netlify.toml` (reads `dist/_headers`)                                                                   | Add new site, import from GitHub. Settings are picked up from `netlify.toml`.                                                                         |
| **Vercel**                             | `vercel.json`; the build writes `.vercel/output` (Build Output API) with the headers, clean URLs and 404 | Add New, Project, import from GitHub. Leave the framework preset as "Other"; settings come from `vercel.json`.                                        |

Then add the custom domain `www.tarleytravel.com` in the host's domain settings and redirect the bare domain to it. Use one host at a time for the live domain.

From your own computer: `npm run deploy` (Cloudflare Workers, after `npx wrangler login`). To check the Vercel bundle locally: `VERCEL_OUTPUT=1 npm run build`, then look in `.vercel/output`.

## Fonts

Subset WOFF2 files (Playfair Display, Poppins, Cinzel digits) are committed in `src/assets/fonts`. To regenerate: `pip install fonttools brotli`, then `npm run fonts`.
