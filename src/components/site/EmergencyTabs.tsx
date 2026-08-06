"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "./Icons";

type Faq = { q: string; a: string };
type Paso = { n: string; title: string; text: string };

/**
 * Contenido de urgencias repartido en tres filtros (mismo patrón que servicios
 * y trabajos). Cada bloque dispone del ancho completo, así no se amontona.
 */
export function EmergencyTabs({
  zones,
  outside,
  faqs,
  pasos,
}: {
  zones: string[];
  outside: string;
  faqs: Faq[];
  pasos: Paso[];
}) {
  const tabs = [
    { id: "zonas", label: "Zonas de cobertura", icon: "map-pin" },
    { id: "faqs", label: "Preguntas frecuentes", icon: "file-text" },
    { id: "proceso", label: "Cómo trabajamos", icon: "check" },
  ];
  const [active, setActive] = useState("zonas");

  return (
    <div>
      <div
        role="group"
        aria-label="Más información sobre urgencias"
        className="flex flex-wrap justify-center gap-2"
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActive(t.id)}
            aria-pressed={active === t.id}
            className="filter-chip flex items-center gap-2"
          >
            <Icon name={t.icon} className="h-4 w-4 text-gold-700" />
            {t.label}
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
          {active === "zonas" && (
            <div className="mx-auto max-w-3xl text-center">
              <ul className="flex flex-wrap justify-center gap-2.5">
                {zones.map((z) => (
                  <li
                    key={z}
                    className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-noir shadow-sm"
                  >
                    <Icon name="map-pin" className="h-4 w-4 text-gold-700" />
                    {z}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm font-medium leading-relaxed text-noir">{outside}</p>
            </div>
          )}

          {active === "faqs" && (
            <div className="mx-auto grid max-w-4xl gap-3 md:grid-cols-2">
              {faqs.map((f) => (
                <details key={f.q} className="card group px-5 py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold text-noir">
                    {f.q}
                    <Icon
                      name="chevron-right"
                      className="h-4 w-4 shrink-0 text-gold-700 transition-transform group-open:rotate-90"
                    />
                  </summary>
                  <p className="mt-3 text-sm font-medium leading-relaxed text-noir">{f.a}</p>
                </details>
              ))}
            </div>
          )}

          {active === "proceso" && (
            <ol className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
              {pasos.map((p) => (
                <li key={p.n} className="flex gap-4">
                  <span className="step-circle">{p.n}</span>
                  <div>
                    <p className="font-display text-base font-bold text-noir">{p.title}</p>
                    <p className="mt-0.5 text-sm font-medium leading-snug text-noir">{p.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
