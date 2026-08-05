import { marked } from "marked";

marked.setOptions({ gfm: true, breaks: false });

/**
 * Convierte markdown (escrito por el administrador desde /panel) a HTML.
 * El contenido lo redacta el propietario del sitio, no visitantes.
 */
export function mdToHtml(md: string): string {
  return marked.parse(md, { async: false }) as string;
}

/** Para textos planos con saltos de línea (intro de "quiénes somos", etc.). */
export function paragraphs(text: string): string[] {
  return text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}
