# Tarley Travel website: Phase 0 plan

Status: **built; Design A chosen and Design B removed on 4 October 2026** (see `docs/phase-reports.md`, Phase 8). Earlier status: **approved.** The owner asked me to auto-approve each phase once it passes its audit, and to list carryovers after every phase. D1 to D6 go ahead as recommended.

## Owner answers (2026-10-03)

| Item                         | Answer                                         | Where it goes                                                                |
| ---------------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------- |
| Domain                       | www.tarleytravel.com                           | Canonical URLs, sitemap, WhatsApp footer line ("Sent from tarleytravel.com") |
| Facebook                     | https://www.facebook.com/share/19hm1w3FnL/     | Footer, contact page, JSON-LD `sameAs`                                       |
| Instagram                    | https://www.instagram.com/tarley_travels_1     | Same (tracking parameter removed)                                            |
| Payment methods              | Mobile money, Sendwave, bank transfer          | Trust bar, steps, flights page                                               |
| Hours                        | Monday to Saturday, 7:30 am to 6:00 pm         | Contact, about, footer, JSON-LD                                              |
| Office                       | Old Road, Oldest Congo Town, Monrovia, Liberia | Contact, about, footer, JSON-LD                                              |
| Reply time                   | Usually under 30 minutes                       | Trust bar, contact                                                           |
| Business registration number | Not shown on the site                          | The "Registered in Liberia" trust item becomes "Office in Monrovia"          |

Email stays `info@tarleytravelllc.com` as given; it is on a different domain from the website, so confirming it receives mail is a carryover.

## Decisions I need from you first

These change what gets built, so they come before everything else.

| #   | Question                                                                                                                                                                                                                                                                                                                     | My recommendation                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | **The JS budget and Next.js conflict.** I built an empty Next.js 16.3 static export (one `<h1>`, nothing else) and measured it: **~133 KB gzipped JS** on first load for modern browsers (plus a 39 KB legacy polyfill). The budget is under 100 KB per page. Next.js cannot meet it before we write a line of our own code. | Switch to **Astro 5 + TypeScript strict + Tailwind**, with the quote form as the only interactive island (vanilla TS, no framework runtime). Expected first-load JS is roughly 5 to 15 KB. Everything else in the brief stays: static output, `zod` (via `zod/mini`), `sharp` image script, self-hosted fonts, one content file, Playwright, axe, Lighthouse CI, Cloudflare Pages, `_headers`. The alternative is to keep Next.js and raise the budget to about 150 KB. |
| D2  | **`gold-text` (#9A7414) does not pass contrast.** It measures 4.30:1 on white and 3.95:1 on cream; body-size text needs 4.5:1.                                                                                                                                                                                               | Use **#866510** (5.41:1 on white, 4.96:1 on cream). It reads as the same gold.                                                                                                                                                                                                                                                                                                                                                                                          |
| D3  | **`border` (#DDE1EA) is too light for form inputs.** Input outlines need 3:1 (WCAG 1.4.11); it measures 1.31:1.                                                                                                                                                                                                              | Keep #DDE1EA for card borders; add **`border-strong` #767F94** (4.01:1) for inputs and the quote tabs.                                                                                                                                                                                                                                                                                                                                                                  |
| D4  | **Logo files.** Both arrived as JPEG. Logo A (1536 px square, stacked, white background) is sharp. Logo B (670 x 202, horizontal) has a sky photo baked into its background and is too small for a retina nav. Neither has a version that works on navy.                                                                     | Ask Tarley's designer for **SVGs of: the horizontal lockup, the stacked lockup, a reversed (white and gold) version for navy, and the T-globe mark alone.** Until then, see "Logo placement" for the interim plan, which needs your OK on one point (cropping).                                                                                                                                                                                                         |
| D5  | **Design B direction.**                                                                                                                                                                                                                                                                                                      | Direction 1, "Departures". See "Design B directions".                                                                                                                                                                                                                                                                                                                                                                                                                   |
| D6  | **Skill install.**                                                                                                                                                                                                                                                                                                           | Approve installing `webapp-testing` (and `frontend-design` as a proper skill) from Anthropic's official repo. See "Skills".                                                                                                                                                                                                                                                                                                                                             |

## 1. Skills

Inventory method: listed `~/.claude/skills/` (including the synced org skills), checked for project skills (`.claude/skills/` does not exist yet: empty repo), checked installed plugins (none), checked `/mnt/skills/` (Anthropic's bundled skill library on this machine), and read the `SKILL.md` of every skill that could apply.

**Not found.** `design:design-system`, `design:accessibility-review`, `design:design-critique` and `design:ux-copy` are not installed and no `design` plugin is available here. I replace each with an explicit checklist in the audit loop (listed in the table) rather than pretend a skill ran.

| Skill                                                                                   | Source                                                                      | Status                                | Phases        | Reason                                                                                                                                                                                                                                        |
| --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `frontend-design`                                                                       | Anthropic bundled library (`/mnt/skills/public`), not registered as a skill | Used (read directly); propose install | 0, 2, 4, 5, 7 | Aesthetic direction, type choices, two-pass plan-then-critique process; used for the Design B directions below                                                                                                                                |
| `design-taste-frontend`                                                                 | user (synced org skill)                                                     | Used                                  | 0, 2 to 7     | Anti-template checks and its pre-flight checklist on every page. Two of its rules conflict with the brief and the brief wins: it mandates dark mode (brief: light brand, not in scope) and bans em dashes (I follow that in site copy anyway) |
| `design:design-system`                                                                  | not available                                                               | Not used (missing)                    | 0, 1          | Replaced by the token table in section 4 and a component spec per component in Phase 1                                                                                                                                                        |
| `design:accessibility-review`                                                           | not available                                                               | Not used (missing)                    | every         | Replaced by axe-core in Playwright, Lighthouse a11y, a manual WCAG 2.2 AA checklist (focus order, 44 px targets, 2.4.11 focus not obscured, 3.3.8 accessible auth n/a) and keyboard runs                                                      |
| `design:design-critique`                                                                | not available                                                               | Not used (missing)                    | every         | Replaced by a side-by-side screenshot review against the mockup at 1440 and 390 px, done by a fresh sub-agent                                                                                                                                 |
| `design:ux-copy`                                                                        | not available                                                               | Not used (missing)                    | 3, 4          | Replaced by the copy rules in the brief plus the writing section of `frontend-design`                                                                                                                                                         |
| `full-output-enforcement`                                                               | user (synced)                                                               | Used                                  | 1 to 7        | No stubs, TODOs or truncated files in source                                                                                                                                                                                                  |
| `minimalist-ui`                                                                         | user (synced)                                                               | Not used                              | 5             | Its warm-monochrome, pastel palette would push navy and gold to the margins; the brand needs them carrying the page                                                                                                                           |
| `industrial-brutalist-ui`                                                               | user (synced)                                                               | Not used                              | 5             | All-caps, tiny mono labels and degradation effects break the brief's copy rules (no all-caps), the 15 px minimum, and the trust goal                                                                                                          |
| `redesign-existing-projects`                                                            | user (synced)                                                               | Not used                              | n/a           | Repo starts empty, as the brief expected                                                                                                                                                                                                      |
| `webapp-testing`                                                                        | Anthropic official (`anthropics/skills`, `example-skills` plugin)           | Proposed install                      | 1 to 7        | Drive Chromium for screenshots, keyboard runs and visual review. Playwright and Chromium are already on this machine                                                                                                                          |
| `run`                                                                                   | built-in                                                                    | Used                                  | 1 to 7        | Launch the built site locally to look at it                                                                                                                                                                                                   |
| `code-review`, `simplify`, `security-review`                                            | built-in                                                                    | Used                                  | every audit   | Fresh-eyes review of each phase's diff; security review before Phase 6                                                                                                                                                                        |
| `session-start-hook`                                                                    | user                                                                        | Proposed, optional                    | 1             | Makes future cloud sessions install deps and run checks automatically. Only if you want it                                                                                                                                                    |
| `brand-guidelines`, `theme-factory`, `canvas-design`, `web-artifacts-builder`           | bundled examples                                                            | Not used                              | n/a           | Anthropic's own branding, theme presets, poster art, and single-file claude.ai artifacts: none fit a Tarley production site                                                                                                                   |
| `docs`, `docx`, `pdf`, `pptx`, `xlsx`, `google-workspace`                               | user (synced)                                                               | Not used                              | n/a           | Deliverables are Markdown and HTML in the repo                                                                                                                                                                                                |
| `prompt-architect`, `skill-creator`, `import-memory`, `morning`, other bundled examples | user / bundled                                                              | Not used                              | n/a           | Unrelated to building a website                                                                                                                                                                                                               |
| `artifact-*`, `dataviz`, `claude-api`, `loop`, `init`, config skills                    | built-in                                                                    | Not used                              | n/a           | Unrelated to this build                                                                                                                                                                                                                       |

Connected MCP tools worth noting: **Unsplash** (search free-license photos with photographer data for `CREDITS.md`) will be used in Phase 2 for photo slots. Figma, Canva, Lovable and Higgsfield are not used; Higgsfield in particular generates AI images, which the brief rules out for people.

**Proposed installs (after approval only):** the `example-skills` plugin from Anthropic's official marketplace (`/plugin marketplace add anthropics/skills`, then `/plugin install example-skills@anthropic-agent-skills`), which contains `webapp-testing` and `frontend-design`. In this cloud session I cannot run interactive `/plugin` commands, so the fallback is to copy those two skill folders from `github.com/anthropics/skills` into `.claude/skills/` and commit them. Both sources are the official repository.

## 2. Stack

Assuming D1 is approved:

| Area       | Choice                                                                                                                                                            | Change from brief                                               |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Framework  | Astro 5, `output: 'static'`                                                                                                                                       | **Changed** from Next.js for the JS budget (D1)                 |
| Language   | TypeScript `strict`, `noUncheckedIndexedAccess`, no `any` (lint-enforced)                                                                                         | Same                                                            |
| Styling    | Tailwind CSS v4, tokens in `@theme`; ESLint rule bans hex literals outside the token file                                                                         | Same                                                            |
| Fonts      | Self-hosted WOFF2, Latin subset, `font-display: swap`, preload only the hero heading weight. Design A: Playfair Display 600, Poppins 400/500/600, Cinzel 700      | Same fonts; loaded with Astro's font API instead of `next/font` |
| Images     | `scripts/images.ts` with `sharp`: AVIF + WebP at 400/800/1200/1600 w, explicit width/height, `<picture>` component                                                | Same                                                            |
| Quote flow | Vanilla TS island; `zod/mini` validation; `wa.me/231886504519?text=` builder; fully works as a plain link if JS fails (the WhatsApp CTA still opens a blank chat) | Same behavior                                                   |
| Content    | `src/content/site.ts`, typed, the only place copy, contacts, placeholders and image slots live                                                                    | Same                                                            |
| Quality    | ESLint, Prettier, `astro check`, Vitest (message builder unit tests), Playwright (smoke, quote flows, screenshots), `@axe-core/playwright`, Lighthouse CI         | Added Vitest for the pure functions                             |
| Hosting    | Cloudflare Pages; `public/_headers` with CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy                                                   | Same                                                            |
| Analytics  | Cloudflare Web Analytics, `analytics.enabled = false` in config                                                                                                   | Same                                                            |

If you keep Next.js instead: App Router, `output: 'export'`, `images.unoptimized` plus the same sharp script, and a post-build step to emit `/b/404.html`. Everything else in this plan is unchanged.

**Two designs in one app.** `src/shared/` holds content, types, the message builder, validation and SEO helpers. `src/designs/a/` and `src/designs/b/` hold each design's components and layouts. Routes: `src/pages/*` for Design A, `src/pages/b/*` for Design B. Removing Design B means deleting `src/designs/b/` and `src/pages/b/`.

## 3. Sitemap and URLs

| Page                  | Design A                                                                                                    | Design B                 |
| --------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------ |
| Home                  | `/`                                                                                                         | `/b/`                    |
| Flights & hotels      | `/flights-hotels`                                                                                           | `/b/flights-hotels`      |
| Visa assistance       | `/visa`                                                                                                     | `/b/visa`                |
| Visa destination (x6) | `/visa/united-states`, `/visa/united-kingdom`, `/visa/canada`, `/visa/schengen`, `/visa/uae`, `/visa/china` | same under `/b/visa/...` |
| Liberia concierge     | `/concierge`                                                                                                | `/b/concierge`           |
| About                 | `/about`                                                                                                    | `/b/about`               |
| Contact               | `/contact`                                                                                                  | `/b/contact`             |
| Not found             | `/404`                                                                                                      | `/b/404`                 |

Trailing slashes off, lowercase, hyphens. Design B pages carry `noindex` and are excluded from `sitemap.xml`.

Proposed changes for you to accept or reject:

- **Packages.** The footer in the mockup links "Travel packages". With no packages page, I point it to `/flights-hotels#packages`, a short "Holiday, honeymoon and group packages on request" block with a WhatsApp CTA. No new page.
- **Privacy note (optional).** A short `/privacy` page saying the site stores nothing and the form only opens WhatsApp. Cheap, and it helps first-time visitors trust a form that asks about passports. Only if Tarley wants it.
- **Quote form on a page with ?tab=.** Services buttons scroll to `#quote` and set the tab; deep links like `/?quote=visa&to=canada#quote` also work, so WhatsApp and social posts can link straight to a prefilled form.

## 4. Design tokens (Design A, from the mockup)

**Color.** Brief values, with D2 and D3 applied. Contrast measured:

| Token           | Value                                | Use                                           | Check                     |
| --------------- | ------------------------------------ | --------------------------------------------- | ------------------------- |
| `navy`          | #0B1F4D                              | Hero, headings, dark buttons                  | White on navy 15.9:1      |
| `navy-deep`     | #071536                              | Footer                                        | Gold on navy-deep 7.9:1   |
| `royal`         | #1E3A8A                              | Links on light backgrounds                    | 10.4:1 on white           |
| `gold`          | #D4A537                              | Buttons and accents; always navy text         | Navy on gold 7.0:1        |
| `gold-text`     | **#866510** (was #9A7414)            | Gold text and icons on light backgrounds      | 5.4:1 white, 5.0:1 cream  |
| `cream`         | #F7F5EF                              | Alternating sections                          |                           |
| `border`        | #DDE1EA                              | Card borders, dividers                        | Decorative only           |
| `border-strong` | **#767F94** (new)                    | Inputs, tabs, form controls                   | 4.0:1 on white            |
| `ink`           | #1A2238                              | Body text                                     | 15.8:1                    |
| `muted`         | #3D475C                              | Secondary text                                | 9.3:1 white, 8.5:1 cream  |
| `on-navy-muted` | **#B8C2D9** (new)                    | Secondary text on navy (hero subhead, footer) | 8.9:1 on navy             |
| `focus`         | gold 3 px outline + 2 px navy offset | All focus rings                               | Visible on white and navy |

**Type scale** (rem on a 17 px body; nothing below 15 px):

| Role                           | Font            | Mobile | Desktop | Line height |
| ------------------------------ | --------------- | ------ | ------- | ----------- |
| Display (hero h1)              | Playfair 600    | 40     | 60      | 1.08        |
| h2                             | Playfair 600    | 30     | 40      | 1.15        |
| h3 (card titles)               | Playfair 600    | 22     | 24      | 1.25        |
| Step numbers                   | Cinzel 700      | 32     | 40      | 1           |
| Body                           | Poppins 400     | 17     | 17      | 1.6         |
| Body small / labels / captions | Poppins 400/500 | 15     | 15      | 1.5         |
| Buttons                        | Poppins 600     | 16     | 16      | 1           |

Deviation from the mockup: the mockup's trust-bar sublines, form labels, checklist items and footer links are about 12 to 13 px. All go to 15 px minimum per the brief.

**Spacing:** 4 px base; scale 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Section padding 64 mobile / 96 desktop. Container 1200 px max, 20 px gutters on mobile, 32 px from 768 up.

**Radii:** `sm` 6 px (inputs, chips), `md` 12 px (cards, quote card), `full` (pill buttons and the floating button, as in the mockup).

**Shadows:** `card` 0 1px 2px rgba(11,31,77,.06), 0 8px 24px rgba(11,31,77,.08) (navy-tinted); `quote` 0 24px 48px rgba(7,21,54,.28) for the boarding pass over the hero; nothing else.

**Motion:** one hero load (headline and quote card fade-up, 400 ms, once); tab and menu changes 150 ms; all disabled under `prefers-reduced-motion`.

## 5. Component inventory

**Shared (logic, no styling), `src/shared/`:**
`site.ts` content and placeholders · `types.ts` · `quote/schema.ts` (zod per quote type) · `quote/message.ts` (template builder, omits empty fields) · `quote/whatsapp.ts` (URL encoding, `wa.me` link) · `quote/controller.ts` (tab state, live stub binding, URL param preselect) · `seo.ts` (titles, descriptions, OG, `TravelAgency` JSON-LD from known facts only) · `images.ts` (slot to file mapping) · `Picture` (markup only, styled by props) · `Icon` (one inline SVG sprite, about 15 icons) · `SkipLink`.

**Per design (`src/designs/a/`, mirrored for B where the concept needs it):**

| Component                                                                                                 | Notes                                                                                                             |
| --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `Header` + `MobileMenu`                                                                                   | Disclosure button with `aria-expanded`, focus trap off (it is a disclosure, not a modal), closes on Escape        |
| `Footer`                                                                                                  | Four columns, copyright, "Back to top"                                                                            |
| `FloatingWhatsApp`                                                                                        | Bottom right, 56 px, label "Chat on WhatsApp", stays clear of the footer's last link                              |
| `Hero`                                                                                                    | Split, photo right                                                                                                |
| `QuoteCard`                                                                                               | Boarding pass: tablist, three forms, perforated stub, live preview                                                |
| `TrustBar`                                                                                                | Four items from content                                                                                           |
| `ServiceCard`                                                                                             | Photo, icon badge, checklist, CTA that sets the tab                                                               |
| `Steps`                                                                                                   | Four steps                                                                                                        |
| `DestinationCard` + `NoteBar`                                                                             | Selects Visa tab and destination                                                                                  |
| `Testimonials`                                                                                            | Built, off by default (`features.testimonials = false`)                                                           |
| `AboutBlock`, `CtaBand` (flight-path line art, inline SVG), `PlaceholderImage` (styled slot with caption) |
| Inner page parts                                                                                          | `PageHeader`, `IncludedList`, `DoesDoesNot` (visa), `RequirementsPlaceholder`, `ContactMethods`, `MapPlaceholder` |

Each component stays under about 150 lines; repeated markup comes from `site.ts` arrays.

## 6. Logo placement

| Placement                       | File                                                                                                                                                                  | Why                                                                                                                                                                                                                                                                                                                |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Nav on white                    | **Interim:** Logo A, cropped to the "TARLEY TRAVEL LLC" wordmark area (pixel crop only; no recolor, no redraw), shown at 40 px tall. **Final:** horizontal SVG lockup | The mockup nav shows only the wordmark. Logo A's full stacked lockup is unreadable at nav height. Logo B is horizontal but has a photo background and is 670 px wide. **Needs your OK: is a straight crop of Logo A acceptable as "not altering"?** If not, I use the full Logo A at 64 px and it will look small. |
| Footer on navy                  | **Interim:** Logo A wordmark crop on a white rounded plate. **Final:** reversed SVG                                                                                   | Both files have navy lettering on light grounds; on navy they disappear. The plate keeps them unaltered. Flagged for a reversed SVG.                                                                                                                                                                               |
| Favicon set                     | Logo A, cropped to the T-globe mark                                                                                                                                   | Only Logo A has the mark at enough resolution (about 650 px source). I will render it at 16 px in Phase 1 and show you; if it turns to mush, I ask for a simplified mark rather than redrawing one.                                                                                                                |
| Social preview (OG, 1200 x 630) | Full Logo A centered on white                                                                                                                                         | High-res and complete, including the tagline.                                                                                                                                                                                                                                                                      |
| Logo B                          | Not used in production                                                                                                                                                | Photo background and low resolution. Kept in `reference/`.                                                                                                                                                                                                                                                         |

## 7. Design B directions

Fixed for all three: same logo, navy and gold, every page and its content, the quote flow and templates, the honesty rules and the budgets. None reuses A's split hero, boarding-pass card, photo-topped card grid or section order.

### Direction 1: Departures (recommended)

The site reads like the departures board at Roberts International: a clear, honest list of where you can go, and what Tarley does for each. The homepage hero is the board itself, navy panel, gold characters, one row per destination: _Destination / What we help with / Ask_. Tapping a row opens the quote form inline below it with that destination already filled in, so the board is both the hero and the quote entry. The rest of the page is white and quiet, with the board's row grammar reused for services and steps. The board never shows times, gates, prices or "on time": nothing Tarley has not confirmed. Photos appear as wide, single-strip "window" crops between sections, not on cards.

- **Type:** Big Shoulders Display 700 (board characters and headings; a signage face with real character, clear at 15 px and up), Atkinson Hyperlegible 400/700 (body; designed for low-vision legibility, which also suits small cheap screens).
- **Palette in proportion:** white 65%, navy 25% (board panels, footer), gold 8% (board text, primary buttons), cream 2% (form ground).
- **Memorable element:** the board rows flip in once on load (one CSS animation, 600 ms, skipped under reduced motion), and each row is a real button that opens its quote.
- **Risks:** a board can feel like an airline, not an agency, so copy has to keep saying "we help you"; a dark block on a light page needs care (the taste skill flags random dark sections), so navy is used only for the board system, consistently; Big Shoulders must stay at 18 px and up for body-adjacent text.

```
+------------------------------------------------------+
| [logo]                      Menu   [WhatsApp us]     |
+------------------------------------------------------+
| Where are you going?                                 |
| Flights, visas and arrivals, from Monrovia.          |
|                                                      |
| +--------------------------------------------------+ |
| | DEPARTING MONROVIA (ROB)            (navy board) | |
| |--------------------------------------------------| |
| | United States   Flights, visa      [Ask  >]      | |
| | United Kingdom  Flights, visa      [Ask  >]      | |
| | Canada          Flights, visa      [Ask  >]      | |
| | Schengen Area   Flights, visa      [Ask  >]      | |
| | UAE             Flights, visa      [Ask  >]      | |
| | China           Flights, visa      [Ask  >]      | |
| | Somewhere else  Tell us            [Ask  >]      | |
| |--------------------------------------------------| |
| | ARRIVING IN LIBERIA  Pickup, hotel, driver [Ask] | |
| +--------------------------------------------------+ |
|   (tapping a row expands the quote form here)        |
+------------------------------------------------------+
| [wide photo strip: aircraft at ROB]                  |
+------------------------------------------------------+
| How it works   1 Tell us  2 Options  3 Pay  4 Fly    |
|                (single horizontal rule, row grammar) |
+------------------------------------------------------+
| What we do     Flights & hotels ............ [Read]  |
|                Visa assistance ............. [Read]  |
|                Liberia concierge ........... [Read]  |
+------------------------------------------------------+
| Why people use Tarley (trust items as plain list)    |
| About + office details + team photo slot             |
+------------------------------------------------------+
| footer (navy)                                        |
+------------------------------------------------------+
```

(The board labels above are drawn in caps only in this sketch; on the site they are sentence case, per the copy rules. Arrows are drawn here as layout hints, not appended to link text.)

### Direction 2: The passport

Every page is laid out as a passport spread: a page number in the corner, a fine guilloche line pattern on the cream ground, and services shown as round visa-style stamps in navy and gold. The quote form is styled as an application form with boxed fields. The footer carries a machine-readable-zone style line with the company name.

- **Type:** Fraunces 600 (headings), Public Sans 400/600 (body), IBM Plex Mono only in the MRZ footer line.
- **Palette:** cream 60%, navy 25%, gold 10%, white 5%.
- **Memorable element:** the stamp lands on the service you pick in the quote form.
- **Risks:** skeuomorphism can look like a toy, and borrowing passport visuals near a visa service could read as official, which is a trust and honesty problem; cream plus serif is the most common generated look; guilloche SVGs cost bytes.

```
+---------------------------------------------+
| [logo]                    p. 01   [WhatsApp]|
| Your travel documents, in order.            |
| (o) Flights  (o) Visa  (o) Concierge  stamps|
| [application-style quote form]              |
| --- p. 02: How it works -------------------|
| --- p. 03: Destinations (stamp grid) -------|
| --- p. 04: About ---------------------------|
| <<<TARLEY<TRAVEL<LLC<<MONROVIA<<<<<<<<<<<<< |
+---------------------------------------------+
```

### Direction 3: Route map

A single, simplified line map (Africa, Europe, the Americas, the Gulf, East Asia) with Monrovia at the center and gold arcs to the six visa destinations. The map is the hero and the destination picker; on phones it becomes a vertical list with a small map above.

- **Type:** Newsreader 600 (headings), Atkinson Hyperlegible (body).
- **Palette:** white 75%, navy 15% (land and type), gold 10% (routes).
- **Memorable element:** tapping a destination draws its arc and opens the quote.
- **Risks:** arcs imply direct flights that may not exist; the map is weak at 360 px, which is where most visitors are; a geographically honest SVG map is 20 to 40 KB.

**Recommendation: Direction 1.** It works best on the phones most visitors use (a list is the natural mobile shape), it puts the quote action in the hero for every destination, it is cheap (text, CSS and one animation), and it grows straight out of a place every Tarley customer stands in. Direction 2 carries a real risk of looking official near visa paperwork. Direction 3 is beautiful on desktop and weakest on mobile.

## 8. WhatsApp templates

Empty fields are left out. Footer line on all three: `Sent from tarleytravel.com`.

```
Hello Tarley Travel, I'd like a flight quote.
From: Monrovia (ROB)
To: {to}
Departure: {departure}
Return: {return}
Travelers: {travelers}
Sent from tarleytravel.com
```

```
Hello Tarley Travel, I'd like help with a visa.
Destination: {destination}
Reason for travel: {reason}
Planned travel month: {month}
Sent from tarleytravel.com
```

```
Hello Tarley Travel, I'm planning a trip to Liberia.
Arrival date: {arrival}
Services needed: {services}
Sent from tarleytravel.com
```

Reason options: tourism, visiting family, study, business, other. Concierge services: airport pickup, hotel or guesthouse, car with driver, day trips. Submit labels: "Send flight request on WhatsApp", "Send visa request on WhatsApp", "Send arrival request on WhatsApp". Only "To" (flight), "Destination" (visa) and "Arrival date" (concierge) are required, which keeps a complete request under 60 seconds.

## 9. Phases and gates

Every build phase runs the loop in the brief: build, audit (fresh sub-agent), fix, re-run, report, commit, ask for approval.

| Phase                  | Deliverables                                                                                                                                                                                                                               | Must pass, in addition to the standard checklist                                                                                        |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| 0 Plan                 | This file, `reference/`                                                                                                                                                                                                                    | Your approval of D1 to D6                                                                                                               |
| 1 Foundation           | Scaffold, tokens, fonts, `site.ts` with placeholders, `PLACEHOLDERS.md` (generated from `site.ts`), header/footer/floating button, logos and favicon set, Playwright + axe + Lighthouse CI scripts, `_headers`, `.claude/skills/` installs | Empty-shell page under 20 KB JS; favicon at 16 px shown to you; CSP passes with no inline-script exceptions                             |
| 2 Design A home        | All 12 sections, photo slots (Unsplash via MCP), `CREDITS.md`, responsive at all six widths                                                                                                                                                | Side-by-side with mockup at 1440 and 390; hero image under 150 KB; LCP under 2.5 s throttled                                            |
| 3 Quote flow           | Tabs, validation, live stub, message builder, CTA and destination preselect, URL params                                                                                                                                                    | Vitest on all templates; Playwright for all three quote types including keyboard-only runs; generated `wa.me` URLs decoded and asserted |
| 4 Design A inner pages | Six pages, six visa pages, 404                                                                                                                                                                                                             | No requirement lists anywhere; every placeholder tracked                                                                                |
| 5 Design B             | Approved direction on every `/b/` page                                                                                                                                                                                                     | Same checks as A, plus `noindex` on every page; deleting the B folders still builds                                                     |
| 6 Launch readiness     | Titles, descriptions, OG images, sitemap, robots, JSON-LD, perf pass, credits                                                                                                                                                              | Lighthouse 90/100/100/100 mobile on every page; JSON-LD validates with no `aggregateRating`                                             |
| 7 QA and handover      | Full audit both designs, HD screenshots, `screenshots/index.html`, `REPORT.md`                                                                                                                                                             | Every Definition of Done box checked                                                                                                    |

Standard checks each phase: `astro check` (types), ESLint 0/0, Prettier, build, Vitest, Playwright, axe (0 serious or critical), Lighthouse mobile on touched pages, no horizontal scroll 360 to 1440, JS and image budgets measured from the build output.

## 10. Risks and open questions

**Risks**

1. **Photos.** Free stock cannot show Monrovia or Roberts International honestly, and several mockup captions ask for exactly that ("aircraft on the apron at Roberts International", "a real Liberian location"). I will use generic aircraft, passport and document shots where they fit, never label them as Liberia, and keep styled placeholders with the caption visible for Liberia-specific and team slots. The site will look emptier than the mockup until Tarley sends real photos.
2. **Trust bar items depend on placeholders.** "Registered in Liberia [REG. NUMBER]" and the payment methods are unconfirmed. Showing a bracketed placeholder on a live site hurts trust; launching without them is better than inventing them. Each one can be switched off in `site.ts`.
3. **Email domain.** The given address is `info@tarleytravelllc.com` (three l's). That is "tarleytravel" plus "llc". I will use it exactly, but please confirm the triple l is intended and that the website will live on the same domain, since it also goes into the WhatsApp template footer and the canonical URLs.
4. **Slow data.** Three font families for Design A is about 90 to 120 KB of WOFF2 even subset. I will subset hard and load Cinzel only for the step numbers (or replace it with Playfair numerals if it costs too much, and report that).
5. **Floating button vs. form.** On small phones the floating WhatsApp button can cover the quote submit button; it will hide while the quote form is in view.

**Questions for Tarley**

1. Do you have a business registration number you want shown, and which payment methods are confirmed today?
2. Office address and opening hours, and typical reply time on WhatsApp?
3. Facebook and Instagram URLs for the footer (the mockup shows both)?
4. Is there a domain already, and is `tarleytravelllc.com` it?
5. Should the six visa destinations be exactly those six, in that order?
6. Do you want the optional `/privacy` page?
