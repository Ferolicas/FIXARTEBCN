import Image from "next/image";
import { loginAction } from "../actions";

export const dynamic = "force-dynamic";

const ERRORS: Record<string, string> = {
  credentials: "Email o contraseña incorrectos.",
  rate: "Demasiados intentos. Espera 15 minutos e inténtalo de nuevo.",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <Image src="/logo.webp" alt="FixArte BCN" width={72} height={72} className="mx-auto h-18 w-18 rounded-2xl" priority />
          <h1 className="mt-4 text-2xl text-white">Panel de gestión</h1>
          <p className="mt-1 text-sm text-ink-100">Acceso privado de FixArte BCN</p>
        </div>

        <form action={loginAction} className="mt-8 space-y-4 rounded-2xl bg-white p-6 shadow-2xl">
          {error && (
            <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {ERRORS[error] || "No se pudo iniciar sesión."}
            </p>
          )}
          <div>
            <label htmlFor="email" className="field-label">Email</label>
            <input id="email" name="email" type="email" required autoComplete="username" className="field-input" />
          </div>
          <div>
            <label htmlFor="password" className="field-label">Contraseña</label>
            <input id="password" name="password" type="password" required autoComplete="current-password" className="field-input" />
          </div>
          <button type="submit" className="btn-primary w-full">Entrar</button>
        </form>
      </div>
    </div>
  );
}
