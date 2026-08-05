import type { Metadata } from "next";
import { getContact } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/site/Section";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Política de privacidad | FixArte BCN",
  description: "Cómo trata FixArte BCN tus datos personales: finalidades, base legal, plazos de conservación y derechos RGPD.",
  path: "/politica-privacidad",
});

export default async function PrivacyPage() {
  const contact = await getContact();
  return (
    <>
      <Breadcrumbs items={[{ name: "Inicio", path: "/" }, { name: "Política de privacidad", path: "/politica-privacidad" }]} />
      <article className="container-site py-10 sm:py-14">
        <div className="prose-fix mx-auto max-w-3xl">
          <h1 className="text-3xl sm:text-4xl">Política de privacidad</h1>
          <p>
            En cumplimiento del Reglamento (UE) 2016/679 (RGPD) y de la Ley Orgánica 3/2018 (LOPDGDD), te informamos de
            cómo tratamos los datos personales que nos facilitas a través de este sitio web.
          </p>

          <h2>1. Responsable del tratamiento</h2>
          <p>
            <strong>FixArte BCN</strong> · Correo: {contact.email} · Teléfono: {contact.phoneDisplay} · Ámbito:
            Barcelona y área metropolitana (España).
          </p>

          <h2>2. Qué datos tratamos y con qué finalidad</h2>
          <ul>
            <li>
              <strong>Formularios de presupuesto, contacto y urgencias:</strong> nombre, teléfono, email, descripción de
              la solicitud y fotografías que decidas adjuntar. Finalidad: atender tu solicitud, elaborar el presupuesto
              y comunicarnos contigo.
            </li>
            <li>
              <strong>Comunicaciones por teléfono, WhatsApp o email:</strong> los datos que nos facilites durante la
              conversación, con la única finalidad de gestionar el servicio solicitado.
            </li>
          </ul>

          <h2>3. Base legal</h2>
          <p>
            La base legal del tratamiento es la aplicación de medidas precontractuales y la ejecución del servicio que
            solicitas (art. 6.1.b RGPD), así como tu consentimiento al enviar los formularios (art. 6.1.a RGPD).
          </p>

          <h2>4. Conservación</h2>
          <p>
            Conservamos tus datos mientras dure la relación comercial o la gestión de tu solicitud y, después, durante
            los plazos legalmente exigibles (obligaciones fiscales y de responsabilidad).
          </p>

          <h2>5. Destinatarios</h2>
          <p>
            No cedemos tus datos a terceros, salvo obligación legal. Para el funcionamiento del sitio utilizamos
            proveedores tecnológicos (alojamiento del servidor y plataforma de envío de correo electrónico) que actúan
            como encargados del tratamiento conforme al art. 28 RGPD.
          </p>

          <h2>6. Tus derechos</h2>
          <p>
            Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad
            escribiendo a {contact.email}. Si consideras que el tratamiento no es adecuado, puedes reclamar ante la
            Agencia Española de Protección de Datos (aepd.es).
          </p>

          <h2>7. Seguridad</h2>
          <p>
            Aplicamos medidas técnicas y organizativas apropiadas para proteger tus datos: conexión cifrada (HTTPS),
            acceso restringido a la información y almacenamiento en servidores dentro de la Unión Europea.
          </p>
        </div>
      </article>
    </>
  );
}
