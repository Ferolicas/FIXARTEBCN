import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getContact } from "@/lib/content";
import { pageMetadata, JsonLd, breadcrumbSchema, absoluteUrl } from "@/lib/seo";
import { Icon } from "@/components/site/Icons";
import { SectionHeading, CtaBand, Breadcrumbs } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";

export const revalidate = 600;

export const metadata: Metadata = pageMetadata({
  title: "Servicios de mantenimiento y reformas en Barcelona | FixArte BCN",
  description:
    "Electricidad, fontanería, pintura, pladur, carpintería, cocinas, reparaciones, mantenimiento de comunidades y reformas en Barcelona y Badalona.",
  path: "/servicios",
});

const crumbs = [
  { name: "Inicio", path: "/" },
  { name: "Servicios", path: "/servicios" },
];

export default async function ServicesPage() {
  const [services, contact] = await Promise.all([
    db.service.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
    getContact(),
  ]);

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: services.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.heroTitle,
      url: absoluteUrl(`/servicios/${s.slug}`),
    })),
  };

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), itemList]} />
      <Breadcrumbs items={crumbs} />

      <section className="container-site py-10 sm:py-14">
        <SectionHeading
          as="h1"
          kicker="Nuestros servicios"
          title="Servicios de mantenimiento y reformas en Barcelona"
          text="Soluciones integrales de mantenimiento, reparación e instalación para viviendas, locales comerciales, oficinas y comunidades de propietarios. Profesionalidad, materiales de calidad y compromiso con la satisfacción del cliente."
        />
      </section>

      <section className="container-site pb-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.id} delay={(i % 3) * 60}>
              <Link
                href={`/servicios/${s.slug}`}
                className="card group flex h-full flex-col p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-ink-900/8"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
                    <Icon name={s.icon} className="h-6 w-6" />
                  </span>
                  <h2 className="text-lg leading-tight">{s.title}</h2>
                </div>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-700">{s.shortDesc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent-600">
                  Ver servicio
                  <Icon name="arrow-right" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
        <p className="mx-auto mt-10 max-w-2xl text-center text-ink-700">
          ¿No encuentras exactamente lo que necesitas? Analizamos cada proyecto de forma personalizada para ofrecerte la
          mejor solución, con transparencia, calidad y atención cercana.{" "}
          <Link href="/contacto" className="font-semibold text-accent-600 underline underline-offset-2">
            Cuéntanoslo
          </Link>
          .
        </p>
      </section>

      <CtaBand phone={contact.phone} whatsapp={contact.whatsapp} />
    </>
  );
}
