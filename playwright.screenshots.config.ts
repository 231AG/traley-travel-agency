import { defineConfig } from "@playwright/test";
import base from "./playwright.config";

/** HD screenshots of every page at desktop and mobile sizes (npm run screenshots). */
export default defineConfig({
  ...base,
  testDir: "tests/screens",
  fullyParallel: true,
  timeout: 120_000,
  projects: [{ name: "screens" }],
});
