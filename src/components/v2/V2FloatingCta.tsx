"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/site/Icons";
import { waLink } from "@/lib/content";
import { useQuote } from "@/components/site/QuoteModal";

/**
 * Acciones siempre visibles (mobile-first):
 * - Móvil: barra fija inferior con Llamar / WhatsApp / Presupuesto.
 * - Escritorio: burbujas flotantes a la derecha.
 */
export function V2FloatingCta({ phone, whatsapp }: { phone: string; whatsapp: string }) {
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
        className={`fa-mobile-cta fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 md:hidden ${
          isOpen ? "hidden" : ""
        }`}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <a href={`tel:${phone}`} className="fa-mobile-cta-item">
          <Icon name="phone" className="h-5 w-5 text-noir" />
          Llamar
        </a>
        <a href={wa} target="_blank" rel="noopener" className="fa-mobile-cta-item fa-mobile-cta-wa">
          <Icon name="whatsapp" className="h-5 w-5" />
          WhatsApp
        </a>
        <button
          type="button"
          onClick={open}
          className="fa-mobile-cta-item fa-mobile-cta-budget"
        >
          <Icon name="file-text" className="h-5 w-5" />
          Presupuesto
        </button>
      </nav>
      {/* Reserva de espacio para que la barra no tape el pie */}
      <div className="h-16 md:hidden" aria-hidden />

      {/* Escritorio: burbujas */}
      <div
        className={`fa-desktop-float fixed bottom-6 right-6 z-40 hidden flex-col gap-2 transition-all duration-300 md:flex ${
          pastHero ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={open}
          aria-label="Pedir presupuesto"
          title="Pedir presupuesto"
          className="fa-float-button fa-float-budget"
        >
          <Icon name="file-text" className="h-6 w-6" />
        </button>
        <a
          href={`tel:${phone}`}
          aria-label="Llamar ahora"
          title="Llamar ahora"
          className="fa-float-button fa-float-call"
        >
          <Icon name="phone" className="h-6 w-6" />
        </a>
        <a
          href={wa}
          target="_blank"
          rel="noopener"
          aria-label="Escribir por WhatsApp"
          title="WhatsApp"
          className="fa-float-button fa-float-wa"
        >
          <Icon name="whatsapp" className="h-6 w-6" />
        </a>
      </div>
    </>
  );
}
