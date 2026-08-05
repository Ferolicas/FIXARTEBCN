import Link from "next/link";
import type { Metadata } from "next";
import { getEngineering, getContact } from "@/lib/content";
import { pageMetadata, JsonLd, breadcrumbSchema } from "@/lib/seo";
import { Icon } from "@/components/site/Icons";
import { SectionHeading, CtaBand, Breadcrumbs } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";

export const revalidate = 600;

export const metadata: Metadata = pageMetadata({
  title: "Ingeniería y soluciones técnicas en Barcelona | FixArte BCN",
  description:
    "Diagnóstico de instalaciones, mantenimiento técnico y asesoramiento para empresas, comunidades y proyectos de reforma en Barcelona. Soluciones eficientes y seguras.",
  path: "/ingenieria",
});

const crumbs = [
  { name: "Inicio", path: "/" },
  { name: "Ingeniería y soluciones técnicas", path: "/ingenieria" },
];

const ICONS = ["gear", "shield", "sparkles", "ruler"];

export default async function EngineeringPage() {
  const [eng, contact] = await Promise.all([getEngineering(), getContact()]);

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <Breadcrumbs items={crumbs} />

      <section className="container-site py-10 sm:py-14">
        <SectionHeading
          as="h1"
          kicker="Para empresas y profesionales"
          title={eng.title}
          text={eng.paragraphs[0]}
        />
        <div className="prose-fix mt-6 max-w-3xl">
          {eng.paragraphs.slice(1).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      <section className="bg-cream-50 py-14 sm:py-16">
        <div className="container-site">
          <SectionHeading kicker="Capacidades" title="Qué aportamos a tu proyecto" center />
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {eng.items.map((item, i) => (
              <Reveal key={item.title} delay={i * 60}>
                <div className="card flex h-full gap-4 p-6">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ink-50 text-ink-800">
                    <Icon name={ICONS[i % ICONS.length]} className="h-6 w-6" />
                  </span>
                  <div>
                    <h2 className="text-lg">{item.title}</h2>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-700">{item.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mx-auto mt-10 max-w-2xl rounded-2xl bg-ink-50 p-6 text-center">
            <p className="text-sm leading-relaxed text-ink-800">
              ¿Gestionas una <strong>comunidad, oficina o local</strong>? Descubre también nuestro servicio de{" "}
              <Link href="/servicios/mantenimiento-comunidades-barcelona" className="font-semibold text-accent-600 underline underline-offset-2">
                mantenimiento integral para comunidades y empresas
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <div className="pt-10">
        <CtaBand
          title="Cuéntanos tu reto técnico"
          text="Analizamos tu instalación o proyecto y te proponemos la solución más eficiente, segura y duradera."
          phone={contact.phone}
          whatsapp={contact.whatsapp}
        />
      </div>
    </>
  );
}
