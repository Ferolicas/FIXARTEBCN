import { db } from "@/lib/db";
import type { LeadStatus } from "@prisma/client";
import { Icon } from "@/components/site/Icons";
import { PanelHeader, EmptyState, DangerSubmit } from "@/components/panel/ui";
import { updateLeadAction, deleteLeadAction } from "../actions";

export const dynamic = "force-dynamic";

const FILTERS: { key: string; label: string }[] = [
  { key: "", label: "Todas" },
  { key: "NUEVO", label: "Nuevas" },
  { key: "EN_CURSO", label: "En curso" },
  { key: "CERRADO", label: "Cerradas" },
];

const TYPE_BADGE: Record<string, string> = {
  PRESUPUESTO: "bg-accent-50 text-accent-700",
  CONTACTO: "bg-ink-50 text-ink-800",
  URGENCIA: "bg-red-50 text-red-700",
};

export default async function LeadsPage({ searchParams }: { searchParams: Promise<{ estado?: string }> }) {
  const { estado } = await searchParams;
  const where = estado && ["NUEVO", "EN_CURSO", "CERRADO"].includes(estado) ? { status: estado as LeadStatus } : {};
  const leads = await db.lead.findMany({ where, orderBy: { createdAt: "desc" }, take: 200 });

  return (
    <>
      <PanelHeader title="Solicitudes" text="Formularios recibidos desde la web (presupuesto, contacto y urgencias)" />

      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <a
            key={f.key}
            href={f.key ? `/panel/solicitudes?estado=${f.key}` : "/panel/solicitudes"}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
              (estado || "") === f.key ? "bg-ink-900 text-white" : "border border-cream-200 bg-white text-ink-800"
            }`}
          >
            {f.label}
          </a>
        ))}
      </div>

      {leads.length === 0 ? (
        <EmptyState text="No hay solicitudes en este filtro." />
      ) : (
        <div className="space-y-4">
          {leads.map((l) => (
            <details key={l.id} className="card group overflow-hidden">
              <summary className="flex cursor-pointer list-none flex-wrap items-center gap-3 px-5 py-4">
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${TYPE_BADGE[l.type]}`}>{l.type}</span>
                <span className="text-sm font-bold text-ink-900">{l.name}</span>
                <a href={`tel:${l.phone}`} className="text-sm text-accent-600 hover:underline">
                  {l.phone}
                </a>
                {l.service && <span className="chip">{l.service}</span>}
                <span className="ml-auto flex items-center gap-3">
                  <span className="text-xs text-ink-700">
                    {new Date(l.createdAt).toLocaleString("es-ES", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                      l.status === "NUEVO" ? "bg-accent-500 text-white" : l.status === "EN_CURSO" ? "bg-ink-800 text-white" : "bg-cream-100 text-ink-700"
                    }`}
                  >
                    {l.status.replace("_", " ")}
                  </span>
                  <Icon name="chevron-right" className="h-4 w-4 text-ink-200 transition-transform group-open:rotate-90" />
                </span>
              </summary>

              <div className="border-t border-cream-200 px-5 py-4">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-800">{l.message}</p>
                {l.email && (
                  <p className="mt-2 text-sm">
                    <a href={`mailto:${l.email}`} className="font-medium text-accent-600 hover:underline">{l.email}</a>
                  </p>
                )}

                {((l.photos as string[]) || []).length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {((l.photos as string[]) || []).map((p) => (
                      <a key={p} href={p} target="_blank" rel="noopener">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p} alt="Foto adjunta" className="h-20 w-20 rounded-lg border border-cream-200 object-cover" />
                      </a>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <a
                    href={`https://wa.me/${l.phone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener"
                    className="btn-wa !px-3 !py-1.5 !text-xs"
                  >
                    <Icon name="whatsapp" className="h-3.5 w-3.5" /> WhatsApp
                  </a>
                  {(["NUEVO", "EN_CURSO", "CERRADO"] as const)
                    .filter((s) => s !== l.status)
                    .map((s) => (
                      <form key={s} action={updateLeadAction}>
                        <input type="hidden" name="id" value={l.id} />
                        <input type="hidden" name="status" value={s} />
                        <button type="submit" className="btn-outline !px-3 !py-1.5 !text-xs">
                          Marcar {s.replace("_", " ").toLowerCase()}
                        </button>
                      </form>
                    ))}
                  <form action={deleteLeadAction} className="ml-auto">
                    <input type="hidden" name="id" value={l.id} />
                    <DangerSubmit />
                  </form>
                </div>

                <form action={updateLeadAction} className="mt-3 flex gap-2">
                  <input type="hidden" name="id" value={l.id} />
                  <input
                    name="notes"
                    defaultValue={l.notes}
                    placeholder="Notas internas (presupuesto enviado, visita el martes…)"
                    className="field-input !py-2 text-xs"
                  />
                  <button type="submit" className="btn-dark !px-3 !py-2 !text-xs">Guardar nota</button>
                </form>
              </div>
            </details>
          ))}
        </div>
      )}
    </>
  );
}
