"use client";

/**
 * Galería con filtros y lightbox animado.
 * Adaptación del bloque "Gallery Grid with Lightbox" (ui.tripled.work /
 * 21st.dev, moumensoliman) al sistema visual de FixArte BCN: framer-motion,
 * datos reales desde la base de datos y navegación dentro del filtro activo.
 */
import { AnimatePresence, motion } from "framer-motion";
import { KeyboardEvent, useState } from "react";
import { Icon } from "./Icons";

export type GalleryItem = {
  id: number | string;
  url: string;
  title: string;
  category: string;
  description?: string;
};

export function GalleryGrid({ items, filterAll = "Todos" }: { items: GalleryItem[]; filterAll?: string }) {
  const [selected, setSelected] = useState<GalleryItem["id"] | null>(null);
  const [filter, setFilter] = useState<string>(filterAll);

  const categories = [filterAll, ...new Set(items.map((i) => i.category))];
  const filtered = filter === filterAll ? items : items.filter((i) => i.category === filter);

  const selectedIndex = filtered.findIndex((i) => i.id === selected);
  const selectedData = selectedIndex >= 0 ? filtered[selectedIndex] : null;

  const move = (dir: 1 | -1) => {
    if (selectedIndex < 0) return;
    setSelected(filtered[(selectedIndex + dir + filtered.length) % filtered.length].id);
  };

  const onCardKey = (e: KeyboardEvent<HTMLDivElement>, id: GalleryItem["id"]) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSelected(id);
    }
  };

  const onLightboxKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") setSelected(null);
    if (e.key === "ArrowRight") move(1);
    if (e.key === "ArrowLeft") move(-1);
  };

  return (
    <div>
      {/* Filtros */}
      {categories.length > 2 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex flex-wrap gap-2"
          role="group"
          aria-label="Filtrar por categoría"
        >
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              aria-pressed={filter === c}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                filter === c ? "bg-ink-950 text-white" : "border border-cream-300 bg-white text-ink-800 hover:border-ink-600"
              }`}
            >
              {c}
            </button>
          ))}
        </motion.div>
      )}

      {/* Rejilla */}
      <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list" aria-label="Galería de trabajos">
        <AnimatePresence mode="popLayout">
          {filtered.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
              role="listitem"
            >
              <div
                className="group relative cursor-pointer overflow-hidden rounded-3xl border border-ink-950/5 bg-white shadow-sm transition-shadow hover:shadow-xl hover:shadow-ink-950/15"
                onClick={() => setSelected(item.id)}
                onKeyDown={(e) => onCardKey(e, item.id)}
                role="button"
                tabIndex={0}
                aria-label={`Ver ${item.title}`}
              >
                <div className="relative aspect-square overflow-hidden">
                  <motion.img
                    src={item.url}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.35 }}
                  />
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-ink-950/65 p-4 backdrop-blur-sm"
                    aria-hidden="true"
                  >
                    <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white">
                      <Icon name="gallery" className="h-5 w-5" />
                    </span>
                    <h3 className="mb-2 text-center font-display text-xl font-semibold text-white">{item.title}</h3>
                    <span className="rounded-full bg-accent-500 px-3 py-1 text-xs font-semibold text-white">{item.category}</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/95 p-4"
            onClick={() => setSelected(null)}
            onKeyDown={onLightboxKey}
            role="dialog"
            aria-modal="true"
            aria-labelledby="galeria-titulo"
            tabIndex={-1}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[90vh] w-full max-w-4xl"
            >
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Cerrar galería"
                className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25"
              >
                <Icon name="x" className="h-5 w-5" />
              </button>

              {filtered.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); move(-1); }}
                    aria-label="Imagen anterior"
                    className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25"
                  >
                    <Icon name="chevron-right" className="h-5 w-5 rotate-180" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); move(1); }}
                    aria-label="Imagen siguiente"
                    className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25"
                  >
                    <Icon name="chevron-right" className="h-5 w-5" />
                  </button>
                </>
              )}

              <motion.img
                key={String(selectedData.id)}
                src={selectedData.url}
                alt={selectedData.title}
                className="mx-auto max-h-[72vh] w-auto rounded-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-5 text-center"
              >
                <h3 id="galeria-titulo" className="font-display text-2xl font-semibold text-white">
                  {selectedData.title}
                </h3>
                {selectedData.description && (
                  <p className="mx-auto mt-1.5 max-w-xl text-sm text-ink-100">{selectedData.description}</p>
                )}
                <span className="mt-3 inline-block rounded-full bg-accent-500 px-3.5 py-1 text-xs font-semibold text-white">
                  {selectedData.category}
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
