# FixArte BCN — fixartebcn.es

Web de producción de **FixArte BCN**: mantenimiento, reparaciones, instalaciones y reformas en
Barcelona, Badalona y el área metropolitana.

## Stack

- **Next.js 15** (App Router, TypeScript) + **Tailwind CSS 4**
- **PostgreSQL** propio (`fixartebcn_db`) vía **Prisma**
- **Resend** para el envío de formularios por email
- **PM2 + Caddy** en el VPS del holding (puerto **4008**)

## Estructura

- Web pública: inicio, quiénes somos, servicios (10 páginas SEO por keyword), trabajos
  (antes/después), ingeniería, urgencias y cobertura, presupuesto (con fotos), contacto,
  consejos + opiniones, páginas legales.
- **Panel de autogestión en `/panel`**: solicitudes recibidas, servicios, trabajos, opiniones,
  artículos de consejos, textos de todas las páginas, datos de contacto/redes y contraseña.
  Todo lo editable se publica al instante (revalidación ISR).
- SEO: metadatos por página, canonical, sitemap dinámico, robots, JSON-LD (LocalBusiness,
  Service, FAQPage, BreadcrumbList, BlogPosting), Open Graph.

## Desarrollo

```bash
cp .env.example .env   # rellena credenciales
pnpm install
pnpm db:migrate && pnpm db:seed
pnpm dev
```

## Despliegue

Push a `main` → GitHub Actions → SSH al VPS → `deploy.sh` (pull, install, migrate, build,
`pm2 startOrReload`, healthcheck en `/api/health`).

Las imágenes subidas desde el panel viven en `/var/www/fixartebcn/uploads` (fuera del repo).
