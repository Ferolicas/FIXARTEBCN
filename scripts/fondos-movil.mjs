import sharp from "sharp";

/* Fondos verticales para móvil (hero e ingeniería).

   Las fotos horizontales son 16:9 y en una pantalla de móvil (proporción
   ≈0,46) `object-cover` tiene que ampliarlas casi cuatro veces: sólo se ve un
   26% de su ancho y la casa sale gigante. Por eso el hero usa por debajo de
   640px una toma vertical propia (public/HEROVERTICAL.png), donde la escena
   ya está encuadrada en vertical y se ve la panorámica entera.

   Uso: node scripts/fondos-movil.mjs */

const FUENTES = [
  { origen: "public/HEROVERTICAL.png", nombre: "hero-vertical" },
  { origen: "public/INGENIARIAVERTICAL.png", nombre: "ingenieria-vertical" },
  { origen: "public/URGENCIAVERTICAL.png", nombre: "urgencia-vertical" },
];
const ANCHOS = [480, 780, 1080];

for (const { origen, nombre } of FUENTES) {
  const meta = await sharp(origen).metadata();
  console.log(`${origen}: ${meta.width}x${meta.height} (${(meta.width / meta.height).toFixed(3)})`);
  for (const ancho of ANCHOS) {
    const base = sharp(origen).resize(ancho, null, { withoutEnlargement: false });
    await base.clone().avif({ quality: 52 }).toFile(`public/${nombre}-${ancho}.avif`);
    await base.clone().webp({ quality: 74 }).toFile(`public/${nombre}-${ancho}.webp`);
    console.log(`  ${nombre}-${ancho}`);
  }
}
