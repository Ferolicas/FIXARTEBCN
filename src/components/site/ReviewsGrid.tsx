"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "./Icons";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

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

/** Cuántas se muestran en el feed; el resto quedan en el modal. */
const EN_FEED = 6;

function Tarjeta({ r, i }: { r: Review; i: number }) {
  return (
    <motion.figure
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
  );
}

export function ReviewsGrid({ reviews }: { reviews: Review[] }) {
  const [orden, setOrden] = useState<Orden>("recientes");
  const [verTodas, setVerTodas] = useState(false);
  const [montado, setMontado] = useState(false);

  useEffect(() => setMontado(true), []);

  useEffect(() => {
    if (!verTodas) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setVerTodas(false);
    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previo;
      window.removeEventListener("keydown", onKey);
    };
  }, [verTodas]);

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

  // En el feed sólo las seis primeras del orden elegido; ninguna se elimina,
  // las demás siguen accesibles en el modal.
  const visibles = lista.slice(0, EN_FEED);
  const ocultas = lista.length - visibles.length;

  const media = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1).replace(".", ",")
    : "0";

  const filtros = (
    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-center" role="group" aria-label="Ordenar reseñas">
      {ORDENES.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => setOrden(o.id)}
          aria-pressed={orden === o.id}
          className="filter-chip text-center"
        >
          {o.label}
        </button>
      ))}
    </div>
  );

  const modal = (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Cerrar"
        onClick={() => setVerTodas(false)}
        className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        role="dialog"
        aria-modal="true"
        aria-label="Todas las opiniones"
        className="relative flex max-h-[92svh] w-full max-w-4xl flex-col overflow-hidden rounded-t-[1.75rem] bg-cream-50 shadow-2xl sm:max-h-[88svh] sm:rounded-[1.75rem]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-noir/10 bg-white/80 px-5 py-4 backdrop-blur sm:px-7">
          <div>
            <h3 className="font-display text-xl font-bold text-noir sm:text-2xl">Todas las opiniones</h3>
            <p className="mt-1 flex items-center gap-2 text-sm font-bold text-noir">
              <span className="flex gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Icon key={i} name="star" className="h-4 w-4 text-gold-500" />
                ))}
              </span>
              {media} de 5 · {reviews.length} {reviews.length === 1 ? "reseña" : "reseñas"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setVerTodas(false)}
            aria-label="Cerrar"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-noir/15 bg-white"
          >
            <Icon name="x" className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-noir/10 px-5 py-4 sm:px-7">{filtros}</div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-7">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lista.map((r, i) => (
              <Tarjeta key={r.id} r={r} i={i} />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 text-sm font-bold text-noir">
          <span className="flex gap-0.5">
            {Array.from({ length: 5 }, (_, i) => (
              <Icon key={i} name="star" className="h-4 w-4 text-gold-500" />
            ))}
          </span>
          {media} de 5 · {reviews.length} {reviews.length === 1 ? "reseña" : "reseñas"}
        </p>
        {filtros}
      </div>

      <motion.div layout className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visibles.map((r, i) => (
            <Tarjeta key={r.id} r={r} i={i} />
          ))}
        </AnimatePresence>
      </motion.div>

      {ocultas > 0 && (
        <div className="mt-8 text-center">
          <InteractiveHoverButton
            type="button"
            onClick={() => setVerTodas(true)}
            variant="solid"
            text={`Ver las ${reviews.length} opiniones`}
          />
        </div>
      )}

      {verTodas && montado && createPortal(modal, document.body)}
    </div>
  );
}
