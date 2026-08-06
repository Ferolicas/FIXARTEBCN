"use client";

import { useState } from "react";
import { Icon } from "./Icons";
import { LegalLink } from "./LegalModal";
import { InteractiveHoverButton, InteractiveHoverLink } from "@/components/ui/interactive-hover-button";

type Props = {
  type: "PRESUPUESTO" | "CONTACTO" | "URGENCIA";
  services?: { slug: string; title: string }[];
  withPhotos?: boolean;
  submitLabel?: string;
  whatsapp: string;
};

export function LeadForm({ type, services = [], withPhotos = false, submitLabel = "Enviar solicitud", whatsapp }: Props) {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError] = useState("");
  const [fileNames, setFileNames] = useState<string[]>([]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setError("");
    try {
      const fd = new FormData(e.currentTarget);
      fd.set("type", type);
      const res = await fetch("/api/leads", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || "No se pudo enviar la solicitud. Inténtalo de nuevo.");
      }
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
        <h3 className="mt-4 text-xl">¡Solicitud enviada!</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-700">
          Hemos recibido tu mensaje y te responderemos lo antes posible. Si es urgente, escríbenos directamente por
          WhatsApp.
        </p>
        <InteractiveHoverLink
          href={`https://wa.me/${whatsapp}`}
          target="_blank"
          rel="noopener"
          variant="wa"
          className="mt-5"
          leading={<Icon name="whatsapp" className="h-4 w-4" />}
          text="Abrir WhatsApp"
        />
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-6 sm:p-8" noValidate>
      {/* honeypot anti-spam: los humanos no ven este campo */}
      <div className="hidden" aria-hidden>
        <label>
          No rellenar <input type="text" name="web" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${type}-name`} className="field-label">Nombre *</label>
          <input id={`${type}-name`} name="name" required maxLength={120} autoComplete="name" className="field-input" placeholder="Tu nombre" />
        </div>
        <div>
          <label htmlFor={`${type}-phone`} className="field-label">Teléfono *</label>
          <input id={`${type}-phone`} name="phone" required maxLength={20} type="tel" autoComplete="tel" className="field-input" placeholder="600 000 000" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${type}-email`} className="field-label">Email</label>
          <input id={`${type}-email`} name="email" type="email" maxLength={160} autoComplete="email" className="field-input" placeholder="tu@email.com" />
        </div>
        {services.length > 0 && (
          <div>
            <label htmlFor={`${type}-service`} className="field-label">Servicio</label>
            <select id={`${type}-service`} name="service" className="field-input" defaultValue="">
              <option value="">— Selecciona un servicio —</option>
              {services.map((s) => (
                <option key={s.slug} value={s.title}>{s.title}</option>
              ))}
              <option value="Otro">Otro / no lo sé</option>
            </select>
          </div>
        )}
      </div>

      <div>
        <label htmlFor={`${type}-message`} className="field-label">
          {type === "URGENCIA" ? "¿Qué ha ocurrido? *" : "Cuéntanos tu proyecto *"}
        </label>
        <textarea
          id={`${type}-message`}
          name="message"
          required
          rows={5}
          maxLength={4000}
          className="field-input resize-y"
          placeholder={
            type === "URGENCIA"
              ? "Describe la avería y la dirección aproximada…"
              : "Describe qué necesitas: estancia, medidas aproximadas, plazos…"
          }
        />
      </div>

      {withPhotos && (
        <div>
          <span className="field-label">Fotos (opcional, hasta 5)</span>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-cream-200 bg-cream-50 px-4 py-6 text-center transition-colors hover:border-accent-400">
            <Icon name="camera" className="h-6 w-6 text-ink-600" />
            <span className="text-sm font-medium text-ink-800">
              {fileNames.length > 0 ? fileNames.join(", ") : "Añade fotos del trabajo o la avería"}
            </span>
            <span className="text-xs text-ink-600/70">JPG, PNG o WebP · máx. 12 MB por foto</span>
            <input
              type="file"
              name="photos"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={(e) => {
                const files = Array.from(e.target.files || []).slice(0, 5);
                setFileNames(files.map((f) => f.name));
              }}
            />
          </label>
        </div>
      )}

      <label className="flex items-start gap-2.5 text-xs leading-relaxed text-ink-700">
        <input type="checkbox" name="consent" required className="mt-0.5 h-4 w-4 rounded border-cream-200 accent-accent-500" />
        <span>
          He leído y acepto la{" "}
          <LegalLink doc="politica-privacidad" className="font-bold text-noir underline underline-offset-2">
            política de privacidad
          </LegalLink>
          . Tus datos solo se usan para responder a tu solicitud. *
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
        text={status === "sending" ? "Enviando…" : submitLabel}
        leading={status === "sending" ? undefined : <Icon name="send" className="h-4 w-4" />}
      />
    </form>
  );
}
