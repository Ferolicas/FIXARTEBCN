import type { Metadata } from "next";
import type { Contact, Social } from "./content";

export const SITE_URL = process.env.SITE_URL || "https://fixartebcn.es";
export const SITE_NAME = "FixArte BCN";

export function absoluteUrl(path = "/"): string {
  return new URL(path, SITE_URL).toString();
}

export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  noIndex?: boolean;
}): Metadata {
  const url = absoluteUrl(opts.path);
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    robots: opts.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: SITE_NAME,
      locale: "es_ES",
      type: "website",
      images: [{ url: opts.ogImage || absoluteUrl("/opengraph-image"), width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
    },
  };
}

/** Redes sociales con URL rellenada, para sameAs. */
export function sameAs(social: Social): string[] {
  return [social.instagram, social.facebook, social.youtube, social.wallapop, social.milanuncios, social.linkedin, social.maps].filter(Boolean);
}

export function localBusinessSchema(contact: Contact, social: Social) {
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${SITE_URL}/#business`,
    name: SITE_NAME,
    description:
      "Empresa de mantenimiento, reparaciones, instalaciones y reformas para viviendas, locales, oficinas y comunidades en Barcelona, Badalona y el área metropolitana.",
    url: SITE_URL,
    logo: absoluteUrl("/icon.svg"),
    image: absoluteUrl("/opengraph-image"),
    telephone: contact.phone,
    email: contact.email,
    priceRange: "€€",
    address: {
      "@type": "PostalAddress",
      addressLocality: contact.city || "Barcelona",
      addressRegion: "Barcelona",
      addressCountry: "ES",
    },
    areaServed: [
      { "@type": "City", name: "Barcelona" },
      { "@type": "City", name: "Badalona" },
      { "@type": "City", name: "L'Hospitalet de Llobregat" },
      { "@type": "City", name: "Santa Coloma de Gramenet" },
      { "@type": "City", name: "Sant Adrià de Besòs" },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "00:00",
        closes: "23:59",
      },
    ],
    sameAs: sameAs(social),
  };
}

export function serviceSchema(opts: {
  name: string;
  description: string;
  slug: string;
  schemaType: string;
  contact: Contact;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(`/servicios/${opts.slug}`),
    areaServed: [
      { "@type": "City", name: "Barcelona" },
      { "@type": "City", name: "Badalona" },
    ],
    provider: {
      "@type": opts.schemaType,
      name: SITE_NAME,
      telephone: opts.contact.phone,
      url: SITE_URL,
      address: { "@type": "PostalAddress", addressLocality: "Barcelona", addressCountry: "ES" },
    },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function blogPostingSchema(opts: {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: Date;
  updatedAt: Date;
  image?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: opts.title,
    description: opts.excerpt,
    url: absoluteUrl(`/consejos/${opts.slug}`),
    image: opts.image ? absoluteUrl(opts.image) : absoluteUrl("/opengraph-image"),
    datePublished: opts.publishedAt.toISOString(),
    dateModified: opts.updatedAt.toISOString(),
    inLanguage: "es-ES",
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: absoluteUrl("/icon.svg") },
    },
  };
}

export function JsonLd({ data }: { data: object | object[] }) {
  const list = Array.isArray(data) ? data : [data];
  return (
    <>
      {list.map((d, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(d).replace(/</g, "\\u003c") }}
        />
      ))}
    </>
  );
}
