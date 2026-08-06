"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "./Icons";
import { LEGAL_TITLES, type LegalKey } from "@/lib/legal";

type Ctx = { openLegal: (doc: LegalKey) => void };
const LegalCtx = createContext<Ctx | null>(null);

export function useLegal(): Ctx {
  const ctx = useContext(LegalCtx);
  if (!ctx) throw new Error("useLegal debe usarse dentro de <LegalProvider>");
  return ctx;
}

/**
 * Muestra los textos legales en un modal para no sacar al visitante de la web.
 * Los documentos se renderizan en el servidor y se pasan ya montados.
 */
export function LegalProvider({
  children,
  docs,
}: {
  children: React.ReactNode;
  docs: Record<LegalKey, React.ReactNode>;
}) {
  const [doc, setDoc] = useState<LegalKey | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const openLegal = useCallback((d: LegalKey) => setDoc(d), []);
  const close = useCallback(() => setDoc(null), []);

  useEffect(() => {
    if (!doc) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [doc, close]);

  return (
    <LegalCtx.Provider value={{ openLegal }}>
      {children}

      <AnimatePresence>
        {doc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-end justify-center bg-noir/70 backdrop-blur-sm sm:items-center sm:p-6"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-legal-titulo"
          >
            <motion.div
              ref={panelRef}
              tabIndex={-1}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[92svh] w-full overflow-y-auto rounded-t-[2rem] bg-white outline-none sm:max-w-2xl sm:rounded-[2rem]"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-noir/10 bg-white/95 px-5 py-4 backdrop-blur sm:px-8">
                <h2 id="modal-legal-titulo" className="text-2xl">
                  {LEGAL_TITLES[doc]}
                </h2>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Cerrar"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-noir/10 bg-white text-noir transition-colors hover:bg-cream-100"
                >
                  <Icon name="x" className="h-5 w-5" />
                </button>
              </div>
              <div className="prose-fix px-5 pb-8 pt-4 text-justify sm:px-8">{docs[doc]}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </LegalCtx.Provider>
  );
}

/** Enlace que abre el documento legal en un modal. */
export function LegalLink({ doc, className, children }: { doc: LegalKey; className?: string; children: React.ReactNode }) {
  const { openLegal } = useLegal();
  return (
    <button type="button" onClick={() => openLegal(doc)} className={className}>
      {children}
    </button>
  );
}
