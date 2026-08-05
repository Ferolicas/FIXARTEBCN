import Link from "next/link";
import { db } from "@/lib/db";
import { Icon } from "@/components/site/Icons";
import { PanelHeader } from "@/components/panel/ui";

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  NUEVO: "bg-accent-50 text-accent-700",
  EN_CURSO: "bg-ink-50 text-ink-800",
  CERRADO: "bg-cream-100 text-ink-700",
};

export default async function DashboardPage() {
  const [newLeads, totalLeads, services, projects, testimonials, posts, latest] = await Promise.all([
    db.lead.count({ where: { status: "NUEVO" } }),
    db.lead.count(),
    db.service.count(),
    db.project.count(),
    db.testimonial.count(),
    db.post.count(),
    db.lead.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
  ]);

  const stats = [
    { href: "/panel/solicitudes", icon: "inbox", label: "Solicitudes nuevas", value: newLeads, highlight: newLeads > 0 },
    { href: "/panel/solicitudes", icon: "file-text", label: "Solicitudes totales", value: totalLeads },
    { href: "/panel/servicios", icon: "wrench", label: "Servicios", value: services },
    { href: "/panel/trabajos", icon: "gallery", label: "Trabajos", value: projects },
    { href: "/panel/opiniones", icon: "star", label: "Opiniones", value: testimonials },
    { href: "/panel/consejos", icon: "sparkles", label: "Consejos", value: posts },
  ];

  return (
    <>
      <PanelHeader title="Resumen" text="Estado general de la web de FixArte BCN" />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`card p-4 transition-colors hover:border-accent-400 ${s.highlight ? "!border-accent-400 !bg-accent-50" : ""}`}
          >
            <Icon name={s.icon} className={`h-5 w-5 ${s.highlight ? "text-accent-600" : "text-ink-700"}`} />
            <p className="mt-2 font-display text-2xl font-bold text-ink-900">{s.value}</p>
            <p className="text-xs font-medium text-ink-700">{s.label}</p>
          </Link>
        ))}
      </div>

      <h2 className="mb-3 mt-8 text-lg">Últimas solicitudes</h2>
      {latest.length === 0 ? (
        <p className="card p-6 text-sm text-ink-700">
          Todavía no hay solicitudes. Cuando alguien rellene un formulario de la web aparecerá aquí y recibirás un email.
        </p>
      ) : (
        <div className="card divide-y divide-cream-200">
          {latest.map((l) => (
            <Link key={l.id} href="/panel/solicitudes" className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-cream-50">
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${STATUS_STYLES[l.status]}`}>{l.status.replace("_", " ")}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink-900">
                  {l.name} · <span className="font-normal text-ink-700">{l.type.toLowerCase()}</span>
                </p>
                <p className="truncate text-xs text-ink-700">{l.message}</p>
              </div>
              <time className="shrink-0 text-xs text-ink-700">
                {new Date(l.createdAt).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}
              </time>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
