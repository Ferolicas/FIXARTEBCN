import { db } from "@/lib/db";
import { getContact } from "@/lib/content";
import { HeaderShell } from "./HeaderShell";

/**
 * Menú de la landing: anclas a las secciones de la portada. Las rutas
 * individuales (/servicios, /trabajos…) siguen existiendo y se enlazan desde
 * el pie, para SEO y por si se quiere navegar por páginas.
 */
export const NAV_LINKS = [
  { href: "#inicio", label: "Inicio" },
  { href: "#servicios", label: "Servicios" },
  { href: "#trabajos", label: "Trabajos" },
  { href: "#urgencias", label: "Urgencias" },
  { href: "#quienes-somos", label: "Quiénes somos" },
  { href: "#ingenieria", label: "Ingeniería" },
  { href: "#consejos", label: "Consejos" },
];

export async function Header() {
  const [contact, services] = await Promise.all([
    getContact(),
    db.service.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      select: { slug: true, title: true, icon: true },
    }),
  ]);

  return (
    <HeaderShell
      links={NAV_LINKS}
      services={services}
      phone={contact.phone}
      phoneDisplay={contact.phoneDisplay}
      whatsapp={contact.whatsapp}
    />
  );
}
