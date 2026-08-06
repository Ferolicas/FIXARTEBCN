import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getContact, getSocial } from "@/lib/content";
import { pageMetadata, JsonLd, breadcrumbSchema } from "@/lib/seo";
import { Icon } from "@/components/site/Icons";
import { QuoteButton } from "@/components/site/QuoteModal";
import { SectionHeading, CtaBand, Breadcrumbs } from "@/components/site/Section";
import { GalleryGrid, type GalleryItem } from "@/components/site/GalleryGrid";

export const revalidate = 600;

export const metadata: Metadata = pageMetadata({
  title: "Trabajos realizados en Barcelona | FixArte BCN",
  description:
    "Galería de trabajos de FixArte BCN: antes y después de reformas, pintura, pladur, cocinas y reparaciones en Barcelona y Badalona. Calidad demostrada con hechos.",
  path: "/trabajos",
});

const crumbs = [
  { name: "Inicio", path: "/" },
  { name: "Trabajos realizados", path: "/trabajos" },
];

export default async function ProjectsPage() {
  const [projects, contact, social] = await Promise.all([
    db.project.findMany({ where: { published: true }, orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }] }),
    getContact(),
    getSocial(),
  ]);

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

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <Breadcrumbs items={crumbs} />

      <section className="container-site py-10 sm:py-14">
        <SectionHeading
          as="h1"
          kicker="Trabajos realizados"
          title="Una imagen vale más que mil palabras"
          text="Proyectos reales de FixArte BCN: el antes y el después de reformas, pintura, cocinas y reparaciones que reflejan la calidad y el cuidado que ponemos en cada trabajo."
        />
      </section>

      {projects.length === 0 ? (
        <section className="container-site pb-16">
          <div className="card mx-auto max-w-xl p-10 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cream-100 text-gold-700">
              <Icon name="gallery" className="h-7 w-7" />
            </span>
            <h2 className="mt-4 text-2xl">Estamos preparando la galería</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-noir">
              Muy pronto publicaremos aquí fotografías del antes y el después de nuestros proyectos. Mientras tanto,
              cuéntanos el tuyo: te enseñaremos ejemplos de trabajos similares al pedir tu presupuesto.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <QuoteButton text="Pedir presupuesto" />
              {social.instagram && (
                <a href={social.instagram} target="_blank" rel="noopener" className="btn-outline">
                  <Icon name="instagram" className="h-4 w-4" /> Síguenos en Instagram
                </a>
              )}
            </div>
          </div>
        </section>
      ) : (
        <section className="container-site pb-16">
          <GalleryGrid items={galleryItems} />
        </section>
      )}

      <CtaBand
        title="¿Quieres un resultado así en tu casa?"
        phone={contact.phone}
        whatsapp={contact.whatsapp}
      />
    </>
  );
}
