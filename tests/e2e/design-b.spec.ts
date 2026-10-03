import { expect, test } from "@playwright/test";

test.use({ reducedMotion: "reduce" });

test("board buttons prefill the form and never leave an old destination behind", async ({
  page,
}) => {
  await page.goto("/b");
  const form = page.locator("#quote");
  await page.getByRole("link", { name: /^Flights\W+United States$/ }).click();
  await expect(form.getByRole("tab", { name: "Flights" })).toHaveAttribute("aria-selected", "true");
  await expect(form.getByLabel("To", { exact: true })).toHaveValue("United States");
  await page
    .locator("li", { hasText: "Somewhere else" })
    .getByRole("link", { name: "Flights", exact: true })
    .click();
  await expect(form.getByLabel("To", { exact: true })).toHaveValue("");
  await page.getByRole("link", { name: /^Visa\W+China$/ }).click();
  await expect(form.getByLabel("Destination")).toHaveValue("China");
  await page
    .locator("li", { hasText: "Somewhere else" })
    .getByRole("link", { name: "Visa", exact: true })
    .click();
  await expect(form.getByLabel("Destination")).toHaveValue("");
});

test("the arriving row opens the concierge form", async ({ page }) => {
  await page.goto("/b");
  await page.getByRole("link", { name: "Plan arrival" }).click();
  await expect(page.locator("#quote").getByRole("tab", { name: "Concierge" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
});

test("board destinations are headings screen-reader users can jump between", async ({ page }) => {
  await page.goto("/b");
  await expect(page.getByRole("heading", { level: 3, name: "Canada" })).toBeVisible();
});

test("every Design B page is noindex and points canonical at Design A", async ({ page }) => {
  await page.goto("/b/visa/canada");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://www.tarleytravel.com/visa/canada",
  );
});

test("the quote tablist reports its orientation", async ({ page }, info) => {
  await page.goto("/b");
  const expected = info.project.name === "desktop" ? "vertical" : "horizontal";
  await expect(page.locator("#quote [role=tablist]")).toHaveAttribute("aria-orientation", expected);
});
