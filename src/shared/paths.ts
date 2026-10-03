/** Design base paths. Design A lives at the root, Design B mirrors every page under /b. */
export type DesignBase = "" | "/b";

/** Prefixes an internal path with the design's base. External links pass through. */
export function withBase(base: DesignBase, href: string): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  if (base === "") return href;
  if (href === "/") return base;
  if (href.startsWith("/#")) return `${base}${href.slice(1)}`;
  return `${base}${href}`;
}
