"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Contador animado. Sube desde 0 hasta el valor final; si `from` es mayor que
 * `to`, baja (se usa en "de 200 € a 0 €"). Solo arranca cuando entra en pantalla
 * y respeta la preferencia de movimiento reducido.
 */
export function CountUp({
  to,
  from = 0,
  suffix = "",
  duration = 1600,
  className = "",
}: {
  to: number;
  from?: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const [value, setValue] = useState(from);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(to);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || started.current) return;
        started.current = true;
        io.disconnect();

        const t0 = performance.now();
        const paso = (t: number) => {
          const p = Math.min(1, (t - t0) / duration);
          // easing suave al final
          const e = 1 - Math.pow(1 - p, 3);
          setValue(Math.round(from + (to - from) * e));
          if (p < 1) requestAnimationFrame(paso);
        };
        requestAnimationFrame(paso);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, from, duration]);

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: "lining-nums tabular-nums" }}>
      {value.toLocaleString("es-ES")}
      {suffix}
    </span>
  );
}
