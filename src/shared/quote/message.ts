import { business, quote } from "@content/site";
import type { QuoteType } from "@shared/types";

export type QuoteFields = Partial<Record<keyof typeof quote.messageLabels, string | string[]>>;

const ORDER: Record<QuoteType, (keyof typeof quote.messageLabels)[]> = {
  flights: ["from", "to", "departure", "return", "travelers"],
  visa: ["destination", "reason", "month"],
  concierge: ["arrival", "services"],
};

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

/** 2026-11-04 -> 4 November 2026. Unambiguous for readers on both sides of the Atlantic. */
export function formatDate(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return iso;
  const [, year, month, day] = match;
  return `${Number(day)} ${MONTHS[Number(month) - 1] ?? month} ${year}`;
}

/** 2026-11 -> November 2026. */
export function formatMonth(value: string): string {
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) return value;
  const [, year, month] = match;
  return `${MONTHS[Number(month) - 1] ?? month} ${year}`;
}

function display(key: keyof typeof quote.messageLabels, value: string | string[]): string {
  if (Array.isArray(value)) return value.join(", ");
  if (key === "departure" || key === "return" || key === "arrival") return formatDate(value);
  if (key === "month") return formatMonth(value);
  return value;
}

/** The WhatsApp message for a quote. Empty fields are left out. */
export function buildMessage(type: QuoteType, fields: QuoteFields): string {
  const lines = [quote.messageIntro[type]];
  const from =
    typeof fields.from === "string" && fields.from.trim() ? fields.from : business.airportShort;
  const values: QuoteFields = type === "flights" ? { ...fields, from } : fields;
  for (const key of ORDER[type]) {
    const raw = values[key];
    const value = Array.isArray(raw) ? raw.filter(Boolean) : raw?.trim();
    if (!value || value.length === 0) continue;
    lines.push(`${quote.messageLabels[key]}: ${display(key, value)}`);
  }
  lines.push(quote.messageFooter);
  return lines.join("\n");
}
