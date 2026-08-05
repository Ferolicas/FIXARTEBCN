import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/site/Section";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Política de cookies | FixArte BCN",
  description: "Información sobre las cookies utilizadas en fixartebcn.es: solo cookies técnicas imprescindibles, sin rastreo publicitario.",
  path: "/politica-cookies",
});

export default function CookiesPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Inicio", path: "/" }, { name: "Política de cookies", path: "/politica-cookies" }]} />
      <article className="container-site py-10 sm:py-14">
        <div className="prose-fix mx-auto max-w-3xl">
          <h1 className="text-3xl sm:text-4xl">Política de cookies</h1>

          <h2>¿Qué son las cookies?</h2>
          <p>
            Las cookies son pequeños archivos que se almacenan en tu dispositivo al visitar un sitio web y que permiten
            su funcionamiento o recopilan información sobre tu navegación.
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
            incrustado), actualizaremos esta política y, cuando sea necesario, solicitaremos tu consentimiento mediante
            un banner de gestión de cookies.
          </p>
        </div>
      </article>
    </>
  );
}
