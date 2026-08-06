import { db } from "@/lib/db";
import { getContact } from "@/lib/content";
import { SITE_URL } from "@/lib/seo";
import { Icon } from "@/components/site/Icons";
import { PanelHeader, EmptyState, DangerSubmit } from "@/components/panel/ui";
import { ShareReviewLink } from "@/components/panel/ShareReviewLink";
import { saveTestimonialAction, deleteTestimonialAction, toggleTestimonialAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function TestimonialsAdminPage() {
  const [testimonials, services, contact] = await Promise.all([
    db.testimonial.findMany({ orderBy: { createdAt: "desc" } }),
    db.service.findMany({ orderBy: { order: "asc" }, select: { title: true } }),
    getContact(),
  ]);

  const pendientes = testimonials.filter((t) => !t.published);
  const publicadas = testimonials.filter((t) => t.published);

  return (
    <>
      <PanelHeader
        title="Opiniones"
        text="Reseñas de clientes. Las que llegan por el enlace público quedan pendientes hasta que las apruebes."
      />

      <ShareReviewLink url={`${SITE_URL}/opinar`} whatsapp={contact.whatsapp} />

      {/* Pendientes de aprobar */}
      {pendientes.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 flex items-center gap-2 text-lg">
            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-accent-500 px-2 text-xs font-bold text-white">
              {pendientes.length}
            </span>
            Pendientes de aprobar
          </h2>
          <div className="space-y-3">
            {pendientes.map((t) => (
              <ReviewRow key={t.id} t={t} />
            ))}
          </div>
        </div>
      )}

      {/* Alta manual */}
      <details className="card mt-8 max-w-3xl p-6">
        <summary className="cursor-pointer text-lg font-bold text-ink-900">Añadir una reseña a mano</summary>
        <form action={saveTestimonialAction} className="mt-4 grid gap-4 sm:grid-cols-2">
          <input type="hidden" name="id" value={0} />
          <div>
            <label className="field-label" htmlFor="t-name">Nombre del cliente *</label>
            <input id="t-name" name="name" required className="field-input" placeholder="María G." />
          </div>
          <div>
            <label className="field-label" htmlFor="t-service">Servicio</label>
            <select id="t-service" name="service" className="field-input" defaultValue="">
              <option value="">— Servicio —</option>
              {services.map((s) => (
                <option key={s.title} value={s.title}>{s.title}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="field-label" htmlFor="t-title">Titular</label>
            <input id="t-title" name="title" className="field-input" placeholder="Puntuales y muy limpios" />
          </div>
          <div className="sm:col-span-2">
            <label className="field-label" htmlFor="t-text">Reseña *</label>
            <textarea id="t-text" name="text" required rows={3} className="field-input" />
          </div>
          <div>
            <label className="field-label" htmlFor="t-rating">Estrellas (1–5)</label>
            <input id="t-rating" name="rating" type="number" min={1} max={5} defaultValue={5} className="field-input" />
          </div>
          <label className="flex items-center gap-2.5 self-end pb-2 text-sm font-semibold text-ink-900">
            <input type="checkbox" name="published" defaultChecked className="h-4 w-4 accent-accent-500" />
            Publicada
          </label>
          <button type="submit" className="btn-primary sm:col-span-2">Guardar reseña</button>
        </form>
      </details>

      {/* Publicadas */}
      <h2 className="mb-3 mt-8 text-lg">Publicadas ({publicadas.length})</h2>
      {publicadas.length === 0 ? (
        <EmptyState text="Todavía no hay reseñas publicadas. Comparte el enlace de arriba con tus clientes al terminar cada trabajo." />
      ) : (
        <div className="space-y-3">
          {publicadas.map((t) => (
            <ReviewRow key={t.id} t={t} />
          ))}
        </div>
      )}
    </>
  );
}

type Row = {
  id: number;
  name: string;
  role: string;
  title: string;
  text: string;
  rating: number;
  service: string;
  photo: string | null;
  published: boolean;
  createdAt: Date;
};

function ReviewRow({ t }: { t: Row }) {
  return (
    <div className="card flex flex-col gap-4 p-5 sm:flex-row">
      {t.photo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={t.photo} alt="" className="h-24 w-full rounded-xl object-cover sm:w-32" />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex gap-0.5">
            {Array.from({ length: 5 }, (_, i) => (
              <Icon key={i} name="star" className={`h-4 w-4 ${i < t.rating ? "text-accent-500" : "text-ink-200"}`} />
            ))}
          </span>
          <span className="text-sm font-bold text-ink-900">{t.name}</span>
          {t.service && <span className="chip">{t.service}</span>}
          <span className="text-xs text-ink-700">
            {new Date(t.createdAt).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })}
          </span>
          {!t.published && (
            <span className="rounded-full bg-accent-500 px-2.5 py-0.5 text-[11px] font-bold text-white">Pendiente</span>
          )}
        </div>
        {t.title && <p className="mt-1.5 font-display text-base font-bold text-ink-900">{t.title}</p>}
        <p className="mt-1 text-sm leading-relaxed text-ink-800">“{t.text}”</p>
      </div>
      <div className="flex shrink-0 items-start gap-2">
        <form action={toggleTestimonialAction}>
          <input type="hidden" name="id" value={t.id} />
          <button
            type="submit"
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
              t.published ? "bg-cream-100 text-ink-900 hover:bg-cream-200" : "bg-wa text-white hover:bg-wa-600"
            }`}
          >
            {t.published ? "Ocultar" : "Publicar"}
          </button>
        </form>
        <form action={deleteTestimonialAction}>
          <input type="hidden" name="id" value={t.id} />
          <DangerSubmit />
        </form>
      </div>
    </div>
  );
}
