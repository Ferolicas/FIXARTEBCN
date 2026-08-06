"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "./Icons";

export type Review = {
  id: number;
  name: string;
  role: string;
  title: string;
  text: string;
  rating: number;
  service: string;
  photo: string | null;
  /** ISO, para ordenar */
  createdAt: string;
  /** Ya formateada en el servidor */
  fecha: string;
};

const ORDENES = [
  { id: "recientes", label: "Más recientes" },
  { id: "antiguas", label: "Más antiguas" },
  { id: "altas", label: "Mejor valoradas" },
  { id: "bajas", label: "Peor valoradas" },
] as const;

type Orden = (typeof ORDENES)[number]["id"];

export function ReviewsGrid({ reviews }: { reviews: Review[] }) {
  const [orden, setOrden] = useState<Orden>("recientes");

  const lista = useMemo(() => {
    const t = (r: Review) => new Date(r.createdAt).getTime();
    const copia = [...reviews];
    switch (orden) {
      case "antiguas":
        return copia.sort((a, b) => t(a) - t(b));
      case "altas":
        return copia.sort((a, b) => b.rating - a.rating || t(b) - t(a));
      case "bajas":
        return copia.sort((a, b) => a.rating - b.rating || t(b) - t(a));
      default:
        return copia.sort((a, b) => t(b) - t(a));
    }
  }, [reviews, orden]);

  const media = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1).replace(".", ",")
    : "0";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="flex items-center gap-2 text-sm font-bold text-noir">
          <span className="flex gap-0.5">
            {Array.from({ length: 5 }, (_, i) => (
              <Icon key={i} name="star" className="h-4 w-4 text-gold-500" />
            ))}
          </span>
          {media} de 5 · {reviews.length} {reviews.length === 1 ? "reseña" : "reseñas"}
        </p>

        <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Ordenar reseñas">
          {ORDENES.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => setOrden(o.id)}
              aria-pressed={orden === o.id}
              className="filter-chip !text-sm"
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <motion.div layout className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {lista.map((r, i) => (
            <motion.figure
              key={r.id}
              layout
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: (i % 3) * 0.05 }}
              className="card flex h-full flex-col overflow-hidden"
            >
              {r.photo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={r.photo} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" />
              )}
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex gap-0.5" aria-label={`${r.rating} de 5 estrellas`}>
                    {Array.from({ length: 5 }, (_, k) => (
                      <Icon key={k} name="star" className={`h-4 w-4 ${k < r.rating ? "text-gold-500" : "text-noir/15"}`} />
                    ))}
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-noir/50">{r.fecha}</span>
                </div>

                {r.title && <h4 className="mt-3 font-display text-lg font-bold leading-snug text-noir">{r.title}</h4>}
                <blockquote className="mt-2 flex-1 text-sm font-medium leading-relaxed text-noir">“{r.text}”</blockquote>

                <figcaption className="mt-5 flex items-center gap-3 border-t border-noir/10 pt-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream-100 font-display text-base font-bold text-noir">
                    {r.name.trim().charAt(0).toUpperCase()}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold text-noir">{r.name}</span>
                    <span className="block truncate text-xs font-medium text-noir/70">{r.service || r.role}</span>
                  </span>
                </figcaption>
              </div>
            </motion.figure>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
