import Link from "next/link";
import { db } from "@/lib/db";
import { PanelHeader, DangerSubmit } from "@/components/panel/ui";
import { deletePostAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function PostsAdminPage() {
  const posts = await db.post.findMany({ orderBy: { publishedAt: "desc" } });

  return (
    <>
      <PanelHeader
        title="Consejos (blog)"
        text="Artículos de consejos y noticias que posicionan la web en Google"
        action={{ href: "/panel/consejos/nuevo", label: "Nuevo artículo" }}
      />

      <div className="card divide-y divide-cream-200">
        {posts.map((p) => (
          <div key={p.id} className="flex items-center gap-4 px-5 py-3.5">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-ink-900">
                {p.title}
                {!p.published && (
                  <span className="ml-2 rounded bg-cream-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-ink-700">Borrador</span>
                )}
              </p>
              <p className="truncate text-xs text-ink-700">
                /consejos/{p.slug} ·{" "}
                {new Date(p.publishedAt).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })}
              </p>
            </div>
            <a href={`/consejos/${p.slug}`} target="_blank" className="btn-outline hidden !px-3 !py-1.5 !text-xs sm:inline-flex">Ver</a>
            <Link href={`/panel/consejos/${p.id}`} className="btn-dark !px-3 !py-1.5 !text-xs">Editar</Link>
            <form action={deletePostAction}>
              <input type="hidden" name="id" value={p.id} />
              <DangerSubmit />
            </form>
          </div>
        ))}
      </div>
    </>
  );
}
