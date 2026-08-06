"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "./Icons";

/**
 * Acordeón con apertura animada (el <details> nativo se abre de golpe).
 */
export function Accordion({
  title,
  subtitle,
  children,
  className = "card",
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-start justify-between gap-3 px-5 py-4 text-left"
      >
        <span className="min-w-0">
          <span className="block text-sm font-bold text-noir">{title}</span>
          {subtitle && <span className="mt-1 block text-sm font-medium leading-relaxed text-noir">{subtitle}</span>}
        </span>
        <motion.span animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.2 }} className="mt-0.5 shrink-0">
          <Icon name="chevron-right" className="h-4 w-4 text-gold-700" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
