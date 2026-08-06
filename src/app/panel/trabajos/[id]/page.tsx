import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PanelHeader } from "@/components/panel/ui";
import { ImageUploader } from "@/components/panel/ImageUploader";
import { VideoUploader } from "@/components/panel/VideoUploader";
import { saveProjectAction } from "../../actions";

export const dynamic = "force-dynamic";

export default async function ProjectEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "nuevo";
  const [project, services] = await Promise.all([
    isNew ? null : db.project.findUnique({ where: { id: Number(id) || 0 } }),
    db.service.findMany({ orderBy: { order: "asc" }, select: { title: true } }),
  ]);
  if (!isNew && !project) notFound();

  return (
    <>
      <PanelHeader
        title={isNew ? "Nuevo trabajo" : `Editar: ${project!.title}`}
        text="Sube el antes y el después: la web mostrará un comparador deslizante"
      />

      <form action={saveProjectAction} className="max-w-2xl space-y-5">
        <input type="hidden" name="id" value={project?.id ?? 0} />

        <div className="card grid gap-4 p-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="field-label" htmlFor="p-title">Título del trabajo *</label>
            <input id="p-title" name="title" required defaultValue={project?.title} className="field-input" placeholder="Reforma de baño en Badalona" />
          </div>
          <div>
            <label className="field-label" htmlFor="p-cat">Categoría</label>
            <input id="p-cat" name="category" list="categorias" defaultValue={project?.category} className="field-input" placeholder="Pintura" />
            <datalist id="categorias">
              {services.map((s) => (
                <option key={s.title} value={s.title} />
              ))}
              <option value="Antes y después" />
            </datalist>
          </div>
          <div>
            <label className="field-label" htmlFor="p-order">Orden</label>
            <input id="p-order" name="order" type="number" defaultValue={project?.order ?? 0} className="field-input" />
          </div>
          <div className="sm:col-span-2">
            <label className="field-label" htmlFor="p-desc">Descripción breve</label>
            <textarea id="p-desc" name="description" rows={3} defaultValue={project?.description} className="field-input" />
          </div>
          <ImageUploader name="beforeImage" label="Foto ANTES" defaultValue={project?.beforeImage} subdir="trabajos" />
          <ImageUploader name="afterImage" label="Foto DESPUÉS" defaultValue={project?.afterImage} subdir="trabajos" />
          <input type="hidden" name="images" value={((project?.images as string[]) || []).join("\n")} />
          <div className="sm:col-span-2">
            <VideoUploader
              name="videos"
              defaultValue={(project?.videos as { src: string; poster: string }[]) || []}
            />
          </div>
          <label className="flex items-center gap-2.5 text-sm font-semibold text-ink-900">
            <input type="checkbox" name="featured" defaultChecked={project?.featured ?? false} className="h-4 w-4 accent-accent-500" />
            Proyecto destacado
          </label>
          <label className="flex items-center gap-2.5 text-sm font-semibold text-ink-900">
            <input type="checkbox" name="published" defaultChecked={project?.published ?? true} className="h-4 w-4 accent-accent-500" />
            Publicado en la web
          </label>
        </div>

        <div className="flex gap-3">
          <button type="submit" className="btn-primary">Guardar trabajo</button>
          <a href="/panel/trabajos" className="btn-outline">Cancelar</a>
        </div>
      </form>
    </>
  );
}
