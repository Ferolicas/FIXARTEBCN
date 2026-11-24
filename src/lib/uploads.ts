import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import crypto from "crypto";
import sharp, { type Sharp } from "sharp";

export function uploadsDir(): string {
  return path.resolve(process.env.UPLOADS_DIR || "./uploads");
}

/**
 * Resuelve una ruta relativa dentro de la carpeta de subidas. Devuelve null si
 * el resultado cae fuera de ella. La comparación exige el separador final:
 * con un simple startsWith(raíz), "../uploads-otra/x.png" pasaría el filtro
 * porque "/srv/uploads-otra" también empieza por "/srv/uploads".
 */
export function resolveUpload(rel: string): string | null {
  const root = uploadsDir();
  const abs = path.resolve(root, rel);
  return abs.startsWith(root + path.sep) ? abs : null;
}

const MAX_BYTES = 12 * 1024 * 1024;

/**
 * Guarda una imagen subida: valida, redimensiona (máx 1920px) y convierte a
 * WebP. Devuelve la ruta pública (/uploads/...). Lanza Error con mensaje claro
 * si el archivo no es una imagen válida.
 */
export async function saveImage(file: File, subdir: "servicios" | "trabajos" | "consejos" | "leads"): Promise<string> {
  if (file.size === 0) throw new Error("Archivo vacío");
  if (file.size > MAX_BYTES) throw new Error("La imagen supera los 12 MB");

  const buffer = Buffer.from(await file.arrayBuffer());

  let pipeline: Sharp;
  try {
    pipeline = sharp(buffer, { failOn: "error" }).rotate();
    await pipeline.metadata();
  } catch {
    throw new Error("El archivo no es una imagen válida");
  }

  const name = `${Date.now()}-${crypto.randomBytes(5).toString("hex")}.webp`;
  const dir = path.join(uploadsDir(), subdir);
  await mkdir(dir, { recursive: true });

  await sharp(buffer)
    .rotate()
    .resize(1920, 1920, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(path.join(dir, name));

  return `/uploads/${subdir}/${name}`;
}

/** Borra un archivo subido a partir de su ruta pública. Ignora errores. */
export async function deleteUpload(publicPath: string) {
  if (!publicPath.startsWith("/uploads/")) return;
  // Nunca salir de la carpeta de subidas
  const abs = resolveUpload(publicPath.slice("/uploads/".length));
  if (!abs) return;
  try {
    await unlink(abs);
  } catch {}
}

export { writeFile };

// ─────────────────────────── VÍDEO ───────────────────────────

import { execFile } from "child_process";
import { promisify } from "util";
const run = promisify(execFile);

const MAX_VIDEO_BYTES = 120 * 1024 * 1024;

export type SavedVideo = { src: string; poster: string };

/**
 * Guarda un vídeo del panel: lo recodifica a MP4 (H.264 + AAC) para que se vea
 * en cualquier navegador, lo limita a 1280 px de ancho, lo prepara para
 * reproducción progresiva (faststart) y extrae una miniatura.
 */
export async function saveVideo(file: File): Promise<SavedVideo> {
  if (file.size === 0) throw new Error("Archivo vacío");
  if (file.size > MAX_VIDEO_BYTES) throw new Error("El vídeo supera los 120 MB");

  const dir = path.join(uploadsDir(), "videos");
  await mkdir(dir, { recursive: true });

  const base = `${Date.now()}-${crypto.randomBytes(5).toString("hex")}`;
  const tmp = path.join(dir, `${base}.origen`);
  const out = path.join(dir, `${base}.mp4`);
  const poster = path.join(dir, `${base}.webp`);

  await writeFile(tmp, Buffer.from(await file.arrayBuffer()));

  try {
    // Comprobación real del contenido: si ffprobe no ve vídeo, no es un vídeo
    const { stdout } = await run("ffprobe", [
      "-v", "error", "-select_streams", "v:0",
      "-show_entries", "stream=codec_type", "-of", "csv=p=0", tmp,
    ]);
    if (!stdout.includes("video")) throw new Error("no-video");

    await run("ffmpeg", [
      "-y", "-i", tmp,
      "-vf", "scale='min(1280,iw)':-2",
      "-c:v", "libx264", "-preset", "veryfast", "-crf", "28",
      "-c:a", "aac", "-b:a", "128k",
      "-movflags", "+faststart",
      out,
    ], { maxBuffer: 1024 * 1024 * 32 });

    // Miniatura del segundo 1 (o del primer fotograma si es más corto)
    await run("ffmpeg", ["-y", "-ss", "1", "-i", out, "-frames:v", "1", "-vf", "scale=800:-2", poster])
      .catch(() => run("ffmpeg", ["-y", "-i", out, "-frames:v", "1", "-vf", "scale=800:-2", poster]));
  } catch {
    await unlink(tmp).catch(() => {});
    await unlink(out).catch(() => {});
    throw new Error("El archivo no es un vídeo válido o no se pudo procesar");
  } finally {
    await unlink(tmp).catch(() => {});
  }

  return { src: `/uploads/videos/${base}.mp4`, poster: `/uploads/videos/${base}.webp` };
}
