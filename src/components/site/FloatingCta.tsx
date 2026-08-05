import Link from "next/link";
import { Icon } from "./Icons";
import { waLink } from "@/lib/content";

/**
 * Botones siempre visibles en toda la web:
 * - Escritorio: burbujas flotantes (WhatsApp + llamar) abajo a la derecha.
 * - Móvil: barra de acciones fija inferior (Llamar / WhatsApp / Presupuesto).
 */
export function FloatingCta({ phone, whatsapp }: { phone: string; whatsapp: string }) {
  const wa = waLink(whatsapp, "Hola, quiero pedir información sobre un servicio de FixArte BCN");

  return (
    <>
      {/* Escritorio */}
      <div className="fixed bottom-6 right-6 z-40 hidden flex-col gap-3 md:flex">
        <a
          href={`tel:${phone}`}
          aria-label="Llamar ahora"
          title="Llamar ahora"
          className="flex h-13 w-13 items-center justify-center rounded-full bg-ink-900 p-3.5 text-white shadow-xl shadow-ink-950/30 transition-transform hover:scale-110"
        >
          <Icon name="phone" className="h-6 w-6" />
        </a>
        <a
          href={wa}
          target="_blank"
          rel="noopener"
          aria-label="Escribir por WhatsApp"
          title="WhatsApp"
          className="flex h-13 w-13 items-center justify-center rounded-full bg-wa p-3.5 text-white shadow-xl shadow-wa/40 transition-transform hover:scale-110"
        >
          <Icon name="whatsapp" className="h-6 w-6" />
        </a>
      </div>

      {/* Móvil: barra inferior */}
      <nav
        aria-label="Acciones rápidas"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 gap-px border-t border-cream-200 bg-cream-200 md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <a href={`tel:${phone}`} className="flex flex-col items-center gap-0.5 bg-white py-2.5 text-[11px] font-semibold text-ink-900">
          <Icon name="phone" className="h-5 w-5 text-ink-800" />
          Llamar
        </a>
        <a href={wa} target="_blank" rel="noopener" className="flex flex-col items-center gap-0.5 bg-white py-2.5 text-[11px] font-semibold text-ink-900">
          <Icon name="whatsapp" className="h-5 w-5 text-wa" />
          WhatsApp
        </a>
        <Link href="/presupuesto" className="flex flex-col items-center gap-0.5 bg-accent-500 py-2.5 text-[11px] font-semibold text-white">
          <Icon name="file-text" className="h-5 w-5" />
          Presupuesto
        </Link>
      </nav>
      {/* Reserva de espacio para la barra móvil (evita tapar el pie) */}
      <div className="h-16 md:hidden" aria-hidden />
    </>
  );
}
