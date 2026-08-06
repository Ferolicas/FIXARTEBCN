"use client";

import { useState } from "react";
import { Icon } from "./Icons";
import { LegalLink } from "./LegalModal";
import { InteractiveHoverButton, InteractiveHoverLink } from "@/components/ui/interactive-hover-button";

/** Formulario público de reseña: estrellas, titular, texto, foto y nombre. */
export function ReviewForm({
  services,
  whatsapp,
  onDone,
}: {
  services: { title: string }[];
  whatsapp: string;
  onDone?: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError] = useState("");
  const [foto, setFoto] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    if (rating === 0) {
      setStatus("error");
      setError("Elige cuántas estrellas nos das");
      return;
    }
    setStatus("sending");
    setError("");
    try {
      const fd = new FormData(e.currentTarget);
      fd.set("rating", String(rating));
      const res = await fetch("/api/resenas", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "No se pudo enviar la reseña");
      setStatus("ok");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Error inesperado");
    }
  }

  if (status === "ok") {
    return (
      <div className="card p-8 text-center" role="status">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-wa/10 text-wa">
          <Icon name="check" className="h-7 w-7" />
        </span>
        <h2 className="mt-4 text-2xl">¡Gracias por tu reseña!</h2>
        <p className="mx-auto mt-3 max-w-md text-sm font-medium leading-relaxed text-noir">
          La revisaremos y aparecerá en la web en breve. Nos ayudas muchísimo a que otras personas de Barcelona
          confíen en nuestro trabajo.
        </p>
        {onDone ? (
          <InteractiveHoverButton type="button" onClick={onDone} className="mt-6" text="Cerrar" />
        ) : (
          <InteractiveHoverLink href="/" className="mt-6" text="Volver a la web" />
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={`space-y-5 ${onDone ? "" : "card p-6 sm:p-8"}`} noValidate>
      <div className="hidden" aria-hidden>
        <label>
          No rellenar <input type="text" name="web" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {/* Estrellas */}
      <div>
        <span className="field-label">¿Cómo valoras nuestro trabajo? *</span>
        <div className="flex items-center gap-1" role="radiogroup" aria-label="Puntuación">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              role="radio"
              aria-checked={rating === n}
              aria-label={`${n} ${n === 1 ? "estrella" : "estrellas"}`}
              className="rounded-lg p-1 transition-transform hover:scale-110"
            >
              <Icon
                name="star"
                className={`h-9 w-9 transition-colors ${
                  (hover || rating) >= n ? "text-gold-500" : "text-noir/15"
                }`}
              />
            </button>
          ))}
          {rating > 0 && <span className="ml-2 text-sm font-bold text-noir">{rating} de 5</span>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="r-name" className="field-label">Tu nombre *</label>
          <input id="r-name" name="name" required maxLength={80} className="field-input" placeholder="Nombre y apellido" />
        </div>
        <div>
          <label htmlFor="r-service" className="field-label">¿Qué trabajo hicimos?</label>
          <select id="r-service" name="service" className="field-input" defaultValue="">
            <option value="">— Selecciona un servicio —</option>
            {services.map((s) => (
              <option key={s.title} value={s.title}>{s.title}</option>
            ))}
            <option value="Otro">Otro</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="r-title" className="field-label">Titular de tu reseña *</label>
        <input
          id="r-title"
          name="title"
          required
          maxLength={120}
          className="field-input"
          placeholder="Ej.: Puntuales y muy limpios trabajando"
        />
      </div>

      <div>
        <label htmlFor="r-text" className="field-label">Cuéntanos tu experiencia *</label>
        <textarea
          id="r-text"
          name="text"
          required
          rows={5}
          maxLength={2000}
          className="field-input resize-y"
          placeholder="¿Qué trabajo hicimos? ¿Qué tal fue el trato, la puntualidad y el resultado?"
        />
      </div>

      <div>
        <span className="field-label">Foto del trabajo (opcional)</span>
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-noir/15 bg-cream-50 px-4 py-6 text-center transition-colors hover:border-gold-500">
          <Icon name="camera" className="h-6 w-6 text-noir/60" />
          <span className="text-sm font-medium text-noir">{foto || "Añade una foto si quieres"}</span>
          <span className="text-xs text-noir/60">JPG, PNG o WebP · máx. 12 MB</span>
          <input
            type="file"
            name="photo"
            accept="image/*"
            className="sr-only"
            onChange={(e) => setFoto(e.target.files?.[0]?.name || "")}
          />
        </label>
      </div>

      <label className="flex items-start gap-2.5 text-xs leading-relaxed text-noir">
        <input type="checkbox" required className="mt-0.5 h-4 w-4 rounded accent-wa" />
        <span>
          Confirmo que soy cliente de FixArte BCN y acepto la{" "}
          <LegalLink doc="politica-privacidad" className="font-bold underline underline-offset-2">
            política de privacidad
          </LegalLink>
          . Tu reseña se publicará con tu nombre. *
        </span>
      </label>

      {status === "error" && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      <InteractiveHoverButton
        type="submit"
        disabled={status === "sending"}
        variant="solid"
        className="w-full"
        text={status === "sending" ? "Enviando…" : "Enviar mi reseña"}
        leading={status === "sending" ? undefined : <Icon name="star" className="h-4 w-4" />}
      />

      <p className="text-center text-xs text-noir/70">
        ¿Prefieres contárnoslo por WhatsApp?{" "}
        <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener" className="font-bold text-wa-600 underline">
          Escríbenos
        </a>
      </p>
    </form>
  );
}
