/**
 * Copies dist/ into a folder that works from any sub-path (for a hosted preview):
 * root-relative URLs ("/visa", "/_astro/x.css", "/img/y.avif") become relative file
 * paths ("../visa.html", "../_astro/x.css"). Usage: tsx scripts/preview.ts <out-dir>
 */
import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const DIST = "dist";
const out = process.argv[2];
if (!out) throw new Error("Usage: tsx scripts/preview.ts <out-dir>");
const SKIP = new Set(["_headers", "robots.txt", "sitemap-index.xml", "sitemap-0.xml"]);

async function files(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const full = path.join(dir, entry.name);
      return entry.isDirectory() ? files(full) : Promise.resolve([full]);
    }),
  );
  return nested.flat();
}

/** "/visa/canada#x" -> "visa/canada.html#x"; "/" -> "index.html"; "/_astro/a.js" stays a file path. */
function toFile(url: string): string {
  const [pathPart = "", hash = ""] = url.split("#");
  let target = pathPart.replace(/^\//, "");
  if (target === "") target = "index.html";
  else if (!path.posix.extname(target)) target = `${target.replace(/\/$/, "")}.html`;
  return hash ? `${target}#${hash}` : target;
}

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

for (const file of await files(DIST)) {
  const relative = path.relative(DIST, file);
  if (SKIP.has(relative)) continue;
  const target = path.join(out, relative);
  await mkdir(path.dirname(target), { recursive: true });
  if (!relative.endsWith(".html")) {
    await cp(file, target);
    continue;
  }
  const depth = relative.split(path.sep).length - 1;
  const up = "../".repeat(depth);
  const local = (url: string) => `${up}${toFile(url)}`;
  let html = await readFile(file, "utf8");
  // href / src attributes pointing at this site (not protocol-relative //host).
  html = html.replace(
    /\b(href|src)="(\/(?!\/)[^"]*)"/g,
    (_m, attr: string, url: string) => `${attr}="${local(url)}"`,
  );
  // srcset lists: "/img/a-480.avif 480w, /img/a-800.avif 800w"
  html = html.replace(
    /\bsrcset="([^"]*)"/g,
    (_m, list: string) =>
      `srcset="${list.replace(/(^|,\s*)(\/(?!\/)[^\s,]+)/g, (_x, sep: string, url: string) => `${sep}${local(url)}`)}"`,
  );
  // url(/_astro/font.woff2) inside inlined CSS.
  html = html.replace(
    /url\((["']?)(\/(?!\/)[^)"']+)\1\)/g,
    (_m, q: string, url: string) => `url(${q}${local(url)}${q})`,
  );
  await writeFile(target, html);
}

console.log(`Preview copy written to ${out}`);
