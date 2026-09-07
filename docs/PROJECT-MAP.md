# Mapa del proyecto — FixArte BCN

Actualizado: 2026-09-07 · Rama: `release/fixarte-v2`

## Identidad y stack

FixArte BCN es una web comercial local para captar solicitudes de reparaciones, mantenimiento, instalaciones, reformas y urgencias, acompañada de un panel privado que permite administrar los textos, servicios, trabajos, opiniones, artículos, contacto y leads publicados. La web atiende Barcelona, Badalona y el área metropolitana desde `fixartebcn.es`.

- Next.js 15.3 App Router + React 19.1 + TypeScript 5.8.
- Tailwind CSS 4, componentes propios, Lucide y Framer Motion.
- PostgreSQL `fixartebcn_db` mediante Prisma 6.8.
- Sesión administrativa JWT HS256 en cookie HTTP-only mediante `jose`; contraseñas con bcrypt.
- Resend para aviso interno y respuesta automática de formularios.
- Sharp optimiza imágenes; FFmpeg/ffprobe recodifican vídeo y generan póster.
- PM2 sirve Next.js en el puerto 4008 y Caddy publica `fixartebcn.es`.
- No hay pagos ni transporte realtime. La actualización editorial es ISR/revalidación, no tiempo real entre navegadores.

## Mapa de rutas

| Ruta | Archivo | Qué muestra | Auth | Datos |
|---|---|---|---|---|
| `/` | `src/app/(web)/page.tsx` | Landing completa: hero, servicios, proceso, trabajos, urgencias, empresa, ingeniería, consejos, reseñas y contacto | No | Setting, Service, Post, Project, Testimonial |
| `/v2` | `src/app/(preview)/v2/page.tsx` | Propuesta premium aislada para revisión del dueño; conserva el contenido dinámico y los flujos comerciales de la portada | No; `noindex` | Setting, Service, Post, Project, Testimonial |
| `/servicios` | `src/app/(web)/servicios/page.tsx` | Catálogo de servicios | No | Service, contacto |
| `/servicios/[slug]` | `src/app/(web)/servicios/[slug]/page.tsx` | Servicio SEO, tareas, FAQ y CTA | No | Service, contacto |
| `/trabajos` | `src/app/(web)/trabajos/page.tsx` | Galería, antes/después y vídeos reales | No | Project, contacto, redes |
| `/urgencias` | `src/app/(web)/urgencias/page.tsx` | Urgencias, proceso, cobertura y contacto directo | No | Setting emergency/contact |
| `/ingenieria` | `src/app/(web)/ingenieria/page.tsx` | Ingeniería y soluciones técnicas | No | Setting engineering/contact |
| `/quienes-somos` | `src/app/(web)/quienes-somos/page.tsx` | Empresa, misión, visión y valores | No | Setting about/contact |
| `/consejos` | `src/app/(web)/consejos/page.tsx` | Artículos, opiniones y enlaces sociales | No | Post, Testimonial, contacto, redes |
| `/consejos/[slug]` | `src/app/(web)/consejos/[slug]/page.tsx` | Artículo SEO y relacionados | No | Post, contacto |
| `/presupuesto` | `src/app/(web)/presupuesto/page.tsx` | Formulario de presupuesto con fotos | No | Service, contacto |
| `/contacto` | `src/app/(web)/contacto/page.tsx` | Canales, formulario y redes | No | Service, contacto, redes |
| `/opinar` | `src/app/(web)/opinar/page.tsx` | Formulario público de reseña moderada | No | Service, contacto |
| `/aviso-legal` | `src/app/(web)/aviso-legal/page.tsx` | Aviso legal | No | contacto |
| `/politica-privacidad` | `src/app/(web)/politica-privacidad/page.tsx` | Privacidad | No | contacto |
| `/politica-cookies` | `src/app/(web)/politica-cookies/page.tsx` | Cookies | No | contenido estático |
| `/panel/login` | `src/app/panel/login/page.tsx` | Acceso administrativo | No; redirige si ya existe sesión | AdminUser |
| `/panel` | `src/app/panel/page.tsx` | Resumen y solicitudes recientes | Sí | contadores y Lead |
| `/panel/solicitudes` | `src/app/panel/solicitudes/page.tsx` | Gestión de leads, estado y notas | Sí | Lead |
| `/panel/servicios`, `/panel/servicios/[id]` | `src/app/panel/servicios/**` | Lista y editor de servicios | Sí | Service |
| `/panel/trabajos`, `/panel/trabajos/[id]` | `src/app/panel/trabajos/**` | Lista y editor de trabajos y medios | Sí | Project, Service |
| `/panel/opiniones` | `src/app/panel/opiniones/page.tsx` | Moderación y edición de reseñas | Sí | Testimonial, Service |
| `/panel/consejos`, `/panel/consejos/[id]` | `src/app/panel/consejos/**` | Lista y editor de artículos | Sí | Post |
| `/panel/contenido` | `src/app/panel/contenido/page.tsx` | Textos de inicio, empresa, ingeniería, urgencias y pie | Sí | Setting |
| `/panel/ajustes` | `src/app/panel/ajustes/page.tsx` | Contacto, redes, destinatarios y contraseña | Sí | Setting, AdminUser |

`src/app/(web)/layout.tsx` añade header, footer, CTA flotante, modales de presupuesto/legal y schema LocalBusiness a la web vigente. `src/app/(preview)/v2/layout.tsx` hace lo propio con componentes y estilos encapsulados para que `/v2` no altere `/`. `src/middleware.ts` protege todo `/panel` excepto login.

## Endpoints API

| Método y ruta | Archivo | Función | Consumidor | Datos/archivos |
|---|---|---|---|---|
| `GET /api/health` | `src/app/api/health/route.ts` | Comprueba conexión PostgreSQL | PM2/deploy/monitor | `SELECT 1` |
| `POST /api/leads` | `src/app/api/leads/route.ts` | Valida, limita, guarda solicitud/fotos y envía emails | `LeadForm`, modal y páginas públicas | Lead, Setting, uploads/leads |
| `POST /api/resenas` | `src/app/api/resenas/route.ts` | Guarda reseña pendiente de moderación y foto opcional | `ReviewForm` | Testimonial, uploads/trabajos |
| `POST /api/panel/upload` | `src/app/api/panel/upload/route.ts` | Sube/optimiza imagen o recodifica vídeo | Uploaders del panel | `UPLOADS_DIR`; requiere sesión |
| `GET /uploads/[...path]` | `src/app/uploads/[...path]/route.ts` | Sirve medios persistentes con rangos de vídeo y caché | Galerías, tarjetas y panel | `UPLOADS_DIR` |
| `GET /llms.txt` | `src/app/llms.txt/route.ts` | Resumen rastreable del negocio | Buscadores/agentes | Service, Post, contacto |

Las mutaciones privadas son Server Actions de `src/app/panel/actions.ts`: login/logout/cambio de contraseña, CRUD de Service, Project, Testimonial y Post, estado/notas/borrado de Lead y edición de todos los Setting. Todas exigen `requireAdmin()` salvo login; los cambios públicos revalidan layout y sitemap.

## Modelo de datos

Definido en `prisma/schema.prisma`; migraciones en `prisma/migrations`.

- `Setting`: JSON por clave para contacto, redes, inicio, empresa, ingeniería, urgencias, pie y destinatarios.
- `AdminUser`: email único, nombre y hash de contraseña.
- `Service`: contenido, SEO, tareas, FAQ, icono/imagen, orden y publicación.
- `Project`: trabajo con categoría, descripción, antes/después, imágenes, vídeos, destacado, orden y publicación.
- `Testimonial`: reseña con autor, titular, servicio, texto, puntuación, foto, publicación y orden.
- `Post`: consejo en Markdown con portada, excerpt, metadatos, publicación y fechas.
- `Lead`: solicitud `PRESUPUESTO`, `CONTACTO` o `URGENCIA`; contacto, servicio, mensaje, fotos, notas y estado `NUEVO`, `EN_CURSO` o `CERRADO`.

No hay relaciones Prisma explícitas entre tablas; los cruces visibles se hacen por títulos/slugs y consultas independientes.

## Flujos clave

### Captación de solicitudes

1. `LeadForm` o `QuoteModal` envía `multipart/form-data` a `/api/leads`.
2. `src/app/api/leads/route.ts` aplica rate limit por IP, honeypot y Zod.
3. `saveImage()` valida con Sharp, limita tamaño, rota, redimensiona y guarda WebP.
4. Prisma crea el `Lead`; aunque Resend falle, el lead permanece en base de datos.
5. `sendLeadNotification()` avisa al negocio y `sendAutoReply()` confirma al cliente si hay email.
6. El panel lee y actualiza el lead mediante Server Actions.

### Reseña pública y moderación

1. `ReviewForm` publica a `/api/resenas` con rate limit, honeypot y Zod.
2. La reseña se crea con `published: false`; la foto opcional se optimiza.
3. El administrador modera desde `/panel/opiniones`.
4. La acción revalida la web; solo las reseñas publicadas aparecen y entran en `aggregateRating`.

### Autenticación administrativa

1. Middleware valida `fixarte_session` para rutas `/panel`.
2. `loginAction()` limita intentos por IP, compara bcrypt y firma JWT HS256 de siete días.
3. La cookie es HTTP-only, SameSite Lax y Secure en producción.
4. `requireAdmin()` protege cada Server Action y upload privado.

### Contenido autogestionable

1. El panel edita registros Prisma o valores JSON de `Setting`.
2. `revalidateWeb()` invalida el layout público y sitemap.
3. Las páginas públicas vuelven a consultar contenido real, con `revalidate = 600` donde aplica.

### Medios persistentes

1. `ImageUploader`/`VideoUploader` llaman `/api/panel/upload` autenticado.
2. Sharp crea WebP; FFmpeg produce MP4 H.264/AAC con faststart y póster WebP.
3. Las rutas públicas se guardan en registros Prisma.
4. `/uploads/[...path]` sirve desde el directorio persistente, incluye byte ranges y evita traversal.

## Dependencias compartidas

- `src/app/globals.css`: tokens, tipografía, botones, tarjetas, campos, filtros, fondos, motion y estilos usados por web y panel. Cambiar tokens base impacta todo.
- `src/app/(preview)/v2/v2.css`: dirección visual premium, limitada a clases `fa-*` y al contenedor `.fixarte-v2`; no modificar los tokens de la portada vigente desde aquí.
- `src/app/layout.tsx`: fuentes, metadata raíz, viewport y CSS global.
- `src/app/(web)/layout.tsx`: proveedores y chrome de todas las páginas públicas.
- `Header`, `HeaderShell`, `MobileNav`, `Footer`, `FloatingCta`: navegación y conversión global.
- `QuoteModal`, `LeadForm`, `ReviewModal`, `ReviewForm`, `LegalModal`: flujos públicos con estado y red.
- `Section.tsx`: headings, bandas CTA y breadcrumbs de rutas públicas.
- `GalleryGrid` + `BeforeAfter`, `ServicesFilter`, `WorksFilter`, `PostsGrid`, `ReviewsGrid`: visualización de contenido dinámico.
- `src/lib/content.ts`: contrato tipado y defaults de todos los Setting.
- `src/lib/seo.tsx`: canonical, OG, JSON-LD, zonas y schemas de todas las rutas.
- `src/lib/uploads.ts`: contrato de medios y limpieza compartido por API y Server Actions.
- `src/app/panel/actions.ts`: todas las mutaciones privadas y revalidación.

## Variables de entorno

| Variable | Uso | Consumidores |
|---|---|---|
| `DATABASE_URL` | Conexión PostgreSQL Prisma | Prisma/db |
| `AUTH_SECRET` | Firma/verificación de JWT | auth, middleware |
| `RESEND_API_KEY` | Email transaccional | email |
| `EMAIL_FROM` | Remitente | email |
| `EMAIL_TO` | Legado/documentado; destinatarios activos proceden de Setting `email` | entorno/seed |
| `SITE_URL` | Canonical, OG, sitemap y schema | seo, sitemap, reseñas |
| `PORT` | Puerto de Next/PM2 | start/ecosystem |
| `UPLOADS_DIR` | Raíz persistente de fotos/vídeos | uploads y ruta pública |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Usuario inicial | seed |
| `NEXT_DIST_DIR` | Build alternativo local | next.config.ts |

## Lecciones y gotchas

- 2026-09-07: `.github/workflows-pendiente/deploy.yml` no es un workflow activo; no asumir despliegue automático mientras permanezca fuera de `.github/workflows`.
- 2026-09-07: las imágenes y vídeos creados en el panel no están en `public/`; viven en `UPLOADS_DIR` y deben probarse mediante `/uploads/*`.
- 2026-09-07: el contenido comercial principal procede de PostgreSQL y `Setting`; un rediseño debe conservar esos contratos para que el dueño siga administrándolo.
- 2026-09-07: no hay realtime que auditar; las piezas llamadas `*Tabs` o `*Filter` son interacción local de cliente.
- 2026-09-07: `/v2` es una vista pública de revisión con canonical propio y `noindex`; comparte los datos reales y las APIs, pero no sustituye ni envuelve la ruta `/`.
- 2026-09-07: el rediseño premium solicitado es una demo en la rama local `redesign/fixarte-premium-local`; no se despliega ni se integra en `main` sin aprobación del dueño.
