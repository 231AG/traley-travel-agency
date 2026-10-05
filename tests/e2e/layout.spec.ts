import { expect, test } from "@playwright/test";

test("mobile menu opens, closes with Escape and returns focus", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile", "menu is mobile only");
  await page.goto("/");
  const toggle = page.locator("[data-menu-toggle]").first();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#mobile-menu")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(toggle).toBeFocused();
});

test("skip link moves focus to main content", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
  await expect(page.locator("main")).toBeFocused();
});

test("floating WhatsApp button links to the business number", async ({ page }) => {
  await page.goto("/");
  const link = page.locator("[data-floating-whatsapp]");
  await expect(link).toHaveAttribute("href", /^https:\/\/wa\.me\/231886504519\?text=/);
});

test("content below the screen fades in once it is scrolled into view", async ({ page }) => {
  await page.goto("/visa");
  const card = page.locator("#destinations li").first();
  await expect(card).toHaveClass(/reveal-pending/);
  await expect(card).toHaveCSS("opacity", "0");
  await card.scrollIntoViewIfNeeded();
  await expect(card).toHaveClass(/is-revealed/);
  await expect(card).toHaveCSS("opacity", "1");
});

test("nothing is hidden when the visitor asks for reduced motion", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/visa");
  await expect(page.locator(".reveal-pending")).toHaveCount(0);
  await context.close();
});
