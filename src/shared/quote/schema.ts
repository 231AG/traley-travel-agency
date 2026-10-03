import * as z from "zod/mini";
import { quote } from "@content/site";

const text = z.string().check(z.trim(), z.maxLength(120, quote.errors.tooLong));
const optionalText = z.optional(text);
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
/** Date inputs submit "" when left empty, so empty is allowed for optional dates. */
const optionalDate = z.optional(
  z.union([z.literal(""), z.string().check(z.regex(ISO_DATE, quote.errors.invalidDate))]),
);

export const flightSchema = z.object({
  from: optionalText,
  to: text.check(z.minLength(1, quote.errors.to)),
  departure: optionalDate,
  return: optionalDate,
  travelers: optionalText,
});

export const visaSchema = z.object({
  destination: text.check(z.minLength(1, quote.errors.destination)),
  destinationOther: optionalText,
  reason: optionalText,
  month: optionalText,
});

export const conciergeSchema = z.object({
  arrival: z
    .string()
    .check(z.minLength(1, quote.errors.arrival), z.regex(ISO_DATE, quote.errors.arrival)),
  services: z.array(text),
});

export type FlightRequest = z.infer<typeof flightSchema>;
export type VisaRequest = z.infer<typeof visaSchema>;
export type ConciergeRequest = z.infer<typeof conciergeSchema>;

export type FieldErrors = Record<string, string>;

/** Date rules that need "today", kept outside the schema so tests can pass a fixed date. */
export function dateErrors(fields: Record<string, string | undefined>, today: string): FieldErrors {
  const errors: FieldErrors = {};
  for (const key of ["departure", "return", "arrival"]) {
    const value = fields[key];
    if (value && value < today) errors[key] = quote.errors.pastDate;
  }
  const { departure, return: back } = fields;
  if (departure && back && back < departure && !errors["return"]) {
    errors["return"] = quote.errors.returnBeforeDeparture;
  }
  return errors;
}
