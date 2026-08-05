import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getContact, getSocial, waLink } from "@/lib/content";
import { pageMetadata, JsonLd, breadcrumbSchema } from "@/lib/seo";
import { Icon } from "@/components/site/Icons";
import { SectionHeading, Breadcrumbs } from "@/components/site/Section";
import { LeadForm } from "@/components/site/LeadForm";

export const revalidate = 600;

export const metadata: Metadata = pageMetadata({
  title: "Contacto | FixArte BCN — Barcelona y Badalona",
  description:
    "Contacta con FixArte BCN: teléfono, WhatsApp, email y formulario. Mantenimiento, reparaciones y reformas en Barcelona, Badalona y el área metropolitana.",
  path: "/contacto",
});

const crumbs = [
  { name: "Inicio", path: "/" },
  { name: "Contacto", path: "/contacto" },
];

export default async function ContactPage() {
  const [contact, social, services] = await Promise.all([
    getContact(),
    getSocial(),
    db.service.findMany({ where: { published: true }, orderBy: { order: "asc" }, select: { slug: true, title: true } }),
  ]);

  const cards = [
    {
      icon: "phone",
      title: "Teléfono",
      text: contact.phoneDisplay,
      href: `tel:${contact.phone}`,
      cta: "Llamar ahora",
    },
    {
      icon: "whatsapp",
      title: "WhatsApp Business",
      text: "Respuesta rápida, adjunta fotos si quieres",
      href: waLink(contact.whatsapp, "Hola, quiero hacer una consulta"),
      cta: "Abrir chat",
    },
    {
      icon: "mail",
      title: "Correo electrónico",
      text: contact.email,
      href: `mailto:${contact.email}`,
      cta: "Escribir email",
    },
    {
      icon: "map-pin",
      title: "Zona de servicio",
      text: "Barcelona, Badalona y área metropolitana",
      href: social.maps || undefined,
      cta: social.maps ? "Cómo llegar (Google Maps)" : undefined,
    },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <Breadcrumbs items={crumbs} />

      <section className="container-site py-10 sm:py-14">
        <SectionHeading
          as="h1"
          kicker="Contacto"
          title="Hablemos de tu proyecto"
          text="Nuestro compromiso es responder lo antes posible y ofrecerte una solución profesional, rápida y de calidad desde el primer contacto."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <div key={c.title} className="card flex h-full flex-col p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
                <Icon name={c.icon} className="h-5.5 w-5.5" />
              </span>
              <h2 className="mt-3 text-base">{c.title}</h2>
              <p className="mt-1 flex-1 text-sm text-ink-700">{c.text}</p>
              {c.href && c.cta && (
                <a
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={c.href.startsWith("http") ? "noopener" : undefined}
                  className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent-600 hover:text-accent-700"
                >
                  {c.cta} <Icon name="arrow-right" className="h-4 w-4" />
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-cream-50 py-14 sm:py-16">
        <div className="container-site grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <h2 className="text-3xl">Escríbenos</h2>
            <p className="mt-3 max-w-md leading-relaxed text-ink-700">
              Rellena el formulario y te responderemos lo antes posible. Si tu consulta es una avería urgente, te
              recomendamos llamarnos o escribirnos por WhatsApp para atenderte de inmediato.
            </p>
            <p className="mt-5 text-sm text-ink-700">
              Horario de atención: <strong className="text-ink-900">{contact.hours}</strong>
            </p>
          </div>
          <LeadForm type="CONTACTO" services={services} submitLabel="Enviar mensaje" whatsapp={contact.whatsapp} />
        </div>
      </section>
    </>
  );
}
