"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Icon } from "./Icons";
import { GoldIcon } from "./GoldIcons";
import { MobileNav } from "./MobileNav";
import { QuoteButton } from "./QuoteModal";
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
export function HeaderShell({ links, services, phone, phoneDisplay, whatsapp }: Props) {
  const pathname = usePathname();
  const isHome = pathname === "/";
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
    l.href.startsWith("#") && !isHome ? { ...l, href: `/${l.href}` } : l
  );

  return (
    <header
      className={`${isHome ? "fixed" : "sticky"} inset-x-0 top-0 z-50 transition-colors duration-300 ${
        overlay ? "bg-transparent" : "bg-cream-200/92 shadow-sm backdrop-blur-lg"
      }`}
    >
      {/* 1 · Cinta de servicios, en lo más alto de la página.
          Fondo y texto con los colores del botón "Llamar" (blanco degradado
          + azul marino) e iconos de marca en dorado metalizado. */}
      <div className="marquee border-b border-ink-950/10 bg-gradient-to-r from-cream-100 via-white to-cream-100 py-2 sm:py-2.5">
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
              {services.map((s) => (
                <li key={`${copy}-${s.slug}`} className="flex items-center whitespace-nowrap px-4 sm:px-6">
                  <GoldIcon name={s.icon} className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                  <Link
                    href={isHome ? "#servicios" : "/#servicios"}
                    className="font-display text-sm font-medium text-ink-950 transition-colors hover:text-accent-700 sm:text-base"
                    tabIndex={copy === 1 ? -1 : undefined}
                  >
                    {s.title}
                  </Link>
                  <span className="ml-4 text-accent-500/70 sm:ml-6">✦</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      {/* 2 · Fila principal */}
      <div className={overlay ? "" : "border-b border-ink-950/8"}>
        <div className="mx-auto flex h-[84px] w-full max-w-[1400px] items-center justify-between gap-3 px-3 sm:h-[136px] sm:gap-6 sm:px-6">
          <Link href="/" className="flex shrink-0 items-center" aria-label="FixArte BCN — Inicio">
            <Image
              src="/logo.webp"
              alt="FixArte BCN"
              width={192}
              height={192}
              priority
              className="h-[68px] w-[68px] sm:h-[117px] sm:w-[117px]"
            />
          </Link>

          <nav aria-label="Principal" className="hidden flex-1 justify-center xl:flex">
            <ul className="flex items-center gap-x-4 2xl:gap-x-6">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="group relative block whitespace-nowrap py-2 font-display text-[17px] font-bold text-noir transition-colors hover:text-gold-700 2xl:text-lg"
                  >
                    {l.label}
                    <span
                      aria-hidden
                      className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-accent-500 transition-transform duration-300 group-hover:scale-x-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Acciones: presupuesto + llamar + WhatsApp.
              En móvil no caben junto al logo y además están duplicadas en la
              barra fija inferior y en el menú, así que aparecen a partir de sm. */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <div className="hidden shrink-0 items-center gap-1.5 sm:flex sm:gap-2">
              <QuoteButton className="!px-4 !text-xs sm:!px-6 sm:!text-sm" text="Presupuesto" />

              <InteractiveHoverLink
                href={`tel:${phone}`}
                aria-label={`Llamar al ${phoneDisplay}`}
                title="Llamar ahora"
                className="shrink-0 !px-4 !py-2.5 !text-xs sm:!px-5 sm:!text-sm"
                leading={<Icon name="phone" className="h-4 w-4" />}
                text="Llamar"
              />

              <InteractiveHoverLink
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener"
                aria-label="Escribir por WhatsApp"
                title="WhatsApp"
                variant="wa"
                className="shrink-0 !px-4 !py-2.5 !text-xs sm:!px-5 sm:!text-sm"
                leading={<Icon name="whatsapp" className="h-4 w-4" />}
                text="WhatsApp"
              />
            </div>

            <MobileNav links={navLinks} phone={phone} phoneDisplay={phoneDisplay} whatsapp={whatsapp} />
          </div>
        </div>
      </div>
    </header>
  );
}
