"use client";

import { useState } from "react";
import { Icon } from "@/components/site/Icons";

export type SavedVideo = { src: string; poster: string };

/**
 * Sube vídeos del trabajo. Cada vídeo se recodifica en el servidor a MP4 para
 * que se vea en cualquier móvil y se le extrae una miniatura automáticamente.
 * La lista se guarda en un campo oculto como JSON.
 */
export function VideoUploader({ name, defaultValue = [] }: { name: string; defaultValue?: SavedVideo[] }) {
  const [videos, setVideos] = useState<SavedVideo[]>(defaultValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setBusy(true);
    setError("");
    for (const file of files) {
      try {
        const fd = new FormData();
        fd.set("file", file);
        fd.set("kind", "video");
        const res = await fetch("/api/panel/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Error al subir el vídeo");
        setVideos((v) => [...v, data as SavedVideo]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al subir el vídeo");
      }
    }
    setBusy(false);
    e.target.value = "";
  }

  return (
    <div>
      <span className="field-label">Vídeos del trabajo (opcional)</span>
      <input type="hidden" name={name} value={JSON.stringify(videos)} />

      {videos.length > 0 && (
        <ul className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {videos.map((v) => (
            <li key={v.src} className="relative overflow-hidden rounded-xl border border-cream-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={v.poster} alt="" className="aspect-video w-full object-cover" />
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white">
                  <Icon name="play" className="ml-0.5 h-4 w-4" />
                </span>
              </span>
              <button
                type="button"
                onClick={() => setVideos((list) => list.filter((x) => x.src !== v.src))}
                aria-label="Quitar vídeo"
                className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-red-600 shadow"
              >
                <Icon name="x" className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <label className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-cream-200 bg-cream-50 px-4 py-5 text-center transition-colors hover:border-accent-400">
        <Icon name="play" className="h-5 w-5 text-ink-600" />
        <span className="text-sm font-medium text-ink-800">
          {busy ? "Subiendo y procesando el vídeo…" : "Añadir vídeo"}
        </span>
        <span className="text-xs text-ink-600/70">MP4, MOV o WebM · máx. 120 MB · se optimiza solo</span>
        <input type="file" accept="video/*" multiple className="sr-only" onChange={onChange} disabled={busy} />
      </label>

      {busy && (
        <p className="mt-1.5 text-xs font-medium text-ink-700">
          El vídeo se está convirtiendo para que se vea rápido en móvil. Puede tardar un poco; no cierres la página.
        </p>
      )}
      {error && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
