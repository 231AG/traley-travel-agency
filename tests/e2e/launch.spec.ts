import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { builtRoutes } from "./routes";

test("every page has a unique title and description", () => {
  const seen = new Map<string, string>();
  for (const route of builtRoutes().filter((r) => !r.endsWith("404"))) {
    const file = route === "/" ? "dist/index.html" : `dist${route}.html`;
    const html = readFileSync(file, "utf8");
    const title = /<title>([^<]+)<\/title>/.exec(html)?.[1] ?? "";
    const description = /<meta name="description" content="([^"]+)"/.exec(html)?.[1] ?? "";
    expect(title.length, route).toBeGreaterThan(20);
    expect(description.length, route).toBeGreaterThan(60);
    expect(seen.get(title), `${route} repeats the title of ${seen.get(title)}`).toBeUndefined();
    seen.set(title, route);
  }
});

test("structured data uses only confirmed facts", async ({ page }) => {
  await page.goto("/");
  const raw = await page.locator('script[type="application/ld+json"]').textContent();
  const data = JSON.parse(raw ?? "{}") as Record<string, unknown>;
  expect(data["@type"]).toBe("TravelAgency");
  expect(data["name"]).toBe("Tarley Travel LLC");
  expect(data["telephone"]).toBe("+231886504519");
  expect(data).not.toHaveProperty("aggregateRating");
  expect(data).not.toHaveProperty("review");
  expect(data).not.toHaveProperty("foundingDate");
});

test("sitemap lists every page except 404, robots points at it", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap-0.xml")).text();
  expect(sitemap).toContain("https://www.tarleytravel.com/visa/canada");
  expect(sitemap).not.toContain("404");
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Sitemap: https://www.tarleytravel.com/sitemap-index.xml");
});

test("security headers are served", async ({ request }) => {
  const response = await request.get("/");
  const headers = response.headers();
  expect(headers["content-security-policy"]).toContain("default-src 'self'");
  expect(headers["content-security-policy"]).not.toContain("unsafe-inline");
  expect(headers["strict-transport-security"]).toContain("max-age=");
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
});

test("Open Graph images exist for every page", async ({ page, request }) => {
  for (const route of ["/", "/flights-hotels", "/visa/china", "/concierge"]) {
    await page.goto(route);
    const image = (await page.locator('meta[property="og:image"]').getAttribute("content")) ?? "";
    const local = image.replace("https://www.tarleytravel.com", "");
    expect((await request.get(local)).status(), `${route} ${local}`).toBe(200);
  }
});
