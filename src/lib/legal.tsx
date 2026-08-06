import type { Contact } from "./content";

/**
 * Textos legales en un único sitio: se usan tal cual en las rutas
 * (/aviso-legal, /politica-privacidad, /politica-cookies) y dentro del modal
 * legal, para que nunca se desincronicen.
 */
export type LegalKey = "aviso-legal" | "politica-privacidad" | "politica-cookies";

export const LEGAL_TITLES: Record<LegalKey, string> = {
  "aviso-legal": "Aviso legal",
  "politica-privacidad": "Política de privacidad",
  "politica-cookies": "Política de cookies",
};

export function LegalContent({ doc, contact }: { doc: LegalKey; contact: Contact }) {
  if (doc === "aviso-legal") {
    return (
      <>
        <h2>1. Identificación del titular</h2>
        <p>
          En cumplimiento de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de
          Comercio Electrónico (LSSI-CE), se informa de que el presente sitio web, accesible en{" "}
          <strong>fixartebcn.es</strong>, es titularidad de <strong>FixArte BCN</strong> (en adelante, «el Titular»).
        </p>
        <ul>
          <li>Ámbito de actividad: mantenimiento, reparaciones, instalaciones y reformas.</li>
          <li>Zona de operación: Barcelona, Badalona y área metropolitana (España).</li>
          <li>Correo electrónico de contacto: {contact.email}</li>
          <li>Teléfono: {contact.phoneDisplay}</li>
        </ul>

        <h2>2. Objeto</h2>
        <p>
          Este sitio web tiene por objeto dar a conocer los servicios ofrecidos por el Titular, facilitar el contacto
          con clientes y potenciales clientes y permitir la solicitud de presupuestos.
        </p>

        <h2>3. Condiciones de uso</h2>
        <p>
          El acceso y la navegación por este sitio web atribuyen la condición de usuario e implican la aceptación de
          las presentes condiciones. El usuario se compromete a hacer un uso adecuado de los contenidos y a no
          emplearlos para actividades ilícitas o contrarias a la buena fe.
        </p>

        <h2>4. Propiedad intelectual e industrial</h2>
        <p>
          Los contenidos de este sitio (textos, imágenes, logotipos, diseño y código) son titularidad del Titular o de
          terceros que han autorizado su uso, y están protegidos por la normativa de propiedad intelectual e
          industrial. Queda prohibida su reproducción, distribución o transformación sin autorización expresa.
        </p>

        <h2>5. Responsabilidad</h2>
        <p>
          El Titular no se hace responsable del mal uso que se realice de los contenidos de este sitio ni de los daños
          derivados de circunstancias ajenas a su control, como fallos en la red o intrusiones de terceros. La
          información sobre servicios tiene carácter orientativo: las condiciones concretas de cada trabajo se
          establecen en el presupuesto correspondiente.
        </p>

        <h2>6. Enlaces a terceros</h2>
        <p>
          Este sitio puede contener enlaces a sitios de terceros (redes sociales, Google Maps, plataformas de
          anuncios). El Titular no se responsabiliza de sus contenidos ni de sus políticas de privacidad.
        </p>

        <h2>7. Legislación aplicable</h2>
        <p>
          Las presentes condiciones se rigen por la legislación española. Para cualquier controversia, las partes se
          someten a los juzgados y tribunales de Barcelona, salvo que la normativa de consumidores disponga otro fuero.
        </p>
      </>
    );
  }

  if (doc === "politica-privacidad") {
    return (
      <>
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
      </>
    );
  }

  return (
    <>
      <h2>¿Qué son las cookies?</h2>
      <p>
        Las cookies son pequeños archivos que se almacenan en tu dispositivo al visitar un sitio web y que permiten su
        funcionamiento o recopilan información sobre tu navegación.
      </p>

      <h2>Cookies que utiliza este sitio</h2>
      <p>
        <strong>fixartebcn.es no utiliza cookies publicitarias ni de rastreo.</strong> Únicamente empleamos cookies
        técnicas estrictamente necesarias:
      </p>
      <ul>
        <li>
          <strong>Cookies de sesión del área de administración:</strong> se instalan solo si accedes al panel de
          gestión del sitio (área privada del propietario) y sirven para mantener la sesión iniciada.
        </li>
      </ul>
      <p>
        Las cookies técnicas imprescindibles no requieren consentimiento según la normativa vigente (art. 22.2
        LSSI-CE), por lo que este sitio no muestra banner de cookies.
      </p>

      <h2>Servicios de terceros enlazados</h2>
      <p>
        Este sitio contiene enlaces a servicios de terceros (WhatsApp, Google Maps, redes sociales). Al acceder a
        ellos, se aplican las políticas de cookies y privacidad de dichos servicios.
      </p>

      <h2>Cambios en esta política</h2>
      <p>
        Si en el futuro incorporamos servicios que instalen cookies adicionales (por ejemplo, analítica o vídeo
        incrustado), actualizaremos esta política y, cuando sea necesario, solicitaremos tu consentimiento mediante un
        banner de gestión de cookies.
      </p>
    </>
  );
}
