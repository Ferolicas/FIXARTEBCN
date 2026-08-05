import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { saveImage } from "@/lib/uploads";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const SUBDIRS = ["servicios", "trabajos", "consejos"] as const;

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  const subdir = String(form.get("subdir") || "trabajos") as (typeof SUBDIRS)[number];
  if (!(file instanceof File) || !SUBDIRS.includes(subdir)) {
    return NextResponse.json({ error: "Archivo no válido" }, { status: 400 });
  }

  try {
    const path = await saveImage(file, subdir);
    return NextResponse.json({ path });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "No se pudo guardar la imagen" },
      { status: 400 }
    );
  }
}
