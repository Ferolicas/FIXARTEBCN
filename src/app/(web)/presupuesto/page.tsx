import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getContact, waLink } from "@/lib/content";
import { pageMetadata, JsonLd, breadcrumbSchema } from "@/lib/seo";
import { Icon } from "@/components/site/Icons";
import { SectionHeading, Breadcrumbs } from "@/components/site/Section";
import { LeadForm } from "@/components/site/LeadForm";

export const revalidate = 600;

export const metadata: Metadata = pageMetadata({
  title: "Pide presupuesto sin compromiso | FixArte BCN",
  description:
    "Solicita tu presupuesto de reformas, reparaciones o mantenimiento en Barcelona. Adjunta fotos, recibe respuesta rápida y un precio claro y sin compromiso.",
  path: "/presupuesto",
});

const crumbs = [
  { name: "Inicio", path: "/" },
  { name: "Presupuestos", path: "/presupuesto" },
];

const TRUST = [
  { icon: "check", text: "Respuesta rápida, normalmente el mismo día laborable" },
  { icon: "file-text", text: "Presupuesto claro, por escrito y sin compromiso" },
  { icon: "camera", text: "Adjunta fotos para una valoración más precisa" },
  { icon: "shield", text: "Tus datos solo se usan para responderte" },
];

export default async function BudgetPage() {
  const [services, contact] = await Promise.all([
    db.service.findMany({ where: { published: true }, orderBy: { order: "asc" }, select: { slug: true, title: true } }),
    getContact(),
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <Breadcrumbs items={crumbs} />

      <section className="container-site grid gap-10 py-10 sm:py-14 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <SectionHeading
            as="h1"
            kicker="Presupuestos"
            title="Solicita tu presupuesto sin compromiso"
            text="Cada proyecto es diferente. Cuéntanos qué necesitas y prepararemos un presupuesto personalizado, claro y sin compromiso. Puedes adjuntar fotografías para evaluar la mejor solución antes de la visita."
          />
          <ul className="mt-8 space-y-3">
            {TRUST.map((t) => (
              <li key={t.text} className="flex items-center gap-3 text-sm text-noir">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cream-100 text-gold-700">
                  <Icon name={t.icon} className="h-4.5 w-4.5" />
                </span>
                {t.text}
              </li>
            ))}
          </ul>
          <div className="mt-8 rounded-2xl bg-cream-100 p-5">
            <p className="text-sm font-semibold text-noir">¿Prefieres contarlo directamente?</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a href={`tel:${contact.phone}`} className="btn-dark !py-2.5">
                <Icon name="phone" className="h-4 w-4" /> {contact.phoneDisplay}
              </a>
              <a
                href={waLink(contact.whatsapp, "Hola, quiero pedir un presupuesto")}
                target="_blank"
                rel="noopener"
                className="btn-wa !py-2.5"
              >
                <Icon name="whatsapp" className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </div>
        </div>

        <LeadForm type="PRESUPUESTO" services={services} withPhotos submitLabel="Solicitar presupuesto" whatsapp={contact.whatsapp} />
      </section>
    </>
  );
}
