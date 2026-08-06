import sharp from "sharp";

/* Las tres fotos de fondo son 16:9. En un móvil (≈0,46 de proporción) el
   `object-cover` tiene que ampliarlas casi cuatro veces y sólo se ve un 26%
   de su ancho: por eso la casa salía gigante. Aquí se generan variantes
   VERTICALES en las que la escena entra entera a todo el ancho y el resto del
   lienzo lo rellena una copia muy difuminada de la propia foto. Servidas por
   debajo de 640px, ocupan la sección completa y se ve el 100% de la
   panorámica. El escritorio sigue usando las horizontales de siempre.

   Uso: node scripts/fondos-movil.mjs   (requiere los originales en public/) */

const RATIO = 0.462; // 390x844: la proporción de móvil más habitual
const ANCLA = 0.68;  // la franja nítida, algo por debajo del centro

const FUENTES = ["fondo", "urgencia", "ingenieria"];

for (const nombre of FUENTES) {
  const origen = `public/${nombre}.png`;
  for (const ancho of [480, 780]) {
    const alto = Math.round(ancho / RATIO);
    const altoFoto = Math.round((ancho * 9) / 16);
    const arriba = Math.round((alto - altoFoto) * ANCLA);

    const difuminado = await sharp(origen)
      .resize(ancho, alto, { fit: "cover", position: "center" })
      .blur(Math.round(ancho / 10))
      .modulate({ brightness: 1.05, saturation: 0.85 })
      .toBuffer();

    const nitida = await sharp(origen).resize(ancho, altoFoto, { fit: "cover" }).toBuffer();
    const base = sharp(difuminado).composite([{ input: nitida, top: arriba, left: 0 }]);

    await base.clone().avif({ quality: 50 }).toFile(`public/${nombre}-movil-${ancho}.avif`);
    await base.clone().webp({ quality: 70 }).toFile(`public/${nombre}-movil-${ancho}.webp`);
    console.log(`${nombre}-movil-${ancho}: lienzo ${ancho}x${alto}, foto nítida ${ancho}x${altoFoto} a ${arriba}px`);
  }
}
