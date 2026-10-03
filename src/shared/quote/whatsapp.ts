import { business } from "@content/site";

/** Builds a wa.me link with the message URL-encoded. */
export function whatsappUrl(message: string, number: string = business.whatsappNumber): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
