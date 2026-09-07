import { db } from "@/lib/db";
import { V2Header } from "@/components/v2/V2Header";
import { V2Footer } from "@/components/v2/V2Footer";
import { V2FloatingCta } from "@/components/v2/V2FloatingCta";
import { QuoteProvider } from "@/components/site/QuoteModal";
import { LegalProvider } from "@/components/site/LegalModal";
import { LegalContent } from "@/lib/legal";
import { JsonLd, localBusinessSchema } from "@/lib/seo";
import { getContact, getSocial } from "@/lib/content";
import "./v2.css";

export const revalidate = 600;

export default async function V2Layout({ children }: { children: React.ReactNode }) {
  const [contact, social, services, ratings] = await Promise.all([
    getContact(),
    getSocial(),
    db.service.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      select: { slug: true, title: true, shortDesc: true },
    }),
    db.testimonial.findMany({ where: { published: true }, select: { rating: true } }),
  ]);

  const rating = ratings.length
    ? { media: ratings.reduce((sum, item) => sum + item.rating, 0) / ratings.length, total: ratings.length }
    : null;

  return (
    <LegalProvider
      docs={{
        "aviso-legal": <LegalContent doc="aviso-legal" contact={contact} />,
        "politica-privacidad": <LegalContent doc="politica-privacidad" contact={contact} />,
        "politica-cookies": <LegalContent doc="politica-cookies" contact={contact} />,
      }}
    >
      <QuoteProvider
        services={services}
        phone={contact.phone}
        phoneDisplay={contact.phoneDisplay}
        whatsapp={contact.whatsapp}
      >
        <div className="fixarte-v2">
          <a
            href="#contenido-v2"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:bg-ink-900 focus:px-4 focus:py-2 focus:text-white"
          >
            Saltar al contenido
          </a>
          <JsonLd data={localBusinessSchema(contact, social, { servicios: services, valoracion: rating })} />
          <V2Header />
          <main id="contenido-v2">{children}</main>
          <V2Footer />
          <V2FloatingCta phone={contact.phone} whatsapp={contact.whatsapp} />
        </div>
      </QuoteProvider>
    </LegalProvider>
  );
}
