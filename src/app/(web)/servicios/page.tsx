import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getContact } from "@/lib/content";
import { pageMetadata, JsonLd, breadcrumbSchema, absoluteUrl } from "@/lib/seo";
import { SectionHeading, CtaBand, Breadcrumbs } from "@/components/site/Section";
import { MotionLinkGrid } from "@/components/site/MotionLinkGrid";

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
        <MotionLinkGrid
          columns={3}
          items={services.map((s) => ({
            href: `/servicios/${s.slug}`,
            icon: s.icon,
            title: s.title,
            text: s.shortDesc,
            cta: "Ver servicio",
            image: s.image,
          }))}
        />
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
