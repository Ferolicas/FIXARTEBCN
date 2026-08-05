import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getContact, waLink } from "@/lib/content";
import { mdToHtml } from "@/lib/markdown";
import { pageMetadata, JsonLd, breadcrumbSchema, serviceSchema, faqSchema } from "@/lib/seo";
import { Icon } from "@/components/site/Icons";
import { CtaBand, Breadcrumbs } from "@/components/site/Section";

export const revalidate = 600;
export const dynamicParams = true;

type Faq = { q: string; a: string };

export async function generateStaticParams() {
  const services = await db.service.findMany({ where: { published: true }, select: { slug: true } });
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = await db.service.findUnique({ where: { slug } });
  if (!service || !service.published) return {};
  return pageMetadata({
    title: service.metaTitle,
    description: service.metaDescription,
    path: `/servicios/${service.slug}`,
  });
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [service, contact] = await Promise.all([
    db.service.findUnique({ where: { slug } }),
    getContact(),
  ]);
  if (!service || !service.published) notFound();

  const related = await db.service.findMany({
    where: { published: true, NOT: { id: service.id } },
    orderBy: { order: "asc" },
    take: 4,
    select: { slug: true, title: true, icon: true },
  });

  const bullets = (service.bullets as string[]) || [];
  const faqs = (service.faqs as Faq[]) || [];

  const crumbs = [
    { name: "Inicio", path: "/" },
    { name: "Servicios", path: "/servicios" },
    { name: service.title, path: `/servicios/${service.slug}` },
  ];

  const schemas: object[] = [
    breadcrumbSchema(crumbs),
    serviceSchema({
      name: service.heroTitle,
      description: service.metaDescription,
      slug: service.slug,
      schemaType: service.schemaType,
      contact,
    }),
  ];
  if (faqs.length > 0) schemas.push(faqSchema(faqs));

  return (
    <>
      <JsonLd data={schemas} />
      <Breadcrumbs items={crumbs} />

      <article>
        <header className="container-site py-10 sm:py-14">
          <div className="grid items-start gap-10 lg:grid-cols-[1.6fr_1fr]">
            <div>
              <p className="mb-2 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-accent-600">
                <Icon name={service.icon} className="h-4 w-4" /> {service.title}
              </p>
              <h1 className="text-4xl leading-tight sm:text-5xl">{service.heroTitle}</h1>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-700">{service.shortDesc}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/presupuesto" className="btn-primary">
                  <Icon name="file-text" className="h-4 w-4" /> Pedir presupuesto
                </Link>
                <a href={`tel:${contact.phone}`} className="btn-dark">
                  <Icon name="phone" className="h-4 w-4" /> {contact.phoneDisplay}
                </a>
                <a
                  href={waLink(contact.whatsapp, `Hola, necesito información sobre ${service.title.toLowerCase()}`)}
                  target="_blank"
                  rel="noopener"
                  className="btn-wa"
                >
                  <Icon name="whatsapp" className="h-4 w-4" /> WhatsApp
                </a>
              </div>
            </div>

            <aside className="card p-6">
              {service.image && (
                <Image
                  src={service.image}
                  alt={`${service.heroTitle} — FixArte BCN`}
                  width={480}
                  height={320}
                  className="mb-5 aspect-[3/2] w-full rounded-xl object-cover"
                />
              )}
              <h2 className="text-base">Qué hacemos</h2>
              <ul className="mt-3 space-y-2.5">
                {bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm text-ink-800">
                    <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" />
                    {b}
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </header>

        <div className="bg-white py-12 sm:py-14">
          <div className="container-site grid gap-12 lg:grid-cols-[1.6fr_1fr]">
            <div className="prose-fix max-w-none" dangerouslySetInnerHTML={{ __html: mdToHtml(service.longDesc) }} />

            <div>
              {faqs.length > 0 && (
                <section aria-labelledby="faq-title">
                  <h2 id="faq-title" className="text-2xl">
                    Preguntas frecuentes
                  </h2>
                  <div className="mt-4 space-y-3">
                    {faqs.map((f) => (
                      <details key={f.q} className="card group px-5 py-4">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-ink-900">
                          {f.q}
                          <Icon name="chevron-right" className="h-4 w-4 shrink-0 text-accent-500 transition-transform group-open:rotate-90" />
                        </summary>
                        <p className="mt-3 text-sm leading-relaxed text-ink-700">{f.a}</p>
                      </details>
                    ))}
                  </div>
                </section>
              )}

              <section className="mt-8" aria-label="Otros servicios">
                <h2 className="text-2xl">Otros servicios</h2>
                <ul className="mt-4 space-y-2">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link
                        href={`/servicios/${r.slug}`}
                        className="card flex items-center gap-3 px-4 py-3 text-sm font-medium text-ink-900 transition-colors hover:border-accent-400"
                      >
                        <Icon name={r.icon} className="h-4.5 w-4.5 text-accent-500" />
                        {r.title}
                        <Icon name="chevron-right" className="ml-auto h-4 w-4 text-ink-200" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </div>
      </article>

      <div className="pt-10">
        <CtaBand
          title={`Pide precio para ${service.title.toLowerCase()}`}
          phone={contact.phone}
          whatsapp={contact.whatsapp}
        />
      </div>
    </>
  );
}
