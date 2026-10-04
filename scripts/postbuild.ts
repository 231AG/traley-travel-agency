/**
 * Runs after `astro build`:
 * - writes dist/_headers for Cloudflare Pages, with a CSP that allows only the
 *   exact inline <style> blocks Astro emitted (by hash), no inline scripts
 * - writes dist/robots.txt
 * - fails the build if any page has an inline executable script
 */
import { createHash } from "node:crypto";
import { readFile, readdir, writeFile } from "node:fs/promises";
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

const headers = `/*
  Content-Security-Policy: ${csp}
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
  Cross-Origin-Opener-Policy: same-origin

/_astro/*
  Cache-Control: public, max-age=31536000, immutable

/img/*
  Cache-Control: public, max-age=2592000

/brand/*
  Cache-Control: public, max-age=2592000
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${business.url}/sitemap-index.xml
`;

await writeFile(path.join(DIST, "_headers"), headers);
await writeFile(path.join(DIST, "robots.txt"), robots);
console.log(`postbuild: _headers (${styleHashes.size} style hashes) and robots.txt written`);
