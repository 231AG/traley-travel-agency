export type QuoteType = "flights" | "visa" | "concierge";

export type IconName =
  | "plane"
  | "passport"
  | "pin"
  | "shield"
  | "tag"
  | "receipt"
  | "people"
  | "check"
  | "whatsapp"
  | "phone"
  | "mail"
  | "clock"
  | "info"
  | "image"
  | "menu"
  | "close"
  | "arrow-up"
  | "facebook"
  | "instagram"
  | "car"
  | "bed";

export interface Link {
  label: string;
  href: string;
}

export interface ExternalLink extends Link {
  external: true;
}

export interface SocialLink extends ExternalLink {
  icon: IconName;
}

/** A photo slot. `file` is set once a real or licensed photo exists; until then the caption shows. */
export interface ImageSlot {
  id: string;
  caption: string;
  alt: string;
  file?: string;
  width?: number;
  height?: number;
  credit?: { photographer: string; source: string; license: string };
}

export interface Placeholder {
  token: string;
  /** Stand-in copy shown on the site until Tarley supplies the real content. Built only from confirmed facts. */
  interim: string;
  needs: string;
  pages: string[];
}

export interface TrustItem {
  icon: IconName;
  title: string;
  text: string;
}

export interface Service {
  id: QuoteType;
  slug: string;
  icon: IconName;
  title: string;
  summary: string;
  checklist: string[];
  cta: string;
  image: ImageSlot;
}

export interface Step {
  title: string;
  text: string;
}

export interface VisaType {
  name: string;
  forWho: string;
}

export interface Destination {
  slug: string;
  name: string;
  shortName: string;
  purposes: string;
  visaTypes: VisaType[];
  officialSource: ExternalLink;
}

export interface Testimonial {
  quote: string;
  name: string;
  trip: string;
}

export interface PageMeta {
  title: string;
  description: string;
}
