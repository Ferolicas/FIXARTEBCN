"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Icon } from "./Icons";
import { GoldIcon } from "./GoldIcons";
import { QuoteButton } from "./QuoteModal";
import { waLink } from "@/lib/content";
import { InteractiveHoverLink } from "@/components/ui/interactive-hover-button";

export type FilterService = {
  slug: string;
  title: string;
  icon: string;
  shortDesc: string;
  bullets: string[];
  faqs: { q: string; a: string }[];
};

/**
 * Sección de servicios como panel de filtros: los 10 servicios son botones
 * (el activo queda hundido) y el contenido del elegido —descripción, trabajos
 * y preguntas frecuentes— cambia con la misma animación que la galería.
 */
export function ServicesFilter({
  services,
  phone,
  phoneDisplay,
  whatsapp,
}: {
  services: FilterService[];
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
}) {
  const [active, setActive] = useState(0);
  const current = services[active];
  if (!current) return null;

  return (
    <div>
      {/* Filtros: tira deslizable en móvil, centrada en escritorio */}
      <div
        role="group"
        aria-label="Elige un servicio"
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-3 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0"
      >
        {services.map((s, i) => (
          <button
            key={s.slug}
            type="button"
            onClick={() => setActive(i)}
            aria-pressed={i === active}
            className="filter-chip flex shrink-0 items-center gap-2"
          >
            <GoldIcon name={s.icon} className="h-4.5 w-4.5" />
            {s.title}
          </button>
        ))}
      </div>

      {/* Panel del servicio activo */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.slug}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="card mt-6 overflow-hidden p-6 sm:p-9"
        >
          <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
            {/* Descripción y trabajos */}
            <div>
              <div className="flex items-start gap-4">
                <GoldIcon name={current.icon} className="mt-1 h-12 w-12 shrink-0" />
                <div>
                  <h3 className="font-display text-3xl font-bold leading-tight text-noir">{current.title}</h3>
                  <p className="mt-2 font-medium leading-relaxed text-noir">{current.shortDesc}</p>
                </div>
              </div>

              <hr className="gold-line my-6" />

              <p className="text-xs font-bold uppercase tracking-widest text-noir">Qué hacemos</p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {current.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm font-medium leading-snug text-noir">
                    <span aria-hidden className="gold-rule mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
                    {b}
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex flex-wrap gap-2.5">
                <QuoteButton text="Pedir presupuesto" />
                <InteractiveHoverLink
                  href={`tel:${phone}`}
                  leading={<Icon name="phone" className="h-4 w-4" />}
                  text={phoneDisplay}
                />
                <InteractiveHoverLink
                  href={waLink(whatsapp, `Hola, quiero información sobre ${current.title.toLowerCase()}`)}
                  target="_blank"
                  rel="noopener"
                  variant="wa"
                  leading={<Icon name="whatsapp" className="h-4 w-4" />}
                  text="WhatsApp"
                />
              </div>
            </div>

            {/* Preguntas frecuentes del servicio */}
            {current.faqs.length > 0 && (
              <div className="rounded-[1.5rem] bg-cream-50 p-5 sm:p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-noir">Preguntas frecuentes</p>
                <div className="mt-3 space-y-2">
                  {current.faqs.map((f) => (
                    <details key={f.q} className="group rounded-2xl bg-white px-4 py-3">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold text-noir">
                        {f.q}
                        <Icon
                          name="chevron-right"
                          className="h-4 w-4 shrink-0 text-gold-700 transition-transform group-open:rotate-90"
                        />
                      </summary>
                      <p className="mt-2 text-sm font-medium leading-relaxed text-noir">{f.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
