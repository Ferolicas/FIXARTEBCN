import Link from "next/link";
import { Icon } from "./Icons";
import { QuoteButton } from "./QuoteModal";
import { InteractiveHoverLink } from "@/components/ui/interactive-hover-button";
import { Reveal } from "./Reveal";

export function SectionHeading({
  kicker,
  title,
  text,
  center,
  as: Tag = "h2",
}: {
  kicker?: string;
  title: string;
  text?: string;
  center?: boolean;
  as?: "h1" | "h2";
}) {
  return (
    <Reveal className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      {kicker && <p className="slash-label mb-3">{kicker}</p>}
      <Tag className={Tag === "h1" ? "text-4xl leading-[1.08] sm:text-5xl lg:text-6xl" : "text-3xl sm:text-4xl"}>{title}</Tag>
      {text && <p className="mt-4 text-lg leading-relaxed text-ink-700">{text}</p>}
    </Reveal>
  );
}

/** Banda final de conversión, reutilizada en casi todas las páginas. */
export function CtaBand({
  title = "Solicita tu presupuesto sin compromiso",
  text = "Cuéntanos tu proyecto y te prepararemos un presupuesto personalizado, claro y sin compromiso.",
  phone,
  whatsapp,
}: {
  title?: string;
  text?: string;
  phone: string;
  whatsapp: string;
}) {
  return (
    <section className="container-site pb-16 pt-4 sm:pb-20">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-ink-950 px-6 py-14 text-center sm:px-12 sm:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent-500/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-ink-600/30 blur-3xl"
        />
        <p className="slash-label relative !text-ink-200">Presupuesto en 24h</p>
        <h2 className="relative mt-3 text-4xl text-white sm:text-5xl">{title}</h2>
        <p className="relative mx-auto mt-4 max-w-xl text-ink-100">{text}</p>
        <div className="relative mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <QuoteButton variant="light" text="Pedir presupuesto" />
          <InteractiveHoverLink
            href={`tel:${phone}`}
            variant="light"
            leading={<Icon name="phone" className="h-4 w-4" />}
            text="Llamar ahora"
          />
          <InteractiveHoverLink
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener"
            variant="wa"
            leading={<Icon name="whatsapp" className="h-4 w-4" />}
            text="WhatsApp"
          />
        </div>
      </div>
    </section>
  );
}

export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  return (
    <nav aria-label="Ruta de navegación" className="container-site pt-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-700">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-1.5">
              {i > 0 && <Icon name="chevron-right" className="h-3.5 w-3.5 text-ink-200" />}
              {last ? (
                <span aria-current="page" className="font-medium text-ink-900">
                  {item.name}
                </span>
              ) : (
                <Link href={item.path} className="hover:text-accent-600">
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
