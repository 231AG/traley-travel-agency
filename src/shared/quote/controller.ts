/**
 * Quote form behavior, shared by both designs. Markup contract (data attributes):
 *   [data-quote]                root; data-initial = starting tab
 *   [data-quote-tab=type]       role="tab" buttons
 *   [data-quote-panel=type]     role="tabpanel" containers
 *   [data-quote-form=type]      the form inside each panel
 *   [data-error-for=id]         error line for the control with that id
 *   [data-quote-summary]        form-level error (role="alert")
 *   [data-quote-status-text]    polite live region filled after WhatsApp opens
 *   [data-quote-fallback]       link to the same message, shown after sending
 *   [data-stub=left|right]      live boarding-pass stub values, [data-stub-label=left|right]
 *   [data-month-select]         month options, refreshed in the browser
 * Anywhere on the page:
 *   [data-quote-select=type]    selects that tab, optional [data-quote-destination]
 *   [data-quote-focus]          scrolls to the form and focuses its first field
 *   [data-floating-whatsapp]    hidden while a quote form is on screen
 */
import { business, quote } from "@content/site";
import type { QuoteType } from "@shared/types";
import { buildMessage, formatDate, type QuoteFields } from "./message";
import { upcomingMonths } from "./months";
import { conciergeSchema, dateErrors, flightSchema, visaSchema, type FieldErrors } from "./schema";
import { whatsappUrl } from "./whatsapp";

const TYPES: QuoteType[] = ["flights", "visa", "concierge"];
const SCHEMAS = { flights: flightSchema, visa: visaSchema, concierge: conciergeSchema };

const isQuoteType = (value: string | null | undefined): value is QuoteType =>
  TYPES.includes(value as QuoteType);

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function todayIso(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function readFields(form: HTMLFormElement): QuoteFields {
  const data = new FormData(form);
  const fields: Record<string, string | string[]> = {};
  for (const key of new Set(data.keys())) {
    const values = data.getAll(key).map(String);
    fields[key] = key === "services" ? values : (values[0] ?? "").trim();
  }
  return fields as QuoteFields;
}

class QuoteCard {
  private readonly tabs: HTMLButtonElement[];
  private current: QuoteType;

  constructor(private readonly root: HTMLElement) {
    this.tabs = [...root.querySelectorAll<HTMLButtonElement>("[data-quote-tab]")];
    const initial = root.dataset["initial"];
    this.current = isQuoteType(initial) ? initial : "flights";
    this.tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => this.select(tab.dataset["quoteTab"] as QuoteType));
      tab.addEventListener("keydown", (event) => this.onTabKey(event, index));
    });
    root.querySelectorAll<HTMLFormElement>("[data-quote-form]").forEach((form) => {
      form.addEventListener("submit", (event) => this.onSubmit(event, form));
      form.addEventListener("input", (event) => this.onInput(event));
      form.addEventListener("change", (event) => this.onInput(event));
    });
    this.refreshMonths();
    this.updateStub();
  }

  select(type: QuoteType, options: { focusTab?: boolean } = {}): void {
    this.current = type;
    for (const tab of this.tabs) {
      const active = tab.dataset["quoteTab"] === type;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && options.focusTab) tab.focus();
    }
    this.root.querySelectorAll<HTMLElement>("[data-quote-panel]").forEach((panel) => {
      panel.hidden = panel.dataset["quotePanel"] !== type;
    });
    this.updateStub();
  }

  setDestination(name: string): void {
    const select = this.form("visa")?.querySelector<HTMLSelectElement>('[name="destination"]');
    if (!select) return;
    select.value = [...select.options].some((o) => o.value === name) ? name : "";
    this.clearError(select);
    this.updateStub();
  }

  setFlightDestination(name: string): void {
    const input = this.form("flights")?.querySelector<HTMLInputElement>('[name="to"]');
    if (input) input.value = name;
    this.updateStub();
  }

  /** Scrolls the card into view, then puts focus on the first field of the open tab. */
  reveal(): void {
    this.root.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "start" });
    const field = this.form(this.current)?.querySelector<HTMLElement>(
      "input:not([type=hidden]), select",
    );
    field?.focus({ preventScroll: true });
  }

  private form(type: QuoteType): HTMLFormElement | null {
    return this.root.querySelector<HTMLFormElement>(`[data-quote-form="${type}"]`);
  }

  private onTabKey(event: KeyboardEvent, index: number): void {
    const last = this.tabs.length - 1;
    const next: Record<string, number> = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    };
    const target = next[event.key];
    if (target === undefined) return;
    event.preventDefault();
    const type = this.tabs[target]?.dataset["quoteTab"];
    if (isQuoteType(type)) this.select(type, { focusTab: true });
  }

  private onInput(event: Event): void {
    const target = event.target;
    if (target instanceof HTMLInputElement || target instanceof HTMLSelectElement)
      this.clearError(target);
    this.updateStub();
  }

  private onSubmit(event: SubmitEvent, form: HTMLFormElement): void {
    event.preventDefault();
    const type = form.dataset["quoteForm"];
    if (!isQuoteType(type)) return;
    const fields = readFields(form);
    const errors = this.validate(type, fields);
    this.showErrors(form, errors);
    if (Object.keys(errors).length > 0) return;

    const url = whatsappUrl(buildMessage(type, fields));
    const opened = window.open(url, "_blank");
    if (opened) {
      opened.opener = null;
    } else {
      window.location.href = url;
    }
    // The live region stays in the DOM from page load; only its text changes, so it is announced.
    const status = form.querySelector<HTMLElement>("[data-quote-status-text]");
    const fallback = form.querySelector<HTMLAnchorElement>("[data-quote-fallback]");
    if (fallback) {
      fallback.href = url;
      fallback.hidden = false;
    }
    if (status) status.textContent = status.dataset["openedText"] ?? "";
  }

  private validate(type: QuoteType, fields: QuoteFields): FieldErrors {
    const errors: FieldErrors = {};
    const result = SCHEMAS[type].safeParse(fields);
    if (!result.success) {
      for (const issue of result.error.issues) {
        const key = String(issue.path[0] ?? "");
        if (key && !errors[key]) errors[key] = issue.message;
      }
    }
    const dates: Record<string, string | undefined> = {};
    for (const key of ["departure", "return", "arrival"] as const) {
      const value = fields[key];
      if (typeof value === "string") dates[key] = value;
    }
    for (const [key, message] of Object.entries(dateErrors(dates, todayIso()))) {
      errors[key] ??= message;
    }
    return errors;
  }

  private showErrors(form: HTMLFormElement, errors: FieldErrors): void {
    const summary = form.querySelector<HTMLElement>("[data-quote-summary]");
    let first: HTMLElement | null = null;
    form
      .querySelectorAll<HTMLInputElement | HTMLSelectElement>("input[name], select[name]")
      .forEach((control) => {
        const message = errors[control.name];
        if (message) {
          this.setError(control, message);
          first ??= control;
        } else {
          this.clearError(control);
        }
      });
    if (summary) {
      summary.hidden = first === null;
      summary.textContent = first === null ? "" : quote.errors.summary;
    }
    (first as HTMLElement | null)?.focus();
  }

  private setError(control: HTMLInputElement | HTMLSelectElement, message: string): void {
    control.setAttribute("aria-invalid", "true");
    const line = this.root.querySelector<HTMLElement>(`[data-error-for="${control.id}"]`);
    if (line) {
      line.textContent = message;
      line.hidden = false;
    }
  }

  private clearError(control: HTMLInputElement | HTMLSelectElement): void {
    if (control.getAttribute("aria-invalid") !== "true") return;
    control.removeAttribute("aria-invalid");
    const line = this.root.querySelector<HTMLElement>(`[data-error-for="${control.id}"]`);
    if (line) {
      line.textContent = "";
      line.hidden = true;
    }
    const summary = control.form?.querySelector<HTMLElement>("[data-quote-summary]");
    if (summary && !control.form?.querySelector("[aria-invalid='true']")) summary.hidden = true;
  }

  private value(type: QuoteType, name: string): string {
    const control = this.form(type)?.querySelector<HTMLInputElement | HTMLSelectElement>(
      `[name="${name}"]`,
    );
    return control?.value.trim() ?? "";
  }

  private updateStub(): void {
    const s = quote.stub;
    const views: Record<QuoteType, [string, string, string, string]> = {
      flights: [
        s.from,
        this.value("flights", "from") || business.airportShort,
        s.to,
        this.value("flights", "to") || s.destinationFallback,
      ],
      visa: [
        s.from,
        business.airportShort,
        s.visa,
        this.value("visa", "destination") || s.destinationFallback,
      ],
      concierge: [
        s.arriving,
        formatDate(this.value("concierge", "arrival")) || s.arrivalFallback,
        s.to,
        s.arrivingAt,
      ],
    };
    const [leftLabel, left, rightLabel, right] = views[this.current];
    const set = (selector: string, text: string) => {
      const node = this.root.querySelector<HTMLElement>(selector);
      if (node && node.textContent !== text) node.textContent = text;
    };
    set('[data-stub-label="left"]', leftLabel);
    set('[data-stub="left"]', left);
    set('[data-stub-label="right"]', rightLabel);
    set('[data-stub="right"]', right);
  }

  /** Static builds can go stale; rebuild the month list from today's date. */
  private refreshMonths(): void {
    this.root.querySelectorAll<HTMLSelectElement>("[data-month-select]").forEach((select) => {
      const months = upcomingMonths(new Date());
      if (select.options[1]?.value === months[0]?.value) return;
      const keep = select.options[0];
      select.replaceChildren(
        ...(keep ? [keep] : []),
        ...months.map((m) => new Option(m.label, m.value)),
      );
    });
  }
}

function floatingButtonAvoids(cards: HTMLElement[]): void {
  const button = document.querySelector<HTMLElement>("[data-floating-whatsapp]");
  if (!button || cards.length === 0 || !("IntersectionObserver" in window)) return;
  const visible = new Set<Element>();
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) visible.add(entry.target);
      else visible.delete(entry.target);
    }
    const hide = visible.size > 0;
    button.toggleAttribute("data-hidden", hide);
    button.setAttribute("aria-hidden", String(hide));
    button.tabIndex = hide ? -1 : 0;
  });
  cards.forEach((card) => observer.observe(card));
}

export function initQuote(): void {
  const roots = [...document.querySelectorAll<HTMLElement>("[data-quote]")];
  const cards = roots.map((root) => new QuoteCard(root));
  const primary = cards[0];
  if (!primary) return;

  document.addEventListener("click", (event) => {
    const trigger = (event.target as Element | null)?.closest<HTMLElement>(
      "[data-quote-select], [data-quote-focus]",
    );
    if (!trigger) return;
    event.preventDefault();
    const type = trigger.dataset["quoteSelect"];
    if (isQuoteType(type)) primary.select(type);
    const destination = trigger.dataset["quoteDestination"];
    if (destination) primary.setDestination(destination);
    primary.reveal();
  });

  const params = new URLSearchParams(window.location.search);
  const requested = params.get("quote");
  if (isQuoteType(requested)) {
    primary.select(requested);
    const to = params.get("to");
    if (to && requested === "visa") primary.setDestination(to);
    if (to && requested === "flights") primary.setFlightDestination(to);
  }

  floatingButtonAvoids(roots);
}
