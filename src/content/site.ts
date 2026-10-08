/**
 * Every word, contact detail and image slot on the site lives here.
 * Every page reads from this file; components never hard-code copy.
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
} from "@lib/types";

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
  email: "info@tarleytravel.com",
  city: "Monrovia",
  country: "Liberia",
  countryCode: "LR",
  street: "Old Road, Oldest Congo Town",
  addressLine: "Old Road, Oldest Congo Town, Monrovia, Liberia",
  hours: "Monday to Saturday, 7:30\u00a0am to 6:00\u00a0pm",
  hoursRange: "7:30\u00a0am to 6:00\u00a0pm",
  hoursShort: "Mon to Sat, 7:30\u00a0am to 6:00\u00a0pm",
  openingHoursSpec: {
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "07:30",
    closes: "18:00",
  },
  replyTime: "We usually reply in under 30 minutes.",
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
    value: "info@tarleytravel.com",
    why: "Confirm the mailbox is configured to receive customer messages.",
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
    interim:
      "Tarley Travel is a travel agency on Old Road, Oldest Congo Town, in Monrovia. We book flights and hotels, help with visa applications and look after visitors arriving in Liberia. Most trips start with a WhatsApp message, and we usually reply in under 30 minutes.",
    needs:
      "A short company story in Tarley's own words. No figures unless Tarley can stand behind them.",
    pages: ["/", "/about"],
  },
  team: {
    token:
      "[TEAM: names and roles of the people customers talk to, only if Tarley wants them shown]",
    interim:
      "The team works from the office on Old Road, Monday to Saturday. Message us on WhatsApp or stop by, and we will help you plan the trip.",
    needs: "Optional. First names and roles, with each person's consent.",
    pages: ["/about"],
  },
  mapPin: {
    token: "[MAP PIN: Google Maps link to the exact office location]",
    interim:
      "Search Google Maps for Old Road, Oldest Congo Town, or message us on WhatsApp and we will send directions.",
    needs: "A shared Google Maps link for the office, or a landmark that helps people find it.",
    pages: ["/contact"],
  },
  requirements: {
    token:
      "[REQUIREMENTS: checklist Tarley confirms for this country, or leave as a WhatsApp check]",
    interim:
      "Tell us which visa you need and when you travel, and we send you the current checklist on WhatsApp.",
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
  monrovia: {
    id: "monrovia-coast",
    file: "monrovia-coast",
    caption: "Monrovia's coastline",
    alt: "Monrovia buildings and palm-lined roads beside the Atlantic Ocean",
  },
  city: {
    id: "monrovia-street",
    file: "monrovia-street",
    caption: "Around Monrovia",
    alt: "Traffic and local businesses along a palm-lined street in Monrovia",
  },
  cityView: {
    id: "monrovia-view",
    file: "monrovia-view",
    caption: "Monrovia city life",
    alt: "Elevated view of a busy avenue and businesses in Monrovia",
  },
  sedan: {
    id: "rental-sedan",
    file: "rental-sedan",
    caption: "White sedan available for rent",
    alt: "White rental sedan shown from the front and side",
  },
  ford: {
    id: "rental-ford",
    file: "rental-ford",
    caption: "Red Ford Fusion available for rent",
    alt: "Front view of a red Ford Fusion rental car",
  },
  fleet: {
    id: "rental-fleet",
    file: "rental-fleet",
    caption: "Rental vehicles in Liberia",
    alt: "Blue Mitsubishi and white Ford rental vehicles parked in Liberia",
  },
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
    caption: "Photo: traveler at the airport checking flight details",
    alt: "A traveler with luggage checking flight details on a phone at an airport",
    file: "flights",
  },
  visa: {
    id: "visa",
    caption: "Photo: visa documents being reviewed at a travel agency desk",
    alt: "A travel consultant reviewing passport and visa documents with a client",
    file: "visa",
  },
  concierge: {
    id: "concierge",
    caption: "Photo: airport pickup arranged before arrival",
    alt: "A professional driver greeting an arriving traveler with luggage outside an airport",
    file: "concierge",
  },
  team: {
    id: "team",
    caption: "Photo: travel consultants helping a client plan a trip",
    alt: "Travel consultants sitting with a client in a bright office and planning a trip",
    file: "team",
  },
  office: {
    id: "office",
    caption: "Photo: welcoming travel agency office reception",
    alt: "A visitor entering a bright travel agency reception area",
    file: "office",
  },
} satisfies Record<string, ImageSlot>;

export const nav: Link[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/#services" },
  { label: "Visa", href: "/visa" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const ctas = {
  whatsapp: "WhatsApp us",
  whatsappLong: "Chat on WhatsApp",
  quote: "Get a free quote",
  call: `Call ${business.phoneDisplay}`,
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
  title: "Travel the World without a guesswork",
  subtitle:
    "Flight booking, visa application support, hotels and airport pickup from a Monrovia travel agency you can reach on WhatsApp.",
  location: `Office on ${business.street}, ${business.city}. Open ${business.hoursShort}.`,
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
  title: "Travel services built for real trips from Liberia",
  text: "Choose one service or ask us to combine flights, visas, hotels and arrival support into one plan.",
};

export const services: Service[] = [
  {
    id: "flights",
    slug: "/flights-hotels",
    icon: "plane",
    title: "Flights & hotels",
    summary:
      "We compare flight and hotel options for your dates, then send the best-fit choices with the full price shown up front.",
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
      "We help you prepare a complete application file, review documents and book appointments. Embassies decide; we keep the process clear.",
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
    title: "Car rentals & Liberia concierge",
    summary:
      "Daily and long-term car rentals, airport pickup and drop-off, local tours and transport for events or business in Liberia.",
    checklist: [
      "Airport pickup and drop-off",
      "Daily and long-term car rentals",
      "Wedding and event transportation",
      "Delivery and business transport",
    ],
    cta: "Plan your arrival",
    image: images.sedan,
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
  noteLabel: "About visa requirements",
  purposesLabel: "Visa purposes for",
};

export const destinations: Destination[] = [
  {
    slug: "united-states",
    name: "United States",
    shortName: "the US",
    region: "North America",
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
    region: "Europe",
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
    region: "North America",
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
    region: "Europe",
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
    region: "Middle East",
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
    region: "East Asia",
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
  eyebrow: "Meet Tarley Travel",
  title: "Your travel plans, handled by people who know Liberia",
  lead: `${business.name} is a travel agency based in ${business.city}, ${business.country}.`,
  story:
    "From finding a flight to preparing your visa application, our Monrovia team helps you put the details in place. Traveling to Liberia? We can arrange your pickup, hotel and driver before you land.",
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
    { label: "Contact", href: "/contact" },
  ] satisfies Link[],
  copyright: `© ${new Date().getFullYear()} ${business.name}. All rights reserved.`,
  credits: { label: "Photo credits", href: "/credits" } satisfies Link,
};

export const creditsPage = {
  title: "Photo credits",
  lead: "The photos on this site and the people who took them.",
  intro:
    "Some photos are shared under Creative Commons licenses that ask for the photographer to be named. Photos marked CC0 are free to use without credit; we list them anyway.",
  photographer: "Photographer",
  license: "License",
  source: "Source",
  view: "View the original",
  usedOn: "Photo",
};

/* ---------- Quote form ---------- */

export const quote = {
  title: "Request a quote",
  subtitle: "Share a few details. A real person replies on WhatsApp.",
  noPayment: "Free quote. No payment until you confirm.",
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
  conciergeServices: [
    "Airport pickup or drop-off",
    "Hotel or lodge",
    "Car rental",
    "Tours or staycation",
    "Wedding or event transport",
    "Delivery or business transport",
  ],
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
  lead: "Tell us where and when. We compare flight and hotel options from Monrovia and send clear prices before anything is booked.",
  includedTitle: "What we book",
  included: [
    {
      icon: "plane",
      title: "Flights",
      text: "Domestic and international flights: one-way, return and multi-city tickets for individuals, families and groups.",
    },
    {
      icon: "bed",
      title: "Hotels & lodges",
      text: "Hotel and lodge reservations in Liberia and at your destination.",
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
    "Each option shows the full price: fare, taxes and our service fee.",
    "You choose. Nothing is booked until you confirm.",
    `You pay by ${business.paymentMethods.join(", ").replace(/, ([^,]*)$/, " or $1")}, and you get a receipt for every payment.`,
    "Your e-ticket and booking details come to you on WhatsApp and email.",
  ],
  packagesTitle: "Packages on request",
  packagesText:
    "Local and international tour packages, vacations, staycations, honeymoons and group trips. Tell us your dates, budget and interests, and we help arrange the travel and accommodation.",
  packagesCta: "Ask about a package",
  formTitle: "Get a flight quote",
};

export const visaPage = {
  title: "Visa assistance in Monrovia",
  lead: "We help travelers in Liberia prepare complete visa files for the US, UK, Canada, Schengen Area, UAE, China and other destinations.",
  doesTitle: "What we do",
  doesLead:
    "From the first question to the appointment, we prepare the application with you and keep the requirements current.",
  does: [
    { icon: "compass", text: "Work out which visa fits your trip" },
    { icon: "list", text: "Give you the document checklist for your case" },
    { icon: "file-check", text: "Review every document before you submit" },
    { icon: "calendar", text: "Book your appointment" },
    { icon: "refresh", text: "Help with extensions and renewals" },
  ] satisfies { icon: IconName; text: string }[],
  doesNotTitle: "What we do not do",
  doesNotLead: "So there are no surprises later.",
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
  fleetTitle: "Cars available for rent",
  fleetText:
    "Choose a daily or long-term rental. Send us your dates and preferred car for availability, pricing and rental terms.",
  fleetCta: "Ask about this car",
  fleet: [
    { name: "White sedan", image: images.sedan },
    { name: "Red Ford Fusion", image: images.ford },
    { name: "Mitsubishi & Ford", image: images.fleet },
  ],
  title: "Car rentals & travel services in Liberia",
  lead: "Rent a car for a day or a longer stay. Our Monrovia team also arranges airport transfers, hotels and lodges, local tours, event transport and business deliveries.",
  includedTitle: "What we arrange",
  included: [
    {
      icon: "plane",
      title: "Airport pickup & drop-off",
      text: "Transfers to and from Roberts International Airport, arranged around your flight.",
    },
    {
      icon: "bed",
      title: "Hotels, lodges & staycations",
      text: "Accommodation and vacation planning in Monrovia and across Liberia.",
    },
    {
      icon: "car",
      title: "Daily & long-term car rentals",
      text: "Cars for errands, family visits and longer stays. Ask about availability and driver arrangements for your dates.",
    },
    {
      icon: "pin",
      title: "Local tours",
      text: "Day trips and tour packages around Liberia, planned around your time and interests.",
    },
    {
      icon: "people",
      title: "Wedding & event transport",
      text: "Transportation for wedding parties, guests and other events.",
    },
    {
      icon: "car",
      title: "Delivery & business transport",
      text: "Transport and deliveries for your business. Share the route, schedule and what needs moving.",
    },
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
  teamTitle: "Based in Monrovia",
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
  closedDay: "Sunday",
  closed: "Closed",
  mapTitle: "Find the office",
  mapLabel: "Old Road, Oldest Congo Town, Monrovia",
  mapNote:
    "The map shows our area in Monrovia. Message us for the exact office pin and directions before you visit.",
  directions: "Ask for directions",
  directionsMessage: "Hello Tarley Travel, could you send me directions to your office?",
  followTitle: "Follow us",
  followText: "Find Tarley Travel on Facebook and Instagram.",
  fastest: "Fastest",
};

export const notFoundPage = {
  title: "We couldn't find that page",
  text: "The link may be old or mistyped. Here are the places most people are looking for.",
  home: "Go to the homepage",
  cardTitle: "Page not found",
  cardCode: "404",
  requested: "You asked for",
  requestedFallback: "an address that does not exist",
  servicesTitle: "Our services",
  destinationsTitle: "Visa destinations",
  helpTitle: "Still can't find it?",
  helpText: "Send us a message on WhatsApp and we'll point you to the right page.",
};

/** Label for the header button that jumps to the quote form on long inner pages. */
export const jumpToQuote = "Get a free quote";

/* ---------- Page metadata ---------- */

export const meta = {
  home: {
    title: "Travel Agency in Monrovia, Liberia | Tarley Travel",
    description:
      "Tarley Travel helps with flights, hotels, visa assistance and Liberia airport pickup from Monrovia. Get a free quote on WhatsApp.",
  },
  flights: {
    title: "Flight Booking & Hotels in Monrovia | Tarley Travel",
    description:
      "Book flights and hotels from Monrovia with clear prices, receipts and WhatsApp support from Tarley Travel.",
  },
  visa: {
    title: "Visa Assistance in Monrovia, Liberia | Tarley Travel",
    description:
      "Visa application support in Liberia for the US, UK, Canada, Schengen Area, UAE and China. Document review and appointment booking.",
  },
  concierge: {
    title: "Car Rentals & Airport Transfers in Liberia | Tarley Travel",
    description:
      "Daily and long-term car rentals in Monrovia, airport pickup and drop-off, local tours, event transport and business deliveries with Tarley Travel.",
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
  credits: {
    title: "Photo credits | Tarley Travel",
    description: "Photographers and licenses for the photos used on the Tarley Travel website.",
  },
  notFound: {
    title: "Page not found | Tarley Travel",
    description:
      "This page does not exist. Find flights, visa assistance and Liberia concierge services.",
  },
} satisfies Record<string, PageMeta>;

export function destinationMeta(destination: Destination): PageMeta {
  return {
    title: `${destination.name} Visa Help from Liberia | Tarley Travel`,
    description: `Visa assistance in Monrovia for ${destination.name}: application guidance, document review and appointment support.`,
  };
}
