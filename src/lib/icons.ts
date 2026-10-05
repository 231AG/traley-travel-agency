import { siFacebook, siInstagram, siWhatsapp } from "simple-icons";
import type { IconName } from "@lib/types";

interface IconDef {
  /** Filled glyphs (brand marks) use fill; the rest are 1.75px strokes on a 24px grid. */
  fill?: boolean;
  paths: string[];
}

export const icons: Record<IconName, IconDef> = {
  plane: {
    paths: [
      "M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z",
    ],
  },
  passport: {
    paths: [
      "M6 2.75h11a1.25 1.25 0 0 1 1.25 1.25v16a1.25 1.25 0 0 1-1.25 1.25H6A1.25 1.25 0 0 1 4.75 20V4A1.25 1.25 0 0 1 6 2.75z",
      "M11.5 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
      "M8.5 17h6",
    ],
  },
  pin: {
    paths: [
      "M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z",
      "M12 7.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5z",
    ],
  },
  shield: { paths: ["M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6l-7-3z", "m9 12 2 2 4-4"] },
  tag: {
    paths: [
      "M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9-9-9z",
      "M7.5 6.25a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5z",
    ],
  },
  receipt: {
    paths: [
      "M5 3h14v18l-2.5-1.5L14 21l-2-1.5L10 21l-2.5-1.5L5 21V3z",
      "M9 8h6",
      "M9 12h6",
      "M9 16h3",
    ],
  },
  people: {
    paths: [
      "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z",
      "M2.5 20c0-3.3 2.9-6 6.5-6s6.5 2.7 6.5 6",
      "M16 4.2a3.5 3.5 0 0 1 0 6.6",
      "M18 14.3c2 .8 3.5 3 3.5 5.7",
    ],
  },
  check: { paths: ["m4.5 12.5 5 5 10-11"] },
  whatsapp: { fill: true, paths: [siWhatsapp.path] },
  facebook: { fill: true, paths: [siFacebook.path] },
  instagram: { fill: true, paths: [siInstagram.path] },
  phone: {
    paths: [
      "M5 3.5h3l1.5 4.5-2 1.5a12 12 0 0 0 7 7l1.5-2 4.5 1.5v3a2 2 0 0 1-2 2A17 17 0 0 1 3 5.5a2 2 0 0 1 2-2z",
    ],
  },
  mail: { paths: ["M3.75 5.75h16.5v12.5H3.75z", "m4 6.5 8 6.5 8-6.5"] },
  clock: { paths: ["M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z", "M12 7v5l3.5 2"] },
  info: { paths: ["M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z", "M12 11v6", "M12 7.5v.01"] },
  image: {
    paths: [
      "M4 4.75h16v14.5H4z",
      "M8.5 8.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z",
      "m4 17 5-5 4 4 2.5-2.5L20 18",
    ],
  },
  menu: { paths: ["M4 7h16", "M4 12h16", "M4 17h16"] },
  close: { paths: ["M6 6l12 12", "M18 6 6 18"] },
  "arrow-up": { paths: ["M12 19V5", "m6 11 6-6 6 6"] },
  car: {
    paths: [
      "M5 16.5h14v-4l-2-5H7l-2 5z",
      "M5 16.5V19h2.5v-2.5",
      "M16.5 16.5V19H19v-2.5",
      "M7.5 13.5h.01",
      "M16.5 13.5h.01",
    ],
  },
  bed: {
    paths: [
      "M3 18V6",
      "M3 14h18v4",
      "M21 14v-3a3 3 0 0 0-3-3h-7v6",
      "M7 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
    ],
  },
  calendar: {
    paths: ["M4.75 5.75h14.5v14.5H4.75z", "M4.75 10h14.5", "M8.5 3.5v4", "M15.5 3.5v4"],
  },
  "file-check": {
    paths: [
      "M14 3H6.75A1.75 1.75 0 0 0 5 4.75v14.5A1.75 1.75 0 0 0 6.75 21h10.5A1.75 1.75 0 0 0 19 19.25V8z",
      "M14 3v5h5",
      "m9 14 2 2 4-4",
    ],
  },
  refresh: {
    paths: [
      "M20 11a8 8 0 0 0-14.3-4.9L4 8",
      "M4 3.5V8h4.5",
      "M4 13a8 8 0 0 0 14.3 4.9L20 16",
      "M20 20.5V16h-4.5",
    ],
  },
  compass: { paths: ["M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z", "m15.5 8.5-2 5-5 2 2-5z"] },
  list: {
    paths: ["M9 6h11", "M9 12h11", "M9 18h11", "M4.5 6h.01", "M4.5 12h.01", "M4.5 18h.01"],
  },
};
