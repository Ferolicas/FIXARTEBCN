"use client";

import { useState } from "react";

type Props = {
  name: string;
  label: string;
  defaultValue?: string | null;
  subdir: "servicios" | "trabajos" | "consejos";
};

/** Sube una imagen al servidor y guarda su ruta en un input oculto del formulario. */
export function ImageUploader({ name, label, defaultValue, subdir }: Props) {
  const [path, setPath] = useState(defaultValue || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const fd = new FormData();
      fd.set("file", file);
      fd.set("subdir", subdir);
      const res = await fetch("/api/panel/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Error al subir");
      setPath(data.path);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir la imagen");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      <span className="field-label">{label}</span>
      <input type="hidden" name={name} value={path} />
      <div className="flex items-center gap-3">
        {path ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={path} alt="" className="h-16 w-16 rounded-xl border border-cream-200 object-cover" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-dashed border-cream-200 text-xs text-ink-600/50">
            Sin foto
          </div>
        )}
        <div className="flex flex-col gap-1.5">
          <label className="btn-outline cursor-pointer !px-3 !py-1.5 !text-xs">
            {busy ? "Subiendo…" : path ? "Cambiar imagen" : "Subir imagen"}
            <input type="file" accept="image/*" className="sr-only" onChange={onChange} disabled={busy} />
          </label>
          {path && (
            <button type="button" onClick={() => setPath("")} className="text-left text-xs font-medium text-red-600 hover:underline">
              Quitar imagen
            </button>
          )}
        </div>
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
