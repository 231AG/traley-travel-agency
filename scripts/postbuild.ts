/**
 * Runs after `astro build`:
 * - writes dist/_headers for Cloudflare Pages, with a CSP that allows only the
 *   exact inline <style> blocks Astro emitted (by hash), no inline scripts
 * - writes dist/robots.txt
 * - fails the build if any page has an inline executable script
 */
import { createHash } from "node:crypto";
import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { analytics, business, features } from "../src/content/site";

const DIST = "dist";

async function htmlFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return htmlFiles(full);
      return Promise.resolve(entry.name.endsWith(".html") ? [full] : []);
    }),
  );
  return nested.flat();
}

const styleHashes = new Set<string>();
const inlineScriptPages: string[] = [];

for (const file of await htmlFiles(DIST)) {
  const html = await readFile(file, "utf8");
  for (const match of html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) {
    const body = match[1] ?? "";
    styleHashes.add(`'sha256-${createHash("sha256").update(body).digest("base64")}'`);
  }
  for (const match of html.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>/g)) {
    const attrs = match[1] ?? "";
    if (!/type="application\/ld\+json"/.test(attrs)) inlineScriptPages.push(file);
  }
}

if (inlineScriptPages.length > 0) {
  console.error(`Inline scripts found (CSP would block them):\n${inlineScriptPages.join("\n")}`);
  process.exit(1);
}

const analyticsOn = features.analytics && analytics.token !== "";
const csp = [
  "default-src 'self'",
  `script-src 'self'${analyticsOn ? " https://static.cloudflareinsights.com" : ""}`,
  `style-src 'self' ${[...styleHashes].join(" ")}`,
  "img-src 'self' data:",
  "font-src 'self'",
  `connect-src 'self'${analyticsOn ? " https://cloudflareinsights.com" : ""}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

/** One source of truth for response headers; rendered for each host below. */
const headerRules: { path: string; headers: Record<string, string> }[] = [
  {
    path: "/*",
    headers: {
      "Content-Security-Policy": csp,
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
      "Cross-Origin-Opener-Policy": "same-origin",
    },
  },
  { path: "/_astro/*", headers: { "Cache-Control": "public, max-age=31536000, immutable" } },
  { path: "/img/*", headers: { "Cache-Control": "public, max-age=2592000" } },
  { path: "/brand/*", headers: { "Cache-Control": "public, max-age=2592000" } },
];

/** Cloudflare (Pages and Workers static assets) and Netlify read this file format. */
const headers = headerRules
  .map((rule) =>
    [rule.path, ...Object.entries(rule.headers).map(([k, v]) => `  ${k}: ${v}`)].join("\n"),
  )
  .join("\n\n")
  .concat("\n");

const robots = `User-agent: *
Allow: /

Sitemap: ${business.url}/sitemap-index.xml
`;

await writeFile(path.join(DIST, "_headers"), headers);
await writeFile(path.join(DIST, "robots.txt"), robots);
console.log(`postbuild: _headers (${styleHashes.size} style hashes) and robots.txt written`);

// Vercel ignores _headers, so on Vercel (or with VERCEL_OUTPUT=1) the same rules are
// written as a Build Output API bundle in .vercel/output, which Vercel deploys as-is.
if (process.env["VERCEL"] || process.env["VERCEL_OUTPUT"]) {
  await writeVercelOutput();
}

async function writeVercelOutput(): Promise<void> {
  const out = ".vercel/output";
  await rm(out, { recursive: true, force: true });
  await mkdir(path.join(out, "static"), { recursive: true });
  await cp(DIST, path.join(out, "static"), { recursive: true });
  await rm(path.join(out, "static", "_headers"), { force: true });

  // Serve /about from about.html, matching the site's URLs (no trailing slash).
  const overrides: Record<string, { path: string; contentType: string }> = {};
  for (const file of await htmlFiles(DIST)) {
    const relative = path.relative(DIST, file).split(path.sep).join("/");
    if (relative === "index.html" || relative === "404.html") continue;
    overrides[relative] = {
      path: relative.replace(/\.html$/, ""),
      contentType: "text/html; charset=utf-8",
    };
  }

  const toRegex = (pattern: string) => `^${pattern.replace(/\./g, "\\.").replace(/\*/g, ".*")}$`;
  const config = {
    version: 3,
    routes: [
      // Drop trailing slashes so every page has one URL.
      { src: "^/(.+)/$", headers: { Location: "/$1" }, status: 308 },
      ...headerRules.map((rule) => ({
        src: toRegex(rule.path),
        headers: rule.headers,
        continue: true,
      })),
      { handle: "filesystem" },
      { src: "^/.*$", dest: "/404.html", status: 404 },
    ],
    overrides,
  };
  await writeFile(path.join(out, "config.json"), `${JSON.stringify(config, null, 2)}\n`);
  console.log(
    `postbuild: Vercel output written to ${out} (${Object.keys(overrides).length} clean URLs)`,
  );
}
