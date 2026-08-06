"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GalleryGrid, type GalleryItem } from "./GalleryGrid";
import { GoldIcon } from "./GoldIcons";
import { Icon } from "./Icons";
import { QuoteButton } from "./QuoteModal";

export type WorkService = { slug: string; title: string; icon: string };

/**
 * Trabajos realizados: mismos filtros que la sección de servicios, aplicados a
 * la galería. Al elegir un servicio se muestran solo las fotos de esa
 * categoría (las que se suben desde /panel/trabajos).
 */
export function WorksFilter({ services, items }: { services: WorkService[]; items: GalleryItem[] }) {
  const TODOS = "Todos";
  const [active, setActive] = useState(TODOS);

  // Solo se ofrecen como filtro los servicios que ya tienen trabajos publicados
  const conTrabajos = services.filter((s) => items.some((i) => i.category === s.title));
  const visibles = active === TODOS ? items : items.filter((i) => i.category === active);
  const servicioActivo = services.find((s) => s.title === active);

  return (
    <div>
      {/* Filtros por servicio */}
      <div
        role="group"
        aria-label="Filtrar trabajos por servicio"
        className="flex flex-wrap justify-center gap-2"
      >
        <button
          type="button"
          onClick={() => setActive(TODOS)}
          aria-pressed={active === TODOS}
          className="filter-chip"
        >
          Todos
        </button>
        {(conTrabajos.length > 0 ? conTrabajos : services).map((s) => (
          <button
            key={s.slug}
            type="button"
            onClick={() => setActive(s.title)}
            aria-pressed={active === s.title}
            className="filter-chip flex items-center gap-2"
          >
            <GoldIcon name={s.icon} className="h-4.5 w-4.5" />
            {s.title}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="mt-8"
        >
          {visibles.length > 0 ? (
            <GalleryGrid items={visibles} showFilters={false} />
          ) : (
            <div className="mx-auto max-w-xl rounded-[2rem] border border-dashed border-noir/20 bg-white px-6 py-12 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cream-100">
                {servicioActivo ? (
                  <GoldIcon name={servicioActivo.icon} className="h-7 w-7" />
                ) : (
                  <Icon name="camera" className="h-6 w-6 text-gold-700" />
                )}
              </span>
              <h3 className="mt-4 text-2xl">
                {servicioActivo ? `Aún no hay fotos de ${servicioActivo.title.toLowerCase()}` : "Galería en preparación"}
              </h3>
              <p className="mx-auto mt-3 max-w-md text-sm font-medium leading-relaxed text-noir">
                Estamos fotografiando nuestros últimos proyectos. Muy pronto verás aquí el antes y el después de cada
                trabajo; mientras tanto, cuéntanos el tuyo y te enseñaremos casos similares.
              </p>
              <QuoteButton className="mt-6" text="Cuéntanos tu proyecto" />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
