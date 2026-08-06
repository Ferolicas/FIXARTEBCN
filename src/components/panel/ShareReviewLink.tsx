"use client";

import { useState } from "react";
import { Icon } from "@/components/site/Icons";

const MENSAJE =
  "¡Hola! Gracias por confiar en FixArte BCN. ¿Nos dejas una reseña? Te lleva un minuto y nos ayuda muchísimo:";

/** Enlace público de reseñas, listo para copiar o enviar por WhatsApp. */
export function ShareReviewLink({ url, whatsapp }: { url: string; whatsapp: string }) {
  const [copiado, setCopiado] = useState<"link" | "texto" | null>(null);

  const copiar = async (valor: string, cual: "link" | "texto") => {
    try {
      await navigator.clipboard.writeText(valor);
      setCopiado(cual);
      setTimeout(() => setCopiado(null), 2000);
    } catch {
      setCopiado(null);
    }
  };

  const texto = `${MENSAJE} ${url}`;

  return (
    <div className="card border-l-4 !border-l-accent-500 p-6">
      <h2 className="flex items-center gap-2 text-lg">
        <Icon name="star" className="h-5 w-5 text-accent-500" />
        Enlace para pedir reseñas
      </h2>
      <p className="mt-1.5 text-sm text-ink-700">
        Envíalo a cada cliente al terminar un trabajo. Rellenan estrellas, titular, texto, foto y su nombre; la reseña
        te llega aquí pendiente de aprobar.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <code className="min-w-0 flex-1 truncate rounded-xl bg-cream-100 px-4 py-2.5 text-sm text-ink-900">{url}</code>
        <button type="button" onClick={() => copiar(url, "link")} className="btn-outline !px-4 !py-2 !text-xs">
          {copiado === "link" ? "¡Copiado!" : "Copiar enlace"}
        </button>
        <button type="button" onClick={() => copiar(texto, "texto")} className="btn-outline !px-4 !py-2 !text-xs">
          {copiado === "texto" ? "¡Copiado!" : "Copiar mensaje"}
        </button>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(texto)}`}
          target="_blank"
          rel="noopener"
          className="btn-wa !px-4 !py-2 !text-xs"
        >
          <Icon name="whatsapp" className="h-4 w-4" /> Enviar por WhatsApp
        </a>
      </div>

      <p className="mt-3 rounded-xl bg-cream-100 px-4 py-3 text-xs leading-relaxed text-ink-800">
        <strong>Mensaje sugerido:</strong> {MENSAJE} {url}
      </p>
    </div>
  );
}
