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
