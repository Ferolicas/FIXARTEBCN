import { db } from "@/lib/db";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { FloatingCta } from "@/components/site/FloatingCta";
import { QuoteProvider } from "@/components/site/QuoteModal";
import { LegalProvider } from "@/components/site/LegalModal";
import { LegalContent } from "@/lib/legal";
import { JsonLd, localBusinessSchema } from "@/lib/seo";
import { getContact, getSocial } from "@/lib/content";

export const revalidate = 600;

export default async function WebLayout({ children }: { children: React.ReactNode }) {
  const [contact, social, services, valoraciones] = await Promise.all([
    getContact(),
    getSocial(),
    db.service.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      select: { slug: true, title: true, shortDesc: true },
    }),
    db.testimonial.findMany({ where: { published: true }, select: { rating: true } }),
  ]);

  // Sólo se declara la valoración media si hay reseñas reales publicadas
  const valoracion = valoraciones.length
    ? { media: valoraciones.reduce((s, t) => s + t.rating, 0) / valoraciones.length, total: valoraciones.length }
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
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-xl focus:bg-ink-900 focus:px-4 focus:py-2 focus:text-white"
      >
        Saltar al contenido
      </a>
      <JsonLd data={localBusinessSchema(contact, social, { servicios: services, valoracion })} />
      <Header />
      <main id="contenido">{children}</main>
      <Footer />
      <FloatingCta phone={contact.phone} whatsapp={contact.whatsapp} />
    </QuoteProvider>
    </LegalProvider>
  );
}
