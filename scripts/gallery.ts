/** Writes screenshots/index.html: Design A and Design B side by side for every page. */
import { readdirSync, writeFileSync } from "node:fs";

const pages = readdirSync("screenshots/design-a/desktop")
  .filter((f) => f.endsWith("-full.png"))
  .map((f) => f.replace(/-full\.png$/, ""))
  .sort((a, b) => (a === "home" ? -1 : b === "home" ? 1 : a.localeCompare(b)));

const cell = (design: string, size: string, page: string, kind: string) =>
  `<a href="${design}/${size}/${page}-${kind}.png"><img loading="lazy" src="${design}/${size}/${page}-${kind}.png" alt="${design} ${size} ${page} ${kind}"></a>`;

const sections = pages
  .map(
    (page) => `
<section id="${page}">
  <h2>${page}</h2>
  <div class="grid">
    <div><h3>Design A, desktop</h3>${cell("design-a", "desktop", page, "fold")}</div>
    <div><h3>Design B, desktop</h3>${cell("design-b", "desktop", page, "fold")}</div>
    <div><h3>Design A, mobile</h3>${cell("design-a", "mobile", page, "fold")}</div>
    <div><h3>Design B, mobile</h3>${cell("design-b", "mobile", page, "fold")}</div>
  </div>
  <p>Full pages: <a href="design-a/desktop/${page}-full.png">A desktop</a>, <a href="design-b/desktop/${page}-full.png">B desktop</a>, <a href="design-a/mobile/${page}-full.png">A mobile</a>, <a href="design-b/mobile/${page}-full.png">B mobile</a></p>
</section>`,
  )
  .join("\n");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Tarley Travel: Design A and B</title>
<style>
  body { margin: 0; font: 16px/1.5 system-ui, sans-serif; color: #1a2238; background: #f7f5ef; }
  header, section { max-width: 1400px; margin: 0 auto; padding: 24px 16px; }
  nav a { margin-right: 12px; color: #1e3a8a; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-items: start; }
  .grid img { width: 100%; height: auto; border: 1px solid #dde1ea; background: #fff; }
  h2 { border-top: 2px solid #0b1f4d; padding-top: 16px; }
  h3 { font-size: 15px; margin: 0 0 6px; }
</style>
</head>
<body>
<header>
  <h1>Tarley Travel: Design A and Design B</h1>
  <p>Above-the-fold views side by side; full-page captures are linked under each page. Desktop at 1440 px (2x), mobile at 390 px (3x).</p>
  <nav>${pages.map((p) => `<a href="#${p}">${p}</a>`).join("")}</nav>
</header>
${sections}
</body>
</html>
`;

writeFileSync("screenshots/index.html", html);
console.log(`screenshots/index.html: ${pages.length} pages`);
