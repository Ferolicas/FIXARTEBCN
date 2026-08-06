"use client";

import { useState } from "react";
import Image from "next/image";

/** Comparador deslizante antes/después. */
export function BeforeAfter({
  before,
  after,
  alt,
  rounded = true,
}: {
  before: string;
  after: string;
  alt: string;
  rounded?: boolean;
}) {
  const [pos, setPos] = useState(50);

  return (
    <div className={`relative aspect-[4/3] w-full select-none overflow-hidden ${rounded ? "rounded-2xl" : ""}`}>
      <Image src={after} alt={`${alt} — después`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 400px" />
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Image src={before} alt={`${alt} — antes`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 400px" />
      </div>
      <div className="pointer-events-none absolute inset-y-0" style={{ left: `${pos}%` }}>
        <div className="absolute inset-y-0 -ml-px w-0.5 bg-white shadow" />
        <div className="absolute top-1/2 -ml-4 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white text-xs font-bold text-ink-900 shadow-lg">
          ⇄
        </div>
      </div>
      <span className="absolute left-3 top-3 rounded-full bg-noir/75 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">Antes</span>
      <span className="absolute right-3 top-3 rounded-full bg-wa/90 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">Después</span>
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={`Comparar antes y después: ${alt}`}
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
