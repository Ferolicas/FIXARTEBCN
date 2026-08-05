"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "./Icons";

type Props = {
  links: { href: string; label: string }[];
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
};

export function MobileNav({ links, phone, phoneDisplay, whatsapp }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir menú"
        aria-expanded={open}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-cream-200 text-ink-900"
      >
        <Icon name="menu" className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-cream-200 px-5 py-4">
              <span className="font-display text-lg font-bold">
                FixArte <span className="text-accent-500">BCN</span>
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar menú"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-cream-200"
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
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium text-ink-900 hover:bg-ink-50"
                >
                  {l.label}
                  <Icon name="chevron-right" className="h-4 w-4 text-ink-200" />
                </Link>
              ))}
              <Link
                href="/presupuesto"
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center justify-between rounded-xl bg-accent-50 px-4 py-3 text-base font-semibold text-accent-700 hover:bg-accent-100"
              >
                Solicitar presupuesto
                <Icon name="arrow-right" className="h-4 w-4" />
              </Link>
            </nav>
            <div className="grid grid-cols-2 gap-2 border-t border-cream-200 p-4">
              <a href={`tel:${phone}`} className="btn-dark !py-2.5">
                <Icon name="phone" className="h-4 w-4" /> Llamar
              </a>
              <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener" className="btn-wa !py-2.5">
                <Icon name="whatsapp" className="h-4 w-4" /> WhatsApp
              </a>
              <p className="col-span-2 text-center text-xs text-ink-700">{phoneDisplay} · Barcelona y área metropolitana</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
