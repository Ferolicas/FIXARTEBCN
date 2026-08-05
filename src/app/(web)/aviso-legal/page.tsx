import type { Metadata } from "next";
import { getContact } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/site/Section";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Aviso legal | FixArte BCN",
  description: "Aviso legal y condiciones de uso del sitio web fixartebcn.es, titularidad de FixArte BCN.",
  path: "/aviso-legal",
});

export default async function LegalPage() {
  const contact = await getContact();
  return (
    <>
      <Breadcrumbs items={[{ name: "Inicio", path: "/" }, { name: "Aviso legal", path: "/aviso-legal" }]} />
      <article className="container-site py-10 sm:py-14">
        <div className="prose-fix mx-auto max-w-3xl">
          <h1 className="text-3xl sm:text-4xl">Aviso legal</h1>

          <h2>1. Identificación del titular</h2>
          <p>
            En cumplimiento de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de
            Comercio Electrónico (LSSI-CE), se informa de que el presente sitio web, accesible en{" "}
            <strong>fixartebcn.es</strong>, es titularidad de <strong>FixArte BCN</strong> (en adelante, "el Titular").
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
        </div>
      </article>
    </>
  );
}
