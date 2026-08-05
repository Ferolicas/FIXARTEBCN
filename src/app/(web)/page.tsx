import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getContact, getHome, getEmergency, waLink } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { Icon } from "@/components/site/Icons";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading, CtaBand } from "@/components/site/Section";

export const revalidate = 600;

export const metadata: Metadata = pageMetadata({
  title: "FixArte BCN | Reformas y Mantenimiento en Barcelona",
  description:
    "Empresa de mantenimiento, reparaciones e instalaciones en Barcelona y Badalona: electricidad, fontanería, pintura, pladur, cocinas y reformas. Presupuesto sin compromiso.",
  path: "/",
});

const BENTO = [
  { href: "/servicios", icon: "wrench", title: "Servicios", text: "Electricidad, fontanería, pintura, pladur y más" },
  { href: "/presupuesto", icon: "file-text", title: "Presupuestos", text: "Pide precio claro y sin compromiso", featured: true },
  { href: "/urgencias", icon: "alert", title: "Urgencias", text: "Atención prioritaria a averías" },
  { href: "/trabajos", icon: "gallery", title: "Trabajos", text: "Antes y después de proyectos reales" },
  { href: "/ingenieria", icon: "sparkles", title: "Ingeniería", text: "Soluciones técnicas para empresas" },
  { href: "/quienes-somos", icon: "users", title: "Quiénes somos", text: "Misión, visión y valores" },
  { href: "/consejos", icon: "star", title: "Consejos", text: "Opiniones y guías de mantenimiento" },
  { href: "/contacto", icon: "mail", title: "Contacto", text: "Habla con nuestro equipo" },
];

export default async function HomePage() {
  const [contact, home, emergency, services, posts] = await Promise.all([
    getContact(),
    getHome(),
    getEmergency(),
    db.service.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
    db.post.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" }, take: 3 }),
  ]);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-ink-950">
        <div aria-hidden className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-ink-600/25 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-accent-500/15 blur-3xl" />
        <div className="container-site relative grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-[1.2fr_1fr] lg:py-24">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent-400">
              <Icon name="sparkles" className="h-3.5 w-3.5" />
              {home.heroKicker}
            </p>
            <h1 className="text-4xl leading-tight text-white sm:text-5xl lg:text-[3.4rem]">
              {home.heroTitle}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-100">{home.heroText}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/presupuesto" className="btn-primary">
                <Icon name="file-text" className="h-4 w-4" /> Solicitar presupuesto
              </Link>
              <a href={`tel:${contact.phone}`} className="btn bg-white text-ink-900 hover:bg-cream-100">
                <Icon name="phone" className="h-4 w-4" /> Llamar ahora
              </a>
              <a
                href={waLink(contact.whatsapp, "Hola, quiero pedir un presupuesto a FixArte BCN")}
                target="_blank"
                rel="noopener"
                className="btn-wa"
              >
                <Icon name="whatsapp" className="h-4 w-4" /> WhatsApp
              </a>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-100">
              <li className="flex items-center gap-2">
                <Icon name="check" className="h-4 w-4 text-accent-400" /> Presupuesto sin compromiso
              </li>
              <li className="flex items-center gap-2">
                <Icon name="check" className="h-4 w-4 text-accent-400" /> Atención de urgencias
              </li>
              <li className="flex items-center gap-2">
                <Icon name="check" className="h-4 w-4 text-accent-400" /> Barcelona · Badalona · Área metropolitana
              </li>
            </ul>
          </div>

          <div className="relative mx-auto hidden w-full max-w-sm lg:block">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <Image
                src="/logo.webp"
                alt="Logo de FixArte BCN: llave inglesa, paleta de pintor y pincel"
                width={320}
                height={320}
                priority
                className="mx-auto w-full max-w-[280px] rounded-2xl"
              />
              <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                {[
                  { icon: "bolt", label: "Electricidad" },
                  { icon: "droplet", label: "Fontanería" },
                  { icon: "paint", label: "Pintura" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl bg-white/5 px-2 py-3">
                    <Icon name={s.icon} className="mx-auto h-5 w-5 text-accent-400" />
                    <p className="mt-1.5 text-[11px] font-medium text-ink-100">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PANEL BENTO: acceso rápido a todas las secciones */}
      <section className="container-site py-14 sm:py-16" aria-label="Accesos rápidos">
        <Reveal>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {BENTO.map((b) => (
              <Link
                key={b.href}
                href={b.href}
                className={`bento-tile group ${b.featured ? "bg-ink-950 !border-ink-950" : ""}`}
              >
                <span
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${
                    b.featured ? "bg-accent-500 text-white" : "bg-accent-50 text-accent-600"
                  }`}
                >
                  <Icon name={b.icon} className="h-5.5 w-5.5" />
                </span>
                <h2 className={`mt-3 font-display text-base font-bold ${b.featured ? "text-white" : "text-ink-900"}`}>
                  {b.title}
                </h2>
                <p className={`mt-1 text-sm leading-snug ${b.featured ? "text-ink-100" : "text-ink-700"}`}>{b.text}</p>
                <span
                  className={`mt-3 inline-flex items-center gap-1 text-xs font-semibold ${
                    b.featured ? "text-accent-400" : "text-accent-600"
                  }`}
                >
                  Entrar <Icon name="arrow-right" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      {/* SERVICIOS */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container-site">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              kicker="Nuestros servicios"
              title="Todo lo que tu hogar o negocio necesita"
              text="Soluciones integrales de mantenimiento, reparación e instalación con profesionalidad, materiales de calidad y compromiso con cada detalle."
            />
            <Link href="/servicios" className="btn-outline shrink-0">
              Ver todos <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((s, i) => (
              <Reveal key={s.id} delay={i * 60}>
                <Link href={`/servicios/${s.slug}`} className="card group flex h-full flex-col p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-ink-900/8">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
                    <Icon name={s.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-lg">{s.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-700">{s.shortDesc}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent-600">
                    Más información
                    <Icon name="arrow-right" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* POR QUÉ ELEGIRNOS */}
      <section className="py-16 sm:py-20">
        <div className="container-site">
          <SectionHeading kicker="Compromiso" title={home.whyTitle} center />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {home.why.map((w, i) => (
              <Reveal key={w.title} delay={i * 50}>
                <div className="card h-full p-6">
                  <Icon name="shield" className="h-6 w-6 text-accent-500" />
                  <h3 className="mt-3 text-base">{w.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-700">{w.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* URGENCIAS */}
      <section className="container-site pb-16 sm:pb-20">
        <div className="grid overflow-hidden rounded-3xl bg-ink-950 lg:grid-cols-2">
          <div className="p-8 sm:p-12">
            <p className="inline-flex items-center gap-2 rounded-full bg-red-500/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-red-400">
              <Icon name="alert" className="h-4 w-4" /> Servicio de urgencias
            </p>
            <h2 className="mt-4 text-3xl text-white">Algunas averías no pueden esperar</h2>
            <p className="mt-3 leading-relaxed text-ink-100">{emergency.intro}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={`tel:${contact.phone}`} className="btn-primary">
                <Icon name="phone" className="h-4 w-4" /> {contact.phoneDisplay}
              </a>
              <a
                href={waLink(contact.whatsapp, "URGENCIA: necesito ayuda con una avería")}
                target="_blank"
                rel="noopener"
                className="btn-wa"
              >
                <Icon name="whatsapp" className="h-4 w-4" /> WhatsApp directo
              </a>
            </div>
          </div>
          <div className="border-t border-white/10 p-8 sm:p-12 lg:border-l lg:border-t-0">
            <h3 className="flex items-center gap-2 text-lg text-white">
              <Icon name="map-pin" className="h-5 w-5 text-accent-400" /> Zona de cobertura
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {emergency.zones.map((z) => (
                <li key={z} className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-ink-100">
                  {z}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm leading-relaxed text-ink-200">{emergency.outside}</p>
            <Link href="/urgencias" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-400 hover:text-accent-500">
              Más sobre urgencias y cobertura <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CONSEJOS RECIENTES */}
      {posts.length > 0 && (
        <section className="bg-white py-16 sm:py-20">
          <div className="container-site">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                kicker="Consejos útiles"
                title="Aprende a cuidar tu hogar"
                text="Guías prácticas escritas por nuestro equipo para prevenir averías y mantener tu vivienda o negocio en forma."
              />
              <Link href="/consejos" className="btn-outline shrink-0">
                Ver todos <Icon name="arrow-right" className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {posts.map((p, i) => (
                <Reveal key={p.id} delay={i * 60}>
                  <Link href={`/consejos/${p.slug}`} className="card group flex h-full flex-col p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-ink-900/8">
                    <Icon name="star" className="h-5 w-5 text-accent-400" />
                    <h3 className="mt-3 text-lg leading-snug">{p.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-700">{p.excerpt}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent-600">
                      Leer consejo
                      <Icon name="arrow-right" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="pt-12">
        <CtaBand phone={contact.phone} whatsapp={contact.whatsapp} />
      </div>
    </>
  );
}
