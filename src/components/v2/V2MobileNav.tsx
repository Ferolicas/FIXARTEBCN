"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/site/Icons";
import { useQuote } from "@/components/site/QuoteModal";
import { InteractiveHoverButton, InteractiveHoverLink } from "@/components/ui/interactive-hover-button";

type Props = {
  links: { href: string; label: string }[];
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
};

export function V2MobileNav({ links, phone, phoneDisplay, whatsapp }: Props) {
  const [open, setOpen] = useState(false);
  const [montado, setMontado] = useState(false);
  const { open: openQuote } = useQuote();

  useEffect(() => setMontado(true), []);

  // Cerrar con Escape y bloquear el scroll del fondo mientras está abierto
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previo;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  /* El panel se monta en <body> mediante portal. Si colgara de la cabecera,
     el backdrop-blur que ésta adopta al hacer scroll la convertiría en bloque
     contenedor y el `fixed` del menú se recortaría a su altura. */
  const panel = (
    <div className="fixed inset-0 z-[100]">
      <button
        type="button"
        aria-label="Cerrar menú"
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm"
      />
      <div className="fa-mobile-panel">
        <div className="fa-mobile-head">
          <Link href="/v2" onClick={() => setOpen(false)} aria-label="FixArte BCN — Inicio" className="fa-brand fa-brand-mobile">
            <Image src="/images/fixarte-mark.webp" alt="" width={145} height={123} className="fa-brand-mark" />
            <span className="fa-brand-copy"><strong>FixArte</strong><small>BCN</small></span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Cerrar menú"
            className="fa-mobile-close"
          >
            <Icon name="x" className="h-5 w-5" />
          </button>
        </div>
        <nav aria-label="Menú móvil" className="fa-mobile-links">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="fa-mobile-link"
            >
              {l.label}
              <Icon name="chevron-right" className="h-4 w-4" />
            </Link>
          ))}
          <InteractiveHoverButton
            type="button"
            onClick={() => {
              setOpen(false);
              openQuote();
            }}
            variant="solid"
            className="fa-mobile-budget mt-3 w-full"
            text="Pedir presupuesto"
          />
        </nav>
        <div className="fa-mobile-contact">
          <InteractiveHoverLink
            href={`tel:${phone}`}
            variant="light"
            className="w-full !px-3 !py-2.5"
            leading={<Icon name="phone" className="h-4 w-4" />}
            text="Llamar"
          />
          <InteractiveHoverLink
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener"
            variant="wa"
            className="w-full !px-3 !py-2.5"
            leading={<Icon name="whatsapp" className="h-4 w-4" />}
            text="WhatsApp"
          />
          <p>{phoneDisplay} · Barcelona y área metropolitana</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="xl:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir menú"
        aria-expanded={open}
        className="fa-menu-trigger"
      >
        <Icon name="menu" className="h-6 w-6" />
      </button>

      {open && montado && createPortal(panel, document.body)}
    </div>
  );
}
