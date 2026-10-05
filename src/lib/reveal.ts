/**
 * Scroll reveal: elements marked `.reveal` (and the children of `.reveal-stagger`)
 * fade up once, the first time they scroll into view.
 *
 * Only elements that start below the screen are hidden, and only by this script,
 * so content above the fold never flickers and the page is complete without
 * JavaScript, with reduced motion, or in browsers without IntersectionObserver.
 */
const STAGGER_MS = 80;
const MAX_STAGGER_MS = 320;

export function initReveal(): void {
  if (!("IntersectionObserver" in window)) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -6% 0px", threshold: 0.05 },
  );

  const below = (el: Element) => el.getBoundingClientRect().top > window.innerHeight;

  for (const el of document.querySelectorAll<HTMLElement>(".reveal")) {
    if (!below(el)) continue;
    el.classList.add("reveal-pending");
    observer.observe(el);
  }
  for (const group of document.querySelectorAll<HTMLElement>(".reveal-stagger")) {
    // The group itself is observed too, so decorations on it (the steps route) can wait for it.
    if (below(group)) {
      group.classList.add("reveal-group-pending");
      observer.observe(group);
    }
    const columns = Number(group.dataset["revealColumns"] ?? 3);
    [...group.children].forEach((child, index) => {
      if (!(child instanceof HTMLElement) || !below(child)) return;
      // Children on the same row arrive a beat apart; the delay is capped so long lists never lag.
      const column = index % columns;
      child.style.setProperty(
        "--reveal-delay",
        `${Math.min(column * STAGGER_MS, MAX_STAGGER_MS)}ms`,
      );
      child.classList.add("reveal-pending");
      observer.observe(child);
    });
  }
}
