"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "./Icons";
import { useQuote } from "./QuoteModal";
import { InteractiveHoverButton, InteractiveHoverLink } from "@/components/ui/interactive-hover-button";

type Props = {
  links: { href: string; label: string }[];
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
};

export function MobileNav({ links, phone, phoneDisplay, whatsapp }: Props) {
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
      <div className="absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-cream-200 px-5 py-4">
          <Link href="/" onClick={() => setOpen(false)} aria-label="FixArte BCN — Inicio">
            <Image src="/logo.webp" alt="FixArte BCN" width={192} height={192} className="h-14 w-14" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Cerrar menú"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-noir/15"
          >
            <Icon name="x" className="h-5 w-5" />
          </button>
        </div>
        <nav aria-label="Menú móvil" className="flex-1 overflow-y-auto px-3 py-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between rounded-2xl px-4 py-3 font-display text-lg font-bold text-noir hover:bg-cream-100 active:bg-cream-100"
            >
              {l.label}
              <Icon name="chevron-right" className="h-4 w-4 text-ink-200" />
            </Link>
          ))}
          <InteractiveHoverButton
            type="button"
            onClick={() => {
              setOpen(false);
              openQuote();
            }}
            variant="solid"
            className="mt-3 w-full"
            text="Pedir presupuesto"
          />
        </nav>
        <div className="grid grid-cols-2 gap-2 border-t border-cream-200 p-4">
          <InteractiveHoverLink
            href={`tel:${phone}`}
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
          <p className="col-span-2 text-center text-xs text-ink-700">{phoneDisplay} · Barcelona y área metropolitana</p>
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
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-noir/15 bg-white/70 text-ink-900 backdrop-blur-sm"
      >
        <Icon name="menu" className="h-6 w-6" />
      </button>

      {open && montado && createPortal(panel, document.body)}
    </div>
  );
}
