import { mkdirSync } from "node:fs";
import { test } from "@playwright/test";
import { builtRoutes } from "../e2e/routes";

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900, scale: 2 },
  { name: "mobile", width: 390, height: 844, scale: 3 },
] as const;

/** "/" -> home, "/visa/canada" -> visa-canada, "/b/about" -> about */
function pageName(route: string): string {
  const path = route.replace(/^\/b(?=\/|$)/, "").replace(/^\//, "");
  return path === "" ? "home" : path.replace(/\//g, "-");
}

for (const route of builtRoutes()) {
  for (const viewport of VIEWPORTS) {
    test(`${route} ${viewport.name}`, async ({ browser }) => {
      const design = route === "/b" || route.startsWith("/b/") ? "design-b" : "design-a";
      const dir = `screenshots/${design}/${viewport.name}`;
      mkdirSync(dir, { recursive: true });
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: viewport.scale,
        isMobile: viewport.name === "mobile",
        hasTouch: viewport.name === "mobile",
        reducedMotion: "reduce",
      });
      const page = await context.newPage();
      await page.goto(route, { waitUntil: "networkidle" });
      await page.evaluate(async () => {
        document
          .querySelectorAll("img[loading=lazy]")
          .forEach((img) => img.setAttribute("loading", "eager"));
        await document.fonts.ready;
        await Promise.all(
          [...document.images].map((img) =>
            img.complete
              ? img.decode().catch(() => undefined)
              : new Promise((done) => img.addEventListener("load", done, { once: true })),
          ),
        );
      });
      await page.addStyleTag({
        content: "*,*::before,*::after{animation:none!important;transition:none!important}",
      });
      const name = pageName(route);
      await page.screenshot({ path: `${dir}/${name}-fold.png` });
      await page.screenshot({ path: `${dir}/${name}-full.png`, fullPage: true });
      await context.close();
    });
  }
}
