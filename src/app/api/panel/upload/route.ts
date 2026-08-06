import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { saveImage, saveVideo } from "@/lib/uploads";

export const dynamic = "force-dynamic";
// La recodificación del vídeo puede tardar: damos margen suficiente
export const maxDuration = 300;

const SUBDIRS = ["servicios", "trabajos", "consejos"] as const;

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  const kind = String(form.get("kind") || "image");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Archivo no válido" }, { status: 400 });
  }

  try {
    if (kind === "video") {
      const video = await saveVideo(file);
      return NextResponse.json(video);
    }

    const subdir = String(form.get("subdir") || "trabajos") as (typeof SUBDIRS)[number];
    if (!SUBDIRS.includes(subdir)) {
      return NextResponse.json({ error: "Destino no válido" }, { status: 400 });
    }
    const path = await saveImage(file, subdir);
    return NextResponse.json({ path });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "No se pudo guardar el archivo" },
      { status: 400 }
    );
  }
}
