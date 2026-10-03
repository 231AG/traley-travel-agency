# Tarley Travel website build

## Role and project brief

You are a senior full-stack engineer and product designer. Build the marketing website for Tarley Travel LLC, a travel agency in Monrovia, Liberia, starting from this empty repo. You will build two complete designs of the same site (Design A and Design B) so the owner can compare them.

**The business.** Three services: flights and hotels, visa assistance, and a Liberia concierge for people arriving in the country (airport pickup, hotels, car with driver, day trips). Packages (holiday, honeymoon, group) are on request only.

**The audience.** Liberians traveling abroad, diaspora coming home, and first-time visitors. Most visit on phones, often on slow or expensive mobile data.

**The site's one job.** Get a visitor to trust Tarley enough to send a quote request on WhatsApp. There is no online payment and no account system. Quotes go to WhatsApp as a prefilled message.

**Success criteria.**

- A visitor can send a complete quote request in under 60 seconds on a phone.
- Every page is fast on a slow mobile connection (budgets in the audit checklist).
- Nothing on the site states a fact Tarley has not confirmed.

**Known facts (use these exactly).**

| Item | Value |
| --- | --- |
| Legal name | Tarley Travel LLC |
| Phone and WhatsApp | +231 886 504 519 |
| Email | info@tarleytravelllc.com |
| City | Monrovia, Liberia |
| Tagline | Travel. Explore. Experience. |
| Main airport | Roberts International Airport (ROB) |

Everything else is unknown and becomes a placeholder (see "Content and honesty rules").

## Inputs

The mockup is the source of truth for Design A; the logos are fixed brand assets you may place but never alter.

**`reference/mockup-design-a.png`** is the approved homepage. Recreate its layout, hierarchy, palette, type and copy faithfully. Where your audit finds a real problem (contrast, readability, responsiveness, performance), fix it and record the deviation with a reason. Inner pages do not exist in the mockup: design them in the same language.

**`reference/logo-a.png` and `reference/logo-b.png`** are two variations of Tarley's logo.

- In the plan, say which variation goes where (nav on white, footer on navy, favicon, social preview image) and why. Using both is fine.
- Do not redraw, recolor, stretch or "clean up" either logo. If a file is too low-resolution for its placement, flag it and ask for an SVG instead of tracing one.
- Generate the favicon set (`favicon.ico`, 32px, 180px Apple touch icon, 192px and 512px PWA icons) from whichever variation stays legible at 16px.

**Photos.** There are no Tarley photos yet. Every photo slot in the mockup carries a caption describing the shot it needs. For each slot:

- If network access allows, use a free-license stock photo (Unsplash or Pexels) that matches the caption, and record photographer, source URL and license in `CREDITS.md`.
- Never use AI-generated people presented as Tarley staff or clients, and never label a skyline or beach as Liberia unless it is verifiably in Liberia.
- If no suitable photo is available, keep a styled placeholder with the caption visible, so the gap is obvious.
- All images are swappable from one content file.

## Skills

Before planning anything, find out which skills you actually have, use the best ones for each phase, and report every skill as used or not used with a reason.

**1. Inventory.** List every skill and plugin available to you: user skills (`~/.claude/skills/`), project skills (`.claude/skills/`), and installed plugins (`/plugin`). Read the `SKILL.md` of each one that could plausibly apply before deciding.

**2. Expected candidates.** These are believed to be installed; confirm each one exists before relying on it.

| Skill | Likely use |
| --- | --- |
| `frontend-design` | Aesthetic direction, typography and layout decisions for both designs |
| `design-taste-frontend` | Anti-template checks, pre-flight review of each page |
| `design:design-system` | Turning the mockup into tokens and component specs |
| `design:accessibility-review` | WCAG 2.2 AA audit at the end of every phase |
| `design:design-critique` | Visual audit of each phase against the mockup |
| `design:ux-copy` | Buttons, form labels, errors, empty states, WhatsApp message templates |
| `full-output-enforcement` | No placeholders or truncated code in source files |
| `minimalist-ui`, `industrial-brutalist-ui` | Candidate directions for Design B only; pick at most one and justify it |
| `redesign-existing-projects` | Expected not used: the repo starts empty |

**3. Install what is missing.** At minimum you need a skill for driving a real browser to test pages and capture screenshots (for example `webapp-testing` from Anthropic's official skills repository, with Playwright). Install only from Anthropic's official repository or plugin marketplace, or another source the owner approves. Check the current install command in the docs rather than guessing. List proposed installs in the plan and install them only after approval.

**4. Report.** The plan must open with this table, and the final report must repeat it with what actually happened:

| Skill | Source | Status | Phases | Reason |
| --- | --- | --- | --- | --- |
| example | user / project / plugin / installed | Used / Not used / Installed | 2, 5 | One line on why |

Every available skill appears in the table, including the ones you are not using.

## Working rules

Plan first, then build one phase at a time, and never start the next phase without the owner's explicit approval.

**Phase 0 is planning only: write no code.** The plan contains:

1. The skills table (see "Skills").
2. Stack confirmation, and any deviation from the stack below with a reason.
3. Sitemap and the URL scheme for Design A and Design B.
4. The design tokens extracted from the mockup (colors, type scale, spacing, radii, shadows).
5. A component inventory, marking what is shared and what is per-design.
6. Two or three Design B directions, each with a one-paragraph concept and an ASCII wireframe of the homepage, with your recommendation.
7. The phase breakdown with deliverables, and the checks each phase must pass.
8. Risks and open questions for the owner.

Then stop and wait. Do not proceed on silence, and do not treat a question as approval.

**Every build phase follows the same loop:**

1. Build the phase.
2. Audit it like a senior engineer reviewing someone else's pull request, using the audit checklist. Use a fresh sub-agent for the audit if you can start one.
3. Fix everything you found, then re-run every check.
4. Report, using this format: what was built; an audit table (issue, severity, fix, status); check results (typecheck, lint, build, tests, Lighthouse, axe); screenshots of the pages the phase touched; known gaps; what the next phase will do.
5. Commit with a conventional commit message, then ask for approval.

**General rules.**

- If you are blocked or a requirement is ambiguous, ask instead of guessing.
- Never invent business facts (see "Content and honesty rules").
- Keep the owner's time in mind: reports are skimmable, findings come first, no padding.

## Tech stack and architecture

Next.js with TypeScript and Tailwind CSS, built as a static site and deployed to Cloudflare, with both designs sharing one content layer.

| Area | Choice |
| --- | --- |
| Framework | Next.js (App Router), static export (`output: 'export'`); no server needed for the MVP |
| Language | TypeScript, `strict: true`, no `any` |
| Styling | Tailwind CSS with the design tokens as theme values; no hard-coded hex values in components |
| Fonts | `next/font`, self-hosted and subset: Playfair Display (headings), Poppins (body), Cinzel (step numbers and accents) |
| Images | Pre-optimized at build time to AVIF and WebP at responsive widths (a `sharp` script), with explicit width and height |
| Quote flow | Client-side form that builds a `https://wa.me/231886504519?text=` link with a URL-encoded message; validation with `zod` |
| Content | One typed file (`src/content/site.ts`) holding all copy, contact details, services, visa destinations and image slots |
| Quality | ESLint, Prettier, Playwright (smoke tests and screenshots), axe-core, Lighthouse CI |
| Hosting | Cloudflare Pages, security headers in a `_headers` file |
| Analytics | Cloudflare Web Analytics snippet behind a config flag, off by default |

**Two designs in one app.** Content, form logic, the WhatsApp link builder and types are shared. Presentation lives in `src/designs/a/` and `src/designs/b/`. Design A is served at `/` and Design B mirrors every page under `/b/`, so the owner can switch by changing the URL. Design B must be removable later by deleting one folder and one route group.

**WhatsApp message templates** (one per quote type; empty fields are left out):

```
Hello Tarley Travel, I'd like a flight quote.
From: Monrovia (ROB)
To: {to}
Departure: {departure}
Return: {return}
Travelers: {travelers}
Sent from tarleytravelllc.com
```

Write matching templates for visa (destination, reason, travel month) and concierge (arrival date, services needed).

## Pages and Design A spec

Build seven pages plus six visa destination pages; the homepage follows the mockup section by section. Propose changes to this sitemap in the plan if you see a better one.

| Page | URL | Contents |
| --- | --- | --- |
| Home | `/` | As in the mockup |
| Flights & hotels | `/flights-hotels` | What's included, how pricing works, quote form on the Flights tab |
| Visa assistance | `/visa` | What Tarley does and does not do, the destination grid, quote form on the Visa tab |
| Visa destination | `/visa/[country]` | One template, six pages: US, UK, Canada, Schengen Area, UAE, China. Visa types plus a requirements placeholder (never invented requirements) and a CTA |
| Liberia concierge | `/concierge` | Arrival services, quote form on the Concierge tab |
| About | `/about` | Company story placeholder, office details, team photo slot |
| Contact | `/contact` | WhatsApp, phone, email, office, hours, map placeholder |
| Not found | `/404` | Plain language plus links to the three services |

**Design tokens (from the mockup).**

| Token | Value | Use |
| --- | --- | --- |
| navy | #0B1F4D | Primary: hero, headings, dark buttons |
| navy-deep | #071536 | Footer |
| royal | #1E3A8A | Links on light backgrounds |
| gold | #D4A537 | Primary buttons and accents only, always with navy text |
| gold-text | #9A7414 | Gold text and icons on light backgrounds (passes contrast) |
| cream | #F7F5EF | Alternating section backgrounds |
| border | #DDE1EA | Card and input borders |
| ink | #1A2238 | Body text |
| muted | #3D475C | Secondary text (no lighter grays for text) |

Type: Playfair Display 600 for headings, Poppins 400/500/600 for everything else, Cinzel 700 for step numbers. Body text is 17px, and no text is smaller than 15px anywhere.

**Homepage sections, in order.**

1. Nav: logo, Services, Visa, How it works, About, Contact, and a gold "WhatsApp us" button. On mobile it collapses into an accessible menu.
2. Hero: photo filling the right side behind the content, headline "Travel from Liberia without the guesswork.", subhead, two CTAs, and a location line.
3. Quote card styled as a boarding pass: Flights / Visa / Concierge tabs; a perforated stub that updates live with what the user enters; the submit label changes per tab; "No payment needed to get a quote." beneath it.
4. Trust bar: four items with icons (registered business, full price up front, receipts and payment methods, real people in Monrovia).
5. Services: three cards, each with a photo on top, an overlapping icon badge, a checklist, and a button that scrolls to the quote card with the matching tab selected.
6. How it works: four numbered steps.
7. Visa destinations: six cards; clicking one selects the Visa tab and that destination. A note bar below says requirements change and Tarley checks the current list.
8. Testimonials: built, but hidden behind a config flag that is off until real quotes exist.
9. About: text, office details and a team photo slot.
10. Final CTA band with the dotted flight-path line art.
11. Footer: Services, Company, Contact and Follow columns, then copyright and "Back to top".
12. Floating WhatsApp button, bottom right, on every page.

**Behavior.** Breakpoints are checked at 360, 390, 768, 1024, 1280 and 1440px, with no horizontal scrolling at any of them. Allow one page-load animation in the hero and nothing else unprompted. Respect `prefers-reduced-motion`. Every interactive element is a real `button`, `a` or form control, with visible focus and a target of at least 44px.

## Design B

Design B is a genuinely different site built on the same brand, content and functionality, so the comparison tests design rather than features.

**Fixed (same as Design A):** Tarley's logo, navy and gold as the brand colors, every page and its content, the WhatsApp quote flow and its templates, the honesty rules, and every performance and accessibility budget.

**Must change:** the layout concept, typographic voice, how color is proportioned, the imagery treatment, and the signature interaction. Design B must not reuse Design A's split hero, its boarding-pass quote card, its photo-topped card grid, or its section order unless you justify keeping one.

**In the plan, propose two or three directions.** Each one gets a name, the idea in one paragraph, its typefaces (none of Inter, Roboto or Arial), the palette in proportions, an ASCII wireframe of the homepage, its one memorable element, and its risks. Directions can grow from the subject; for example, airport departure-board signage, the passport and visa stamp as a document system, or a route map of where Liberians travel. Gimmicks that cost performance or accessibility fail the budgets.

Recommend one direction and build only the approved one. Run every design skill check on it, exactly as on Design A.

## Content and honesty rules

The site handles people's passports and money, so it states only confirmed facts; everything else is a visible, tracked placeholder.

**Never invent:** testimonials, names, star ratings or review counts; licenses, registrations, IATA or airline affiliations; founding year, client counts or any statistic; team members or their photos; visa requirements, fees or processing times; prices or discounts; office address or hours.

**Placeholders** use square brackets in capitals, such as `[OFFICE ADDRESS]`, `[REG. NUMBER]`, `[OPENING HOURS]`, `[REPLY TIME]` and `[ABOUT: 2–3 sentences from Tarley]`. They all live in `src/content/site.ts`. Generate `PLACEHOLDERS.md` listing each one, every page it appears on, and what Tarley must supply. Payment methods (Orange Money, MTN MoMo, bank transfer) are marked as needing confirmation.

**Visa pages** show visa types and a clearly marked requirements placeholder, the line "Requirements change. We check the current list with you before you start.", and a CTA. Write no requirement lists from memory.

**Copy style:** sentence case, active voice, plain words, American English. No emoji, no arrows appended to links, no all-caps labels above headings, and no single highlighted word in a headline. CTAs say exactly what happens, for example "Send flight request on WhatsApp".

**SEO and structured data:** a unique title and description per page; Open Graph images; `sitemap.xml` and `robots.txt`. Use schema.org `TravelAgency` with known facts only; do not add `aggregateRating` until real reviews exist. Design B pages carry `noindex`.

## Build phases

There are eight phases, each ending in the audit loop and an approval gate. Adjust the split in your plan if needed, but keep the gates.

0. **Plan.** No code (see "Working rules").
1. **Foundation.** Scaffold Next.js, TypeScript, Tailwind, ESLint and Prettier. Add tokens, fonts, the content layer with placeholders, the shared layout (nav, footer, floating WhatsApp button), the logo and favicon set, Playwright, axe and Lighthouse scripts, and `_headers`.
2. **Design A homepage.** Every section from the mockup, with photo slots and responsive behavior.
3. **Quote flow.** The tabbed form, validation, the live stub, WhatsApp link building and templates, CTA-to-tab preselection, and Playwright tests for all three quote types.
4. **Design A inner pages.** All the remaining pages, the visa destination template, and the 404 page.
5. **Design B.** The approved direction across every page under `/b/`, reusing the shared logic.
6. **Launch readiness.** SEO metadata, Open Graph images, sitemap, robots, structured data, a final performance pass, and image credits.
7. **Final QA and handover.** A full audit of both designs, the HD screenshots, the comparison sheet, and the final report.

## Audit checklist (every phase)

A phase passes only when every line below is met or a deviation is written up with a reason. Report results in the audit table.

| Area | Pass criteria |
| --- | --- |
| Build | `tsc --noEmit` 0 errors; ESLint 0 errors and 0 warnings; production build succeeds; all Playwright tests pass |
| Code quality | No `any`; no dead code or commented-out blocks; repeated markup driven by data; components under about 150 lines; clear names; no hard-coded colors or copy in components |
| Design fidelity | Side-by-side with the mockup at 1440px and 390px; every deviation listed with a reason |
| Responsive | No horizontal scroll from 360px to 1440px; navigation and forms usable one-handed on a phone |
| Accessibility | WCAG 2.2 AA; axe reports 0 serious or critical issues; contrast 4.5:1 for text (3:1 at 24px and up); visible focus; full keyboard path through the quote flow; labeled inputs; alt text; 44px targets; reduced motion respected |
| Performance | Lighthouse mobile: Performance at least 90, Accessibility 100, Best Practices 100, SEO 100. LCP under 2.5s and CLS under 0.1 on throttled mobile. First-load JS under 100 KB gzipped per page. Hero image under 150 KB |
| Content | No invented facts; every placeholder is in `PLACEHOLDERS.md`; copy follows the style rules |
| Security | No secrets in the repo; `rel="noopener noreferrer"` on external links; security headers present (CSP, HSTS, X-Content-Type-Options, Referrer-Policy) |
| Design skills | Run the design-critique, accessibility-review and taste checks from the skills you selected, and act on their findings |

Write the audit as a reviewer who wants to find problems: what would break on a cheap Android phone on slow data, and what would make a first-time visitor distrust the site.

## Final deliverables

The handover is HD screenshots of every page in both designs, a side-by-side comparison sheet, and a final report.

**HD screenshots.** Capture them with Playwright against the production build:

- Every page in Design A and Design B, including each visa destination page and the 404 page.
- Desktop at 1440px wide with `deviceScaleFactor: 2`, and mobile at 390px with `deviceScaleFactor: 3`.
- For each, one full-page shot and one above-the-fold shot.
- Wait for fonts and images to load, and disable animations before capturing.
- Save to `screenshots/{design-a|design-b}/{desktop|mobile}/{page}-{full|fold}.png`.
- Generate `screenshots/index.html`: a gallery showing A and B side by side for each page.

Then show the screenshots in the session if your interface can display images, and always list the paths.

**Final report** (`REPORT.md`, also summarized in chat):

1. The skills table, final version: used, not used, installed, and why.
2. What was built, and how to run, build and deploy it to Cloudflare Pages.
3. Final check results for both designs (Lighthouse, axe, tests).
4. All deviations from the mockup, with reasons.
5. The placeholder list Tarley must fill, from `PLACEHOLDERS.md`.
6. Known issues and recommended next steps.
7. Your recommendation on Design A versus Design B, with reasons tied to trust, conversion and performance. The owner decides.

**Definition of done.**

- [ ] Both designs complete on every page, with the quote flow working on every quote type
- [ ] Every audit line passes for both designs
- [ ] Screenshots, gallery, `REPORT.md`, `PLACEHOLDERS.md` and `CREDITS.md` delivered
- [ ] No invented facts anywhere on the site
- [ ] Clean git history, one or more commits per phase
