import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { builtRoutes } from "./routes";

const routes = builtRoutes();
const WIDTHS = [360, 390, 768, 1024, 1280, 1440];

test("a missing page returns 404 with the not-found page", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");
  expect(response?.status()).toBe(404);
});

for (const route of routes) {
  test.describe(`page ${route}`, () => {
    test("loads with no console errors or CSP violations", async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      page.on("pageerror", (error) => errors.push(error.message));
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await page.waitForLoadState("networkidle");
      expect(errors).toEqual([]);
    });

    test("has a single h1, a title and a description", async ({ page }) => {
      await page.goto(route);
      await expect(page.locator("h1")).toHaveCount(1);
      expect((await page.title()).length).toBeGreaterThan(10);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.{40,}/);
    });

    test("has no serious or critical axe violations", async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState("networkidle");
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      const blocking = results.violations.filter(
        (v) => v.impact === "serious" || v.impact === "critical",
      );
      expect(
        blocking.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`),
      ).toEqual([]);
    });

    test("never scrolls horizontally from 360 to 1440 px", async ({ page }, info) => {
      test.skip(info.project.name !== "desktop", "width sweep runs once");
      for (const width of WIDTHS) {
        await page.setViewportSize({ width, height: 800 });
        await page.goto(route);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - window.innerWidth,
        );
        expect(overflow, `overflow at ${width}px`).toBeLessThanOrEqual(0);
      }
    });

    test("keeps text at 15 px or larger", async ({ page }, info) => {
      test.skip(info.project.name !== "desktop", "runs once");
      await page.goto(route);
      const small = await page.evaluate(() => {
        const found: string[] = [];
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) {
          const node = walker.currentNode;
          const parent = node.parentElement;
          if (!parent || !node.textContent?.trim()) continue;
          const style = getComputedStyle(parent);
          if (style.display === "none" || style.visibility === "hidden") continue;
          if (parent.closest(".sr-only, [aria-hidden='true'], [hidden]")) continue;
          if (parseFloat(style.fontSize) < 15)
            found.push(
              `${parent.tagName} "${node.textContent.trim().slice(0, 30)}" ${style.fontSize}`,
            );
        }
        return found;
      });
      expect(small).toEqual([]);
    });

    test("interactive elements are at least 44 px", async ({ page }) => {
      await page.goto(route);
      await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished)));
      const tooSmall = await page.evaluate(() =>
        [
          ...document.querySelectorAll<HTMLElement>(
            "a[href], button, input, select, textarea, [role='tab']",
          ),
        ]
          .filter((el) => {
            const rect = el.getBoundingClientRect();
            if (rect.width === 0 && rect.height === 0) return false;
            // WCAG 2.5.8 exempts links inside running text, not every link that sits in a <p>.
            const paragraph = el.closest("p");
            if (
              paragraph &&
              (paragraph.textContent ?? "").trim().length > (el.textContent ?? "").trim().length + 3
            )
              return false;
            if (el.classList.contains("sr-only-focusable")) return false;
            if (el.matches("input[type='checkbox'], input[type='radio']")) return false;
            return rect.height < 44 || rect.width < 44;
          })
          .map(
            (el) =>
              `${el.tagName} "${(el.textContent ?? "").trim().slice(0, 30)}" ${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)}`,
          ),
      );
      expect(tooSmall).toEqual([]);
    });

    test("external links open safely", async ({ page }) => {
      await page.goto(route);
      const unsafe = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLAnchorElement>("a[target='_blank']")]
          .filter((a) => !/noopener/.test(a.rel) || !/noreferrer/.test(a.rel))
          .map((a) => a.href),
      );
      expect(unsafe).toEqual([]);
    });
  });
}
