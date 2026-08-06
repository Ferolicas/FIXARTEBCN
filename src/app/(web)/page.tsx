import Image from "next/image";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getContact, getHome, getEmergency, getAbout, getEngineering, waLink } from "@/lib/content";
import { pageMetadata, JsonLd, faqSchema } from "@/lib/seo";
import { mdToHtml } from "@/lib/markdown";
import { Icon } from "@/components/site/Icons";
import { GoldIcon } from "@/components/site/GoldIcons";
import { QuoteButton } from "@/components/site/QuoteModal";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/Section";
import { GalleryGrid, type GalleryItem } from "@/components/site/GalleryGrid";
import { HeroServiceCard } from "@/components/site/HeroServiceCard";
import { ServicesFilter } from "@/components/site/ServicesFilter";
import { WorksFilter } from "@/components/site/WorksFilter";
import { EmergencyTabs } from "@/components/site/EmergencyTabs";
import { AboutTabs } from "@/components/site/AboutTabs";
import { PostsGrid } from "@/components/site/PostsGrid";
import { ReviewsGrid } from "@/components/site/ReviewsGrid";
import { ReviewModalButton } from "@/components/site/ReviewModal";
import { LeadForm } from "@/components/site/LeadForm";
import { InteractiveHoverLink } from "@/components/ui/interactive-hover-button";

export const revalidate = 600;

export const metadata: Metadata = pageMetadata({
  title: "FixArte BCN | Reformas y Mantenimiento en Barcelona",
  description:
    "Empresa de mantenimiento, reparaciones e instalaciones en Barcelona y Badalona: electricidad, fontanería, pintura, pladur, cocinas y reformas. Presupuesto sin compromiso.",
  path: "/",
});

const PROCESO = [
  {
    n: "01",
    title: "Cuéntanos qué necesitas",
    text: "Por teléfono, WhatsApp o formulario. Si nos envías una foto o un vídeo, llegamos con el material adecuado desde el primer día.",
  },
  {
    n: "02",
    title: "Presupuesto claro",
    text: "Valoramos el trabajo y te damos un precio cerrado por escrito, detallado y sin compromiso. Sin sorpresas al terminar.",
  },
  {
    n: "03",
    title: "Ejecutamos el trabajo",
    text: "Puntualidad, materiales de primeras marcas y obra limpia: protegemos suelos y muebles y recogemos al acabar.",
  },
  {
    n: "04",
    title: "Revisión y garantía",
    text: "Repasamos contigo el resultado, te explicamos lo realizado y respondemos de cada intervención.",
  },
];

/** Un icono distinto para cada consejo. */
const CONSEJO_ICONS = ["electricidad", "fontaneria", "reparaciones-hogar", "mantenimiento-comunidades"];

const FAQS_URGENCIAS = [
  {
    q: "¿Qué tipo de urgencias atendéis?",
    a: "Averías eléctricas (falta de luz, diferencial que salta, olor a quemado), fugas de agua, atascos y desperfectos que requieren solución inmediata en viviendas, locales y comunidades.",
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

export default async function LandingPage() {
  const [contact, home, emergency, about, engineering, services, posts, projects, testimonials] =
    await Promise.all([
      getContact(),
      getHome(),
      getEmergency(),
      getAbout(),
      getEngineering(),
      db.service.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
      db.post.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" }, take: 4 }),
      db.project.findMany({ where: { published: true }, orderBy: [{ featured: "desc" }, { order: "asc" }] }),
      db.testimonial.findMany({ where: { published: true }, orderBy: { createdAt: "desc" } }),
    ]);

  // Un elemento por pieza real: el antes/después va junto en una sola tarjeta
  const galleryItems: GalleryItem[] = projects.flatMap((p) => {
    const base = { title: p.title, category: p.category, description: p.description || undefined };
    const out: GalleryItem[] = [];

    if (p.beforeImage && p.afterImage) {
      out.push({ id: `${p.id}-cmp`, kind: "comparador", url: p.afterImage, before: p.beforeImage, after: p.afterImage, ...base });
    } else if (p.afterImage || p.beforeImage) {
      out.push({ id: `${p.id}-img`, kind: "imagen", url: (p.afterImage || p.beforeImage)!, ...base });
    }

    for (const [i, v] of (((p.videos as { src: string; poster: string }[]) || [])).entries()) {
      out.push({ id: `${p.id}-v${i}`, kind: "video", url: v.poster, video: v.src, ...base });
    }
    for (const [i, url] of (((p.images as string[]) || [])).entries()) {
      out.push({ id: `${p.id}-i${i}`, kind: "imagen", url, ...base });
    }
    return out;
  });

  const stats = [
    { value: String(services.length), label: "Servicios especializados", to: services.length },
    { value: String(emergency.zones.length), label: "Zonas de cobertura", to: emergency.zones.length },
    { value: "24h", label: "Atención de urgencias", to: 24, suffix: "h" },
    // Cuenta atrás de 200 € a 0 €: el presupuesto no cuesta nada
    { value: "0 €", label: "Coste del presupuesto", from: 200, to: 0, suffix: " €" },
  ];

  const contactItems: { icon: string; label: string; href: string }[] = [
    { icon: "phone", label: contact.phoneDisplay, href: `tel:${contact.phone}` },
    { icon: "whatsapp", label: "WhatsApp Business", href: waLink(contact.whatsapp, "Hola, quiero pedir un presupuesto") },
    { icon: "mail", label: contact.email, href: `mailto:${contact.email}` },
  ];

  return (
    <>
      <JsonLd data={faqSchema(FAQS_URGENCIAS)} />

      {/* ═══ INICIO ═══════════════════════════════════════════ */}
      <section id="inicio" className="hero-panel anchor relative flex min-h-svh flex-col overflow-hidden">
        <picture>
          <source
            type="image/avif"
            sizes="100vw"
            srcSet="/fondo-640.avif 640w, /fondo-1024.avif 1024w, /fondo-1536.avif 1536w, /fondo-1920.avif 1920w, /fondo-2560.avif 2560w"
          />
          <source
            type="image/webp"
            sizes="100vw"
            srcSet="/fondo-640.webp 640w, /fondo-1024.webp 1024w, /fondo-1536.webp 1536w, /fondo-1920.webp 1920w, /fondo-2560.webp 2560w"
          />
          <img
            src="/fondo-1536.webp"
            alt=""
            aria-hidden
            width={1536}
            height={864}
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-[70%_center] sm:object-center"
          />
        </picture>

        <div className="relative mx-auto flex w-full max-w-[1180px] flex-1 items-center px-4 pt-32 sm:px-6 sm:pt-40 lg:pt-48">
          <div className="grid w-full gap-10 pb-24 pt-8 sm:pb-16 sm:pt-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-center lg:gap-10">
            <div>
              <h1 className="max-w-[13em] text-[clamp(1.65rem,7vw,2.6rem)] leading-[1.08] text-noir [text-wrap:normal] lg:text-[2.75rem] xl:text-[3rem]">
                {home.heroTitle}
              </h1>
              <p className="mt-5 max-w-lg text-lg font-medium leading-relaxed text-noir">{home.heroText}</p>
              <div className="mt-8 flex flex-wrap items-center gap-2.5 sm:gap-3">
                <QuoteButton className="w-full sm:w-auto" text="Pedir presupuesto" />
                <InteractiveHoverLink
                  href={`tel:${contact.phone}`}
                  aria-label={`Llamar al ${contact.phoneDisplay}`}
                  className="flex-1 !px-3 sm:flex-none sm:!px-5"
                  leading={<Icon name="phone" className="h-4 w-4" />}
                  /* El número completo no cabe junto a WhatsApp en pantallas
                     estrechas: ahí basta con "Llamar". */
                  text={
                    <>
                      <span className="sm:hidden">Llamar</span>
                      <span className="hidden sm:inline">{contact.phoneDisplay}</span>
                    </>
                  }
                />
                <InteractiveHoverLink
                  href={waLink(contact.whatsapp, "Hola, quiero pedir un presupuesto a FixArte BCN")}
                  target="_blank"
                  rel="noopener"
                  variant="wa"
                  className="flex-1 !px-3 sm:flex-none sm:!px-5"
                  leading={<Icon name="whatsapp" className="h-4 w-4" />}
                  text="WhatsApp"
                />
              </div>

              <ul className="mt-7 inline-grid gap-2 rounded-2xl bg-white/40 px-5 py-4 backdrop-blur-sm sm:grid-cols-[auto_auto] sm:gap-x-6">
                {[
                  <>Presupuesto cerrado por escrito, <strong className="font-bold">sin sorpresas</strong></>,
                  <>Urgencias <strong className="font-bold">24 h</strong></>,
                  <>Barcelona · Badalona · Área metropolitana</>,
                ].map((t, i) => (
                  <li
                    key={i}
                    className={`flex items-center gap-2 text-[15.4px] font-semibold text-black ${i === 2 ? "sm:col-span-2" : ""}`}
                  >
                    <span aria-hidden className="gold-rule h-1.5 w-1.5 shrink-0 rounded-full" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="hidden lg:block">
              <HeroServiceCard
                services={services.slice(0, 3).map((s) => ({
                  slug: s.slug,
                  title: s.title,
                  icon: s.icon,
                  shortDesc: s.shortDesc,
                  bullets: (s.bullets as string[]) || [],
                }))}
                phone={contact.phone}
                phoneDisplay={contact.phoneDisplay}
                whatsapp={contact.whatsapp}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SERVICIOS ════════════════════════════════════════ */}
      <section id="servicios" className="anchor container-site py-16 sm:py-24">
        <SectionHeading
          kicker="Nuestros servicios"
          title="Todo lo que tu hogar o negocio necesita"
          text="Soluciones integrales de mantenimiento, reparación e instalación para viviendas, locales, oficinas y comunidades. Profesionalidad, materiales de calidad y precio cerrado."
          center
        />
        <div className="mt-12">
          <ServicesFilter
            services={services.map((s) => ({
              slug: s.slug,
              title: s.title,
              icon: s.icon,
              shortDesc: s.shortDesc,
              bullets: (s.bullets as string[]) || [],
              faqs: (s.faqs as { q: string; a: string }[]) || [],
            }))}
            phone={contact.phone}
            phoneDisplay={contact.phoneDisplay}
            whatsapp={contact.whatsapp}
          />
        </div>
      </section>

      {/* ═══ TRABAJOS ═════════════════════════════════════════ */}
      <section id="trabajos" className="anchor bg-cream-50 py-16 sm:py-24">
        <div className="container-site">
          <SectionHeading
            kicker="Trabajos realizados"
            title="El antes y el después habla por nosotros"
            text="Proyectos reales ejecutados por nuestro equipo en Barcelona y su área metropolitana."
            center
          />
          <div className="mt-12">
            <WorksFilter
              services={services.map((s) => ({ slug: s.slug, title: s.title, icon: s.icon }))}
              items={galleryItems}
            />
          </div>
        </div>
      </section>

      {/* ═══ URGENCIAS ════════════════════════════════════════ */}
      <section id="urgencias" className="anchor relative overflow-hidden">
        {/* La foto ocupa exactamente la sección */}
        <picture>
          <source
            type="image/avif"
            sizes="100vw"
            srcSet="/urgencia-640.avif 640w, /urgencia-960.avif 960w, /urgencia-1280.avif 1280w"
          />
          <source
            type="image/webp"
            sizes="100vw"
            srcSet="/urgencia-640.webp 640w, /urgencia-960.webp 960w, /urgencia-1280.webp 1280w"
          />
          <img
            src="/urgencia-1280.webp"
            alt=""
            aria-hidden
            width={1280}
            height={720}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-[62%_center]"
          />
        </picture>

        {/* La tarjeta cubre la sección entera, del mismo tamaño que la foto */}
        <div className="relative bg-white/75 backdrop-blur-md">
          <div className="container-site py-16 sm:py-24">
            <div className="text-center">
              <p className="slash-gold !text-red-700">Servicio de urgencias</p>
              <h2 className="mx-auto mt-4 max-w-3xl text-4xl leading-[1.1] sm:text-5xl">
                Algunas averías no pueden esperar
              </h2>
            </div>

            {/* Introducción y contacto, siempre visibles */}
            <p className="mx-auto mt-5 max-w-2xl text-center font-medium leading-relaxed text-noir">
              {emergency.intro}
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <InteractiveHoverLink
                href={`tel:${contact.phone}`}
                variant="solid"
                leading={<Icon name="phone" className="h-4 w-4" />}
                text={contact.phoneDisplay}
              />
              <InteractiveHoverLink
                href={waLink(contact.whatsapp, "URGENCIA: necesito ayuda con una avería")}
                target="_blank"
                rel="noopener"
                variant="wa"
                leading={<Icon name="whatsapp" className="h-4 w-4" />}
                text="WhatsApp directo"
              />
            </div>

            <div className="mt-12">
              <EmergencyTabs
                zones={emergency.zones}
                outside={emergency.outside}
                faqs={FAQS_URGENCIAS}
                pasos={PROCESO}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ QUIÉNES SOMOS ════════════════════════════════════ */}
      <section id="quienes-somos" className="anchor bg-cream-50 py-16 sm:py-24">
        <div className="container-site">
          <SectionHeading
            kicker="Quiénes somos"
            title="Un buen trabajo no es solo reparar: es generar confianza"
            text="Somos una empresa de mantenimiento, reparaciones e instalaciones para viviendas, locales, oficinas y comunidades de Barcelona y su área metropolitana."
            center
          />
          <div className="mt-12">
            <AboutTabs
              intro={about.intro}
              stats={stats}
              mission={about.mission}
              vision={about.vision}
              values={about.values}
              whyTitle={home.whyTitle}
              why={home.why}
            />
          </div>
        </div>
      </section>

      {/* ═══ INGENIERÍA ═══════════════════════════════════════ */}
      <section id="ingenieria" className="anchor relative overflow-hidden py-16 sm:py-24">
        <picture>
          <source
            type="image/avif"
            sizes="100vw"
            srcSet="/ingenieria-640.avif 640w, /ingenieria-960.avif 960w, /ingenieria-1280.avif 1280w, /ingenieria-1920.avif 1920w"
          />
          <source
            type="image/webp"
            sizes="100vw"
            srcSet="/ingenieria-640.webp 640w, /ingenieria-960.webp 960w, /ingenieria-1280.webp 1280w, /ingenieria-1920.webp 1920w"
          />
          <img
            src="/ingenieria-1280.webp"
            alt=""
            aria-hidden
            width={1280}
            height={720}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </picture>

        {/* Mismo velo que en urgencias: el texto se lee sin necesidad de tarjeta */}
        <div aria-hidden className="absolute inset-0 bg-white/75 backdrop-blur-md" />

        <div className="container-site relative">
          <div className="mx-auto max-w-3xl text-center">
            <p className="slash-gold">Para empresas y profesionales</p>
            <h2 className="mt-4 text-4xl leading-[1.1] sm:text-5xl">{engineering.title}</h2>
            <p className="mt-4 font-medium leading-relaxed text-noir">{engineering.paragraphs[0]}</p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {engineering.items.map((item, i) => (
              <Reveal key={item.title} delay={(i % 2) * 80}>
                <div className="flex h-full gap-4 rounded-3xl bg-white p-7 shadow-lg shadow-noir/10">
                  <span className="step-circle">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-display text-xl font-bold text-noir">{item.title}</h3>
                    <p className="mt-1.5 text-sm font-medium leading-relaxed text-noir">{item.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mx-auto mt-8 max-w-3xl rounded-[2rem] bg-white p-6 text-center sm:p-8">
            <p className="font-medium leading-relaxed text-noir">
              {engineering.paragraphs[engineering.paragraphs.length - 1]}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <QuoteButton text="Solicitar asesoramiento técnico" />
              <InteractiveHoverLink
                href={waLink(contact.whatsapp, "Hola, quiero consultar un tema técnico o de mantenimiento")}
                target="_blank"
                rel="noopener"
                variant="wa"
                leading={<Icon name="whatsapp" className="h-4 w-4" />}
                text="WhatsApp"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ RESEÑAS Y CONSEJOS ═══════════════════════════════ */}
      <section id="consejos" className="anchor bg-cream-50 py-16 sm:py-24">
        <div className="container-site">
          <SectionHeading
            kicker="Reseñas y consejos"
            title="La confianza de nuestros clientes"
            text="Lo que opinan quienes ya han trabajado con nosotros y los consejos de nuestro equipo para cuidar tu vivienda, local o comunidad."
            center
          />

          {/* ── Reseñas ── */}
          <div className="mt-14">
            <div className="flex items-center gap-3">
              <Icon name="star" className="h-5 w-5 text-gold-500" />
              <h3 className="text-2xl">Opiniones de clientes</h3>
              <span className="h-px flex-1 gold-line" />
            </div>

            {testimonials.length > 0 ? (
              <div className="mt-6">
                <ReviewsGrid
                  reviews={testimonials.map((t) => ({
                    id: t.id,
                    name: t.name,
                    role: t.role,
                    title: t.title,
                    text: t.text,
                    rating: t.rating,
                    service: t.service,
                    photo: t.photo,
                    createdAt: t.createdAt.toISOString(),
                    fecha: new Date(t.createdAt).toLocaleDateString("es-ES", { month: "short", year: "numeric" }),
                  }))}
                />
              </div>
            ) : (
              <Reveal>
                <div className="mt-6 rounded-[2rem] border border-dashed border-noir/20 bg-white px-6 py-12 text-center">
                  <span className="mx-auto flex justify-center gap-1">
                    {Array.from({ length: 5 }, (_, k) => (
                      <Icon key={k} name="star" className="h-5 w-5 text-gold-500" />
                    ))}
                  </span>
                  <h4 className="mt-4 font-display text-2xl font-bold text-noir">
                    Muy pronto, las opiniones de nuestros clientes
                  </h4>
                  <p className="mx-auto mt-3 max-w-lg text-sm font-medium leading-relaxed text-noir">
                    Estamos recopilando las valoraciones de las personas, empresas y comunidades que han confiado en
                    FixArte BCN. ¿Ya has trabajado con nosotros?
                  </p>
                  <ReviewModalButton
                    services={services.map((s) => ({ title: s.title }))}
                    whatsapp={contact.whatsapp}
                    className="mt-6"
                    text="Deja tu reseña"
                  />
                </div>
              </Reveal>
            )}
          </div>

          {/* ── Consejos ── */}
          <div className="mt-16">
            <div className="flex items-center gap-3">
              <Icon name="sparkles" className="h-5 w-5 text-gold-700" />
              <h3 className="text-2xl">Consejos de mantenimiento</h3>
              <span className="h-px flex-1 gold-line" />
            </div>

            <PostsGrid
              posts={posts.map((p, i) => ({
                slug: p.slug,
                title: p.title,
                excerpt: p.excerpt,
                date: new Date(p.publishedAt).toLocaleDateString("es-ES", { month: "long", year: "numeric" }),
                html: mdToHtml(p.content),
                icon: CONSEJO_ICONS[i % CONSEJO_ICONS.length],
              }))}
            />
          </div>
        </div>
      </section>

      {/* ═══ PRESUPUESTO Y CONTACTO ═══════════════════════════ */}
      <section id="contacto" className="anchor bg-cream-50 py-16 sm:py-24">
        <div className="container-site grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          <div>
            <p className="slash-gold">Presupuestos</p>
            <h2 className="mt-5 text-[2rem] leading-[1.25] [text-wrap:normal] sm:text-[2.5rem] lg:text-[2.4rem] xl:text-[2.75rem]">
              Cuéntanos tu proyecto y te damos{" "}
              <span className="destacado-verde">precio cerrado</span>
            </h2>
            <p className="mt-7 max-w-md font-medium leading-relaxed text-noir">
              Cada trabajo es diferente. Descríbenos qué necesitas —puedes adjuntar fotos— y te preparamos un
              presupuesto claro, detallado y sin compromiso.
            </p>

            <ul className="mt-8 flex flex-wrap gap-2.5">
              {contactItems.map((c) => (
                <li key={c.label}>
                  <InteractiveHoverLink
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel={c.href.startsWith("http") ? "noopener" : undefined}
                    variant={c.icon === "whatsapp" ? "wa" : "dark"}
                    leading={<Icon name={c.icon} className="h-4 w-4" />}
                    text={c.label}
                  />
                </li>
              ))}
            </ul>

            <div className="mt-8 flex items-center gap-4 rounded-2xl bg-white p-5">
              <Image src="/logo.webp" alt="" width={120} height={120} className="h-16 w-16" />
              <p className="text-sm font-medium leading-snug text-noir">
                Atendemos en <strong className="font-bold">Barcelona, Badalona y el área metropolitana</strong>.
                Respondemos lo antes posible, normalmente el mismo día laborable.
              </p>
            </div>
          </div>

          <Reveal>
            <LeadForm
              type="PRESUPUESTO"
              services={services.map((s) => ({ slug: s.slug, title: s.title }))}
              withPhotos
              submitLabel="Solicitar presupuesto"
              whatsapp={contact.whatsapp}
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
