import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PanelHeader } from "@/components/panel/ui";
import { ImageUploader } from "@/components/panel/ImageUploader";
import { savePostAction } from "../../actions";

export const dynamic = "force-dynamic";

export default async function PostEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "nuevo";
  const post = isNew ? null : await db.post.findUnique({ where: { id: Number(id) || 0 } });
  if (!isNew && !post) notFound();

  return (
    <>
      <PanelHeader
        title={isNew ? "Nuevo artículo" : `Editar: ${post!.title}`}
        text="Escribe en markdown: ## crea un título de sección, **negrita**, - listas"
      />

      <form action={savePostAction} className="max-w-3xl space-y-5">
        <input type="hidden" name="id" value={post?.id ?? 0} />

        <div className="card grid gap-4 p-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="field-label" htmlFor="a-title">Título *</label>
            <input id="a-title" name="title" required defaultValue={post?.title} className="field-input" />
          </div>
          <div>
            <label className="field-label" htmlFor="a-slug">Slug (URL)</label>
            <input id="a-slug" name="slug" defaultValue={post?.slug} className="field-input" placeholder="se genera del título si lo dejas vacío" />
          </div>
          <ImageUploader name="coverImage" label="Imagen de portada (opcional)" defaultValue={post?.coverImage} subdir="consejos" />
          <div className="sm:col-span-2">
            <label className="field-label" htmlFor="a-excerpt">Resumen (aparece en los listados) *</label>
            <textarea id="a-excerpt" name="excerpt" required rows={2} defaultValue={post?.excerpt} className="field-input" />
          </div>
        </div>

        <div className="card p-6">
          <label className="field-label" htmlFor="a-content">Contenido (markdown) *</label>
          <textarea id="a-content" name="content" required rows={20} defaultValue={post?.content} className="field-input font-mono !text-xs" />
        </div>

        <div className="card grid gap-4 p-6 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="a-mtitle">Meta título (SEO, opcional)</label>
            <input id="a-mtitle" name="metaTitle" maxLength={70} defaultValue={post?.metaTitle} className="field-input" />
          </div>
          <label className="flex items-center gap-2.5 self-end pb-2 text-sm font-semibold text-ink-900">
            <input type="checkbox" name="published" defaultChecked={post?.published ?? true} className="h-4 w-4 accent-accent-500" />
            Publicado
          </label>
          <div className="sm:col-span-2">
            <label className="field-label" htmlFor="a-mdesc">Meta descripción (SEO, opcional)</label>
            <textarea id="a-mdesc" name="metaDescription" maxLength={170} rows={2} defaultValue={post?.metaDescription} className="field-input" />
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" className="btn-primary">Guardar artículo</button>
          <a href="/panel/consejos" className="btn-outline">Cancelar</a>
        </div>
      </form>
    </>
  );
}
