"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { LeadForm } from "./LeadForm";
import { Icon } from "./Icons";
import { InteractiveHoverButton, InteractiveHoverLink } from "@/components/ui/interactive-hover-button";

type QuoteCtx = { open: () => void; close: () => void; isOpen: boolean };

const Ctx = createContext<QuoteCtx | null>(null);

export function useQuote(): QuoteCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useQuote debe usarse dentro de <QuoteProvider>");
  return ctx;
}

type ProviderProps = {
  children: React.ReactNode;
  services: { slug: string; title: string }[];
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
};

/**
 * Modal de presupuesto disponible en toda la web. Diseño mobile-first:
 * hoja a pantalla completa en móvil, diálogo centrado a partir de sm.
 */
export function QuoteProvider({ children, services, phone, phoneDisplay, whatsapp }: ProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, close]);

  return (
    <Ctx.Provider value={{ open, close, isOpen }}>
      {children}

      {isOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-ink-950/70 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-presupuesto-titulo"
        >
          <div
            ref={panelRef}
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[92svh] w-full overflow-y-auto rounded-t-[2rem] bg-cream-50 outline-none sm:max-w-lg sm:rounded-[2rem]"
          >
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 bg-cream-50/95 px-5 pb-4 pt-6 backdrop-blur sm:px-7 sm:pt-7">
              <div>
                <p className="slash-label">Sin compromiso</p>
                <h2 id="modal-presupuesto-titulo" className="mt-2 text-2xl sm:text-3xl">
                  Pide tu presupuesto
                </h2>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Cerrar"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink-950/10 bg-white text-ink-900 transition-colors hover:bg-cream-100"
              >
                <Icon name="x" className="h-5 w-5" />
              </button>
            </div>

            <div className="px-5 pb-6 sm:px-7 sm:pb-7">
              <p className="mb-4 text-sm leading-relaxed text-ink-700">
                Cuéntanos qué necesitas y te preparamos un precio claro y cerrado. Puedes adjuntar fotos para afinar la
                valoración.
              </p>

              <LeadForm
                type="PRESUPUESTO"
                services={services}
                withPhotos
                submitLabel="Solicitar presupuesto"
                whatsapp={whatsapp}
              />

              <div className="mt-5 grid grid-cols-2 gap-2">
                <InteractiveHoverLink
                  href={`tel:${phone}`}
                  className="w-full !py-2.5 !text-xs"
                  leading={<Icon name="phone" className="h-4 w-4" />}
                  text={phoneDisplay}
                />
                <InteractiveHoverLink
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener"
                  variant="wa"
                  className="w-full !py-2.5 !text-xs"
                  leading={<Icon name="whatsapp" className="h-4 w-4" />}
                  text="WhatsApp"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}

/** Botón que abre el modal de presupuesto. */
export function QuoteButton({
  className,
  text = "Pedir presupuesto",
  ariaLabel,
  variant = "dark",
}: {
  className?: string;
  text?: string;
  ariaLabel?: string;
  variant?: "dark" | "wa" | "light";
}) {
  const { open } = useQuote();
  return (
    <InteractiveHoverButton
      type="button"
      onClick={open}
      aria-label={ariaLabel}
      text={text}
      variant={variant}
      className={className}
    />
  );
}
