import Link from "next/link";
import { Icon } from "@/components/site/Icons";

export function PanelHeader({ title, text, action }: { title: string; text?: string; action?: { href: string; label: string } }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl sm:text-3xl">{title}</h1>
        {text && <p className="mt-1 text-sm text-ink-700">{text}</p>}
      </div>
      {action && (
        <Link href={action.href} className="btn-primary !py-2.5">
          + {action.label}
        </Link>
      )}
    </div>
  );
}

export function OkBanner({ show, text = "Cambios guardados correctamente." }: { show: boolean; text?: string }) {
  if (!show) return null;
  return (
    <p role="status" className="mb-4 flex items-center gap-2 rounded-xl bg-wa/10 px-4 py-3 text-sm font-medium text-wa-600">
      <Icon name="check" className="h-4 w-4" /> {text}
    </p>
  );
}

export function ErrorBanner({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <p role="alert" className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
      {text}
    </p>
  );
}

export function EmptyState({ text }: { text: string }) {
  return <p className="card p-8 text-center text-sm text-ink-700">{text}</p>;
}

export function DangerSubmit({ label = "Eliminar" }: { label?: string }) {
  return (
    <button
      type="submit"
      className="rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
    >
      {label}
    </button>
  );
}
