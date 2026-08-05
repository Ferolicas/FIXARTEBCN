import Link from "next/link";
import { db } from "@/lib/db";
import { Icon } from "@/components/site/Icons";
import { PanelHeader, DangerSubmit } from "@/components/panel/ui";
import { deleteServiceAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function ServicesAdminPage() {
  const services = await db.service.findMany({ orderBy: { order: "asc" } });

  return (
    <>
      <PanelHeader
        title="Servicios"
        text="Los servicios que se muestran en la web, con su contenido SEO"
        action={{ href: "/panel/servicios/nuevo", label: "Nuevo servicio" }}
      />

      <div className="card divide-y divide-cream-200">
        {services.map((s) => (
          <div key={s.id} className="flex items-center gap-4 px-5 py-3.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-50 text-accent-600">
              <Icon name={s.icon} className="h-4.5 w-4.5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-ink-900">
                {s.title}
                {!s.published && (
                  <span className="ml-2 rounded bg-cream-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-ink-700">
                    Oculto
                  </span>
                )}
              </p>
              <p className="truncate text-xs text-ink-700">/servicios/{s.slug}</p>
            </div>
            <span className="hidden text-xs text-ink-700 sm:block">Orden: {s.order}</span>
            <a href={`/servicios/${s.slug}`} target="_blank" className="btn-outline hidden !px-3 !py-1.5 !text-xs sm:inline-flex">
              Ver
            </a>
            <Link href={`/panel/servicios/${s.id}`} className="btn-dark !px-3 !py-1.5 !text-xs">
              Editar
            </Link>
            <form action={deleteServiceAction}>
              <input type="hidden" name="id" value={s.id} />
              <DangerSubmit />
            </form>
          </div>
        ))}
      </div>
    </>
  );
}
