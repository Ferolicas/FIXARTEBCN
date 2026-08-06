-- Vídeos de los trabajos (además de las fotos)
ALTER TABLE "Project" ADD COLUMN "videos" JSONB NOT NULL DEFAULT '[]';
