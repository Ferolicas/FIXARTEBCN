"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/site/Icons";
import { GoldIcon } from "@/components/site/GoldIcons";
import { V2MobileNav } from "./V2MobileNav";
import { QuoteButton } from "@/components/site/QuoteModal";
import { InteractiveHoverLink } from "@/components/ui/interactive-hover-button";

type Props = {
  links: { href: string; label: string }[];
  services: { slug: string; title: string; icon: string }[];
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
};

/**
 * Cabecera mobile-first. De arriba abajo: cinta de servicios (siempre visible)
 * y fila principal con logo, menú y las tres
 * acciones: presupuesto, llamar y WhatsApp.
 * En la portada va superpuesta sobre el hero y se vuelve sólida al hacer scroll.
 */
export function V2HeaderShell({ links, services, phone, phoneDisplay, whatsapp }: Props) {
  const pathname = usePathname();
  const isHome = pathname === "/v2";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const overlay = isHome && !scrolled;
  // Fuera de la portada, las anclas deben volver a ella
  const navLinks = links.map((l) =>
    l.href.startsWith("#") && !isHome ? { ...l, href: `/v2${l.href}` } : l
  );

  return (
    <header
      className={`fa-header ${isHome ? "fixed" : "sticky"} inset-x-0 top-0 z-50 ${overlay ? "fa-header-overlay" : "fa-header-solid"}`}
    >
      <div className="fa-service-rail marquee">
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
              {services.map((s) => (
                <li key={`${copy}-${s.slug}`} className="fa-rail-item">
                  <GoldIcon name={s.icon} className="h-4 w-4" />
                  <Link
                    href={isHome ? "#servicios" : "/v2#servicios"}
                    className="fa-rail-link"
                    tabIndex={copy === 1 ? -1 : undefined}
                  >
                    {s.title}
                  </Link>
                  <span aria-hidden className="fa-rail-separator" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <div className="fa-header-main">
        <div className="fa-header-inner">
          <Link href="/v2" className="fa-brand" aria-label="FixArte BCN — Inicio">
            <Image
              src="/images/fixarte-mark.webp"
              alt=""
              width={145}
              height={123}
              priority
              className="fa-brand-mark"
            />
            <span className="fa-brand-copy">
              <strong>FixArte</strong>
              <small>Barcelona · Oficios y reformas</small>
            </span>
          </Link>

          <nav aria-label="Principal" className="fa-desktop-nav">
            <ul>
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="fa-nav-link"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="fa-header-actions">
            <div className="fa-header-contact">
              <a href={`tel:${phone}`} aria-label={`Llamar al ${phoneDisplay}`} className="fa-phone-link">
                <span>Atención directa</span>
                <strong>{phoneDisplay}</strong>
              </a>
              <InteractiveHoverLink
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener"
                aria-label="Escribir por WhatsApp"
                title="WhatsApp"
                variant="light"
                className="fa-header-whatsapp"
                leading={<Icon name="whatsapp" className="h-4 w-4" />}
                text="Consulta"
              />
              <QuoteButton className="fa-header-quote" text="Pedir presupuesto" variant="dark" />
            </div>

            <V2MobileNav links={navLinks} phone={phone} phoneDisplay={phoneDisplay} whatsapp={whatsapp} />
          </div>
        </div>
      </div>
    </header>
  );
}
