import { NextRequest, NextResponse } from "next/server";
import { createReadStream, existsSync, statSync } from "fs";
import path from "path";
import { Readable } from "stream";
import { resolveUpload } from "@/lib/uploads";

export const dynamic = "force-dynamic";

const TYPES: Record<string, string> = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".mp4": "video/mp4",
};

export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path: parts } = await ctx.params;
  // Nunca servir fuera de la carpeta de subidas
  const abs = resolveUpload(parts.join("/"));
  if (!abs || !existsSync(abs) || !statSync(abs).isFile()) {
    return new NextResponse("Not found", { status: 404 });
  }

  const type = TYPES[path.extname(abs).toLowerCase()];
  if (!type) return new NextResponse("Not found", { status: 404 });

  const size = statSync(abs).size;
  const cache = "public, max-age=31536000, immutable";
  const range = req.headers.get("range");

  // Petición por rangos: necesaria para que el vídeo se pueda adelantar
  if (range) {
    const m = /bytes=(\d*)-(\d*)/.exec(range);
    if (m) {
      const start = m[1] ? Number(m[1]) : 0;
      const end = m[2] ? Number(m[2]) : size - 1;
      if (start >= size || end >= size || start > end) {
        return new NextResponse(null, {
          status: 416,
          headers: { "Content-Range": `bytes */${size}`, "Accept-Ranges": "bytes" },
        });
      }
      const stream = Readable.toWeb(createReadStream(abs, { start, end })) as ReadableStream;
      return new NextResponse(stream, {
        status: 206,
        headers: {
          "Content-Type": type,
          "Content-Length": String(end - start + 1),
          "Content-Range": `bytes ${start}-${end}/${size}`,
          "Accept-Ranges": "bytes",
          "Cache-Control": cache,
        },
      });
    }
  }

  const stream = Readable.toWeb(createReadStream(abs)) as ReadableStream;
  return new NextResponse(stream, {
    headers: {
      "Content-Type": type,
      "Content-Length": String(size),
      "Accept-Ranges": "bytes",
      "Cache-Control": cache,
    },
  });
}
