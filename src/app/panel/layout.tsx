import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getSession } from "@/lib/auth";
import { Icon } from "@/components/site/Icons";
import { logoutAction } from "./actions";

export const metadata: Metadata = {
  title: "Panel de gestión | FixArte BCN",
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "/panel", icon: "home", label: "Resumen" },
  { href: "/panel/solicitudes", icon: "inbox", label: "Solicitudes" },
  { href: "/panel/servicios", icon: "wrench", label: "Servicios" },
  { href: "/panel/trabajos", icon: "gallery", label: "Trabajos" },
  { href: "/panel/opiniones", icon: "star", label: "Opiniones" },
  { href: "/panel/consejos", icon: "file-text", label: "Consejos" },
  { href: "/panel/contenido", icon: "sparkles", label: "Contenido" },
  { href: "/panel/ajustes", icon: "gear", label: "Ajustes" },
];

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  // Sin sesión solo puede estar renderizándose /panel/login (el middleware
  // redirige el resto): sin shell.
  if (!session) return <>{children}</>;

  return (
    <div className="min-h-screen bg-cream-100 lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="border-b border-cream-200 bg-ink-950 lg:sticky lg:top-0 lg:h-screen lg:border-b-0">
        <div className="flex items-center justify-between p-4 lg:block">
          <Link href="/panel" className="flex items-center gap-2.5">
            <Image src="/logo.webp" alt="" width={36} height={36} className="h-9 w-9 rounded-lg" />
            <span className="font-display text-base font-bold text-white">
              FixArte <span className="text-accent-400">BCN</span>
              <span className="ml-2 rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ink-100">
                Panel
              </span>
            </span>
          </Link>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:mt-2 lg:flex-col lg:overflow-visible" aria-label="Panel">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-ink-100 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Icon name={n.icon} className="h-4.5 w-4.5" />
              {n.label}
            </Link>
          ))}
          <div className="my-2 hidden border-t border-white/10 lg:block" />
          <a
            href="/"
            target="_blank"
            className="flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-ink-100 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Icon name="arrow-right" className="h-4.5 w-4.5" />
            Ver la web
          </a>
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-ink-100 transition-colors hover:bg-red-500/20 hover:text-white"
            >
              <Icon name="logout" className="h-4.5 w-4.5" />
              Salir
            </button>
          </form>
        </nav>
      </aside>

      <div className="min-w-0 p-4 sm:p-6 lg:p-8">{children}</div>
    </div>
  );
}
