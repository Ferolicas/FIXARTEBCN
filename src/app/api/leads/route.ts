import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { rateLimit } from "@/lib/ratelimit";
import { saveImage } from "@/lib/uploads";
import { getContact, getEmailSettings } from "@/lib/content";
import { sendLeadNotification, sendAutoReply } from "@/lib/email";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const leadSchema = z.object({
  type: z.enum(["PRESUPUESTO", "CONTACTO", "URGENCIA"]),
  name: z.string().trim().min(2, "Indica tu nombre").max(120),
  phone: z
    .string()
    .trim()
    .min(9, "Indica un teléfono válido")
    .max(20)
    .regex(/^[+0-9 ().-]+$/, "Indica un teléfono válido"),
  email: z.string().trim().max(160).email("Email no válido").or(z.literal("")),
  service: z.string().trim().max(120).optional().default(""),
  message: z.string().trim().min(5, "Cuéntanos qué necesitas").max(4000),
});

export async function POST(req: NextRequest) {
  const ip = (req.headers.get("x-forwarded-for") || "local").split(",")[0].trim();
  if (!rateLimit(`leads:${ip}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Has enviado demasiadas solicitudes seguidas. Espera unos minutos o escríbenos por WhatsApp." },
      { status: 429 }
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Solicitud no válida" }, { status: 400 });
  }

  // Honeypot: si el campo oculto viene relleno, es un bot
  if (String(form.get("web") || "") !== "") {
    return NextResponse.json({ ok: true });
  }

  const parsed = leadSchema.safeParse({
    type: form.get("type"),
    name: form.get("name"),
    phone: form.get("phone"),
    email: form.get("email") || "",
    service: form.get("service") || "",
    message: form.get("message"),
  });
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message || "Revisa los campos del formulario";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  // Fotos adjuntas (opcional)
  const photos: string[] = [];
  const files = form.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);
  for (const file of files.slice(0, 5)) {
    try {
      photos.push(await saveImage(file, "leads"));
    } catch {
      // Una foto inválida no bloquea el alta de la solicitud
    }
  }

  const lead = await db.lead.create({
    data: { ...parsed.data, photos },
  });

  // Notificaciones por email (Resend). Un fallo de email nunca pierde el lead:
  // queda guardado en BD y visible en /panel/solicitudes.
  try {
    const [emailCfg, contact] = await Promise.all([getEmailSettings(), getContact()]);
    const data = {
      ...parsed.data,
      photoCount: photos.length,
      leadId: lead.id,
    };
    await sendLeadNotification(data, emailCfg.to);
    await sendAutoReply(data, contact);
  } catch (err) {
    console.error("[leads] fallo al enviar email:", err);
  }

  return NextResponse.json({ ok: true, id: lead.id });
}
