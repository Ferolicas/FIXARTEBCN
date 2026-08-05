"use client";

import { useState } from "react";
import Image from "next/image";
import { BeforeAfter } from "./BeforeAfter";
import { Icon } from "./Icons";

export type GalleryProject = {
  id: number;
  title: string;
  category: string;
  description: string;
  beforeImage: string | null;
  afterImage: string | null;
  images: string[];
  featured: boolean;
};

/** Galería con filtro por categoría y comparador antes/después. */
export function ProjectsGallery({ projects, categories }: { projects: GalleryProject[]; categories: string[] }) {
  const [active, setActive] = useState<string>("Todos");
  const visible = active === "Todos" ? projects : projects.filter((p) => p.category === active);

  return (
    <div>
      {categories.length > 1 && (
        <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Filtrar por categoría">
          {["Todos", ...categories].map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={active === c}
              onClick={() => setActive(c)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                active === c
                  ? "bg-ink-900 text-white"
                  : "border border-cream-200 bg-white text-ink-800 hover:border-ink-600"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => (
          <article key={p.id} className="card overflow-hidden">
            {p.beforeImage && p.afterImage ? (
              <div className="p-3 pb-0">
                <BeforeAfter before={p.beforeImage} after={p.afterImage} alt={p.title} />
              </div>
            ) : p.afterImage || p.images[0] ? (
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={(p.afterImage || p.images[0])!}
                  alt={p.title}
                  fill
                  loading="lazy"
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            ) : null}
            <div className="p-5">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent-600">
                {p.category}
                {p.featured && <Icon name="star" className="h-3.5 w-3.5" />}
              </p>
              <h2 className="mt-1.5 text-lg leading-snug">{p.title}</h2>
              {p.description && <p className="mt-2 text-sm leading-relaxed text-ink-700">{p.description}</p>}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
