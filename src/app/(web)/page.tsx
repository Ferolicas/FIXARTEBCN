import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getContact, getHome, getEmergency, waLink } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { Icon } from "@/components/site/Icons";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading, CtaBand } from "@/components/site/Section";
import { MotionLinkGrid } from "@/components/site/MotionLinkGrid";

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
      {/* HERO editorial */}
      <section className="container-site pt-4 sm:pt-6">
        <div className="hero-panel relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem]">
          {/* Siluetas de montaña */}
          <svg
            viewBox="0 0 1440 300"
            preserveAspectRatio="xMidYMax slice"
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-56 w-full sm:h-72"
          >
            <path fill="#8b98a9" opacity=".45" d="M0 210 L190 110 L350 200 L540 80 L710 195 L910 120 L1110 205 L1300 140 L1440 205 L1440 300 L0 300 Z" />
            <path fill="#5d7089" opacity=".5" d="M0 250 L230 165 L430 240 L650 150 L870 245 L1090 175 L1290 245 L1440 195 L1440 300 L0 300 Z" />
            <path fill="#0f2438" opacity=".92" d="M0 300 L0 272 Q360 232 720 262 T1440 255 L1440 300 Z" />
          </svg>

          <div className="relative grid gap-10 px-6 pb-60 pt-12 sm:px-12 sm:pb-48 sm:pt-16 lg:grid-cols-[1.25fr_1fr] lg:gap-6">
            <div>
              <p className="slash-label">{home.heroKicker}</p>
              <h1 className="mt-5 max-w-2xl text-5xl leading-[1.04] sm:text-6xl lg:text-[4.4rem]">
                {home.heroTitle}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-900/80">{home.heroText}</p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link href="/presupuesto" className="btn-primary">
                  Solicitar presupuesto
                </Link>
                <a href={`tel:${contact.phone}`} className="btn bg-white/90 text-ink-950 backdrop-blur hover:bg-white">
                  <Icon name="phone" className="h-4 w-4" /> {contact.phoneDisplay}
                </a>
                <a
                  href={waLink(contact.whatsapp, "Hola, quiero pedir un presupuesto a FixArte BCN")}
                  target="_blank"
                  rel="noopener"
                  aria-label="WhatsApp"
                  title="WhatsApp"
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-wa text-white shadow-lg shadow-wa/30 transition-transform hover:scale-105"
                >
                  <Icon name="whatsapp" className="h-5.5 w-5.5" />
                </a>
              </div>
            </div>

            {/* Tarjeta flotante */}
            <div className="hidden lg:block">
              <div className="ml-auto max-w-sm rounded-[1.75rem] bg-white/92 p-6 shadow-2xl shadow-ink-950/15 backdrop-blur">
                <div className="flex flex-wrap gap-2">
                  {[
                    ["Electricidad", "/servicios/electricista-barcelona"],
                    ["Fontanería", "/servicios/fontanero-barcelona"],
                    ["Pintura", "/servicios/pintores-barcelona"],
                  ].map(([label, href]) => (
                    <Link key={href} href={href} className="chip hover:border-accent-500">
                      {label}
                    </Link>
                  ))}
                </div>
                <h2 className="mt-4 text-2xl">Oficio y detalle en cada intervención</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-700">
                  De la avería urgente a la reforma completa, un solo equipo para todo.
                </p>
                <div className="mt-5 flex items-center gap-4 rounded-2xl bg-cream-100 p-4">
                  <Image src="/logo.webp" alt="Logo de FixArte BCN" width={64} height={64} priority className="h-16 w-16 rounded-2xl" />
                  <div>
                    <p className="slash-label !text-[10px]">Urgencias</p>
                    <p className="font-display text-xl font-semibold text-ink-950">
                      Atención <em className="italic text-accent-600">prioritaria</em>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Overlay inferior sobre la franja oscura */}
          <div className="absolute inset-x-0 bottom-0">
            <div className="flex flex-col gap-4 px-6 pb-6 sm:flex-row sm:items-end sm:justify-between sm:px-12 sm:pb-8">
              <div className="max-w-xs rounded-2xl bg-[#b9977a]/90 p-5 backdrop-blur">
                <p className="text-sm font-bold text-ink-950">Presupuestos claros, sin sorpresas</p>
                <p className="mt-1 text-xs leading-relaxed text-ink-950/75">
                  Precio cerrado por escrito antes de empezar y materiales de primeras marcas.
                </p>
              </div>
              <div className="flex items-center gap-6 text-white">
                <div>
                  <p className="font-display text-3xl font-semibold italic">24h</p>
                  <p className="text-xs uppercase tracking-widest text-white/70">Urgencias</p>
                </div>
                <div className="hidden h-10 w-px bg-white/20 sm:block" />
                <p className="max-w-[16rem] font-display text-sm font-medium uppercase leading-snug tracking-wide">
                  Barcelona · Badalona · Área metropolitana
                </p>
                <Link
                  href="/urgencias"
                  className="text-xs font-semibold uppercase tracking-widest text-accent-400 underline underline-offset-4 hover:text-accent-500"
                >
                  Saber más
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PANEL DE ACCESOS (galería animada de opciones) */}
      <section className="container-site py-14 sm:py-16" aria-label="Accesos rápidos">
        <MotionLinkGrid items={BENTO} columns={4} />
      </section>

      {/* SERVICIOS */}
      <section className="container-site pb-14 sm:pb-16">
        <div className="rounded-[2rem] bg-cream-50 p-6 sm:rounded-[2.5rem] sm:p-12">
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
          <div className="mt-10">
            <MotionLinkGrid
              columns={3}
              items={services.slice(0, 6).map((s) => ({
                href: `/servicios/${s.slug}`,
                icon: s.icon,
                title: s.title,
                text: s.shortDesc,
                cta: "Más información",
                image: s.image,
              }))}
            />
          </div>
        </div>
      </section>

      {/* POR QUÉ ELEGIRNOS */}
      <section className="py-2 pb-14 sm:pb-16">
        <div className="container-site">
          <SectionHeading kicker="Compromiso" title={home.whyTitle} center />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {home.why.map((w, i) => (
              <Reveal key={w.title} delay={i * 50}>
                <div className="card h-full p-7">
                  <Icon name="shield" className="h-6 w-6 text-accent-500" />
                  <h3 className="mt-3 text-lg">{w.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-700">{w.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* URGENCIAS */}
      <section className="container-site pb-14 sm:pb-16">
        <div className="grid overflow-hidden rounded-[2rem] bg-ink-950 sm:rounded-[2.5rem] lg:grid-cols-2">
          <div className="p-8 sm:p-12">
            <p className="slash-label !text-red-400">Servicio de urgencias</p>
            <h2 className="mt-4 text-3xl text-white sm:text-4xl">Algunas averías no pueden esperar</h2>
            <p className="mt-3 leading-relaxed text-ink-100">{emergency.intro}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href={`tel:${contact.phone}`} className="btn-dark">
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
            <h3 className="flex items-center gap-2 text-xl text-white">
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
            <Link href="/urgencias" className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-accent-400 hover:text-accent-500">
              Más sobre urgencias <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CONSEJOS RECIENTES */}
      {posts.length > 0 && (
        <section className="container-site pb-14 sm:pb-16">
          <div className="rounded-[2rem] bg-cream-50 p-6 sm:rounded-[2.5rem] sm:p-12">
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
                  <Link href={`/consejos/${p.slug}`} className="card group flex h-full flex-col p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-ink-950/10">
                    <Icon name="star" className="h-5 w-5 text-accent-400" />
                    <h3 className="mt-3 text-xl leading-snug">{p.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-700">{p.excerpt}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-accent-600">
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

      <CtaBand phone={contact.phone} whatsapp={contact.whatsapp} />
    </>
  );
}
