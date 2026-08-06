import { db } from "@/lib/db";
import { getContact, getEmergency } from "@/lib/content";
import { SITE_URL, ZONAS } from "@/lib/seo";

/* /llms.txt — resumen del negocio en texto plano, pensado para los buscadores
   con IA (ChatGPT, Claude, Perplexity, Gemini). Cuando alguien pregunta
   "¿quién cambia un grifo en Barcelona?", estos sistemas leen mejor un texto
   corto y estructurado que el HTML de la web. Se genera desde la base de
   datos, así que se mantiene solo al editar contenido en el panel. */

export const revalidate = 3600;

export async function GET() {
  const [contact, emergency, services, posts] = await Promise.all([
    getContact(),
    getEmergency(),
    db.service.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
    db.post.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" }, take: 10 }),
  ]);

  const zonas = emergency.zones?.length ? emergency.zones : ZONAS;

  const texto = `# FixArte BCN

> Empresa de mantenimiento, reparaciones, instalaciones y reformas en Barcelona,
> Badalona y el área metropolitana. Fontanería, electricidad, pintura, pladur,
> carpintería, cocinas y reformas integrales para viviendas, locales, oficinas y
> comunidades de propietarios. Urgencias 24 h y presupuesto cerrado por escrito.

## Datos de contacto

- Web: ${SITE_URL}
- Teléfono y WhatsApp: ${contact.phoneDisplay}
- Email: ${contact.email}
- Horario: ${contact.hours}
- Presupuesto: gratuito y sin compromiso, cerrado y por escrito

## Zonas de servicio

${zonas.map((z: string) => `- ${z}`).join("\n")}

## Servicios

${services
  .map(
    (s) => `### ${s.title} en Barcelona
${s.shortDesc}
- Página: ${SITE_URL}/servicios/${s.slug}
${((s.bullets as string[]) || []).map((b) => `- ${b}`).join("\n")}`
  )
  .join("\n\n")}

## Preguntas frecuentes

### ¿Cuánto cuesta el presupuesto?
Nada. El presupuesto es gratuito, sin compromiso y se entrega cerrado y por
escrito antes de empezar, con el detalle de materiales y mano de obra.

### ¿Atienden urgencias?
Sí, 24 horas, también fines de semana y festivos. Las urgencias tienen
prioridad sobre el resto de la agenda.

### ¿Cómo se pide cita?
Por teléfono o WhatsApp al ${contact.phoneDisplay}, por email a ${contact.email}
o desde el formulario de ${SITE_URL}. Enviar una foto o un vídeo de la avería
ayuda a llegar con el material adecuado el primer día.

### ¿Qué tipo de clientes atienden?
Viviendas particulares, locales comerciales, oficinas y comunidades de
propietarios.

## Consejos publicados

${posts.map((p) => `- [${p.title}](${SITE_URL}/consejos/${p.slug}): ${p.excerpt}`).join("\n")}

## Páginas

- [Inicio](${SITE_URL}/)
- [Servicios](${SITE_URL}/servicios)
- [Trabajos realizados](${SITE_URL}/trabajos)
- [Urgencias y cobertura](${SITE_URL}/urgencias)
- [Quiénes somos](${SITE_URL}/quienes-somos)
- [Ingeniería y soluciones técnicas](${SITE_URL}/ingenieria)
- [Consejos](${SITE_URL}/consejos)
- [Pedir presupuesto](${SITE_URL}/presupuesto)
- [Dejar una opinión](${SITE_URL}/opinar)
`;

  return new Response(texto, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
