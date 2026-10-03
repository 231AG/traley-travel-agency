import { defineConfig } from "@playwright/test";
import base from "./playwright.config";

/** HD handover screenshots of every page in both designs (npm run screenshots). */
export default defineConfig({
  ...base,
  testDir: "tests/screens",
  fullyParallel: true,
  timeout: 120_000,
  projects: [{ name: "screens" }],
});
