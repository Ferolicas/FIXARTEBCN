import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { getContact, getSocial, getFooter, waLink } from "@/lib/content";
import { Icon } from "@/components/site/Icons";
import { LegalLink } from "@/components/site/LegalModal";
import { InteractiveHoverLink } from "@/components/ui/interactive-hover-button";
import { QuoteButton } from "@/components/site/QuoteModal";

const SOCIAL_ITEMS: { key: "instagram" | "facebook" | "youtube" | "wallapop" | "milanuncios" | "linkedin" | "maps"; icon: string; label: string }[] = [
  { key: "maps", icon: "map-pin", label: "Google Maps" },
  { key: "instagram", icon: "instagram", label: "Instagram" },
  { key: "facebook", icon: "facebook", label: "Facebook" },
  { key: "youtube", icon: "youtube", label: "YouTube" },
  { key: "wallapop", icon: "wallapop", label: "Wallapop" },
  { key: "milanuncios", icon: "milanuncios", label: "Milanuncios" },
  { key: "linkedin", icon: "linkedin", label: "LinkedIn" },
];

export async function V2Footer() {
  const [contact, social, footer, services] = await Promise.all([
    getContact(),
    getSocial(),
    getFooter(),
    db.service.findMany({ where: { published: true }, orderBy: { order: "asc" }, select: { slug: true, title: true }, take: 10 }),
  ]);

  const year = new Date().getFullYear();

  return (
    <footer className="fa-footer">
      <div>
      {/* Accesos rápidos siempre visibles en el pie */}
      <div className="fa-footer-action-wrap">
        <div className="fa-shell fa-footer-actions">
          <InteractiveHoverLink
            href={`tel:${contact.phone}`}
            className="w-full !px-3 sm:!px-6"
            leading={<Icon name="phone" className="h-4 w-4" />}
            text="Llamar"
          />
          <InteractiveHoverLink
            href={waLink(contact.whatsapp)}
            target="_blank"
            rel="noopener"
            variant="wa"
            className="w-full !px-3 sm:!px-6"
            leading={<Icon name="whatsapp" className="h-4 w-4" />}
            text="WhatsApp"
          />
          <InteractiveHoverLink
            href={`mailto:${contact.email}`}
            className="w-full !px-3 sm:!px-6"
            leading={<Icon name="mail" className="h-4 w-4" />}
            text="Email"
          />
          <QuoteButton className="w-full !px-3 !py-3 sm:!px-6" text="Presupuesto" />
        </div>
      </div>

      <div className="fa-shell fa-footer-grid">
        <div>
          <div className="flex items-center gap-2.5">
            <Image src="/images/fixarte-mark.webp" alt="" width={145} height={123} className="h-10 w-11 object-contain" />
            <span className="font-display text-lg font-bold text-noir">
              FixArte <span className="text-gold-700">BCN</span>
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-noir">
            Mantenimiento, reparaciones, instalaciones y reformas para hogares, empresas y comunidades.
          </p>
          <ul className="mt-4 space-y-0.5 text-sm">
            <li className="flex items-center gap-2">
              <Icon name="map-pin" className="h-4 w-4 text-gold-700" />
              Barcelona, Badalona y área metropolitana
            </li>
            <li className="flex items-center gap-2">
              <Icon name="clock" className="h-4 w-4 text-gold-700" />
              {contact.hours}
            </li>
          </ul>
        </div>

        <nav aria-label="Secciones">
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-noir">Secciones</h2>
          <ul className="mt-4 space-y-0.5 text-sm">
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
                <Link href={href} className="inline-block py-2.5 transition-colors hover:text-gold-700">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Servicios">
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-noir">Servicios</h2>
          <ul className="mt-4 space-y-0.5 text-sm">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/servicios/${s.slug}`} className="inline-block py-2.5 transition-colors hover:text-gold-700">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-noir">Contacto</h2>
          <ul className="mt-4 space-y-0.5 text-sm">
            <li>
              <a href={`tel:${contact.phone}`} className="flex items-center gap-2 py-2.5 transition-colors hover:text-gold-700">
                <Icon name="phone" className="h-4 w-4 text-gold-700" /> {contact.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${contact.email}`} className="flex items-center gap-2 py-2.5 transition-colors hover:text-gold-700">
                <Icon name="mail" className="h-4 w-4 text-gold-700" /> {contact.email}
              </a>
            </li>
          </ul>
          <h2 className="mt-6 font-display text-sm font-bold uppercase tracking-wider text-noir">Síguenos</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {SOCIAL_ITEMS.filter((s) => social[s.key]).map((s) => (
              <li key={s.key}>
                <a
                  href={social[s.key]}
                  target="_blank"
                  rel="noopener"
                  aria-label={s.label}
                  title={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-noir/10 bg-white text-noir transition-colors hover:border-gold-500"
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
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-wa text-white transition-colors hover:bg-wa-600"
              >
                <Icon name="whatsapp" className="h-5 w-5" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="fa-footer-bottom-wrap">
        <div className="fa-shell fa-footer-bottom">
          <p className="font-medium">{footer.tagline}</p>
          <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <li><LegalLink doc="aviso-legal" className="inline-block py-3 hover:text-white">Aviso legal</LegalLink></li>
            <li><LegalLink doc="politica-privacidad" className="inline-block py-3 hover:text-white">Privacidad</LegalLink></li>
            <li><LegalLink doc="politica-cookies" className="inline-block py-3 hover:text-white">Cookies</LegalLink></li>
            <li>© {year} FixArte BCN</li>
          </ul>
        </div>
      </div>
      </div>
    </footer>
  );
}
