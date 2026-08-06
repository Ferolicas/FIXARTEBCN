"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Icon } from "./Icons";
import { GoldIcon } from "./GoldIcons";
import { waLink } from "@/lib/content";
import { InteractiveHoverLink } from "@/components/ui/interactive-hover-button";

export type HeroService = {
  slug: string;
  title: string;
  icon: string;
  shortDesc: string;
  bullets: string[];
};

/**
 * Tarjeta del hero: arriba el reclamo de urgencias, debajo los servicios como
 * filtros (el activo queda hundido) y el contenido real del servicio elegido,
 * que cambia con la misma animación que la galería.
 */
export function HeroServiceCard({
  services,
  phone,
  phoneDisplay,
  whatsapp,
}: {
  services: HeroService[];
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
}) {
  const [active, setActive] = useState(0);
  const current = services[active];
  if (!current) return null;

  return (
    <div className="rounded-[1.5rem] bg-white/72 p-5 shadow-2xl shadow-noir/20 backdrop-blur-md">
      {/* Urgencias, arriba del todo */}
      <p className="text-center font-display text-lg font-bold leading-tight text-noir">
        Urgencias · Atención prioritaria
      </p>
      <p className="mt-0.5 text-center text-xs font-medium text-noir">
        Te atendemos hoy mismo en Barcelona y alrededores
      </p>

      <hr className="gold-line my-3.5" />

      {/* Filtros por servicio */}
      <div className="grid grid-cols-3 gap-1.5" role="group" aria-label="Elige un servicio">
        {services.map((s, i) => (
          <button
            key={s.slug}
            type="button"
            onClick={() => setActive(i)}
            aria-pressed={i === active}
            className="filter-chip"
          >
            {s.title}
          </button>
        ))}
      </div>

      {/* Contenido del servicio activo */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.slug}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22 }}
          className="mt-4"
        >
          <div className="flex items-start gap-2.5">
            <GoldIcon name={current.icon} className="mt-0.5 h-7 w-7 shrink-0" />
            <div>
              <h2 className="font-display text-lg font-bold leading-tight text-noir">{current.title}</h2>
              <p className="mt-1 text-[13px] font-medium leading-snug text-noir">{current.shortDesc}</p>
            </div>
          </div>

          <ul className="mt-3 grid gap-1">
            {current.bullets.slice(0, 5).map((b) => (
              <li key={b} className="flex items-start gap-2 text-[13px] font-medium leading-snug text-noir">
                <span aria-hidden className="gold-rule mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
                {b}
              </li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>

      <hr className="gold-line my-3.5" />

      <div className="grid grid-cols-2 gap-2">
        <InteractiveHoverLink
          href={`tel:${phone}`}
          aria-label={`Llamar al ${phoneDisplay}`}
          className="!px-4 !py-2.5"
          leading={<Icon name="phone" className="h-4 w-4" />}
          text="Llamar"
        />
        <InteractiveHoverLink
          href={waLink(whatsapp, "Hola, necesito ayuda con una avería")}
          target="_blank"
          rel="noopener"
          variant="wa"
          className="!px-4 !py-2.5"
          leading={<Icon name="whatsapp" className="h-4 w-4" />}
          text="WhatsApp"
        />
      </div>
    </div>
  );
}
