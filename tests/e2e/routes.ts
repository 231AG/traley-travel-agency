import { readdirSync } from "node:fs";
import path from "node:path";

/** Every built page, as the URL a visitor would use. Read from dist so new pages are tested automatically. */
export function builtRoutes(): string[] {
  const walk = (dir: string): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return walk(full);
      return entry.name.endsWith(".html") ? [full] : [];
    });
  return walk("dist")
    .map((file) =>
      `/${path.relative("dist", file)}`.replace(/\.html$/, "").replace(/\/index$/, "/"),
    )
    .map((route) => (route === "/b/" ? "/b" : route))
    .sort();
}
