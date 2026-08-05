import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getContact, getSocial } from "@/lib/content";
import { pageMetadata, JsonLd, breadcrumbSchema } from "@/lib/seo";
import { Icon } from "@/components/site/Icons";
import { SectionHeading, CtaBand, Breadcrumbs } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";

export const revalidate = 600;

export const metadata: Metadata = pageMetadata({
  title: "Consejos de mantenimiento y opiniones | FixArte BCN",
  description:
    "Opiniones de clientes de FixArte BCN y consejos prácticos de mantenimiento para viviendas, locales y comunidades: prevención de averías, ahorro y cuidado del hogar.",
  path: "/consejos",
});

const crumbs = [
  { name: "Inicio", path: "/" },
  { name: "Consejos y opiniones", path: "/consejos" },
];

function Stars({ n }: { n: number }) {
  return (
    <span className="flex gap-0.5 text-accent-500" aria-label={`${n} de 5 estrellas`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Icon key={i} name="star" className={`h-4 w-4 ${i < n ? "" : "opacity-20"}`} />
      ))}
    </span>
  );
}

export default async function TipsPage() {
  const [posts, testimonials, contact, social] = await Promise.all([
    db.post.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" } }),
    db.testimonial.findMany({ where: { published: true }, orderBy: [{ order: "asc" }, { createdAt: "desc" }] }),
    getContact(),
    getSocial(),
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <Breadcrumbs items={crumbs} />

      <section className="container-site py-10 sm:py-14">
        <SectionHeading
          as="h1"
          kicker="Consejos y opiniones"
          title="La confianza de nuestros clientes"
          text="La satisfacción de nuestros clientes es nuestro mejor respaldo. Aquí encontrarás sus opiniones y, además, consejos prácticos de nuestro equipo para cuidar tu vivienda, local o comunidad."
        />
      </section>

      {/* OPINIONES */}
      <section className="container-site pb-14" aria-labelledby="opiniones-title">
        <h2 id="opiniones-title" className="sr-only">
          Opiniones de clientes
        </h2>
        {testimonials.length === 0 ? (
          <div className="card mx-auto max-w-xl p-8 text-center">
            <Stars n={5} />
            <h3 className="mt-3 text-xl">Muy pronto, las opiniones de nuestros clientes</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-700">
              Estamos recopilando las valoraciones de personas, empresas y comunidades que han confiado en FixArte BCN.
              {social.maps ? " ¿Ya has trabajado con nosotros? Nos ayudaría mucho tu reseña en Google." : ""}
            </p>
            {social.maps && (
              <a href={social.maps} target="_blank" rel="noopener" className="btn-outline mt-5">
                <Icon name="star" className="h-4 w-4 text-accent-500" /> Dejar una reseña en Google
              </a>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.id} delay={(i % 3) * 60}>
                <figure className="card flex h-full flex-col p-6">
                  <Stars n={t.rating} />
                  <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-ink-800">“{t.text}”</blockquote>
                  <figcaption className="mt-4 border-t border-cream-200 pt-3">
                    <p className="text-sm font-bold text-ink-900">{t.name}</p>
                    {t.role && <p className="text-xs text-ink-700">{t.role}</p>}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* CONSEJOS */}
      <section className="bg-cream-50 py-14 sm:py-16" aria-labelledby="consejos-title">
        <div className="container-site">
          <SectionHeading
            kicker="Blog de mantenimiento"
            title="Consejos útiles para tu hogar o negocio"
            text="Guías prácticas escritas por nuestro equipo: prevención de averías, ahorro energético y cuidado de tus instalaciones."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {posts.map((p, i) => (
              <Reveal key={p.id} delay={(i % 2) * 60}>
                <Link
                  href={`/consejos/${p.slug}`}
                  className="card group flex h-full flex-col p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-ink-900/8"
                >
                  <p className="text-xs font-bold uppercase tracking-widest text-accent-600">
                    {new Date(p.publishedAt).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                  <h3 className="mt-2 text-xl leading-snug">{p.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-700">{p.excerpt}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent-600">
                    Leer artículo
                    <Icon name="arrow-right" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="pt-10">
        <CtaBand phone={contact.phone} whatsapp={contact.whatsapp} />
      </div>
    </>
  );
}
