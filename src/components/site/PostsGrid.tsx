"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "./Icons";
import { GoldIcon } from "./GoldIcons";
import { Reveal } from "./Reveal";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

export type PostCard = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  html: string;
  icon: string;
};

/**
 * Tarjetas de consejos que abren el artículo completo en un modal, para que el
 * visitante no salga de la landing. La ruta /consejos/[slug] sigue existiendo
 * para el SEO y se enlaza desde el propio modal.
 */
export function PostsGrid({ posts }: { posts: PostCard[] }) {
  const [open, setOpen] = useState<PostCard | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(null), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  return (
    <>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {posts.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 2) * 70}>
            <article className="card flex h-full flex-col overflow-hidden">
              <div className="flex items-start gap-4 p-7 pb-0">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cream-100">
                  <GoldIcon name={p.icon} className="h-7 w-7" />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-noir/60">{p.date}</p>
                  <h4 className="mt-1 font-display text-xl font-bold leading-snug text-noir">{p.title}</h4>
                </div>
              </div>
              <p className="flex-1 px-7 pt-3 text-sm font-medium leading-relaxed text-noir">{p.excerpt}</p>
              <div className="px-7 pb-6 pt-5">
                <InteractiveHoverButton type="button" onClick={() => setOpen(p)} text="Leer el consejo" />
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-end justify-center bg-noir/70 backdrop-blur-sm sm:items-center sm:p-6"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-consejo-titulo"
          >
            <motion.div
              ref={panelRef}
              tabIndex={-1}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[92svh] w-full overflow-y-auto rounded-t-[2rem] bg-white outline-none sm:max-w-2xl sm:rounded-[2rem]"
            >
              <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-noir/10 bg-white/95 px-5 py-4 backdrop-blur sm:px-8">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-widest text-noir/60">{open.date}</p>
                  <h2 id="modal-consejo-titulo" className="mt-1 font-display text-2xl font-bold leading-snug text-noir">
                    {open.title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Cerrar"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-noir/10 bg-white text-noir transition-colors hover:bg-cream-100"
                >
                  <Icon name="x" className="h-5 w-5" />
                </button>
              </div>

              <div
                className="prose-fix px-5 pb-6 pt-4 text-justify sm:px-8"
                dangerouslySetInnerHTML={{ __html: open.html }}
              />

              <div className="border-t border-noir/10 px-5 py-4 sm:px-8">
                <a
                  href={`/consejos/${open.slug}`}
                  className="text-xs font-bold uppercase tracking-widest text-noir hover:underline"
                >
                  Ver el artículo en su página
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
