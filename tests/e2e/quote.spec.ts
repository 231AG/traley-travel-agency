import { expect, test, type Page } from "@playwright/test";

/** Captures the WhatsApp URL instead of opening a new tab. */
async function captureOpen(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const w = window as unknown as { __opened: string[] };
    w.__opened = [];
    window.open = ((url?: string | URL) => {
      w.__opened.push(String(url));
      return { opener: null } as unknown as Window;
    }) as typeof window.open;
  });
}

async function openedMessage(page: Page): Promise<string> {
  const urls = await page.evaluate(() => (window as unknown as { __opened: string[] }).__opened);
  expect(urls).toHaveLength(1);
  const url = urls[0] ?? "";
  expect(url).toMatch(/^https:\/\/wa\.me\/231886504519\?text=/);
  return decodeURIComponent(url.split("?text=")[1] ?? "");
}

function isoInDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const human = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[(m ?? 1) - 1]} ${y}`;
};

const card = (page: Page) => page.locator("#quote");

test.beforeEach(async ({ page }) => {
  await captureOpen(page);
});

test("flight quote builds the full WhatsApp message", async ({ page }) => {
  await page.goto("/");
  const out = isoInDays(30);
  const back = isoInDays(44);
  await card(page).getByLabel("To", { exact: true }).fill("London (LHR)");
  await card(page).getByLabel("Departure").fill(out);
  await card(page)
    .getByLabel(/^Return/)
    .fill(back);
  await card(page).getByLabel("Travelers").selectOption("2 adults");
  await expect(card(page).locator('[data-stub="right"]')).toHaveText("London (LHR)");
  await card(page).getByRole("button", { name: "Send flight request on WhatsApp" }).click();
  expect(await openedMessage(page)).toBe(
    [
      "Hello Tarley Travel, I'd like a flight quote.",
      "From: Monrovia (ROB)",
      "To: London (LHR)",
      `Departure: ${human(out)}`,
      `Return: ${human(back)}`,
      "Travelers: 2 adults",
      "Sent from tarleytravel.com",
    ].join("\n"),
  );
  await expect(card(page).locator("[data-quote-fallback]").first()).toBeVisible();
  await expect(card(page).locator("[data-quote-status-text]").first()).toHaveText(
    /WhatsApp opened/,
  );
});

test("one-way flight leaves the return line out", async ({ page }) => {
  await page.goto("/");
  await card(page).getByLabel("To", { exact: true }).fill("Accra");
  await card(page).getByRole("button", { name: "Send flight request on WhatsApp" }).click();
  const message = await openedMessage(page);
  expect(message).not.toContain("Return:");
  expect(message).not.toContain("Departure:");
  expect(message).toContain("To: Accra");
});

test("missing destination shows an error and focuses the field", async ({ page }) => {
  await page.goto("/");
  await card(page).getByRole("button", { name: "Send flight request on WhatsApp" }).click();
  const to = card(page).getByLabel("To", { exact: true });
  await expect(to).toBeFocused();
  await expect(to).toHaveAttribute("aria-invalid", "true");
  await expect(card(page).getByText("Enter where you want to fly to.")).toBeVisible();
  await expect(card(page).getByRole("alert").first()).toHaveText(
    "Check the highlighted field before sending.",
  );
  expect(
    await page.evaluate(() => (window as unknown as { __opened: string[] }).__opened),
  ).toHaveLength(0);
  await to.fill("Lagos");
  await expect(to).not.toHaveAttribute("aria-invalid", "true");
});

test("past dates and a return before departure are rejected", async ({ page }) => {
  await page.goto("/");
  await card(page).getByLabel("To", { exact: true }).fill("Accra");
  await card(page).getByLabel("Departure").fill(isoInDays(-3));
  await card(page).getByRole("button", { name: "Send flight request on WhatsApp" }).click();
  await expect(card(page).getByText("Choose a date from today onward.")).toBeVisible();
  await card(page).getByLabel("Departure").fill(isoInDays(20));
  await card(page)
    .getByLabel(/^Return/)
    .fill(isoInDays(10));
  await card(page).getByRole("button", { name: "Send flight request on WhatsApp" }).click();
  await expect(card(page).getByText("The return date is before the departure date.")).toBeVisible();
});

test("a destination card selects the visa tab and that country", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Start a request\W+Canada/ }).click();
  await expect(card(page).getByRole("tab", { name: "Visa" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  const destination = card(page).getByLabel("Destination");
  await expect(destination).toHaveValue("Canada");
  await expect(destination).toBeFocused();
  await card(page).getByLabel("Reason for travel").selectOption("Study");
  await card(page).getByRole("button", { name: "Send visa request on WhatsApp" }).click();
  const message = await openedMessage(page);
  expect(message).toMatch(
    /^Hello Tarley Travel, I'd like help with a visa\.\nDestination: Canada\nReason for travel: Study\n/,
  );
  expect(message.endsWith("Sent from tarleytravel.com")).toBe(true);
});

test("a service button opens the concierge tab and sends the arrival request", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Plan your arrival" }).click();
  await expect(card(page).getByRole("tab", { name: "Concierge" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  const arrival = isoInDays(60);
  await card(page).getByLabel("Arrival date").fill(arrival);
  await card(page).getByLabel("Airport pickup").check();
  await card(page).getByLabel("Car with driver").check();
  await expect(card(page).locator('[data-stub="left"]')).toHaveText(human(arrival));
  await card(page).getByRole("button", { name: "Send arrival request on WhatsApp" }).click();
  expect(await openedMessage(page)).toBe(
    [
      "Hello Tarley Travel, I'm planning a trip to Liberia.",
      `Arrival date: ${human(arrival)}`,
      "Services needed: Airport pickup, Car with driver",
      "Sent from tarleytravel.com",
    ].join("\n"),
  );
});

test("the whole flow works with the keyboard alone", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop", "keyboard run on desktop");
  await page.goto("/");
  const flightsTab = card(page).getByRole("tab", { name: "Flights" });
  await flightsTab.focus();
  await page.keyboard.press("ArrowRight");
  await expect(card(page).getByRole("tab", { name: "Visa" })).toBeFocused();
  await expect(card(page).getByRole("tab", { name: "Visa" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await page.keyboard.press("End");
  await expect(card(page).getByRole("tab", { name: "Concierge" })).toBeFocused();
  await page.keyboard.press("Home");
  await expect(flightsTab).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(card(page).getByLabel("From")).toBeFocused();
  await page.keyboard.press("Tab");
  await page.keyboard.type("Nairobi");
  await page.keyboard.press("Enter");
  expect(await openedMessage(page)).toContain("To: Nairobi");
});

test("a link with quote parameters preselects the form", async ({ page }) => {
  await page.goto("/?quote=visa&to=Schengen%20Area#quote");
  await expect(card(page).getByRole("tab", { name: "Visa" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(card(page).getByLabel("Destination")).toHaveValue("Schengen Area");
});

test("the floating WhatsApp button steps aside while the form is on screen", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "mobile", "overlap only matters on phones");
  await page.goto("/");
  const floating = page.locator("[data-floating-whatsapp]");
  await card(page).scrollIntoViewIfNeeded();
  await expect(floating).toHaveAttribute("data-hidden", "");
  await page.locator("#how-it-works").scrollIntoViewIfNeeded();
  await expect(floating).not.toHaveAttribute("data-hidden", "");
});
