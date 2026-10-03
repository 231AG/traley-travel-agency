import { defineConfig, devices } from "@playwright/test";

const PORT = 4321;
/** Use a preinstalled Chromium when one is provided (cloud sessions, CI images). */
const executablePath =
  process.env["CHROMIUM_PATH"] ??
  (process.env["PLAYWRIGHT_BROWSERS_PATH"] ? "/opt/pw-browsers/chromium" : undefined);
const launchOptions = executablePath ? { executablePath } : {};

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env["CI"]),
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
    launchOptions,
  },
  projects: [
    { name: "mobile", use: { ...devices["Pixel 7"], browserName: "chromium" } },
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
  ],
  webServer: {
    command: `PORT=${PORT} npx tsx scripts/serve.ts`,
    port: PORT,
    reuseExistingServer: false,
  },
});
