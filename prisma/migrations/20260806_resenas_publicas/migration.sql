-- Reseñas enviadas por clientes desde el formulario público
ALTER TABLE "Testimonial" ADD COLUMN "title"   TEXT NOT NULL DEFAULT '';
ALTER TABLE "Testimonial" ADD COLUMN "service" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Testimonial" ADD COLUMN "photo"   TEXT;
-- Las nuevas nacen sin publicar; las que ya existían se respetan
ALTER TABLE "Testimonial" ALTER COLUMN "published" SET DEFAULT false;
