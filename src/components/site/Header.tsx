import Link from "next/link";
import Image from "next/image";
import { getContact } from "@/lib/content";
import { Icon } from "./Icons";
import { MobileNav } from "./MobileNav";

export const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/quienes-somos", label: "Quiénes somos" },
  { href: "/servicios", label: "Servicios" },
  { href: "/trabajos", label: "Trabajos" },
  { href: "/ingenieria", label: "Ingeniería" },
  { href: "/urgencias", label: "Urgencias" },
  { href: "/consejos", label: "Consejos" },
  { href: "/contacto", label: "Contacto" },
];

export async function Header() {
  const contact = await getContact();

  return (
    <header className="sticky top-0 z-40 border-b border-ink-950/5 bg-cream-200/85 backdrop-blur-lg">
      <div className="container-site flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5" aria-label="FixArte BCN — Inicio">
          <Image
            src="/logo.webp"
            alt="Logo de FixArte BCN"
            width={40}
            height={40}
            priority
            className="h-10 w-10 rounded-full"
          />
          <span className="font-display text-lg font-bold text-ink-950">
            FixArte <span className="text-accent-600">BCN</span>
          </span>
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-0.5 lg:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-ink-800 transition-colors hover:bg-white hover:text-ink-950"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${contact.phone}`}
            className="hidden items-center gap-2 whitespace-nowrap rounded-full border border-ink-950/10 bg-white/60 px-4 py-2 text-sm font-semibold text-ink-950 transition-colors hover:border-ink-600 xl:inline-flex"
          >
            <Icon name="phone" className="h-4 w-4 text-accent-500" />
            {contact.phoneDisplay}
          </a>
          <Link href="/presupuesto" className="btn-primary hidden !px-5 !py-2 sm:inline-flex">
            Presupuesto
          </Link>
          <MobileNav links={NAV_LINKS} phone={contact.phone} phoneDisplay={contact.phoneDisplay} whatsapp={contact.whatsapp} />
        </div>
      </div>
    </header>
  );
}
