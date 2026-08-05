import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { faqsToText } from "@/lib/utils";
import { PanelHeader } from "@/components/panel/ui";
import { ImageUploader } from "@/components/panel/ImageUploader";
import { saveServiceAction } from "../../actions";

export const dynamic = "force-dynamic";

const ICON_OPTIONS = ["bolt", "droplet", "paint", "wall", "hammer", "sofa", "kitchen", "wrench", "building", "ruler", "gear", "shield", "sparkles", "home"];
const SCHEMA_OPTIONS = ["HomeAndConstructionBusiness", "Electrician", "Plumber", "HousePainter", "GeneralContractor", "Locksmith", "MovingCompany", "RoofingContractor"];

export default async function ServiceEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "nuevo";
  const service = isNew ? null : await db.service.findUnique({ where: { id: Number(id) || 0 } });
  if (!isNew && !service) notFound();

  return (
    <>
      <PanelHeader
        title={isNew ? "Nuevo servicio" : `Editar: ${service!.title}`}
        text="El contenido de la página del servicio y su SEO"
      />

      <form action={saveServiceAction} className="max-w-3xl space-y-5">
        <input type="hidden" name="id" value={service?.id ?? 0} />

        <div className="card grid gap-4 p-6 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="s-title">Nombre del servicio *</label>
            <input id="s-title" name="title" required defaultValue={service?.title} className="field-input" placeholder="Fontanería" />
          </div>
          <div>
            <label className="field-label" htmlFor="s-slug">Slug (URL, keyword SEO)</label>
            <input id="s-slug" name="slug" defaultValue={service?.slug} className="field-input" placeholder="fontanero-barcelona" />
          </div>
          <div className="sm:col-span-2">
            <label className="field-label" htmlFor="s-hero">Título H1 (con la keyword)</label>
            <input id="s-hero" name="heroTitle" defaultValue={service?.heroTitle} className="field-input" placeholder="Fontanero en Barcelona" />
          </div>
          <div className="sm:col-span-2">
            <label className="field-label" htmlFor="s-short">Descripción corta (tarjetas) *</label>
            <textarea id="s-short" name="shortDesc" required rows={2} defaultValue={service?.shortDesc} className="field-input" />
          </div>
          <div>
            <label className="field-label" htmlFor="s-icon">Icono</label>
            <select id="s-icon" name="icon" defaultValue={service?.icon || "wrench"} className="field-input">
              {ICON_OPTIONS.map((i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label" htmlFor="s-order">Orden</label>
            <input id="s-order" name="order" type="number" defaultValue={service?.order ?? 0} className="field-input" />
          </div>
          <ImageUploader name="image" label="Imagen (opcional)" defaultValue={service?.image} subdir="servicios" />
          <label className="flex items-center gap-2.5 self-end pb-2 text-sm font-semibold text-ink-900">
            <input type="checkbox" name="published" defaultChecked={service?.published ?? true} className="h-4 w-4 accent-accent-500" />
            Publicado en la web
          </label>
        </div>

        <div className="card space-y-4 p-6">
          <div>
            <label className="field-label" htmlFor="s-long">Contenido de la página (markdown: ## para títulos)</label>
            <textarea id="s-long" name="longDesc" rows={12} defaultValue={service?.longDesc} className="field-input font-mono !text-xs" />
          </div>
          <div>
            <label className="field-label" htmlFor="s-bullets">“Qué hacemos” (una línea por punto)</label>
            <textarea id="s-bullets" name="bullets" rows={6} defaultValue={((service?.bullets as string[]) || []).join("\n")} className="field-input" />
          </div>
          <div>
            <label className="field-label" htmlFor="s-faqs">Preguntas frecuentes (formato P: / R:)</label>
            <textarea
              id="s-faqs"
              name="faqs"
              rows={10}
              defaultValue={faqsToText((service?.faqs as { q: string; a: string }[]) || [])}
              className="field-input font-mono !text-xs"
              placeholder={"P: ¿Hacéis presupuesto sin compromiso?\nR: Sí, siempre."}
            />
          </div>
        </div>

        <div className="card grid gap-4 p-6 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="s-mtitle">Meta título (50–60 caracteres)</label>
            <input id="s-mtitle" name="metaTitle" maxLength={70} defaultValue={service?.metaTitle} className="field-input" />
          </div>
          <div>
            <label className="field-label" htmlFor="s-schema">Tipo de negocio (schema.org)</label>
            <select id="s-schema" name="schemaType" defaultValue={service?.schemaType || "HomeAndConstructionBusiness"} className="field-input">
              {SCHEMA_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="field-label" htmlFor="s-mdesc">Meta descripción (150–160 caracteres)</label>
            <textarea id="s-mdesc" name="metaDescription" maxLength={170} rows={2} defaultValue={service?.metaDescription} className="field-input" />
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" className="btn-primary">Guardar servicio</button>
          <a href="/panel/servicios" className="btn-outline">Cancelar</a>
        </div>
      </form>
    </>
  );
}
