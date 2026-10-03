/**
 * Every word, contact detail and image slot on the site lives here.
 * Both designs read from this file; components never hard-code copy.
 *
 * Honesty rule: only facts Tarley has confirmed. Anything else is a
 * bracketed placeholder registered in `placeholders` below, which
 * `npm run placeholders` turns into PLACEHOLDERS.md.
 */
import type {
  Destination,
  IconName,
  ImageSlot,
  Link,
  PageMeta,
  Placeholder,
  QuoteType,
  Service,
  SocialLink,
  Step,
  Testimonial,
  TrustItem,
} from "@shared/types";

export const features = {
  /** Off until Tarley supplies real, attributable quotes. */
  testimonials: false,
  /** Cloudflare Web Analytics. Needs `analytics.token` before it can be turned on. */
  analytics: false,
} as const;

export const analytics = {
  token: "",
} as const;

export const business = {
  name: "Tarley Travel LLC",
  shortName: "Tarley Travel",
  tagline: "Travel. Explore. Experience.",
  phoneDisplay: "+231 886 504 519",
  phoneHref: "tel:+231886504519",
  whatsappNumber: "231886504519",
  email: "info@tarleytravelllc.com",
  city: "Monrovia",
  country: "Liberia",
  countryCode: "LR",
  street: "Old Road, Oldest Congo Town",
  addressLine: "Old Road, Oldest Congo Town, Monrovia, Liberia",
  hours: "Monday to Saturday, 7:30\u00a0am to 6:00\u00a0pm",
  hoursShort: "Mon to Sat, 7:30\u00a0am to 6:00\u00a0pm",
  openingHoursSpec: {
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "07:30",
    closes: "18:00",
  },
  replyTime: "We usually reply in under 30 minutes.",
  airport: "Roberts International Airport (ROB)",
  airportShort: "Monrovia (ROB)",
  domain: "tarleytravel.com",
  url: "https://www.tarleytravel.com",
  mapsSearch:
    "https://www.google.com/maps/search/?api=1&query=Old+Road%2C+Oldest+Congo+Town%2C+Monrovia%2C+Liberia",
  paymentMethods: ["mobile money", "Sendwave", "bank transfer"],
  paymentSentence: "Mobile money, Sendwave or bank transfer.",
} as const;

/** Owner-supplied facts that still need a second look. Listed in PLACEHOLDERS.md. */
export const factsToConfirm = [
  {
    item: "Email",
    value: "info@tarleytravelllc.com",
    why: "It is on a different domain from the website (tarleytravel.com). Confirm it receives mail, or supply an @tarleytravel.com address.",
  },
  {
    item: "Office address spelling",
    value: "Old Road, Oldest Congo Town, Monrovia",
    why: 'Supplied as "Old Road, OldestCongo Monrovia-Liberia" and spelled out as the area name.',
  },
  {
    item: "Official visa links",
    value: "One official link per destination page",
    why: "Checked by hand on 3 October 2026. Government sites move pages, so run `npm run check:links` every few months.",
  },
  {
    item: "Service promises from the approved mockup",
    value:
      "Full price shown before you pay with the service fee included; receipts for every payment; visa extensions and renewals; car rental on arrival; day trips outside Monrovia",
    why: "These come from the approved homepage design, not from a written answer. A one-line yes from Tarley confirms each one.",
  },
  {
    item: "Service details written for the inner pages",
    value:
      "We compare fares from the airlines flying out of Roberts International; we book visa appointments; e-tickets arrive on WhatsApp and email; family and group seats on one booking; a driver waiting at the airport; holiday, honeymoon and group packages on request",
    why: "These expand the approved homepage copy. Tarley should confirm each one, and confirm which visa types it handles for each country.",
  },
  {
    item: "Copyright year",
    value: "Set when the site is built",
    why: "Rebuild once a year (or on any content change) to keep it current.",
  },
];

export const social: SocialLink[] = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/19hm1w3FnL/",
    external: true,
    icon: "facebook",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/tarley_travels_1",
    external: true,
    icon: "instagram",
  },
];

export const placeholders = {
  about: {
    token:
      "[ABOUT: 2–3 sentences from Tarley: when they started, who runs it, who they mostly serve and what they do best]",
    needs:
      "A short company story in Tarley's own words. No figures unless Tarley can stand behind them.",
    pages: ["/", "/about"],
  },
  team: {
    token:
      "[TEAM: names and roles of the people customers talk to, only if Tarley wants them shown]",
    needs: "Optional. First names and roles, with each person's consent.",
    pages: ["/about"],
  },
  mapPin: {
    token: "[MAP PIN: Google Maps link to the exact office location]",
    needs: "A shared Google Maps link for the office, or a landmark that helps people find it.",
    pages: ["/contact"],
  },
  requirements: {
    token:
      "[REQUIREMENTS: checklist Tarley confirms for this country, or leave as a WhatsApp check]",
    needs:
      "Decide per country: either Tarley writes and maintains a current checklist, or the page keeps sending people to WhatsApp for a check. The site never lists requirements from memory.",
    pages: [
      "/visa/united-states",
      "/visa/united-kingdom",
      "/visa/canada",
      "/visa/schengen",
      "/visa/uae",
      "/visa/china",
    ],
  },
} satisfies Record<string, Placeholder>;

/** Photo slots. Captions describe the shot needed; slots without `file` render as visible placeholders. */
export const images = {
  hero: {
    id: "hero",
    caption: "Hero photo: traveler holding a passport at the airport, full-bleed",
    alt: "The passenger terminal at Roberts International Airport, Liberia",
    file: "hero",
    credit: {
      photographer: "Bethel Anthony Chisom",
      source:
        "https://commons.wikimedia.org/wiki/File:Robert_International_Airport,_Margibi_County,_Liberia.jpg",
      license: "CC BY-SA 4.0",
    },
  },
  flights: {
    id: "flights",
    caption: "Photo: aircraft on the apron at Roberts International",
    alt: "A passenger jet flying overhead against a blue sky",
    file: "flights",
    credit: {
      photographer: "Jordan Sanchez (Unsplash)",
      source: "https://commons.wikimedia.org/wiki/File:Passenger_airplane_(Unsplash).jpg",
      license: "CC0",
    },
  },
  visa: {
    id: "visa",
    caption: "Photo: passport and application documents on a desk",
    alt: "A passport and printed travel papers on a desk",
    file: "visa",
    credit: {
      photographer: "Alex Robert (Unsplash)",
      source: "https://commons.wikimedia.org/wiki/File:Passport_documents_desk_(Unsplash).jpg",
      license: "CC0",
    },
  },
  concierge: {
    id: "concierge",
    caption: "Photo: a real Liberian location, Monrovia or the coast",
    alt: "A Welcome to Liberia sign in the arrivals hall at Roberts International Airport",
    file: "concierge",
    credit: {
      photographer: "Sm105",
      source: "https://commons.wikimedia.org/wiki/File:Arrivals_at_new_terminal_GLRB.jpg",
      license: "CC BY-SA 4.0",
    },
  },
  team: {
    id: "team",
    caption: "Photo: the real Tarley team at their Monrovia office",
    alt: "",
  },
  office: {
    id: "office",
    caption: "Photo: the Tarley office entrance on Old Road, so visitors recognize it",
    alt: "",
  },
} satisfies Record<string, ImageSlot>;

export const nav: Link[] = [
  { label: "Services", href: "/#services" },
  { label: "Visa", href: "/visa" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const ctas = {
  whatsapp: "WhatsApp us",
  whatsappLong: "Chat on WhatsApp",
  whatsappShort: "WhatsApp",
  photoCredits: "Photos:",
  quote: "Get a free quote",
  call: `Call ${business.phoneDisplay}`,
  email: "Email us",
  messageTeam: "Message the team",
  backToTop: "Back to top",
  skip: "Skip to content",
  newTab: "(opens in a new tab)",
  openMenu: "Open menu",
  closeMenu: "Close menu",
  mapsOpen: "Open in Google Maps",
} as const;

/** Prefilled text for general WhatsApp buttons that are not part of the quote form. */
export const whatsappGreeting = "Hello Tarley Travel, I have a question about a trip.";

export const hero = {
  title: "Travel from Liberia without the guesswork.",
  subtitle:
    "Flights, visa assistance, and arrival arrangements for visitors to Liberia, handled by one team on WhatsApp.",
  location: "Based in Monrovia, serving travelers across Liberia and the diaspora",
};

export const trustLabel = "Why travelers use Tarley";

export const trust: TrustItem[] = [
  {
    icon: "pin",
    title: "Office in Monrovia",
    text: `${business.street}. Open ${business.hoursShort}.`,
  },
  {
    icon: "tag",
    title: "Full price up front",
    text: "Every fee shown before you pay, ours included.",
  },
  {
    icon: "receipt",
    title: "A receipt for every payment",
    text: business.paymentSentence,
  },
  {
    icon: "people",
    title: "Real people on WhatsApp",
    text: business.replyTime,
  },
];

export const servicesIntro = {
  title: "Everything you need before and during your trip",
  text: "Holiday, honeymoon and group packages are available on request.",
};

export const services: Service[] = [
  {
    id: "flights",
    slug: "/flights-hotels",
    icon: "plane",
    title: "Flights & hotels",
    summary:
      "We compare fares from the airlines flying out of Monrovia and book the one that fits your dates and budget.",
    checklist: [
      "One-way, return and multi-city",
      "Hotels at your destination",
      "Car rental on arrival",
      "Family and group bookings",
    ],
    cta: "Ask about flights",
    image: images.flights,
  },
  {
    id: "visa",
    slug: "/visa",
    icon: "passport",
    title: "Visa assistance",
    summary:
      "We prepare your file, book your appointment and check every document. Embassies decide; we make sure nothing is missing.",
    checklist: [
      "Tourist, family, study and business visas",
      "Document checklist and review",
      "Appointment booking",
      "Extensions and renewals",
    ],
    cta: "Start a visa request",
    image: images.visa,
  },
  {
    id: "concierge",
    slug: "/concierge",
    icon: "pin",
    title: "Liberia concierge",
    summary:
      "Coming home or visiting for the first time? Your pickup, room and driver are arranged before you land.",
    checklist: [
      "Airport pickup at Roberts International",
      "Hotels and guesthouses",
      "Car with driver",
      "Day trips outside Monrovia",
    ],
    cta: "Plan your arrival",
    image: images.concierge,
  },
];

export const stepsIntro = { title: "Four steps from message to boarding" };

export const steps: Step[] = [
  {
    title: "Tell us where you're going",
    text: "Use the quote form or send your destination and dates on WhatsApp.",
  },
  {
    title: "We send your options",
    text: "Each option shows the full price, our service fee included.",
  },
  {
    title: "Confirm and pay",
    text: `${business.paymentSentence.replace(/\.$/, "")}, with a receipt every time.`,
  },
  {
    title: "Travel",
    text: "Tickets, bookings and documents arrive on WhatsApp and email.",
  },
];

export const visaNote =
  "Visa requirements change. We check the current list with you before you start gathering documents.";
export const visaPageNote =
  "Requirements change. We check the current list with you before you start.";

export const destinationsIntro = {
  title: "Planning to travel? Start with your destination.",
  start: "Start a request",
  details: "Visa details",
};

export const destinations: Destination[] = [
  {
    slug: "united-states",
    name: "United States",
    shortName: "the US",
    purposes: "Visit, study, business",
    visaTypes: [
      { name: "Visitor visa (B1/B2)", forWho: "Tourism, visiting family, short business trips" },
      { name: "Student visa (F-1)", forWho: "Full-time study at a US school or university" },
    ],
    officialSource: {
      label: "US Department of State: US visas",
      href: "https://travel.state.gov/content/travel/en/us-visas.html",
      external: true,
    },
  },
  {
    slug: "united-kingdom",
    name: "United Kingdom",
    shortName: "the UK",
    purposes: "Visit, study, business",
    visaTypes: [
      { name: "Standard Visitor visa", forWho: "Tourism, visiting family, business meetings" },
      { name: "Student visa", forWho: "Study at a UK college or university" },
    ],
    officialSource: {
      label: "GOV.UK: Visas and immigration",
      href: "https://www.gov.uk/browse/visas-immigration",
      external: true,
    },
  },
  {
    slug: "canada",
    name: "Canada",
    shortName: "Canada",
    purposes: "Visit, study",
    visaTypes: [
      { name: "Visitor visa", forWho: "Tourism and visiting family" },
      { name: "Study permit", forWho: "Study at a designated Canadian school" },
    ],
    officialSource: {
      label: "Government of Canada: Visit Canada",
      href: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada.html",
      external: true,
    },
  },
  {
    slug: "schengen",
    name: "Schengen Area",
    shortName: "the Schengen Area",
    purposes: "Short-stay visits to Europe",
    visaTypes: [
      {
        name: "Short-stay Schengen visa",
        forWho: "Tourism, family visits and business in Schengen countries",
      },
    ],
    officialSource: {
      label: "European Commission: Schengen visa policy",
      href: "https://home-affairs.ec.europa.eu/policies/schengen-borders-and-visa/visa-policy_en",
      external: true,
    },
  },
  {
    slug: "uae",
    name: "United Arab Emirates",
    shortName: "the UAE",
    purposes: "Tourism, business",
    visaTypes: [
      { name: "Tourist visa", forWho: "Holidays and visiting family" },
      { name: "Business visit visa", forWho: "Meetings, trade fairs and short business trips" },
    ],
    officialSource: {
      label: "UAE government portal: Visa and Emirates ID",
      href: "https://u.ae/en/information-and-services/visa-and-emirates-id",
      external: true,
    },
  },
  {
    slug: "china",
    name: "China",
    shortName: "China",
    purposes: "Business, tourism",
    visaTypes: [
      { name: "Business visa (M)", forWho: "Trade, meetings and trade fairs" },
      { name: "Tourist visa (L)", forWho: "Holidays and sightseeing" },
    ],
    officialSource: {
      label: "Embassy of China in Liberia",
      href: "https://lr.china-embassy.gov.cn/eng/",
      external: true,
    },
  },
];

export const about = {
  title: "Your travel plans, handled by people who know Liberia",
  lead: `${business.name} is a travel agency based in ${business.city}, ${business.country}.`,
  story: placeholders.about.token,
  labels: { office: "Office", hours: "Hours", phone: "Phone & WhatsApp", email: "Email" },
};

export const testimonials: Testimonial[] = [];
export const testimonialsIntro = { title: "What travelers say" };

export const finalCta = {
  title: "Planning a trip? Tell us where you're going.",
  text: "Quotes are free. Nothing to pay until you confirm.",
};

export const footer = {
  whatsappLabel: "WhatsApp:",
  columns: {
    services: "Services",
    company: "Company",
    contact: "Contact",
    follow: "Follow",
  },
  services: [
    { label: "Flights & hotels", href: "/flights-hotels" },
    { label: "Visa assistance", href: "/visa" },
    { label: "Liberia concierge", href: "/concierge" },
    { label: "Travel packages", href: "/flights-hotels#packages" },
  ] satisfies Link[],
  company: [
    { label: "About us", href: "/about" },
    { label: "How it works", href: "/#how-it-works" },
    { label: "Contact", href: "/contact" },
  ] satisfies Link[],
  copyright: `© ${new Date().getFullYear()} ${business.name}. All rights reserved.`,
};

/* ---------- Quote form ---------- */

export const quote = {
  title: "Request a quote",
  subtitle: "Tell us where you're going. We reply on WhatsApp.",
  noPayment: "No payment needed to get a quote.",
  tabsLabel: "Quote type",
  tabs: [
    { id: "flights", label: "Flights" },
    { id: "visa", label: "Visa" },
    { id: "concierge", label: "Concierge" },
  ] satisfies { id: QuoteType; label: string }[],
  submit: {
    flights: "Send flight request on WhatsApp",
    visa: "Send visa request on WhatsApp",
    concierge: "Send arrival request on WhatsApp",
  } satisfies Record<QuoteType, string>,
  fields: {
    from: "From",
    to: "To",
    toPlaceholder: "City or airport",
    departure: "Departure",
    return: "Return",
    returnHint: "Leave empty for one-way",
    travelers: "Travelers",
    destination: "Destination",
    destinationPlaceholder: "Choose a destination",
    otherDestination: "Somewhere else",
    reason: "Reason for travel",
    month: "Planned travel month",
    monthUnsure: "Not sure yet",
    choose: "Choose (optional)",
    otherCountry: "Which country?",
    arrival: "Arrival date",
    services: "What do you need?",
    optional: "optional",
  },
  travelerOptions: ["1 adult", "2 adults", "3 adults", "4 adults", "5 adults", "6 or more"],
  reasons: ["Tourism", "Visiting family", "Study", "Business", "Other"],
  conciergeServices: ["Airport pickup", "Hotel or guesthouse", "Car with driver", "Day trips"],
  stub: {
    from: "From",
    to: "To",
    destinationFallback: "Your destination",
    visa: "Visa for",
    arriving: "Arriving",
    arrivalFallback: "Your arrival date",
    arrivingAt: "Monrovia (ROB)",
  },
  errors: {
    to: "Enter where you want to fly to.",
    destination: "Choose a destination.",
    arrival: "Enter your arrival date.",
    pastDate: "Choose a date from today onward.",
    invalidDate: "Enter the date as day, month and year.",
    tooLong: "Keep this under 120 characters.",
    returnBeforeDeparture: "The return date is before the departure date.",
    summary: "Check the highlighted field before sending.",
  },
  opened: "WhatsApp opened in a new tab. If it did not, use the link below.",
  blocked:
    "Your browser blocked the new tab. Use the link below to open WhatsApp with your message.",
  openFallback: "Open WhatsApp with this message",
  noscript: "The quote form needs JavaScript. You can still message us directly on WhatsApp.",
  /** Visible only on the stub ornament; the stub is a live preview, hidden from screen readers to avoid duplicate output. */
  messageIntro: {
    flights: "Hello Tarley Travel, I'd like a flight quote.",
    visa: "Hello Tarley Travel, I'd like help with a visa.",
    concierge: "Hello Tarley Travel, I'm planning a trip to Liberia.",
  } satisfies Record<QuoteType, string>,
  messageLabels: {
    from: "From",
    to: "To",
    departure: "Departure",
    return: "Return",
    travelers: "Travelers",
    destination: "Destination",
    reason: "Reason for travel",
    month: "Planned travel month",
    arrival: "Arrival date",
    services: "Services needed",
  },
  messageFooter: `Sent from ${business.domain}`,
};

/* ---------- Inner pages ---------- */

export const flightsPage = {
  title: "Flights & hotels from Monrovia",
  lead: "Tell us where and when. We compare what the airlines flying out of Roberts International offer and send you the options that fit.",
  includedTitle: "What we book",
  included: [
    {
      icon: "plane",
      title: "Flights",
      text: "One-way, return and multi-city tickets, for one person or a whole family.",
    },
    {
      icon: "bed",
      title: "Hotels",
      text: "Rooms at your destination, close to where you need to be.",
    },
    { icon: "car", title: "Car rental", text: "A car waiting when you land, if you want one." },
    {
      icon: "people",
      title: "Family and group bookings",
      text: "Seats for everyone traveling together, on one booking.",
    },
  ] satisfies { icon: IconName; title: string; text: string }[],
  pricingTitle: "How pricing works",
  pricing: [
    "Each option we send shows the full price: the fare, taxes and our service fee.",
    "You choose. Nothing is booked until you confirm.",
    `You pay by ${business.paymentMethods.join(", ").replace(/, ([^,]*)$/, " or $1")}, and you get a receipt for every payment.`,
    "Your e-ticket and booking details come to you on WhatsApp and email.",
  ],
  packagesTitle: "Packages on request",
  packagesText:
    "Holiday, honeymoon and group packages are put together for each trip. Tell us who is going, where and when, and we build the package with you.",
  packagesCta: "Ask about a package",
  formTitle: "Get a flight quote",
};

export const visaPage = {
  title: "Visa assistance",
  lead: "We help you prepare a complete application, so you go to your appointment ready.",
  doesTitle: "What we do",
  does: [
    "Work out which visa fits your trip",
    "Give you the document checklist for your case",
    "Review every document before you submit",
    "Book your appointment",
    "Help with extensions and renewals",
  ],
  doesNotTitle: "What we do not do",
  doesNot: [
    "Decide visas or promise approval. The embassy decides.",
    "Create, change or supply documents for you.",
    "Hide fees. Every fee is shown before you pay, ours included.",
  ],
  destinationsTitle: "Choose your destination",
  formTitle: "Start a visa request",
};

export const destinationPage = {
  titleSuffix: "visa help",
  typesTitle: "Common visa types",
  requirementsTitle: "Requirements",
  officialTitle: "Official source",
  officialText: "The official page has the final word. We go through it with you.",
  cta: "Start a visa request for",
  backToVisa: "All visa destinations",
  otherTitle: "Other destinations",
};

export const conciergePage = {
  title: "Liberia concierge",
  lead: "Coming home after years away, or visiting Liberia for the first time? We arrange the first days so you can land and go.",
  includedTitle: "What we arrange",
  included: [
    {
      icon: "plane",
      title: "Airport pickup",
      text: "A driver waiting at Roberts International when you land.",
    },
    {
      icon: "bed",
      title: "Hotels and guesthouses",
      text: "A room booked in Monrovia or wherever you are staying.",
    },
    {
      icon: "car",
      title: "Car with driver",
      text: "For errands, family visits and getting around the city.",
    },
    { icon: "pin", title: "Day trips", text: "Trips outside Monrovia, planned around your time." },
  ] as const,
  howTitle: "How it works",
  how: [
    "Send your arrival date and what you need.",
    "We confirm the plan and the full price on WhatsApp.",
    "You pay and get a receipt.",
    "Someone is waiting when you land.",
  ],
  formTitle: "Plan your arrival",
};

export const aboutPage = {
  title: "About Tarley Travel",
  lead: about.lead,
  storyTitle: "Our story",
  teamTitle: "The team",
  visitTitle: "Visit the office",
  howWeWorkTitle: "How we work",
  howWeWork: [
    "Every quote shows the full price, our fee included.",
    "Nothing is booked until you confirm.",
    "A receipt for every payment.",
    "We tell you plainly what we can and cannot do.",
  ],
};

export const contactPage = {
  title: "Contact Tarley Travel",
  lead: "The fastest way to reach us is WhatsApp. You can also call, email or visit the office.",
  methods: {
    whatsapp: { icon: "whatsapp", title: "WhatsApp", text: business.replyTime },
    phone: { icon: "phone", title: "Phone", text: business.hours },
    email: { icon: "mail", title: "Email", text: "For documents and longer questions." },
    office: { icon: "pin", title: "Office", text: business.addressLine },
  } satisfies Record<string, { icon: IconName; title: string; text: string }>,
  hoursTitle: "Opening hours",
  mapTitle: "Find the office",
  followTitle: "Follow us",
};

export const notFoundPage = {
  title: "We couldn't find that page",
  text: "The link may be old or mistyped. These are the places most people are looking for:",
  home: "Go to the homepage",
};

/** Label for the header button that jumps to the quote form on long inner pages. */
export const jumpToQuote = "Get a free quote";

/* ---------- Page metadata ---------- */

export const meta = {
  home: {
    title: "Tarley Travel | Flights, visas and arrivals from Monrovia, Liberia",
    description:
      "Flights, visa assistance and Liberia arrival arrangements from one team in Monrovia. Get a free quote on WhatsApp.",
  },
  flights: {
    title: "Flights & hotels from Monrovia | Tarley Travel",
    description:
      "Flight and hotel bookings from Roberts International Airport, with the full price shown before you pay. Get a free quote on WhatsApp.",
  },
  visa: {
    title: "Visa assistance in Monrovia | Tarley Travel",
    description:
      "Help preparing visa applications for the US, UK, Canada, Schengen Area, UAE and China. Document review and appointment booking.",
  },
  concierge: {
    title: "Liberia arrival concierge | Tarley Travel",
    description:
      "Airport pickup at Roberts International, hotels, a car with driver and day trips, arranged before you land in Liberia.",
  },
  about: {
    title: "About Tarley Travel | Travel agency in Monrovia, Liberia",
    description: "Tarley Travel LLC is a travel agency on Old Road, Oldest Congo Town, Monrovia.",
  },
  contact: {
    title: "Contact Tarley Travel | WhatsApp +231 886 504 519",
    description:
      "WhatsApp, call, email or visit Tarley Travel on Old Road, Oldest Congo Town, Monrovia. Open Monday to Saturday, 7:30 am to 6:00 pm.",
  },
  notFound: {
    title: "Page not found | Tarley Travel",
    description:
      "This page does not exist. Find flights, visa assistance and Liberia concierge services.",
  },
} satisfies Record<string, PageMeta>;

export function destinationMeta(destination: Destination): PageMeta {
  return {
    title: `${destination.name} visa help from Liberia | Tarley Travel`,
    description: `Help preparing your ${destination.name} visa application from Monrovia: visa types, document review and appointment booking.`,
  };
}

/* ---------- Design B: departures board ---------- */

export const board = {
  title: "From Monrovia (ROB): where we help you go",
  columns: { destination: "Destination", help: "Usually for", ask: "Ask us" },
  flight: "Flights",
  visa: "Visa",
  elsewhere: { name: "Somewhere else", purposes: "Flights and visas for any destination" },
  arriving: {
    title: "Arriving in Liberia",
    text: "Airport pickup, hotels, a car with driver, day trips",
    action: "Plan arrival",
  },
  formTitle: "Your request",
  servicesTitle: "What we do",
  trustTitle: "Why people use Tarley",
  readMore: "Read more",
};
