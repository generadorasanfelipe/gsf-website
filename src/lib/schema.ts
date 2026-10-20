// JSON-LD structured data builders for schema.org markup.
// Consumed by components that render <script type="application/ld+json"> tags.

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://gsf-website-sable.vercel.app";

export const GSF_ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const GSF_WEBSITE_ID = `${SITE_URL}/#website`;

const organizationRef = { "@id": GSF_ORGANIZATION_ID };

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": GSF_ORGANIZATION_ID,
    name: "Generadora San Felipe Limited Partnership",
    legalName: "Generadora San Felipe Limited Partnership",
    alternateName: ["GSF", "Generadora San Felipe"],
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/images/logo-gsf-new.png`,
      width: 200,
      height: 60,
    },
    image: `${SITE_URL}/images/og-image.jpg`,
    description:
      "Generadora San Felipe construye una central de ciclo combinado de 467 MW en República Dominicana con tecnología GE Vernova 7HA.02.",
    knowsAbout: [
      "Combined cycle power generation",
      "Natural gas power plants",
      "Energy infrastructure",
      "GE Vernova 7HA.02 gas turbine",
      "Electric power transmission",
    ],
    areaServed: {
      "@type": "Country",
      name: "Dominican Republic",
      identifier: "DO",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Av. Gustavo Mejía Ricart #102, Suite 701",
      addressLocality: "Santo Domingo",
      addressRegion: "Piantini",
      addressCountry: "DO",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-809-563-8182",
      email: "contacto@gsf.com.do",
      contactType: "customer service",
      areaServed: "DO",
      availableLanguage: ["Spanish", "English"],
    },
    sameAs: [
      "https://do.linkedin.com/company/generadora-san-felipe-lp",
      "https://www.instagram.com/generadorasanfelipe",
    ],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": GSF_WEBSITE_ID,
    url: SITE_URL,
    name: "Generadora San Felipe",
    inLanguage: ["es-DO", "en"],
    publisher: organizationRef,
    description:
      "Sitio oficial de Generadora San Felipe — central de ciclo combinado de 467 MW en República Dominicana.",
  };
}

export type MilestoneEventInput = {
  title: string;
  description: string;
  date: string; // ISO YYYY-MM-DD
  locationName?: string;
  locationCountry?: string;
  status: "completed" | "in_progress" | "upcoming";
};

export function eventSchema(input: MilestoneEventInput) {
  // Schema.org EventStatusType has no "completed" value — the valid options are
  // EventScheduled / EventCancelled / EventPostponed / EventRescheduled /
  // EventMovedOnline. A past (completed) event is simply EventScheduled with a
  // startDate in the past, so every milestone uses EventScheduled. The visual
  // completed/in_progress/upcoming distinction lives in the UI, not here.
  const eventStatus = "https://schema.org/EventScheduled";

  return {
    "@type": "Event",
    name: input.title,
    description: input.description,
    startDate: input.date,
    eventStatus,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    organizer: organizationRef,
    location: {
      "@type": "Place",
      name: input.locationName ?? "Punta Caucedo, Boca Chica",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Boca Chica",
        addressRegion: "Santo Domingo",
        addressCountry: input.locationCountry ?? "DO",
      },
    },
  };
}

export function eventListSchema(milestones: MilestoneEventInput[]) {
  return {
    "@context": "https://schema.org",
    "@graph": milestones.map(eventSchema),
  };
}

export type NewsArticleInput = {
  url: string;
  headline: string;
  source: string;
  datePublished: string; // ISO YYYY-MM-DD when available
  imageUrl: string;
  description?: string;
};

export function newsArticleSchema(input: NewsArticleInput) {
  const image = input.imageUrl.startsWith("http")
    ? input.imageUrl
    : `${SITE_URL}${input.imageUrl}`;
  const publisher = {
    "@type": "Organization" as const,
    name: input.source,
  };
  return {
    "@type": "NewsArticle",
    headline: input.headline,
    url: input.url,
    mainEntityOfPage: input.url,
    datePublished: input.datePublished,
    image,
    // Google Rich Results recommends `author` on NewsArticle. For coverage
    // without an individual byline we attribute authorship to the publishing
    // outlet itself, which Google explicitly accepts.
    author: publisher,
    publisher,
    about: organizationRef,
    ...(input.description ? { description: input.description } : {}),
  };
}

export function newsArticleListSchema(articles: NewsArticleInput[]) {
  return {
    "@context": "https://schema.org",
    "@graph": articles.map(newsArticleSchema),
  };
}

export type GalleryImageInput = {
  src: string;
  caption: string;
  description?: string;
  datePublished?: string;
};

export function imageObjectSchema(input: GalleryImageInput) {
  const url = input.src.startsWith("http") ? input.src : `${SITE_URL}${input.src}`;
  return {
    "@type": "ImageObject",
    contentUrl: url,
    url,
    name: input.caption,
    ...(input.description ? { description: input.description } : {}),
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    creator: organizationRef,
    copyrightHolder: organizationRef,
    contentLocation: {
      "@type": "Place",
      name: "GSF-1 construction site, Punta Caucedo, Boca Chica, Dominican Republic",
    },
  };
}

export function imageGallerySchema(
  galleryName: string,
  images: GalleryImageInput[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: galleryName,
    about: organizationRef,
    image: images.map(imageObjectSchema),
  };
}

// Helper for rendering JSON.stringify safely into a <script> tag
export function toJsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
