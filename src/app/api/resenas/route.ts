import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { rateLimit } from "@/lib/ratelimit";
import { saveImage } from "@/lib/uploads";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const schema = z.object({
  name: z.string().trim().min(2, "Escribe tu nombre").max(80),
  service: z.string().trim().max(120).optional().default(""),
  rating: z.coerce.number().int().min(1, "Elige una puntuación").max(5),
  title: z.string().trim().min(3, "Escribe un titular").max(120),
  text: z.string().trim().min(10, "Cuéntanos algo más").max(2000),
});

export async function POST(req: NextRequest) {
  const ip = (req.headers.get("x-forwarded-for") || "local").split(",")[0].trim();
  if (!rateLimit(`resena:${ip}`, 3, 60 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Ya has enviado varias reseñas. Si es un error, escríbenos por WhatsApp." },
      { status: 429 }
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Solicitud no válida" }, { status: 400 });
  }

  // Honeypot
  if (String(form.get("web") || "") !== "") return NextResponse.json({ ok: true });

  const parsed = schema.safeParse({
    name: form.get("name"),
    service: form.get("service") || "",
    rating: form.get("rating"),
    title: form.get("title"),
    text: form.get("text"),
  });
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Revisa los campos" }, { status: 400 });
  }

  let photo: string | null = null;
  const file = form.get("photo");
  if (file instanceof File && file.size > 0) {
    try {
      photo = await saveImage(file, "trabajos");
    } catch {
      // Una foto inválida no impide guardar la reseña
    }
  }

  await db.testimonial.create({
    data: { ...parsed.data, photo, published: false },
  });

  return NextResponse.json({ ok: true });
}
