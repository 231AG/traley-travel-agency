import { business, services, social } from "@content/site";
import type { PageMeta } from "@lib/types";

export function pageJsonLd(pathname: string, meta: PageMeta): string {
  const url = canonical(pathname);
  const type =
    pathname === "/contact" ? "ContactPage" : pathname === "/about" ? "AboutPage" : "WebPage";
  const crumbs = [{ "@type": "ListItem", position: 1, name: "Home", item: `${business.url}/` }];
  if (pathname.startsWith("/visa/")) {
    crumbs.push({
      "@type": "ListItem",
      position: 2,
      name: "Visa assistance",
      item: `${business.url}/visa`,
    });
  }
  if (pathname !== "/") {
    crumbs.push({
      "@type": "ListItem",
      position: crumbs.length + 1,
      name: meta.title.split(" | ")[0] ?? meta.title,
      item: url,
    });
  }
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": type,
        "@id": `${url}#webpage`,
        url,
        name: meta.title,
        description: meta.description,
        inLanguage: "en",
        isPartOf: { "@id": `${business.url}/#website` },
        about: { "@id": `${business.url}/#travelagency` },
        ...(pathname !== "/" ? { breadcrumb: { "@id": `${url}#breadcrumb` } } : {}),
      },
      ...(pathname !== "/"
        ? [{ "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`, itemListElement: crumbs }]
        : []),
    ],
  }).replace(/</g, "\\u003c");
}

export function canonical(pathname: string): string {
  const clean = pathname
    .replace(/\.html$/, "")
    .replace(/\/index$/, "")
    .replace(/\/$/, "");
  return `${business.url}${clean === "" ? "/" : clean}`;
}

/** schema.org TravelAgency with confirmed facts only. No ratings until real reviews exist. */
export function travelAgencyJsonLd(): string {
  const agencyId = `${business.url}/#travelagency`;
  const websiteId = `${business.url}/#website`;
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: business.shortName,
        url: business.url,
        publisher: { "@id": agencyId },
        inLanguage: "en",
      },
      {
        "@type": "TravelAgency",
        "@id": agencyId,
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
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: business.phoneHref.replace("tel:", ""),
            contactType: "customer service",
            areaServed: business.countryCode,
            availableLanguage: ["en"],
          },
        ],
        paymentAccepted: business.paymentMethods.join(", "),
        areaServed: [
          { "@type": "Country", name: business.country },
          { "@type": "City", name: business.city },
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Travel services",
          itemListElement: services.map((service) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: service.title,
              description: service.summary,
              areaServed: business.country,
              provider: { "@id": agencyId },
            },
            url: `${business.url}${service.slug}`,
          })),
        },
        sameAs: social.map((link) => link.href),
      },
    ],
  };
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
