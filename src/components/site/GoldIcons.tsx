/**
 * Iconos de servicio en dorado metalizado (SVG de marca, incrustados para no
 * generar peticiones extra). Cada icono lleva sus degradados con id propio
 * para que no colisionen al repetirse en la página.
 */
const PATHS: Record<string, React.ReactNode> = {
  "carpinteria": (
    <><defs><linearGradient id="g-carpinteria" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#6F4810"/><stop offset="0.28" stopColor="#D4A63A"/><stop offset="0.5" stopColor="#FFF0A8"/><stop offset="0.72" stopColor="#C58B20"/><stop offset="1" stopColor="#765017"/></linearGradient><linearGradient id="gd-carpinteria" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#5A390C"/><stop offset="0.45" stopColor="#B57B18"/><stop offset="0.65" stopColor="#F5D477"/><stop offset="1" stopColor="#785115"/></linearGradient></defs><path d="m10 48 29-29 7 7-29 29H10v-7Z" fill="url(#g-carpinteria)" stroke="url(#gd-carpinteria)" strokeWidth="3" strokeLinejoin="round"/><path d="m36 16 6-6 12 12-6 6M14 44l7 7" stroke="url(#gd-carpinteria)" strokeWidth="3" strokeLinecap="round"/><path d="M8 11h19M8 17h13" stroke="url(#g-carpinteria)" strokeWidth="3" strokeLinecap="round"/></>
  ),
  "electricidad": (
    <><defs><linearGradient id="g-electricidad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#6F4810"/><stop offset="0.28" stopColor="#D4A63A"/><stop offset="0.5" stopColor="#FFF0A8"/><stop offset="0.72" stopColor="#C58B20"/><stop offset="1" stopColor="#765017"/></linearGradient><linearGradient id="gd-electricidad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#5A390C"/><stop offset="0.45" stopColor="#B57B18"/><stop offset="0.65" stopColor="#F5D477"/><stop offset="1" stopColor="#785115"/></linearGradient></defs><path d="M36 5 17 35h13l-3 24 20-33H34l2-21Z" fill="url(#g-electricidad)" stroke="url(#gd-electricidad)" strokeWidth="3" strokeLinejoin="round"/><path d="M13 12v8M9 16h8M50 44v8M46 48h8" stroke="url(#gd-electricidad)" strokeWidth="3" strokeLinecap="round"/></>
  ),
  "fontaneria": (
    <><defs><linearGradient id="g-fontaneria" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#6F4810"/><stop offset="0.28" stopColor="#D4A63A"/><stop offset="0.5" stopColor="#FFF0A8"/><stop offset="0.72" stopColor="#C58B20"/><stop offset="1" stopColor="#765017"/></linearGradient><linearGradient id="gd-fontaneria" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#5A390C"/><stop offset="0.45" stopColor="#B57B18"/><stop offset="0.65" stopColor="#F5D477"/><stop offset="1" stopColor="#785115"/></linearGradient></defs><path d="M10 16h27a9 9 0 0 1 9 9v5" stroke="url(#gd-fontaneria)" strokeWidth="4" strokeLinecap="round"/><path d="M8 11h13v10H8zM40 29h12v8H40z" fill="url(#g-fontaneria)" stroke="url(#gd-fontaneria)" strokeWidth="3" strokeLinejoin="round"/><path d="M46 39c-5 7-7 10-7 14a7 7 0 0 0 14 0c0-4-2-7-7-14Z" fill="url(#g-fontaneria)" stroke="url(#gd-fontaneria)" strokeWidth="3" strokeLinejoin="round"/></>
  ),
  "instalacion-cocinas": (
    <><defs><linearGradient id="g-instalacion-cocinas" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#6F4810"/><stop offset="0.28" stopColor="#D4A63A"/><stop offset="0.5" stopColor="#FFF0A8"/><stop offset="0.72" stopColor="#C58B20"/><stop offset="1" stopColor="#765017"/></linearGradient><linearGradient id="gd-instalacion-cocinas" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#5A390C"/><stop offset="0.45" stopColor="#B57B18"/><stop offset="0.65" stopColor="#F5D477"/><stop offset="1" stopColor="#785115"/></linearGradient></defs><path d="M8 8h48v48H8z" stroke="url(#gd-instalacion-cocinas)" strokeWidth="3" strokeLinejoin="round"/><path d="M8 29h48M34 29v27" stroke="url(#gd-instalacion-cocinas)" strokeWidth="3"/><path d="M13 13h16v11H13z" fill="url(#g-instalacion-cocinas)" stroke="url(#gd-instalacion-cocinas)" strokeWidth="3"/><circle cx="44" cy="18" r="6" stroke="url(#g-instalacion-cocinas)" strokeWidth="3"/><path d="M14 36h14v13H14zM40 38h10" stroke="url(#gd-instalacion-cocinas)" strokeWidth="3" strokeLinejoin="round"/></>
  ),
  "mantenimiento-comunidades": (
    <><defs><linearGradient id="g-mantenimiento-comunidades" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#6F4810"/><stop offset="0.28" stopColor="#D4A63A"/><stop offset="0.5" stopColor="#FFF0A8"/><stop offset="0.72" stopColor="#C58B20"/><stop offset="1" stopColor="#765017"/></linearGradient><linearGradient id="gd-mantenimiento-comunidades" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#5A390C"/><stop offset="0.45" stopColor="#B57B18"/><stop offset="0.65" stopColor="#F5D477"/><stop offset="1" stopColor="#785115"/></linearGradient></defs><path d="M8 57h48M13 57V15h24v42M37 26h14v31" stroke="url(#gd-mantenimiento-comunidades)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M19 22h5v5h-5zM28 22h5v5h-5zM19 33h5v5h-5zM28 33h5v5h-5zM19 44h5v5h-5zM43 33h4v5h-4zM43 44h4v5h-4z" fill="url(#g-mantenimiento-comunidades)"/><path d="m46 9 2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4Z" fill="url(#g-mantenimiento-comunidades)" stroke="url(#gd-mantenimiento-comunidades)" strokeWidth="2" strokeLinejoin="round"/></>
  ),
  "montaje-muebles": (
    <><defs><linearGradient id="g-montaje-muebles" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#6F4810"/><stop offset="0.28" stopColor="#D4A63A"/><stop offset="0.5" stopColor="#FFF0A8"/><stop offset="0.72" stopColor="#C58B20"/><stop offset="1" stopColor="#765017"/></linearGradient><linearGradient id="gd-montaje-muebles" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#5A390C"/><stop offset="0.45" stopColor="#B57B18"/><stop offset="0.65" stopColor="#F5D477"/><stop offset="1" stopColor="#785115"/></linearGradient></defs><path d="M9 25h46v29H9z" stroke="url(#gd-montaje-muebles)" strokeWidth="3" strokeLinejoin="round"/><path d="M32 25v29M9 39h46" stroke="url(#gd-montaje-muebles)" strokeWidth="3"/><circle cx="27" cy="33" r="2" fill="url(#g-montaje-muebles)"/><circle cx="37" cy="33" r="2" fill="url(#g-montaje-muebles)"/><path d="M15 54v5M49 54v5" stroke="url(#gd-montaje-muebles)" strokeWidth="3" strokeLinecap="round"/><path d="m22 18 7-7 5 5-7 7M37 11l5 5" stroke="url(#g-montaje-muebles)" strokeWidth="4" strokeLinecap="round"/></>
  ),
  "pintura": (
    <><defs><linearGradient id="g-pintura" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#6F4810"/><stop offset="0.28" stopColor="#D4A63A"/><stop offset="0.5" stopColor="#FFF0A8"/><stop offset="0.72" stopColor="#C58B20"/><stop offset="1" stopColor="#765017"/></linearGradient><linearGradient id="gd-pintura" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#5A390C"/><stop offset="0.45" stopColor="#B57B18"/><stop offset="0.65" stopColor="#F5D477"/><stop offset="1" stopColor="#785115"/></linearGradient></defs><path d="M9 9h35v13H9z" fill="url(#g-pintura)" stroke="url(#gd-pintura)" strokeWidth="3" strokeLinejoin="round"/><path d="M44 15h7a5 5 0 0 1 5 5v7a5 5 0 0 1-5 5H31a5 5 0 0 0-5 5v5" stroke="url(#gd-pintura)" strokeWidth="4" strokeLinecap="round"/><path d="M21 40h10v19H21z" fill="url(#g-pintura)" stroke="url(#gd-pintura)" strokeWidth="3" strokeLinejoin="round"/></>
  ),
  "pladur-tabiqueria": (
    <><defs><linearGradient id="g-pladur-tabiqueria" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#6F4810"/><stop offset="0.28" stopColor="#D4A63A"/><stop offset="0.5" stopColor="#FFF0A8"/><stop offset="0.72" stopColor="#C58B20"/><stop offset="1" stopColor="#765017"/></linearGradient><linearGradient id="gd-pladur-tabiqueria" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#5A390C"/><stop offset="0.45" stopColor="#B57B18"/><stop offset="0.65" stopColor="#F5D477"/><stop offset="1" stopColor="#785115"/></linearGradient></defs><path d="M9 8h20v48H9zM35 8h20v48H35z" stroke="url(#gd-pladur-tabiqueria)" strokeWidth="3" strokeLinejoin="round"/><path d="M9 24h20M9 40h20M35 24h20M35 40h20" stroke="url(#g-pladur-tabiqueria)" strokeWidth="4"/><path d="M29 16h6M29 32h6M29 48h6" stroke="url(#gd-pladur-tabiqueria)" strokeWidth="3" strokeLinecap="round"/></>
  ),
  "reformas": (
    <><defs><linearGradient id="g-reformas" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#6F4810"/><stop offset="0.28" stopColor="#D4A63A"/><stop offset="0.5" stopColor="#FFF0A8"/><stop offset="0.72" stopColor="#C58B20"/><stop offset="1" stopColor="#765017"/></linearGradient><linearGradient id="gd-reformas" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#5A390C"/><stop offset="0.45" stopColor="#B57B18"/><stop offset="0.65" stopColor="#F5D477"/><stop offset="1" stopColor="#785115"/></linearGradient></defs><path d="M8 55h48" stroke="url(#gd-reformas)" strokeWidth="3" strokeLinecap="round"/><path d="M12 50V27l20-16 20 16v23" stroke="url(#gd-reformas)" strokeWidth="3" strokeLinejoin="round"/><path d="M23 50V34h18v16" fill="url(#g-reformas)" stroke="url(#gd-reformas)" strokeWidth="3" strokeLinejoin="round"/><path d="m45 10 4 4-13 13-7 2 2-7 14-12Z" fill="url(#g-reformas)" stroke="url(#gd-reformas)" strokeWidth="2.5" strokeLinejoin="round"/></>
  ),
  "reparaciones-hogar": (
    <><defs><linearGradient id="g-reparaciones-hogar" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#6F4810"/><stop offset="0.28" stopColor="#D4A63A"/><stop offset="0.5" stopColor="#FFF0A8"/><stop offset="0.72" stopColor="#C58B20"/><stop offset="1" stopColor="#765017"/></linearGradient><linearGradient id="gd-reparaciones-hogar" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#5A390C"/><stop offset="0.45" stopColor="#B57B18"/><stop offset="0.65" stopColor="#F5D477"/><stop offset="1" stopColor="#785115"/></linearGradient></defs><path d="m7 30 25-20 25 20" stroke="url(#gd-reparaciones-hogar)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/><path d="M13 27v29h38V27" stroke="url(#gd-reparaciones-hogar)" strokeWidth="3" strokeLinejoin="round"/><path d="M38 31a9 9 0 0 0-11 11L17 52l5 5 10-10a9 9 0 0 0 11-11l-6 6-5-5 6-6Z" fill="url(#g-reparaciones-hogar)" stroke="url(#gd-reparaciones-hogar)" strokeWidth="2.5" strokeLinejoin="round"/></>
  ),
};

/** Traduce la clave de icono guardada en la base de datos al icono dorado. */
export const GOLD_BY_KEY: Record<string, string> = {
  bolt: "electricidad",
  droplet: "fontaneria",
  paint: "pintura",
  wall: "pladur-tabiqueria",
  hammer: "carpinteria",
  sofa: "montaje-muebles",
  kitchen: "instalacion-cocinas",
  wrench: "reparaciones-hogar",
  building: "mantenimiento-comunidades",
  ruler: "reformas",
};

export function GoldIcon({ name, className = "h-5 w-5" }: { name: string; className?: string }) {
  const key = PATHS[name] ? name : GOLD_BY_KEY[name];
  const content = key ? PATHS[key] : null;
  if (!content) return null;
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden className={className}>
      {content}
    </svg>
  );
}
