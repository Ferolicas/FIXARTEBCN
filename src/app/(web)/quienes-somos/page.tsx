import type { Metadata } from "next";
import { getAbout, getContact } from "@/lib/content";
import { paragraphs } from "@/lib/markdown";
import { pageMetadata, JsonLd, breadcrumbSchema } from "@/lib/seo";
import { Icon } from "@/components/site/Icons";
import { SectionHeading, CtaBand, Breadcrumbs } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";

export const revalidate = 600;

export const metadata: Metadata = pageMetadata({
  title: "Quiénes somos | FixArte BCN",
  description:
    "Conoce FixArte BCN: empresa de mantenimiento, reparaciones e instalaciones en Barcelona. Nuestra misión, visión y los valores que guían cada trabajo.",
  path: "/quienes-somos",
});

const crumbs = [
  { name: "Inicio", path: "/" },
  { name: "Quiénes somos", path: "/quienes-somos" },
];

export default async function AboutPage() {
  const [about, contact] = await Promise.all([getAbout(), getContact()]);

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <Breadcrumbs items={crumbs} />

      <section className="container-site py-10 sm:py-14">
        <SectionHeading as="h1" kicker="Quiénes somos" title="Personas que cuidan tu hogar como si fuera suyo" />
        <div className="prose-fix mt-6 max-w-3xl">
          {paragraphs(about.intro).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      <section className="bg-cream-50 py-14 sm:py-16">
        <div className="container-site grid gap-4 md:grid-cols-2">
          <Reveal>
            <div className="card h-full border-l-4 !border-l-accent-500 p-7">
              <Icon name="sparkles" className="h-6 w-6 text-accent-500" />
              <h2 className="mt-3 text-2xl">Nuestra misión</h2>
              <p className="mt-3 leading-relaxed text-ink-700">{about.mission}</p>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="card h-full border-l-4 !border-l-ink-800 p-7">
              <Icon name="building" className="h-6 w-6 text-ink-800" />
              <h2 className="mt-3 text-2xl">Nuestra visión</h2>
              <p className="mt-3 leading-relaxed text-ink-700">{about.vision}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-14 sm:py-16">
        <div className="container-site">
          <SectionHeading kicker="Lo que nos define" title="Nuestros valores" center />
          <ul className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            {about.values.map((v, i) => (
              <Reveal key={v} delay={i * 40}>
                <li className="card flex h-full flex-col items-center gap-2 p-5 text-center">
                  <Icon name="check" className="h-5 w-5 text-accent-500" />
                  <span className="text-sm font-semibold text-ink-900">{v}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand phone={contact.phone} whatsapp={contact.whatsapp} />
    </>
  );
}
