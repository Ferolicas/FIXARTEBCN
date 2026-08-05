import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream-50 px-6 text-center">
      <p className="font-display text-7xl font-bold text-accent-500">404</p>
      <h1 className="mt-4 text-2xl">Esta página no existe</h1>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-700">
        Puede que el enlace haya cambiado. Vuelve al inicio o consulta nuestros servicios.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-dark">
          Ir al inicio
        </Link>
        <Link href="/servicios" className="btn-outline">
          Ver servicios
        </Link>
        <Link href="/presupuesto" className="btn-primary">
          Pedir presupuesto
        </Link>
      </div>
    </div>
  );
}
