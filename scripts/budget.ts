/**
 * Measures what each built page costs on first load and fails over budget:
 * - JavaScript: every module script plus its static imports, gzipped (< 100 KB)
 * - Hero/priority image: the largest eagerly loaded image candidate (< 150 KB)
 */
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { gzipSync } from "node:zlib";

const DIST = "dist";
const JS_BUDGET = 100 * 1024;
const HERO_BUDGET = 150 * 1024;

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

async function jsClosure(entry: string, seen: Set<string>): Promise<void> {
  if (seen.has(entry)) return;
  seen.add(entry);
  const code = await readFile(path.join(DIST, entry), "utf8");
  for (const match of code.matchAll(/(?:import|from)\s*["']([^"']+\.js)["']/g)) {
    const spec = match[1];
    if (spec) await jsClosure(path.posix.join(path.posix.dirname(entry), spec), seen);
  }
}

const rows: string[] = [];
let failed = false;

for (const file of (await htmlFiles(DIST)).sort()) {
  const html = await readFile(file, "utf8");
  const seen = new Set<string>();
  for (const match of html.matchAll(/<script[^>]*type="module"[^>]*src="([^"]+)"/g)) {
    if (match[1]) await jsClosure(match[1], seen);
  }
  let jsBytes = 0;
  for (const script of seen) jsBytes += gzipSync(await readFile(path.join(DIST, script))).length;

  let heroBytes = 0;
  const eager = html.match(
    /<picture>(?:(?!<\/picture>)[\s\S])*fetchpriority="high"[\s\S]*?<\/picture>/,
  );
  if (eager) {
    const candidates = [...eager[0].matchAll(/(\/img\/[^\s",]+\.(?:avif|webp))/g)].map(
      (m) => m[1] ?? "",
    );
    for (const candidate of candidates) {
      const size = (await stat(path.join(DIST, candidate))).size;
      heroBytes = Math.max(heroBytes, size);
    }
  }
  const htmlGz = gzipSync(html).length;
  const over = jsBytes > JS_BUDGET || heroBytes > HERO_BUDGET;
  failed ||= over;
  rows.push(
    `${over ? "FAIL" : "ok  "} ${path.relative(DIST, file).padEnd(36)} js ${(jsBytes / 1024).toFixed(1).padStart(5)} KB gz   html ${(htmlGz / 1024).toFixed(1).padStart(5)} KB gz   hero ${(heroBytes / 1024).toFixed(0).padStart(4)} KB`,
  );
}

console.log(rows.join("\n"));
if (failed) process.exit(1);
