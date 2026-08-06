"use client";

/**
 * Galería con lightbox. Adaptación del bloque "Gallery Grid with Lightbox"
 * (ui.tripled.work / 21st.dev, moumensoliman) al sistema de FixArte BCN.
 *
 * Cada elemento es UN trabajo, no una foto suelta:
 *  - "comparador": antes y después en la misma tarjeta, con deslizador
 *  - "video": miniatura con botón de reproducción
 *  - "imagen": foto única
 * Todos llevan el título y la descripción superpuestos y siempre visibles,
 * para que en móvil se sepa de qué trabajo se trata sin pasar el dedo.
 */
import { AnimatePresence, motion } from "framer-motion";
import { KeyboardEvent, useState } from "react";
import { Icon } from "./Icons";
import { BeforeAfter } from "./BeforeAfter";

export type GalleryItem = {
  id: number | string;
  kind: "imagen" | "video" | "comparador";
  /** Imagen visible; en los vídeos es la miniatura */
  url: string;
  title: string;
  category: string;
  description?: string;
  /** Solo en vídeos */
  video?: string;
  /** Solo en comparador */
  before?: string;
  after?: string;
};

function Pie({ item }: { item: GalleryItem }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-noir/90 via-noir/55 to-transparent px-5 pb-4 pt-14">
      <p className="text-[11px] font-bold uppercase tracking-widest text-gold-200">{item.category}</p>
      <h3 className="mt-0.5 font-display text-lg font-bold leading-snug text-white drop-shadow">{item.title}</h3>
      {item.description && (
        <p className="mt-1 line-clamp-2 text-xs font-medium leading-snug text-white/85">{item.description}</p>
      )}
    </div>
  );
}

export function GalleryGrid({
  items,
  filterAll = "Todos",
  showFilters = true,
}: {
  items: GalleryItem[];
  filterAll?: string;
  showFilters?: boolean;
}) {
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
      {showFilters && categories.length > 2 && (
        <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoría">
          {categories.map((c) => (
            <button key={c} type="button" onClick={() => setFilter(c)} aria-pressed={filter === c} className="filter-chip">
              {c}
            </button>
          ))}
        </div>
      )}

      <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list" aria-label="Galería de trabajos">
        <AnimatePresence mode="popLayout">
          {filtered.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
              role="listitem"
            >
              <div
                className="group relative cursor-pointer overflow-hidden rounded-3xl border border-noir/5 bg-white shadow-sm transition-shadow hover:shadow-xl hover:shadow-noir/15"
                onClick={() => setSelected(item.id)}
                onKeyDown={(e) => onCardKey(e, item.id)}
                role="button"
                tabIndex={0}
                aria-label={`Ver ${item.title}`}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {item.kind === "comparador" && item.before && item.after ? (
                    <BeforeAfter before={item.before} after={item.after} alt={item.title} rounded={false} />
                  ) : (
                    <motion.img
                      src={item.url}
                      alt={item.title}
                      loading="lazy"
                      className="h-full w-full object-cover"
                      whileHover={{ scale: 1.06 }}
                      transition={{ duration: 0.35 }}
                    />
                  )}

                  {item.kind === "video" && (
                    <span aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-noir/70 text-white shadow-lg backdrop-blur-sm">
                        <Icon name="play" className="ml-1 h-7 w-7" />
                      </span>
                    </span>
                  )}

                  <Pie item={item} />
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
            className="fixed inset-0 z-[70] flex items-center justify-center bg-noir/95 p-4"
            onClick={() => setSelected(null)}
            onKeyDown={onLightboxKey}
            role="dialog"
            aria-modal="true"
            aria-labelledby="galeria-titulo"
            tabIndex={-1}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl"
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
                    aria-label="Trabajo anterior"
                    className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25"
                  >
                    <Icon name="chevron-right" className="h-5 w-5 rotate-180" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); move(1); }}
                    aria-label="Trabajo siguiente"
                    className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25"
                  >
                    <Icon name="chevron-right" className="h-5 w-5" />
                  </button>
                </>
              )}

              {selectedData.kind === "comparador" && selectedData.before && selectedData.after ? (
                <div className="mx-auto w-full max-w-3xl">
                  <BeforeAfter before={selectedData.before} after={selectedData.after} alt={selectedData.title} />
                </div>
              ) : selectedData.kind === "video" && selectedData.video ? (
                <motion.video
                  key={String(selectedData.id)}
                  src={selectedData.video}
                  poster={selectedData.url}
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                  className="mx-auto max-h-[70vh] w-auto rounded-2xl bg-black"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              ) : (
                <motion.img
                  key={String(selectedData.id)}
                  src={selectedData.url}
                  alt={selectedData.title}
                  className="mx-auto max-h-[70vh] w-auto rounded-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-5 text-center"
              >
                <p className="text-xs font-bold uppercase tracking-widest text-gold-200">{selectedData.category}</p>
                <h3 id="galeria-titulo" className="mt-1 font-display text-2xl font-bold text-white">
                  {selectedData.title}
                </h3>
                {selectedData.description && (
                  <p className="mx-auto mt-2 max-w-xl text-sm font-medium text-white/80">{selectedData.description}</p>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
