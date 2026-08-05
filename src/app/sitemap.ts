import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, posts] = await Promise.all([
    db.service.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    db.post.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
  ]);

  const statics: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/servicios"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/presupuesto"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/urgencias"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/trabajos"), changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/quienes-somos"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/ingenieria"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/consejos"), changeFrequency: "weekly", priority: 0.6 },
    { url: absoluteUrl("/contacto"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/aviso-legal"), changeFrequency: "yearly", priority: 0.1 },
    { url: absoluteUrl("/politica-privacidad"), changeFrequency: "yearly", priority: 0.1 },
    { url: absoluteUrl("/politica-cookies"), changeFrequency: "yearly", priority: 0.1 },
  ];

  return [
    ...statics,
    ...services.map((s) => ({
      url: absoluteUrl(`/servicios/${s.slug}`),
      lastModified: s.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...posts.map((p) => ({
      url: absoluteUrl(`/consejos/${p.slug}`),
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
