import Link from "next/link";
import { db } from "@/lib/db";
import { PanelHeader, EmptyState, DangerSubmit } from "@/components/panel/ui";
import { deleteProjectAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function ProjectsAdminPage() {
  const projects = await db.project.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });

  return (
    <>
      <PanelHeader
        title="Trabajos realizados"
        text="La galería pública: sube el antes y el después de tus proyectos"
        action={{ href: "/panel/trabajos/nuevo", label: "Nuevo trabajo" }}
      />

      {projects.length === 0 ? (
        <EmptyState text='Aún no hay trabajos. Pulsa "Nuevo trabajo" y sube las fotos del antes y el después de un proyecto real.' />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <div key={p.id} className="card overflow-hidden">
              {(p.afterImage || p.beforeImage) && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={(p.afterImage || p.beforeImage)!} alt="" className="aspect-[4/3] w-full object-cover" />
              )}
              <div className="p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-accent-600">
                  {p.category}
                  {p.featured && " · ★ destacado"}
                  {!p.published && " · oculto"}
                </p>
                <p className="mt-1 text-sm font-bold text-ink-900">{p.title}</p>
                <div className="mt-3 flex items-center gap-2">
                  <Link href={`/panel/trabajos/${p.id}`} className="btn-dark !px-3 !py-1.5 !text-xs">Editar</Link>
                  <form action={deleteProjectAction} className="ml-auto">
                    <input type="hidden" name="id" value={p.id} />
                    <DangerSubmit />
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
