"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "./Icons";
import { ReviewForm } from "./ReviewForm";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

/** Botón que abre el formulario de reseña en un modal. */
export function ReviewModalButton({
  services,
  whatsapp,
  className,
  text = "Deja tu reseña",
}: {
  services: { title: string }[];
  whatsapp: string;
  className?: string;
  text?: string;
}) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  return (
    <>
      <InteractiveHoverButton type="button" onClick={() => setOpen(true)} className={className} text={text} />

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-end justify-center bg-noir/70 backdrop-blur-sm sm:items-center sm:p-6"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-resena-titulo"
          >
            <motion.div
              ref={panelRef}
              tabIndex={-1}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[92svh] w-full overflow-y-auto rounded-t-[2rem] bg-cream-50 outline-none sm:max-w-lg sm:rounded-[2rem]"
            >
              <div className="sticky top-0 z-10 flex items-start justify-between gap-4 bg-cream-50/95 px-5 pb-4 pt-6 backdrop-blur sm:px-7">
                <div>
                  <p className="slash-gold">Tu opinión</p>
                  <h2 id="modal-resena-titulo" className="mt-2 text-2xl sm:text-3xl">
                    ¿Qué tal fue nuestro trabajo?
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Cerrar"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-noir/10 bg-white text-noir transition-colors hover:bg-cream-100"
                >
                  <Icon name="x" className="h-5 w-5" />
                </button>
              </div>
              <div className="px-5 pb-7 sm:px-7">
                <ReviewForm services={services} whatsapp={whatsapp} onDone={close} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
