import type { Metadata } from "next";
import { getEmergency, getContact, waLink } from "@/lib/content";
import { pageMetadata, JsonLd, breadcrumbSchema, faqSchema } from "@/lib/seo";
import { Icon } from "@/components/site/Icons";
import { SectionHeading, Breadcrumbs } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";

export const revalidate = 600;

export const metadata: Metadata = pageMetadata({
  title: "Urgencias 24h en Barcelona y Badalona | FixArte BCN",
  description:
    "Atención rápida de averías urgentes: electricidad, fontanería y reparaciones en Barcelona, Badalona y área metropolitana. Llama o escribe por WhatsApp.",
  path: "/urgencias",
});

const crumbs = [
  { name: "Inicio", path: "/" },
  { name: "Urgencias y cobertura", path: "/urgencias" },
];

const FAQS = [
  {
    q: "¿Qué tipo de urgencias atendéis?",
    a: "Averías eléctricas (falta de luz, diferencial que salta, olor a quemado), fugas de agua, atascos, cerraduras y desperfectos que requieren solución inmediata en viviendas, locales y comunidades.",
  },
  {
    q: "¿Cuánto tardáis en llegar?",
    a: "Depende de la zona y la carga de trabajo del momento. Al contactarnos te confirmamos de inmediato la franja más rápida disponible; las urgencias tienen prioridad sobre el resto de la agenda.",
  },
  {
    q: "¿Trabajáis fines de semana y festivos?",
    a: "Sí, el servicio de urgencias atiende también fines de semana y festivos. Escríbenos por WhatsApp o llámanos y te confirmamos disponibilidad al momento.",
  },
  {
    q: "¿Qué me costará la intervención?",
    a: "Antes de intervenir te damos un precio claro. Explícanos la avería por teléfono o WhatsApp —con foto o vídeo si es posible— y te orientamos sin compromiso.",
  },
];

const STEPS = [
  { icon: "whatsapp", title: "1. Contacta", text: "Llámanos o escríbenos por WhatsApp contándonos la avería. Una foto o vídeo nos ayuda a ir preparados." },
  { icon: "clock", title: "2. Respuesta inmediata", text: "Te confirmamos la franja de llegada más rápida y el coste orientativo de la intervención." },
  { icon: "shield", title: "3. Solución profesional", text: "Identificamos el problema y lo resolvemos de forma segura, explicándote qué ha pasado y cómo evitarlo." },
];

export default async function EmergencyPage() {
  const [emergency, contact] = await Promise.all([getEmergency(), getContact()]);

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), faqSchema(FAQS)]} />
      <Breadcrumbs items={crumbs} />

      <section className="container-site py-10 sm:py-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-red-600">
              <Icon name="alert" className="h-4 w-4" /> Servicio de urgencias
            </p>
            <h1 className="text-4xl leading-tight sm:text-5xl">Urgencias en Barcelona y Badalona</h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-700">{emergency.intro}</p>
            <p className="mt-3 max-w-2xl leading-relaxed text-ink-700">{emergency.body}</p>
          </div>
          <div className="card p-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-ink-700">Contacto inmediato</p>
            <a href={`tel:${contact.phone}`} className="btn-primary mt-4 w-full !py-4 text-base">
              <Icon name="phone" className="h-5 w-5" /> {contact.phoneDisplay}
            </a>
            <a
              href={waLink(contact.whatsapp, "URGENCIA: necesito ayuda con una avería")}
              target="_blank"
              rel="noopener"
              className="btn-wa mt-3 w-full !py-4 text-base"
            >
              <Icon name="whatsapp" className="h-5 w-5" /> WhatsApp directo
            </a>
            <p className="mt-4 text-xs leading-relaxed text-ink-700">
              Si puedes, adjunta una foto o vídeo de la avería: llegaremos con el material adecuado.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-16">
        <div className="container-site">
          <SectionHeading kicker="Cómo funciona" title="Así resolvemos tu urgencia" center />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 70}>
                <div className="card h-full p-6 text-center">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
                    <Icon name={s.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-lg">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-700">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16">
        <div className="container-site grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading kicker="Cobertura" title="Zonas en las que trabajamos" />
            <ul className="mt-6 flex flex-wrap gap-2">
              {emergency.zones.map((z) => (
                <li key={z} className="chip !px-4 !py-2 !text-sm">
                  <Icon name="map-pin" className="h-4 w-4 text-accent-500" /> {z}
                </li>
              ))}
            </ul>
            <p className="mt-5 max-w-lg leading-relaxed text-ink-700">{emergency.outside}</p>
          </div>
          <div>
            <h2 className="text-2xl">Preguntas frecuentes</h2>
            <div className="mt-4 space-y-3">
              {FAQS.map((f) => (
                <details key={f.q} className="card group px-5 py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-ink-900">
                    {f.q}
                    <Icon name="chevron-right" className="h-4 w-4 shrink-0 text-accent-500 transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-ink-700">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
