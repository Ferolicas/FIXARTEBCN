import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { getContact, getSocial, getFooter, waLink } from "@/lib/content";
import { Icon } from "./Icons";

const SOCIAL_ITEMS: { key: "instagram" | "facebook" | "youtube" | "wallapop" | "milanuncios" | "linkedin" | "maps"; icon: string; label: string }[] = [
  { key: "maps", icon: "map-pin", label: "Google Maps" },
  { key: "instagram", icon: "instagram", label: "Instagram" },
  { key: "facebook", icon: "facebook", label: "Facebook" },
  { key: "youtube", icon: "youtube", label: "YouTube" },
  { key: "wallapop", icon: "wallapop", label: "Wallapop" },
  { key: "milanuncios", icon: "milanuncios", label: "Milanuncios" },
  { key: "linkedin", icon: "linkedin", label: "LinkedIn" },
];

export async function Footer() {
  const [contact, social, footer, services] = await Promise.all([
    getContact(),
    getSocial(),
    getFooter(),
    db.service.findMany({ where: { published: true }, orderBy: { order: "asc" }, select: { slug: true, title: true }, take: 10 }),
  ]);

  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink-950 text-ink-100">
      {/* Accesos rápidos siempre visibles en el pie */}
      <div className="border-b border-white/10">
        <div className="container-site grid grid-cols-2 gap-3 py-8 sm:grid-cols-4">
          <a href={`tel:${contact.phone}`} className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-white/10">
            <Icon name="phone" className="h-5 w-5 text-accent-400" />
            <span className="text-sm font-semibold text-white">Llamar</span>
          </a>
          <a href={waLink(contact.whatsapp)} target="_blank" rel="noopener" className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-white/10">
            <Icon name="whatsapp" className="h-5 w-5 text-wa" />
            <span className="text-sm font-semibold text-white">WhatsApp</span>
          </a>
          <a href={`mailto:${contact.email}`} className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-white/10">
            <Icon name="mail" className="h-5 w-5 text-accent-400" />
            <span className="text-sm font-semibold text-white">Email</span>
          </a>
          <Link href="/presupuesto" className="flex items-center gap-3 rounded-xl bg-accent-500 px-4 py-3 transition-colors hover:bg-accent-600">
            <Icon name="file-text" className="h-5 w-5 text-white" />
            <span className="text-sm font-semibold text-white">Presupuesto</span>
          </Link>
        </div>
      </div>

      <div className="container-site grid gap-10 py-12 md:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <Image src="/logo.webp" alt="" width={40} height={40} className="h-10 w-10 rounded-xl" />
            <span className="font-display text-lg font-bold text-white">
              FixArte <span className="text-accent-400">BCN</span>
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-200">
            Mantenimiento, reparaciones, instalaciones y reformas para hogares, empresas y comunidades.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Icon name="map-pin" className="h-4 w-4 text-accent-400" />
              Barcelona, Badalona y área metropolitana
            </li>
            <li className="flex items-center gap-2">
              <Icon name="clock" className="h-4 w-4 text-accent-400" />
              {contact.hours}
            </li>
          </ul>
        </div>

        <nav aria-label="Secciones">
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-white">Secciones</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              ["/quienes-somos", "Quiénes somos"],
              ["/servicios", "Servicios"],
              ["/trabajos", "Trabajos realizados"],
              ["/ingenieria", "Ingeniería y soluciones técnicas"],
              ["/urgencias", "Urgencias y cobertura"],
              ["/presupuesto", "Presupuestos"],
              ["/consejos", "Consejos y opiniones"],
              ["/contacto", "Contacto"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="transition-colors hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Servicios">
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-white">Servicios</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/servicios/${s.slug}`} className="transition-colors hover:text-white">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-white">Contacto</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href={`tel:${contact.phone}`} className="flex items-center gap-2 transition-colors hover:text-white">
                <Icon name="phone" className="h-4 w-4 text-accent-400" /> {contact.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${contact.email}`} className="flex items-center gap-2 transition-colors hover:text-white">
                <Icon name="mail" className="h-4 w-4 text-accent-400" /> {contact.email}
              </a>
            </li>
          </ul>
          <h2 className="mt-6 font-display text-sm font-bold uppercase tracking-wider text-white">Síguenos</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {SOCIAL_ITEMS.filter((s) => social[s.key]).map((s) => (
              <li key={s.key}>
                <a
                  href={social[s.key]}
                  target="_blank"
                  rel="noopener"
                  aria-label={s.label}
                  title={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-ink-100 transition-colors hover:bg-accent-500 hover:text-white"
                >
                  <Icon name={s.icon} className="h-5 w-5" />
                </a>
              </li>
            ))}
            <li>
              <a
                href={waLink(contact.whatsapp)}
                target="_blank"
                rel="noopener"
                aria-label="WhatsApp Business"
                title="WhatsApp Business"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-ink-100 transition-colors hover:bg-wa hover:text-white"
              >
                <Icon name="whatsapp" className="h-5 w-5" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col items-center justify-between gap-3 py-6 text-center text-xs text-ink-200 sm:flex-row sm:text-left">
          <p className="font-medium">{footer.tagline}</p>
          <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <li><Link href="/aviso-legal" className="hover:text-white">Aviso legal</Link></li>
            <li><Link href="/politica-privacidad" className="hover:text-white">Privacidad</Link></li>
            <li><Link href="/politica-cookies" className="hover:text-white">Cookies</Link></li>
            <li>© {year} FixArte BCN</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
