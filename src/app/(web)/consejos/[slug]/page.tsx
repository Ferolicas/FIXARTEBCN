import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getContact } from "@/lib/content";
import { mdToHtml } from "@/lib/markdown";
import { pageMetadata, JsonLd, breadcrumbSchema, blogPostingSchema } from "@/lib/seo";
import { Icon } from "@/components/site/Icons";
import { CtaBand, Breadcrumbs } from "@/components/site/Section";

export const revalidate = 600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await db.post.findMany({ where: { published: true }, select: { slug: true } });
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await db.post.findUnique({ where: { slug } });
  if (!post || !post.published) return {};
  return pageMetadata({
    title: post.metaTitle || `${post.title} | FixArte BCN`,
    description: post.metaDescription || post.excerpt,
    path: `/consejos/${post.slug}`,
    ogImage: post.coverImage || undefined,
  });
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, contact] = await Promise.all([db.post.findUnique({ where: { slug } }), getContact()]);
  if (!post || !post.published) notFound();

  const others = await db.post.findMany({
    where: { published: true, NOT: { id: post.id } },
    orderBy: { publishedAt: "desc" },
    take: 3,
    select: { slug: true, title: true },
  });

  const crumbs = [
    { name: "Inicio", path: "/" },
    { name: "Consejos y opiniones", path: "/consejos" },
    { name: post.title, path: `/consejos/${post.slug}` },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          blogPostingSchema({
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            publishedAt: post.publishedAt,
            updatedAt: post.updatedAt,
            image: post.coverImage,
          }),
        ]}
      />
      <Breadcrumbs items={crumbs} />

      <article className="container-site py-10 sm:py-14">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-widest text-gold-700">
            Consejos ·{" "}
            <time dateTime={post.publishedAt.toISOString()}>
              {new Date(post.publishedAt).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}
            </time>
          </p>
          <h1 className="mt-3 text-3xl leading-tight sm:text-4xl">{post.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-noir">{post.excerpt}</p>

          {post.coverImage && (
            <Image
              src={post.coverImage}
              alt={post.title}
              width={960}
              height={540}
              className="mt-8 aspect-video w-full rounded-2xl object-cover"
            />
          )}

          <div className="prose-fix mt-8" dangerouslySetInnerHTML={{ __html: mdToHtml(post.content) }} />

          <div className="mt-10 rounded-2xl bg-cream-100 p-6">
            <p className="text-sm font-semibold text-noir">
              Escrito por el equipo técnico de FixArte BCN — profesionales de mantenimiento y reformas en Barcelona.
            </p>
          </div>

          {others.length > 0 && (
            <nav aria-label="Más consejos" className="mt-10 border-t border-noir/10 pt-8">
              <h2 className="text-xl">Sigue leyendo</h2>
              <ul className="mt-4 space-y-2">
                {others.map((o) => (
                  <li key={o.slug}>
                    <Link
                      href={`/consejos/${o.slug}`}
                      className="card flex items-center gap-3 px-5 py-3.5 text-sm font-medium text-noir transition-colors hover:border-gold-500"
                    >
                      <Icon name="star" className="h-4 w-4 shrink-0 text-gold-700" />
                      {o.title}
                      <Icon name="chevron-right" className="ml-auto h-4 w-4 shrink-0 text-ink-200" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </article>

      <CtaBand phone={contact.phone} whatsapp={contact.whatsapp} />
    </>
  );
}
