import { db } from "@/lib/db";
import { Icon } from "@/components/site/Icons";
import { PanelHeader, EmptyState, DangerSubmit } from "@/components/panel/ui";
import { saveTestimonialAction, deleteTestimonialAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function TestimonialsAdminPage() {
  const testimonials = await db.testimonial.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });

  return (
    <>
      <PanelHeader title="Opiniones" text="Valoraciones de clientes que se muestran en la sección de consejos y opiniones" />

      <form action={saveTestimonialAction} className="card mb-6 grid max-w-3xl gap-4 p-6 sm:grid-cols-2">
        <input type="hidden" name="id" value={0} />
        <h2 className="text-lg sm:col-span-2">Añadir opinión</h2>
        <div>
          <label className="field-label" htmlFor="t-name">Nombre del cliente *</label>
          <input id="t-name" name="name" required className="field-input" placeholder="María G." />
        </div>
        <div>
          <label className="field-label" htmlFor="t-role">Detalle (opcional)</label>
          <input id="t-role" name="role" className="field-input" placeholder="Comunidad de propietarios, Badalona" />
        </div>
        <div className="sm:col-span-2">
          <label className="field-label" htmlFor="t-text">Opinión *</label>
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
        <button type="submit" className="btn-primary sm:col-span-2">Guardar opinión</button>
      </form>

      {testimonials.length === 0 ? (
        <EmptyState text="Aún no hay opiniones guardadas. Añade las valoraciones reales que te dejen tus clientes." />
      ) : (
        <div className="card max-w-3xl divide-y divide-cream-200">
          {testimonials.map((t) => (
            <div key={t.id} className="flex items-start gap-4 px-5 py-4">
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 text-sm font-bold text-ink-900">
                  {t.name}
                  <span className="flex text-accent-500">
                    {Array.from({ length: t.rating }, (_, i) => (
                      <Icon key={i} name="star" className="h-3.5 w-3.5" />
                    ))}
                  </span>
                  {!t.published && (
                    <span className="rounded bg-cream-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-ink-700">Oculta</span>
                  )}
                </p>
                {t.role && <p className="text-xs text-ink-700">{t.role}</p>}
                <p className="mt-1.5 text-sm leading-relaxed text-ink-800">“{t.text}”</p>
              </div>
              <form action={deleteTestimonialAction}>
                <input type="hidden" name="id" value={t.id} />
                <DangerSubmit />
              </form>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
