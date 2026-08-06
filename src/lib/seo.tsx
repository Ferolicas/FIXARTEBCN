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
  keywords?: string[];
}): Metadata {
  const url = absoluteUrl(opts.path);
  return {
    title: opts.title,
    description: opts.description,
    keywords: opts.keywords,
    alternates: { canonical: url },
    robots: opts.noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          // Sin recorte en el fragmento ni en la vista previa: es lo que leen
          // tanto Google como los buscadores con IA para citar la página.
          googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 },
        },
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

/** Municipios del área metropolitana en los que se presta servicio. */
export const ZONAS = [
  "Barcelona",
  "Badalona",
  "L'Hospitalet de Llobregat",
  "Santa Coloma de Gramenet",
  "Sant Adrià de Besòs",
  "Esplugues de Llobregat",
  "Cornellà de Llobregat",
  "Sant Cugat del Vallès",
  "Montgat",
  "Tiana",
];

export function localBusinessSchema(
  contact: Contact,
  social: Social,
  extra?: {
    servicios?: { title: string; slug: string; shortDesc: string }[];
    valoracion?: { media: number; total: number } | null;
  }
) {
  const servicios = extra?.servicios || [];
  const v = extra?.valoracion;

  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${SITE_URL}/#business`,
    name: SITE_NAME,
    alternateName: ["FixArte", "FixArte Barcelona"],
    description:
      "Fontanero, electricista, pintor y empresa de reformas en Barcelona, Badalona y el área metropolitana. Mantenimiento, reparaciones e instalaciones para viviendas, locales, oficinas y comunidades, con urgencias 24 h y presupuesto cerrado por escrito.",
    slogan: "Presupuesto cerrado por escrito, sin sorpresas",
    url: SITE_URL,
    logo: absoluteUrl("/icon.png"),
    image: absoluteUrl("/opengraph-image"),
    telephone: contact.phone,
    email: contact.email,
    priceRange: "€€",
    currenciesAccepted: "EUR",
    paymentAccepted: "Efectivo, Transferencia bancaria, Bizum, Tarjeta",
    address: {
      "@type": "PostalAddress",
      addressLocality: contact.city || "Barcelona",
      addressRegion: "Barcelona",
      postalCode: "08001",
      addressCountry: "ES",
    },
    // Centro de Barcelona: ancla geográfica para las búsquedas locales
    geo: { "@type": "GeoCoordinates", latitude: 41.3874, longitude: 2.1686 },
    areaServed: ZONAS.map((name) => ({ "@type": "City", name })),
    serviceArea: {
      "@type": "GeoCircle",
      geoMidpoint: { "@type": "GeoCoordinates", latitude: 41.3874, longitude: 2.1686 },
      geoRadius: "25000",
    },
    knowsAbout: [
      "fontanería",
      "electricidad",
      "pintura",
      "pladur y tabiquería",
      "carpintería",
      "montaje de muebles",
      "instalación de cocinas",
      "reparaciones del hogar",
      "mantenimiento de comunidades",
      "reformas integrales",
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "00:00",
        closes: "23:59",
      },
    ],
    // Catálogo: es lo que permite a un buscador responder "¿quién cambia un
    // grifo en Barcelona?" con esta empresa
    ...(servicios.length
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Servicios en Barcelona y área metropolitana",
            itemListElement: servicios.map((s) => ({
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: `${s.title} en Barcelona`,
                description: s.shortDesc,
                url: absoluteUrl(`/servicios/${s.slug}`),
                areaServed: { "@type": "City", name: "Barcelona" },
              },
            })),
          },
        }
      : {}),
    // Sólo se declara si hay reseñas reales publicadas
    ...(v && v.total > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: v.media.toFixed(1),
            reviewCount: v.total,
            bestRating: "5",
            worstRating: "1",
          },
        }
      : {}),
    sameAs: sameAs(social),
  };
}

export function serviceSchema(opts: {
  name: string;
  description: string;
  slug: string;
  schemaType: string;
  contact: Contact;
  /** Tareas concretas del servicio: "cambio de grifo", "pintar piso"… */
  tareas?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(`/servicios/${opts.slug}`),
    serviceType: opts.name,
    areaServed: ZONAS.map((name) => ({ "@type": "City", name })),
    availableChannel: {
      "@type": "ServiceChannel",
      servicePhone: { "@type": "ContactPoint", telephone: opts.contact.phone, contactType: "customer service" },
      serviceUrl: absoluteUrl(`/servicios/${opts.slug}`),
    },
    // Cada tarea como oferta: es lo que permite a un buscador responder a
    // consultas concretas del tipo "cambio de grifo Barcelona"
    ...(opts.tareas?.length
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: `${opts.name}: trabajos habituales`,
            itemListElement: opts.tareas.map((t) => ({
              "@type": "Offer",
              itemOffered: { "@type": "Service", name: t, areaServed: { "@type": "City", name: "Barcelona" } },
            })),
          },
        }
      : {}),
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      priceSpecification: {
        "@type": "PriceSpecification",
        description: "Presupuesto gratuito, cerrado y por escrito, sin compromiso",
      },
    },
    provider: {
      "@type": opts.schemaType,
      "@id": `${SITE_URL}/#business`,
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
