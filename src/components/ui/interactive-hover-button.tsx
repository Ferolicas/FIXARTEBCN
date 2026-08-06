"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

export type HoverVariant = "dark" | "wa" | "light" | "solid";

const ESTILOS: Record<HoverVariant, { base: string; fill: string; hoverText: string }> = {
  /** Blanco con borde negro → se rellena de negro */
  dark: { base: "border-noir/20 bg-white text-noir", fill: "bg-noir", hoverText: "text-white" },
  /** Verde WhatsApp de base → se rellena de verde oscuro */
  wa: { base: "border-transparent bg-wa text-white", fill: "bg-wa-600", hoverText: "text-white" },
  /** Sobre fondos oscuros: transparente → se rellena de blanco */
  light: { base: "border-white/35 bg-transparent text-white", fill: "bg-white", hoverText: "text-noir" },
  /** Negro de base → se rellena de dorado */
  solid: { base: "border-transparent bg-noir text-white", fill: "bg-gold-500", hoverText: "text-noir" },
};

const CLASES_BASE =
  "group relative inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-full border px-6 py-3 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60";

function Contenido({
  text,
  leading,
  hoverText,
  fill,
}: {
  text: React.ReactNode;
  leading?: React.ReactNode;
  hoverText: string;
  fill: string;
}) {
  return (
    <>
      {/* Contenido en reposo. En móvil puede partirse en dos líneas: es
          preferible a que una etiqueta larga se salga del botón. */}
      <span className="relative z-10 inline-flex items-center gap-2 text-center leading-tight transition-all duration-300 group-hover:translate-x-10 group-hover:opacity-0 sm:whitespace-nowrap">
        {leading}
        {text}
      </span>

      {/* Contenido que entra con la flecha */}
      <span
        className={cn(
          "absolute inset-0 z-10 flex translate-x-10 items-center justify-center gap-2 whitespace-nowrap px-4 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100",
          hoverText
        )}
      >
        {text}
        <ArrowRight className="h-4 w-4 shrink-0" />
      </span>

      {/* Relleno que crece desde el centro */}
      <span
        aria-hidden
        className={cn(
          "absolute left-1/2 top-1/2 h-0 w-0 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-all duration-300",
          "group-hover:h-full group-hover:w-full group-hover:opacity-100",
          fill
        )}
      />
    </>
  );
}

interface BotonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: React.ReactNode;
  variant?: HoverVariant;
  leading?: React.ReactNode;
}

/**
 * Botón con animación al pasar el ratón: el contenido sale por la derecha
 * mientras un relleno crece desde el centro y entra el texto con una flecha.
 * Adaptado de 21st.dev a los colores de FixArte BCN, con ancho automático.
 */
const InteractiveHoverButton = React.forwardRef<HTMLButtonElement, BotonProps>(
  ({ text = "Button", variant = "dark", leading, className, ...props }, ref) => {
    const v = ESTILOS[variant];
    return (
      <button ref={ref} className={cn(CLASES_BASE, v.base, className)} {...props}>
        <Contenido text={text} leading={leading} hoverText={v.hoverText} fill={v.fill} />
      </button>
    );
  }
);
InteractiveHoverButton.displayName = "InteractiveHoverButton";

interface EnlaceProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  text?: React.ReactNode;
  variant?: HoverVariant;
  leading?: React.ReactNode;
}

/** Misma animación para enlaces: teléfono, WhatsApp, email… */
const InteractiveHoverLink = React.forwardRef<HTMLAnchorElement, EnlaceProps>(
  ({ text = "Enlace", variant = "dark", leading, className, ...props }, ref) => {
    const v = ESTILOS[variant];
    return (
      <a ref={ref} className={cn(CLASES_BASE, v.base, className)} {...props}>
        <Contenido text={text} leading={leading} hoverText={v.hoverText} fill={v.fill} />
      </a>
    );
  }
);
InteractiveHoverLink.displayName = "InteractiveHoverLink";

export { InteractiveHoverButton, InteractiveHoverLink };
