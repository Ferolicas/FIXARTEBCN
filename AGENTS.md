# FixArte BCN — contexto permanente

## Qué es
Web comercial y panel autogestionable de FixArte BCN para captar y gestionar solicitudes de mantenimiento, reparaciones, instalaciones, urgencias y reformas en Barcelona, Badalona y el área metropolitana. Dominio: `fixartebcn.es` · Puerto: `4008` · DB: `fixartebcn_db`.

## Stack
Next.js 15 App Router, React 19, TypeScript, Tailwind CSS 4, Prisma 6 con PostgreSQL, sesiones JWT propias con `jose`, Resend para email, Sharp y FFmpeg para medios. Gestor: pnpm.

## Comandos
Desarrollo: `pnpm dev` · Build: `pnpm build` · Typecheck: `pnpm typecheck` · Migraciones: `pnpm db:migrate` · Seed: `pnpm db:seed`.

## Estructura esencial
- Web pública: `src/app/(web)`
- Vista de rediseño: `src/app/(preview)/v2` y `src/components/v2`
- Panel privado: `src/app/panel`
- API y medios: `src/app/api`, `src/app/uploads/[...path]`
- Componentes públicos: `src/components/site`
- Componentes del panel: `src/components/panel`
- Datos: `prisma/schema.prisma` y `prisma/migrations`
- Contenido editable: `src/lib/content.ts` + tabla `Setting`
- SEO estructurado: `src/lib/seo.tsx`
- Mapa profundo: `docs/PROJECT-MAP.md`

## Reglas de este proyecto
- Antes de cualquier commit: `pnpm typecheck`, `pnpm build` y lint si se configura.
- La web pública consume contenido y datos reales de PostgreSQL; no sustituirlos por copy estático ni datos inventados.
- Mantener formularios, reseñas, enlaces de contacto, JSON-LD, sitemap, páginas SEO y rutas legales al rediseñar.
- Los uploads persistentes viven fuera del repo en `UPLOADS_DIR`; nunca asumir que `public/` contiene todo el material del panel.
- Los cambios de contenido del panel llaman `revalidateWeb()` y deben seguir actualizando la web pública.
- `NEXT_DIST_DIR` permite compilar en una carpeta alternativa sin interferir con desarrollo.
- El workflow está aparcado en `.github/workflows-pendiente`; no moverlo ni desplegar sin orden expresa.
- La portada vigente en `/` es intocable salvo orden expresa. La propuesta premium pública vive aislada en `/v2`, con CSS y componentes propios y `noindex`.
