import { getContact, getSocial, getEmailSettings } from "@/lib/content";
import { PanelHeader, OkBanner, ErrorBanner } from "@/components/panel/ui";
import { saveContactAction, saveSocialAction, saveEmailAction, changePasswordAction } from "../actions";

export const dynamic = "force-dynamic";

const ERRORS: Record<string, string> = {
  "pwd-short": "La contraseña nueva debe tener al menos 10 caracteres.",
  "pwd-current": "La contraseña actual no es correcta.",
};

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string }> }) {
  const { ok, error } = await searchParams;
  const [contact, social, email] = await Promise.all([getContact(), getSocial(), getEmailSettings()]);

  return (
    <>
      <PanelHeader title="Ajustes" text="Datos de contacto, redes sociales y cuenta" />
      <OkBanner show={!!ok} />
      <ErrorBanner text={error ? ERRORS[error] : undefined} />

      <div className="max-w-3xl space-y-6">
        {/* CONTACTO */}
        <form action={saveContactAction} className="card grid gap-4 p-6 sm:grid-cols-2">
          <h2 className="text-lg sm:col-span-2">Datos de contacto</h2>
          <div>
            <label className="field-label" htmlFor="c-phone">Teléfono (como se muestra)</label>
            <input id="c-phone" name="phoneDisplay" defaultValue={contact.phoneDisplay} className="field-input" placeholder="+34 634 39 03 45" />
          </div>
          <div>
            <label className="field-label" htmlFor="c-wa">WhatsApp (solo números, con 34)</label>
            <input id="c-wa" name="whatsapp" defaultValue={contact.whatsapp} className="field-input" placeholder="34634390345" />
          </div>
          <div>
            <label className="field-label" htmlFor="c-email">Email público</label>
            <input id="c-email" name="email" type="email" defaultValue={contact.email} className="field-input" />
          </div>
          <div>
            <label className="field-label" htmlFor="c-city">Ciudad</label>
            <input id="c-city" name="city" defaultValue={contact.city} className="field-input" />
          </div>
          <div>
            <label className="field-label" htmlFor="c-address">Dirección (opcional)</label>
            <input id="c-address" name="address" defaultValue={contact.address} className="field-input" />
          </div>
          <div>
            <label className="field-label" htmlFor="c-hours">Horario</label>
            <input id="c-hours" name="hours" defaultValue={contact.hours} className="field-input" />
          </div>
          <button type="submit" className="btn-primary sm:col-span-2">Guardar contacto</button>
        </form>

        {/* REDES */}
        <form action={saveSocialAction} className="card grid gap-4 p-6 sm:grid-cols-2">
          <h2 className="text-lg sm:col-span-2">Redes sociales y perfiles</h2>
          <p className="-mt-2 text-xs text-ink-700 sm:col-span-2">
            Pega la URL completa de cada perfil. Los que dejes vacíos no se muestran en la web.
          </p>
          {(
            [
              ["maps", "Google Maps (perfil de empresa)"],
              ["instagram", "Instagram"],
              ["facebook", "Facebook"],
              ["youtube", "YouTube"],
              ["wallapop", "Wallapop"],
              ["milanuncios", "Milanuncios"],
              ["linkedin", "LinkedIn"],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <label className="field-label" htmlFor={`s-${key}`}>{label}</label>
              <input id={`s-${key}`} name={key} defaultValue={social[key]} className="field-input" placeholder="https://…" />
            </div>
          ))}
          <button type="submit" className="btn-primary sm:col-span-2">Guardar redes</button>
        </form>

        {/* EMAIL */}
        <form action={saveEmailAction} className="card space-y-4 p-6">
          <h2 className="text-lg">Avisos de solicitudes</h2>
          <div>
            <label className="field-label" htmlFor="e-to">Correos que reciben los formularios (separados por comas)</label>
            <input id="e-to" name="to" defaultValue={email.to.join(", ")} className="field-input" />
          </div>
          <button type="submit" className="btn-primary">Guardar correos</button>
        </form>

        {/* CONTRASEÑA */}
        <form action={changePasswordAction} className="card grid gap-4 p-6 sm:grid-cols-2">
          <h2 className="text-lg sm:col-span-2">Cambiar contraseña del panel</h2>
          <div>
            <label className="field-label" htmlFor="pw-current">Contraseña actual</label>
            <input id="pw-current" name="current" type="password" required autoComplete="current-password" className="field-input" />
          </div>
          <div>
            <label className="field-label" htmlFor="pw-next">Nueva contraseña (mín. 10 caracteres)</label>
            <input id="pw-next" name="next" type="password" required minLength={10} autoComplete="new-password" className="field-input" />
          </div>
          <button type="submit" className="btn-dark sm:col-span-2">Cambiar contraseña</button>
        </form>
      </div>
    </>
  );
}
