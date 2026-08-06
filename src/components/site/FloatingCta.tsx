"use client";

import { useEffect, useState } from "react";
import { Icon } from "./Icons";
import { waLink } from "@/lib/content";
import { useQuote } from "./QuoteModal";

/**
 * Acciones siempre visibles (mobile-first):
 * - Móvil: barra fija inferior con Llamar / WhatsApp / Presupuesto.
 * - Escritorio: burbujas flotantes a la derecha.
 */
export function FloatingCta({ phone, whatsapp }: { phone: string; whatsapp: string }) {
  const { open, isOpen } = useQuote();
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.75);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const wa = waLink(whatsapp, "Hola, quiero pedir información sobre un servicio de FixArte BCN");

  return (
    <>
      {/* Móvil: barra inferior */}
      <nav
        aria-label="Acciones rápidas"
        className={`fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 gap-px border-t border-ink-950/10 bg-ink-950/10 md:hidden ${
          isOpen ? "hidden" : ""
        }`}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <a href={`tel:${phone}`} className="flex flex-col items-center gap-0.5 bg-cream-50 py-2.5 text-[11px] font-bold text-noir">
          <Icon name="phone" className="h-5 w-5 text-noir" />
          Llamar
        </a>
        <a href={wa} target="_blank" rel="noopener" className="flex flex-col items-center gap-0.5 bg-wa py-2.5 text-[11px] font-bold text-white">
          <Icon name="whatsapp" className="h-5 w-5" />
          WhatsApp
        </a>
        <button
          type="button"
          onClick={open}
          className="flex flex-col items-center gap-0.5 bg-noir py-2.5 text-[11px] font-bold text-white"
        >
          <Icon name="file-text" className="h-5 w-5" />
          Presupuesto
        </button>
      </nav>
      {/* Reserva de espacio para que la barra no tape el pie */}
      <div className="h-16 md:hidden" aria-hidden />

      {/* Escritorio: burbujas */}
      <div
        className={`fixed bottom-6 right-6 z-40 hidden flex-col gap-3 transition-all duration-300 md:flex ${
          pastHero ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={open}
          aria-label="Pedir presupuesto"
          title="Pedir presupuesto"
          className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-gold-500 bg-noir text-white shadow-xl shadow-noir/35 transition-transform hover:scale-110"
        >
          <Icon name="file-text" className="h-6 w-6" />
        </button>
        <a
          href={`tel:${phone}`}
          aria-label="Llamar ahora"
          title="Llamar ahora"
          className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-gold-500/50 bg-white text-noir shadow-xl shadow-noir/20 transition-transform hover:scale-110"
        >
          <Icon name="phone" className="h-6 w-6" />
        </a>
        <a
          href={wa}
          target="_blank"
          rel="noopener"
          aria-label="Escribir por WhatsApp"
          title="WhatsApp"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-wa text-white shadow-xl shadow-wa/40 transition-transform hover:scale-110"
        >
          <Icon name="whatsapp" className="h-6 w-6" />
        </a>
      </div>
    </>
  );
}
