import { Resend } from "resend";
import type { Contact } from "./content";

const FROM = process.env.EMAIL_FROM || "FixArte BCN <fixartebcn@olcas.app>";

function resend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

const typeLabel: Record<string, string> = {
  PRESUPUESTO: "Solicitud de presupuesto",
  CONTACTO: "Mensaje de contacto",
  URGENCIA: "⚠️ URGENCIA",
};

export type LeadEmailData = {
  type: "PRESUPUESTO" | "CONTACTO" | "URGENCIA";
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  photoCount: number;
  leadId: number;
};

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function row(label: string, value: string) {
  if (!value) return "";
  return `<tr>
    <td style="padding:10px 14px;border-bottom:1px solid #eef1f5;color:#64748b;font-size:13px;white-space:nowrap;vertical-align:top">${label}</td>
    <td style="padding:10px 14px;border-bottom:1px solid #eef1f5;color:#0f172a;font-size:14px">${esc(value)}</td>
  </tr>`;
}

function shell(title: string, badgeColor: string, inner: string) {
  return `<!doctype html><html lang="es"><body style="margin:0;background:#f1f5f9;font-family:-apple-system,'Segoe UI',Roboto,Arial,sans-serif">
  <div style="max-width:600px;margin:0 auto;padding:24px 12px">
    <div style="background:#0b1f33;border-radius:14px 14px 0 0;padding:20px 24px">
      <span style="color:#ffffff;font-size:18px;font-weight:700">FixArte <span style="color:#f97316">BCN</span></span>
    </div>
    <div style="background:#ffffff;border-radius:0 0 14px 14px;padding:24px;border:1px solid #e2e8f0;border-top:0">
      <span style="display:inline-block;background:${badgeColor};color:#fff;border-radius:99px;padding:4px 12px;font-size:12px;font-weight:700;letter-spacing:.4px">${title}</span>
      ${inner}
    </div>
    <p style="color:#94a3b8;font-size:12px;text-align:center;margin-top:16px">FixArte BCN · Barcelona, Badalona y área metropolitana · fixartebcn.es</p>
  </div></body></html>`;
}

/** Aviso interno al negocio con los datos del lead. */
export async function sendLeadNotification(data: LeadEmailData, to: string[]) {
  const client = resend();
  if (!client || to.length === 0) return;

  const badge = data.type === "URGENCIA" ? "#dc2626" : data.type === "PRESUPUESTO" ? "#f97316" : "#0ea5e9";
  const inner = `
    <h1 style="font-size:18px;color:#0f172a;margin:14px 0 6px">${typeLabel[data.type]} — ${esc(data.name)}</h1>
    <table style="width:100%;border-collapse:collapse;margin-top:10px">
      ${row("Nombre", data.name)}
      ${row("Teléfono", data.phone)}
      ${row("Email", data.email)}
      ${row("Servicio", data.service)}
      ${row("Mensaje", data.message)}
      ${row("Fotos adjuntas", data.photoCount > 0 ? `${data.photoCount} (disponibles en el panel)` : "")}
    </table>
    <div style="margin-top:18px">
      <a href="tel:${data.phone.replace(/\s/g, "")}" style="display:inline-block;background:#0b1f33;color:#fff;text-decoration:none;border-radius:10px;padding:10px 18px;font-size:14px;font-weight:600;margin-right:8px">Llamar</a>
      <a href="https://wa.me/${data.phone.replace(/[^0-9]/g, "")}" style="display:inline-block;background:#22c55e;color:#fff;text-decoration:none;border-radius:10px;padding:10px 18px;font-size:14px;font-weight:600;margin-right:8px">WhatsApp</a>
      <a href="https://fixartebcn.es/panel/solicitudes" style="display:inline-block;background:#f1f5f9;color:#0f172a;text-decoration:none;border-radius:10px;padding:10px 18px;font-size:14px;font-weight:600">Ver en el panel</a>
    </div>`;

  await client.emails.send({
    from: FROM,
    to,
    replyTo: data.email || undefined,
    subject: `${typeLabel[data.type]} · ${data.name} · ${data.phone}`,
    html: shell(typeLabel[data.type], badge, inner),
  });
}

/** Confirmación automática al cliente que rellenó el formulario. */
export async function sendAutoReply(data: LeadEmailData, contact: Contact) {
  const client = resend();
  if (!client || !data.email) return;

  const inner = `
    <h1 style="font-size:18px;color:#0f172a;margin:14px 0 6px">Hemos recibido tu solicitud, ${esc(data.name)}</h1>
    <p style="color:#334155;font-size:14px;line-height:1.6">Gracias por contactar con <strong>FixArte BCN</strong>. Nuestro equipo revisará tu solicitud y te responderá lo antes posible con una propuesta clara y sin compromiso.</p>
    <p style="color:#334155;font-size:14px;line-height:1.6">Si tu caso es urgente, contáctanos directamente:</p>
    <div style="margin-top:14px">
      <a href="tel:${contact.phone}" style="display:inline-block;background:#0b1f33;color:#fff;text-decoration:none;border-radius:10px;padding:10px 18px;font-size:14px;font-weight:600;margin-right:8px">📞 ${esc(contact.phoneDisplay)}</a>
      <a href="https://wa.me/${contact.whatsapp}" style="display:inline-block;background:#22c55e;color:#fff;text-decoration:none;border-radius:10px;padding:10px 18px;font-size:14px;font-weight:600">💬 WhatsApp</a>
    </div>`;

  try {
    await client.emails.send({
      from: FROM,
      to: [data.email],
      replyTo: contact.email,
      subject: "Hemos recibido tu solicitud — FixArte BCN",
      html: shell("Solicitud recibida", "#22c55e", inner),
    });
  } catch {
    // La confirmación al cliente nunca debe tumbar el alta del lead
  }
}
