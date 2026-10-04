/** Pure helpers for the quote form: reading, validating and shaping what the visitor entered. */
import { quote } from "@content/site";
import type { QuoteType } from "@lib/types";
import type { QuoteFields } from "./message";
import { conciergeSchema, dateErrors, flightSchema, visaSchema, type FieldErrors } from "./schema";

export const TYPES: QuoteType[] = ["flights", "visa", "concierge"];
const SCHEMAS = { flights: flightSchema, visa: visaSchema, concierge: conciergeSchema };

export const isQuoteType = (value: string | null | undefined): value is QuoteType =>
  TYPES.includes(value as QuoteType);

export function todayIso(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export function readFields(form: HTMLFormElement): QuoteFields {
  const data = new FormData(form);
  const fields: Record<string, string | string[]> = {};
  for (const key of new Set(data.keys())) {
    const values = data.getAll(key).map(String);
    fields[key] = key === "services" ? values : (values[0] ?? "").trim();
  }
  return fields as QuoteFields;
}

/** "Somewhere else" plus a typed country becomes that country in the message. */
export function withOtherDestination(fields: QuoteFields): QuoteFields {
  const { destinationOther, ...rest } = fields as QuoteFields & { destinationOther?: string };
  if (
    rest.destination === quote.fields.otherDestination &&
    typeof destinationOther === "string" &&
    destinationOther
  ) {
    return { ...rest, destination: destinationOther };
  }
  return rest;
}

/** Field errors for one quote type: schema messages first, then date rules relative to `today`. */
export function validateQuote(type: QuoteType, fields: QuoteFields, today: string): FieldErrors {
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
  for (const [key, message] of Object.entries(dateErrors(dates, today))) {
    errors[key] ??= message;
  }
  return errors;
}
