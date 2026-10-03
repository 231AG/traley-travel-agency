import { formatMonth } from "./message";

/** The next twelve months, starting with the current one, as select options. */
export function upcomingMonths(from: Date, count = 12): { value: string; label: string }[] {
  return Array.from({ length: count }, (_, offset) => {
    const date = new Date(from.getFullYear(), from.getMonth() + offset, 1);
    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    return { value, label: formatMonth(value) };
  });
}
