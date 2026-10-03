/**
 * Minimal static server for dist/ that behaves like Cloudflare Pages for our tests:
 * extensionless URLs map to .html files, 404.html is served for missing paths
 * (nearest one up the tree), and the headers from dist/_headers are applied.
 */
import { createServer, type ServerResponse } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const DIST = path.resolve("dist");
const PORT = Number(process.env["PORT"] ?? 4321);

const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".woff2": "font/woff2",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".xml": "application/xml",
  ".txt": "text/plain",
  ".webmanifest": "application/manifest+json",
};

interface Rule {
  pattern: RegExp;
  headers: [string, string][];
}

async function loadRules(): Promise<Rule[]> {
  const text = await readFile(path.join(DIST, "_headers"), "utf8").catch(() => "");
  const rules: Rule[] = [];
  let current: Rule | undefined;
  for (const line of text.split("\n")) {
    if (line.trim() === "") continue;
    if (!line.startsWith(" ")) {
      const source = line
        .trim()
        .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
        .replace(/\*/g, ".*");
      current = { pattern: new RegExp(`^${source}$`), headers: [] };
      rules.push(current);
    } else if (current) {
      const index = line.indexOf(":");
      current.headers.push([line.slice(0, index).trim(), line.slice(index + 1).trim()]);
    }
  }
  return rules;
}

function inside(file: string): boolean {
  const relative = path.relative(DIST, file);
  return !relative.startsWith("..") && !path.isAbsolute(relative);
}

async function isFile(file: string): Promise<boolean> {
  return stat(file)
    .then((s) => s.isFile())
    .catch(() => false);
}

async function resolve(urlPath: string): Promise<{ file: string; status: number }> {
  const clean = decodeURIComponent(urlPath.split("?")[0] ?? "/");
  const base = path.join(DIST, clean);
  if (!inside(base)) return { file: path.join(DIST, "404.html"), status: 404 };
  const candidates = clean.endsWith("/")
    ? [path.join(base, "index.html"), `${base.slice(0, -1)}.html`]
    : [base, `${base}.html`, path.join(base, "index.html")];
  for (const candidate of candidates) {
    if (await isFile(candidate)) return { file: candidate, status: 200 };
  }
  let dir = path.dirname(base);
  while (inside(dir)) {
    const notFound = path.join(dir, "404.html");
    if (await isFile(notFound)) return { file: notFound, status: 404 };
    dir = path.dirname(dir);
  }
  return { file: path.join(DIST, "404.html"), status: 404 };
}

const rules = await loadRules();

createServer((request, response) => {
  handle(request.url ?? "/", response).catch(() => {
    response.writeHead(400, { "Content-Type": "text/plain" });
    response.end("Bad request");
  });
}).listen(PORT, () => console.log(`Serving dist on http://localhost:${PORT}`));

async function handle(urlPath: string, response: ServerResponse): Promise<void> {
  const { file, status } = await resolve(urlPath);
  const pathname = urlPath.split("?")[0] ?? "/";
  for (const rule of rules) {
    if (rule.pattern.test(pathname)) {
      for (const [name, value] of rule.headers) response.setHeader(name, value);
    }
  }
  const body = await readFile(file);
  response.writeHead(status, {
    "Content-Type": TYPES[path.extname(file)] ?? "application/octet-stream",
  });
  response.end(body);
}
