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
    <header className="sticky top-0 z-40 border-b border-cream-200 bg-white/85 backdrop-blur-lg">
      <div className="container-site flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5" aria-label="FixArte BCN — Inicio">
          <Image
            src="/logo.webp"
            alt="Logo de FixArte BCN"
            width={40}
            height={40}
            priority
            className="h-10 w-10 rounded-xl"
          />
          <span className="font-display text-lg font-bold tracking-tight text-ink-900">
            FixArte <span className="text-accent-500">BCN</span>
          </span>
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-0.5 lg:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-ink-800 transition-colors hover:bg-ink-50 hover:text-ink-950"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${contact.phone}`}
            className="hidden items-center gap-2 rounded-xl border border-cream-200 px-3 py-2 text-sm font-semibold text-ink-900 transition-colors hover:border-ink-600 md:inline-flex"
          >
            <Icon name="phone" className="h-4 w-4 text-accent-500" />
            {contact.phoneDisplay}
          </a>
          <Link href="/presupuesto" className="btn-primary hidden !px-4 !py-2 sm:inline-flex">
            Presupuesto
          </Link>
          <MobileNav links={NAV_LINKS} phone={contact.phone} phoneDisplay={contact.phoneDisplay} whatsapp={contact.whatsapp} />
        </div>
      </div>
    </header>
  );
}
