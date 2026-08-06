"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "./Icons";
import { CountUp } from "./CountUp";

type Why = { title: string; text: string };

/** Un icono distinto para cada motivo de "por qué elegirnos". */
const WHY_ICONS = ["clock", "file-text", "shield", "users", "check", "wrench"];
type Stat = { value: string; label: string; to?: number; from?: number; suffix?: string };

/**
 * "Quiénes somos" con el mismo patrón de filtros que servicios, trabajos y
 * urgencias: historia, misión y valores, y motivos para elegirnos.
 */
export function AboutTabs({
  intro,
  stats,
  mission,
  vision,
  values,
  whyTitle,
  why,
}: {
  intro: string;
  stats: Stat[];
  mission: string;
  vision: string;
  values: string[];
  whyTitle: string;
  why: Why[];
}) {
  const tabs = [
    { id: "historia", label: "Nuestra historia", icon: "users" },
    { id: "mision", label: "Misión y valores", icon: "sparkles" },
    { id: "porque", label: "Por qué elegirnos", icon: "shield" },
  ];
  const [active, setActive] = useState("historia");

  return (
    <div>
      <div
        role="group"
        aria-label="Conoce FixArte BCN"
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-3 sm:mx-0 sm:justify-center sm:overflow-visible sm:px-0"
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActive(t.id)}
            aria-pressed={active === t.id}
            className="filter-chip flex shrink-0 items-center gap-2"
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
          className="mt-10"
        >
          {active === "historia" && (
            <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
              <div>
                {intro.split("\n\n").map((par, i) => (
                  <p key={i} className={`text-justify font-medium leading-relaxed text-noir ${i > 0 ? "mt-4" : ""}`}>
                    {par.split(/(FixArte BCN)/g).map((frag, k) =>
                      frag === "FixArte BCN" ? (
                        <strong key={k} className="font-bold">
                          {frag}
                        </strong>
                      ) : (
                        <span key={k}>{frag}</span>
                      )
                    )}
                  </p>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[2rem] border border-noir/10 bg-noir/10">
                {stats.map((st, i) => (
                  <motion.div
                    key={st.label}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="bg-white px-6 py-8 text-center"
                  >
                    <p className="text-4xl font-bold text-noir sm:text-5xl">
                      {st.to !== undefined ? (
                        <CountUp to={st.to} from={st.from} suffix={st.suffix} />
                      ) : (
                        st.value
                      )}
                    </p>
                    <p className="mt-2 text-xs font-semibold uppercase leading-snug tracking-widest text-noir">
                      {st.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {active === "mision" && (
            <div>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { t: "Nuestra misión", d: mission, ic: "sparkles" },
                  { t: "Nuestra visión", d: vision, ic: "building" },
                ].map((c, i) => (
                  <motion.div
                    key={c.t}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="card p-7"
                  >
                    <h3 className="flex items-center gap-2.5 text-2xl">
                      <Icon name={c.ic} className="h-6 w-6 text-gold-700" /> {c.t}
                    </h3>
                    <p className="mt-3 text-justify font-medium leading-relaxed text-noir">{c.d}</p>
                  </motion.div>
                ))}
              </div>
              <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {values.map((v, i) => (
                  <motion.li
                    key={v}
                    initial={{ opacity: 0, scale: 0.94 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ duration: 0.3, delay: (i % 4) * 0.06 }}
                    className="card flex items-center gap-2 p-4 text-sm font-bold text-noir"
                  >
                    <span aria-hidden className="gold-rule h-1.5 w-1.5 shrink-0 rounded-full" />
                    {v}
                  </motion.li>
                ))}
              </ul>
            </div>
          )}

          {active === "porque" && (
            <div>
              <h3 className="text-center text-2xl">{whyTitle}</h3>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {why.map((w, i) => (
                  <motion.div
                    key={w.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.4, delay: (i % 3) * 0.09 }}
                    className="card h-full p-6"
                  >
                    <h4 className="flex items-center gap-2.5 font-display text-lg font-bold leading-tight text-noir">
                      <Icon name={WHY_ICONS[i % WHY_ICONS.length]} className="h-6 w-6 shrink-0 text-gold-700" />
                      {w.title}
                    </h4>
                    <p className="mt-2 text-sm font-medium leading-relaxed text-noir">{w.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
