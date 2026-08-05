import { getHome, getAbout, getEngineering, getEmergency, getFooter } from "@/lib/content";
import { titledLinesToText } from "@/lib/utils";
import { PanelHeader, OkBanner } from "@/components/panel/ui";
import {
  saveHomeAction,
  saveAboutAction,
  saveEngineeringAction,
  saveEmergencyAction,
  saveFooterAction,
} from "../actions";

export const dynamic = "force-dynamic";

export default async function ContentAdminPage({ searchParams }: { searchParams: Promise<{ ok?: string }> }) {
  const { ok } = await searchParams;
  const [home, about, engineering, emergency, footer] = await Promise.all([
    getHome(),
    getAbout(),
    getEngineering(),
    getEmergency(),
    getFooter(),
  ]);

  return (
    <>
      <PanelHeader title="Contenido de las páginas" text="Edita los textos de la web. Los cambios se publican al instante." />
      <OkBanner show={!!ok} />

      <div className="max-w-3xl space-y-6">
        {/* INICIO */}
        <form action={saveHomeAction} className="card space-y-4 p-6">
          <h2 className="text-lg">Página de inicio</h2>
          <div>
            <label className="field-label" htmlFor="h-kicker">Etiqueta superior</label>
            <input id="h-kicker" name="heroKicker" defaultValue={home.heroKicker} className="field-input" />
          </div>
          <div>
            <label className="field-label" htmlFor="h-title">Título principal (H1)</label>
            <input id="h-title" name="heroTitle" defaultValue={home.heroTitle} className="field-input" />
          </div>
          <div>
            <label className="field-label" htmlFor="h-text">Texto de presentación</label>
            <textarea id="h-text" name="heroText" rows={4} defaultValue={home.heroText} className="field-input" />
          </div>
          <div>
            <label className="field-label" htmlFor="h-whytitle">Título del bloque "por qué elegirnos"</label>
            <input id="h-whytitle" name="whyTitle" defaultValue={home.whyTitle} className="field-input" />
          </div>
          <div>
            <label className="field-label" htmlFor="h-why">Motivos (uno por línea, formato: Título | texto)</label>
            <textarea id="h-why" name="why" rows={7} defaultValue={titledLinesToText(home.why)} className="field-input font-mono !text-xs" />
          </div>
          <button type="submit" className="btn-primary">Guardar inicio</button>
        </form>

        {/* QUIÉNES SOMOS */}
        <form action={saveAboutAction} className="card space-y-4 p-6">
          <h2 className="text-lg">Quiénes somos</h2>
          <div>
            <label className="field-label" htmlFor="ab-intro">Introducción (párrafos separados por línea en blanco)</label>
            <textarea id="ab-intro" name="intro" rows={6} defaultValue={about.intro} className="field-input" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="ab-mission">Misión</label>
              <textarea id="ab-mission" name="mission" rows={4} defaultValue={about.mission} className="field-input" />
            </div>
            <div>
              <label className="field-label" htmlFor="ab-vision">Visión</label>
              <textarea id="ab-vision" name="vision" rows={4} defaultValue={about.vision} className="field-input" />
            </div>
          </div>
          <div>
            <label className="field-label" htmlFor="ab-values">Valores (uno por línea)</label>
            <textarea id="ab-values" name="values" rows={5} defaultValue={about.values.join("\n")} className="field-input" />
          </div>
          <button type="submit" className="btn-primary">Guardar quiénes somos</button>
        </form>

        {/* INGENIERÍA */}
        <form action={saveEngineeringAction} className="card space-y-4 p-6">
          <h2 className="text-lg">Ingeniería y soluciones técnicas</h2>
          <div>
            <label className="field-label" htmlFor="en-title">Título</label>
            <input id="en-title" name="title" defaultValue={engineering.title} className="field-input" />
          </div>
          <div>
            <label className="field-label" htmlFor="en-paragraphs">Párrafos (separados por línea en blanco)</label>
            <textarea id="en-paragraphs" name="paragraphs" rows={7} defaultValue={engineering.paragraphs.join("\n\n")} className="field-input" />
          </div>
          <div>
            <label className="field-label" htmlFor="en-items">Capacidades (una por línea: Título | texto)</label>
            <textarea id="en-items" name="items" rows={5} defaultValue={titledLinesToText(engineering.items)} className="field-input font-mono !text-xs" />
          </div>
          <button type="submit" className="btn-primary">Guardar ingeniería</button>
        </form>

        {/* URGENCIAS */}
        <form action={saveEmergencyAction} className="card space-y-4 p-6">
          <h2 className="text-lg">Urgencias y cobertura</h2>
          <div>
            <label className="field-label" htmlFor="em-intro">Introducción</label>
            <textarea id="em-intro" name="intro" rows={3} defaultValue={emergency.intro} className="field-input" />
          </div>
          <div>
            <label className="field-label" htmlFor="em-body">Texto ampliado</label>
            <textarea id="em-body" name="body" rows={3} defaultValue={emergency.body} className="field-input" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="em-zones">Zonas de cobertura (una por línea)</label>
              <textarea id="em-zones" name="zones" rows={6} defaultValue={emergency.zones.join("\n")} className="field-input" />
            </div>
            <div>
              <label className="field-label" htmlFor="em-outside">Texto "fuera de zona"</label>
              <textarea id="em-outside" name="outside" rows={6} defaultValue={emergency.outside} className="field-input" />
            </div>
          </div>
          <button type="submit" className="btn-primary">Guardar urgencias</button>
        </form>

        {/* PIE */}
        <form action={saveFooterAction} className="card space-y-4 p-6">
          <h2 className="text-lg">Frase del pie de página</h2>
          <input name="tagline" defaultValue={footer.tagline} className="field-input" />
          <button type="submit" className="btn-primary">Guardar frase</button>
        </form>
      </div>
    </>
  );
}
