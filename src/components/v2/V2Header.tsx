import { db } from "@/lib/db";
import { getContact } from "@/lib/content";
import { V2HeaderShell } from "./V2HeaderShell";

const V2_NAV_LINKS = [
  { href: "#inicio", label: "Inicio" },
  { href: "#servicios", label: "Servicios" },
  { href: "#trabajos", label: "Trabajos" },
  { href: "#urgencias", label: "Urgencias" },
  { href: "#quienes-somos", label: "Quiénes somos" },
  { href: "#ingenieria", label: "Ingeniería" },
  { href: "#consejos", label: "Consejos" },
];

export async function V2Header() {
  const [contact, services] = await Promise.all([
    getContact(),
    db.service.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      select: { slug: true, title: true, icon: true },
    }),
  ]);

  return (
    <V2HeaderShell
      links={V2_NAV_LINKS}
      services={services}
      phone={contact.phone}
      phoneDisplay={contact.phoneDisplay}
      whatsapp={contact.whatsapp}
    />
  );
}
