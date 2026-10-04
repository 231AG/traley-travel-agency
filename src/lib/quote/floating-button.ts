/** Hides the floating WhatsApp button only while a quote form actually sits under it. */
export function floatingButtonAvoids(cards: HTMLElement[]): void {
  const button = document.querySelector<HTMLElement>("[data-floating-whatsapp]");
  if (!button || cards.length === 0) return;
  let frame = 0;
  let hidden = false;
  const update = () => {
    frame = 0;
    // Measure where the button sits even while it is faded out.
    const spot = button.getBoundingClientRect();
    const margin = 8;
    const covers = cards.some((card) => {
      const r = card.getBoundingClientRect();
      return (
        r.left < spot.right + margin &&
        r.right > spot.left - margin &&
        r.top < spot.bottom + margin &&
        r.bottom > spot.top - margin
      );
    });
    if (covers === hidden) return;
    hidden = covers;
    button.toggleAttribute("data-hidden", covers);
    button.setAttribute("aria-hidden", String(covers));
    button.tabIndex = covers ? -1 : 0;
  };
  const schedule = () => {
    if (!frame) frame = window.requestAnimationFrame(update);
  };
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  update();
}
