"use client";

/**
 * Presentación animada de opciones (servicios y accesos de la web) con el
 * mismo lenguaje del bloque de galería: rejilla con entrada escalonada,
 * zoom al pasar el cursor y overlay de acción. Navega en lugar de abrir
 * lightbox.
 */
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "./Icons";

export type LinkGridItem = {
  href: string;
  icon: string;
  title: string;
  text: string;
  cta?: string;
  featured?: boolean;
  image?: string | null;
};

export function MotionLinkGrid({ items, columns = 4 }: { items: LinkGridItem[]; columns?: 3 | 4 }) {
  const cols = columns === 4 ? "grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <motion.div layout className={`grid gap-3 sm:gap-4 ${cols}`} role="list">
      <AnimatePresence mode="popLayout">
        {items.map((item, index) => (
          <motion.div
            key={item.href}
            layout
            initial={{ opacity: 0, scale: 0.85, y: 14 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35, delay: (index % 4) * 0.06 }}
            role="listitem"
            className="h-full"
          >
            <Link
              href={item.href}
              className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border p-6 transition-shadow hover:shadow-xl hover:shadow-ink-950/15 ${
                item.featured ? "border-ink-950 bg-ink-950" : "border-ink-950/5 bg-white"
              }`}
            >
              {item.image ? (
                <div className="relative -m-6 mb-4 aspect-[4/3] overflow-hidden">
                  <motion.img
                    src={item.image}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                    whileHover={{ scale: 1.06 }}
                    transition={{ duration: 0.35 }}
                  />
                </div>
              ) : (
                <motion.span
                  whileHover={{ scale: 1.08, rotate: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-full ${
                    item.featured ? "bg-accent-500 text-white" : "bg-cream-100 text-accent-600"
                  }`}
                >
                  <Icon name={item.icon} className="h-5.5 w-5.5" />
                </motion.span>
              )}

              <h3 className={`mt-4 font-display text-xl font-semibold ${item.featured ? "text-white" : "text-ink-950"}`}>
                {item.title}
              </h3>
              <p className={`mt-1.5 flex-1 text-sm leading-snug ${item.featured ? "text-ink-100" : "text-ink-700"}`}>
                {item.text}
              </p>
              <span
                className={`mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest ${
                  item.featured ? "text-accent-400" : "text-accent-600"
                }`}
              >
                {item.cta || "Entrar"}
                <Icon name="arrow-right" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>

              {/* Barra de acento al pasar el cursor */}
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-accent-500 to-accent-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            </Link>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
