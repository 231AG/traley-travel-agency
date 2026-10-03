/**
 * Runs Lighthouse (mobile, simulated slow 4G) on a list of pages against the
 * static server and fails below: Performance 90, Accessibility 100,
 * Best Practices 100, SEO 100 (SEO is skipped for noindex Design B pages).
 * Usage: npm run lighthouse -- /path /other-path
 */
import { spawn, execFileSync } from "node:child_process";
import { readFile, mkdir } from "node:fs/promises";

const PORT = 4322;
const routes = process.argv.slice(2).length > 0 ? process.argv.slice(2) : ["/"];
const chrome = process.env["CHROMIUM_PATH"] ?? "/opt/pw-browsers/chromium";

const server = spawn(process.execPath, ["--import", "tsx", "scripts/serve.ts"], {
  env: { ...process.env, PORT: String(PORT) },
  stdio: "ignore",
});

async function waitForServer(): Promise<void> {
  for (let attempt = 0; attempt < 50; attempt++) {
    const up = await fetch(`http://localhost:${PORT}/`).then(
      () => true,
      () => false,
    );
    if (up) return;
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error("Static server did not start");
}
await waitForServer();
await mkdir(".lighthouseci", { recursive: true });

let failed = false;
try {
  for (const route of routes) {
    const out = `.lighthouseci/${route.replace(/\W+/g, "_") || "home"}.json`;
    execFileSync(
      "npx",
      [
        "lighthouse",
        `http://localhost:${PORT}${route}`,
        "--quiet",
        "--output=json",
        `--output-path=${out}`,
        `--chrome-path=${chrome}`,
        "--chrome-flags=--headless=new --no-sandbox",
        "--only-categories=performance,accessibility,best-practices,seo",
      ],
      { stdio: "inherit", env: { ...process.env, CHROME_PATH: chrome } },
    );
    const report = JSON.parse(await readFile(out, "utf8")) as {
      categories: Record<string, { score: number }>;
      audits: Record<string, { numericValue?: number }>;
    };
    const score = (key: string) => Math.round((report.categories[key]?.score ?? 0) * 100);
    const lcp = report.audits["largest-contentful-paint"]?.numericValue ?? 0;
    const cls = report.audits["cumulative-layout-shift"]?.numericValue ?? 0;
    const isB = route === "/b" || route.startsWith("/b/");
    const scores = {
      perf: score("performance"),
      a11y: score("accessibility"),
      bp: score("best-practices"),
      seo: score("seo"),
    };
    const ok =
      scores.perf >= 90 &&
      scores.a11y === 100 &&
      scores.bp === 100 &&
      (isB || scores.seo === 100) &&
      lcp < 2500 &&
      cls < 0.1;
    failed ||= !ok;
    console.log(
      `${ok ? "ok  " : "FAIL"} ${route.padEnd(28)} perf ${scores.perf}  a11y ${scores.a11y}  bp ${scores.bp}  seo ${scores.seo}${isB ? " (noindex)" : ""}  LCP ${(lcp / 1000).toFixed(2)}s  CLS ${cls.toFixed(3)}`,
    );
  }
} finally {
  server.kill();
}
if (failed) process.exit(1);
