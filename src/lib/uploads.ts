import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import crypto from "crypto";
import sharp from "sharp";

export function uploadsDir(): string {
  return path.resolve(process.env.UPLOADS_DIR || "./uploads");
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

  let pipeline: sharp.Sharp;
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
  const rel = publicPath.slice("/uploads/".length);
  const abs = path.join(uploadsDir(), rel);
  // Nunca salir de la carpeta de subidas
  if (!abs.startsWith(uploadsDir())) return;
  try {
    await unlink(abs);
  } catch {}
}

export { writeFile };
