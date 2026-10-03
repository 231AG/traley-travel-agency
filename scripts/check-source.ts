/**
 * Project rules ESLint cannot see:
 * - no hard-coded colors outside the token stylesheets
 * - no TODO/FIXME or stubbed code in source
 * - copy style: no em dashes, arrows or emoji in site content
 * - every [PLACEHOLDER] in site.ts is registered for PLACEHOLDERS.md
 */
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { placeholders } from "../src/content/site";

const ROOTS = ["src"];
const TOKEN_FILES = new Set(["src/styles/tokens.css", "src/shared/brand.ts"]);
const problems: string[] = [];

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const full = path.join(dir, entry.name);
      return entry.isDirectory() ? walk(full) : Promise.resolve([full]);
    }),
  );
  return nested.flat();
}

const files = (await Promise.all(ROOTS.map(walk)))
  .flat()
  .filter((f) => /\.(astro|ts|css|json)$/.test(f));

for (const file of files) {
  const text = await readFile(file, "utf8");
  const lines = text.split("\n");
  lines.forEach((line, index) => {
    const where = `${file}:${index + 1}`;
    // Anchor links (href="#main", "/#services") are not colors; everything else with #hex is.
    const withoutAnchors = line.replace(/href=["'`{][^"'`}]*/g, "").replace(/\/#[\w-]+/g, "");
    if (!TOKEN_FILES.has(file) && /#[0-9a-fA-F]{3,8}\b/.test(withoutAnchors)) {
      problems.push(`${where} hard-coded hex color`);
    }
    if (/\b(TODO|FIXME|XXX)\b/.test(line)) problems.push(`${where} TODO marker`);
  });
}

const site = await readFile("src/content/site.ts", "utf8");
if (/—/.test(site)) problems.push("src/content/site.ts contains an em dash");
if (/[→⟶➔]/.test(site)) problems.push("src/content/site.ts contains an arrow character");
if (/(?![©®™])\p{Extended_Pictographic}/u.test(site))
  problems.push("src/content/site.ts contains emoji");

const registered = new Set(Object.values(placeholders).map((p) => p.token));
for (const match of site.matchAll(/"(\[[A-Z][A-Z .:]*[^"\]]*\])/g)) {
  const token = match[1];
  if (token && !registered.has(token))
    problems.push(`Unregistered placeholder in site.ts: ${token}`);
}

if (problems.length > 0) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log(`check-source: ${files.length} files clean`);
