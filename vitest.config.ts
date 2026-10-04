import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const dir = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@content": dir("./src/content"),
      "@lib": dir("./src/lib"),
    },
  },
  test: { include: ["tests/unit/**/*.test.ts"] },
});
