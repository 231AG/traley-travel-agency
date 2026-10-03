import { business, social } from "@content/site";

export function canonical(pathname: string): string {
  const clean = pathname
    .replace(/\.html$/, "")
    .replace(/\/index$/, "")
    .replace(/\/$/, "");
  return `${business.url}${clean === "" ? "/" : clean}`;
}

/** schema.org TravelAgency with confirmed facts only. No ratings until real reviews exist. */
export function travelAgencyJsonLd(): string {
  const data = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: business.name,
    url: business.url,
    logo: `${business.url}/brand/icon-512.png`,
    image: `${business.url}/og/default.jpg`,
    slogan: business.tagline,
    telephone: business.phoneHref.replace("tel:", ""),
    email: business.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.street,
      addressLocality: business.city,
      addressCountry: business.countryCode,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: business.openingHoursSpec.days,
        opens: business.openingHoursSpec.opens,
        closes: business.openingHoursSpec.closes,
      },
    ],
    paymentAccepted: business.paymentMethods.join(", "),
    areaServed: "Liberia",
    sameAs: social.map((link) => link.href),
  };
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
