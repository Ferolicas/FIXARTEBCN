/**
 * Seed inicial de FixArte BCN. Idempotente: se puede ejecutar varias veces
 * sin duplicar datos (upsert por clave). No inventa opiniones ni trabajos:
 * esos se suben reales desde /panel.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

const settings: Record<string, unknown> = {
  contact: {
    phone: "+34634390345",
    phoneDisplay: "+34 634 39 03 45",
    whatsapp: "34634390345",
    email: "contacto@fixartebcn.es",
    address: "",
    city: "Barcelona",
    hours: "Lun–Dom · Urgencias con atención prioritaria",
  },
  social: {
    instagram: "",
    facebook: "",
    youtube: "",
    wallapop: "",
    milanuncios: "",
    linkedin: "",
    maps: "https://www.google.com/maps/search/?api=1&query=FixArte+BCN+Barcelona",
  },
  home: {
    heroKicker: "",
    heroTitle: "Reformas y reparaciones en Barcelona",
    heroText:
      "Electricidad, fontanería, pintura y reformas para tu hogar, local o comunidad. Presupuesto cerrado y sin compromiso.",
    whyTitle: "¿Por qué elegir FixArte BCN?",
    why: [
      { title: "Atención rápida y profesional", text: "Respondemos pronto, llegamos puntuales y resolvemos a la primera." },
      { title: "Presupuestos claros y sin compromiso", text: "Precio cerrado antes de empezar. Sin sorpresas al final." },
      { title: "Materiales de calidad", text: "Trabajamos con primeras marcas y garantizamos cada acabado." },
      { title: "Soluciones adaptadas a cada cliente", text: "Cada vivienda, local o comunidad recibe una solución a medida." },
      { title: "Seguridad y acabados cuidados", text: "Cumplimos la normativa vigente y cuidamos cada detalle." },
      { title: "Experiencia en mantenimiento integral", text: "Un solo equipo para electricidad, fontanería, pintura y más." },
    ],
  },
  about: {
    intro:
      "En FixArte BCN somos una empresa dedicada al mantenimiento, las reparaciones y las instalaciones para viviendas, locales comerciales, oficinas y comunidades de propietarios.\n\nNuestro compromiso es ofrecer un servicio profesional, rápido y de calidad, adaptándonos a las necesidades de cada cliente y buscando siempre soluciones eficaces y duraderas.\n\nCreemos que un buen trabajo no solo consiste en reparar una avería, sino en generar confianza, cumplir lo prometido y cuidar cada detalle del servicio.",
    mission:
      "Brindar soluciones integrales de mantenimiento, reparación e instalación con altos estándares de calidad, seguridad y responsabilidad, ofreciendo un servicio cercano, eficiente y orientado a la satisfacción del cliente.",
    vision:
      "Consolidarnos como una empresa de referencia en Barcelona y su área metropolitana, reconocida por la calidad de nuestros trabajos, la confianza de nuestros clientes y la innovación en las soluciones que ofrecemos.",
    values: [
      "Profesionalidad",
      "Honestidad",
      "Puntualidad",
      "Calidad",
      "Responsabilidad",
      "Compromiso con el cliente",
      "Mejora continua",
      "Seguridad en cada trabajo",
    ],
  },
  engineering: {
    title: "Ingeniería y soluciones técnicas",
    paragraphs: [
      "En FixArte BCN combinamos la experiencia práctica con conocimientos técnicos para ofrecer soluciones eficientes, seguras y duraderas.",
      "Analizamos cada proyecto de forma personalizada para identificar la mejor alternativa, optimizando materiales, tiempos de ejecución y costes, siempre cumpliendo la normativa vigente.",
      "Ofrecemos apoyo técnico para viviendas, locales comerciales, oficinas y comunidades de propietarios, realizando diagnósticos, mantenimiento, mejoras de instalaciones y asesoramiento en proyectos de reforma y adecuación.",
      "Nuestro objetivo es aportar soluciones profesionales que garanticen calidad, seguridad y confianza en cada intervención.",
    ],
    items: [
      { title: "Diagnóstico de instalaciones", text: "Revisión técnica de instalaciones eléctricas, de fontanería y climatización para detectar fallos y riesgos antes de que se conviertan en averías." },
      { title: "Mantenimiento preventivo", text: "Planes de mantenimiento periódico para empresas y comunidades que reducen incidencias y alargan la vida de las instalaciones." },
      { title: "Optimización y ahorro", text: "Propuestas de mejora para reducir consumo energético y costes de mantenimiento, con estudio de amortización." },
      { title: "Asesoramiento en reformas", text: "Apoyo técnico en proyectos de reforma y adecuación de locales y viviendas: soluciones viables, seguras y dentro de normativa." },
    ],
  },
  emergency: {
    intro:
      "En FixArte BCN sabemos que algunas averías no pueden esperar. Por eso ofrecemos atención rápida para resolver incidencias en viviendas, locales comerciales, oficinas y comunidades de propietarios.",
    body:
      "Atendemos problemas relacionados con electricidad, fontanería, reparaciones generales, mantenimiento y otras incidencias que requieren una solución eficaz. Nuestro compromiso es responder con rapidez, identificar el problema y ofrecer una solución profesional y segura.",
    zones: [
      "Barcelona",
      "Badalona",
      "L'Hospitalet de Llobregat",
      "Santa Coloma de Gramenet",
      "Sant Adrià de Besòs",
      "Área metropolitana de Barcelona",
    ],
    outside:
      "Si tu proyecto está fuera de estas zonas, consúltanos: estudiaremos la mejor forma de atenderte.",
  },
  footer: {
    tagline: "FixArte BCN | Soluciones profesionales para hogares, empresas y comunidades.",
  },
  email: {
    to: ["contacto@fixartebcn.es", "laagenciacnp@gmail.com"],
  },
};

type Faq = { q: string; a: string };
type ServiceSeed = {
  slug: string;
  title: string;
  heroTitle: string;
  shortDesc: string;
  longDesc: string;
  bullets: string[];
  faqs: Faq[];
  icon: string;
  metaTitle: string;
  metaDescription: string;
  schemaType: string;
  order: number;
};

const services: ServiceSeed[] = [
  {
    slug: "electricista-barcelona",
    title: "Electricidad",
    heroTitle: "Electricista en Barcelona",
    shortDesc:
      "Instalación y reparación de puntos de luz, enchufes, cuadros eléctricos, iluminación LED y averías eléctricas.",
    longDesc: `## Electricistas profesionales para tu hogar o negocio

En FixArte BCN realizamos todo tipo de trabajos eléctricos en viviendas, locales comerciales, oficinas y comunidades de propietarios de Barcelona y su área metropolitana. Desde sustituir un enchufe hasta renovar la instalación completa, siempre con seguridad, limpieza y garantía.

## Averías eléctricas resueltas con rapidez

Un diferencial que salta, una zona de la casa sin luz o un cuadro que huele a quemado no pueden esperar. Localizamos el origen de la avería con instrumentación profesional y la reparamos dejando la instalación segura y dentro de normativa.

## Instalaciones y mejoras

Ampliamos puntos de luz y enchufes, instalamos iluminación LED de bajo consumo, automatizamos con detectores de presencia y renovamos cuadros eléctricos antiguos. Te asesoramos para que tu instalación gane en seguridad y eficiencia.`,
    bullets: [
      "Reparación de averías eléctricas",
      "Cuadros eléctricos y diferenciales",
      "Puntos de luz, enchufes e interruptores",
      "Iluminación LED y bajo consumo",
      "Detectores de presencia",
      "Revisión y mantenimiento de instalaciones",
    ],
    faqs: [
      {
        q: "¿Hacéis presupuesto antes de empezar el trabajo?",
        a: "Sí. Evaluamos la avería o el trabajo, te damos un presupuesto claro y sin compromiso y solo empezamos cuando lo apruebas.",
      },
      {
        q: "Se me va la luz y salta el diferencial, ¿podéis venir hoy?",
        a: "Las averías eléctricas se atienden con prioridad. Escríbenos por WhatsApp o llámanos y te confirmamos la franja de visita más rápida disponible en Barcelona, Badalona o el área metropolitana.",
      },
      {
        q: "¿Podéis cambiar un cuadro eléctrico antiguo?",
        a: "Sí. Sustituimos cuadros antiguos por cuadros modernos con protecciones actuales (diferenciales y magnetotérmicos), dejando la instalación más segura y preparada para el consumo real de la vivienda.",
      },
      {
        q: "¿Trabajáis para comunidades de propietarios?",
        a: "Sí. Mantenemos la iluminación de escaleras, portales y garajes, instalamos detectores de presencia y resolvemos averías en zonas comunes.",
      },
    ],
    icon: "bolt",
    metaTitle: "Electricista en Barcelona | FixArte BCN",
    metaDescription:
      "Electricista en Barcelona y Badalona: averías, cuadros eléctricos, iluminación LED y nuevas instalaciones. Presupuesto claro y sin compromiso. Atención rápida.",
    schemaType: "Electrician",
    order: 1,
  },
  {
    slug: "fontanero-barcelona",
    title: "Fontanería",
    heroTitle: "Fontanero en Barcelona",
    shortDesc:
      "Fugas, grifos, sanitarios, desagües y atascos. Reparaciones e instalaciones de fontanería con garantía.",
    longDesc: `## Fontaneros de confianza en Barcelona

En FixArte BCN resolvemos cualquier problema de fontanería en viviendas, locales, oficinas y comunidades: fugas de agua, grifos que gotean, cisternas que pierden, desagües lentos o atascos. Llegamos puntuales, trabajamos limpio y garantizamos la reparación.

## Fugas y atascos: rapidez ante todo

Una fuga puede convertirse en un problema serio para tu casa y la de tus vecinos. Localizamos la fuga, cortamos el problema de raíz y reparamos la instalación. También desatascamos fregaderos, lavabos, platos de ducha y bajantes.

## Instalaciones y renovaciones

Sustituimos grifería, sanitarios, sifones y flexos; instalamos lavabos, fregaderos, termos y electrodomésticos; y ejecutamos pequeñas reformas de fontanería completas, con materiales de primeras marcas.`,
    bullets: [
      "Reparación de fugas de agua",
      "Desatascos de tuberías y desagües",
      "Sustitución de grifos y sanitarios",
      "Instalación de lavabos y fregaderos",
      "Termos y calentadores",
      "Pequeñas reformas de fontanería",
    ],
    faqs: [
      {
        q: "Tengo una fuga de agua, ¿qué hago mientras llegáis?",
        a: "Cierra la llave de paso general de la vivienda (suele estar en la cocina, el baño o la entrada) y contáctanos por teléfono o WhatsApp. Te daremos la franja de visita más rápida posible.",
      },
      {
        q: "¿Cobráis por venir a ver la avería?",
        a: "Te damos presupuesto claro antes de intervenir. Cuéntanos el problema por WhatsApp —si puedes, con una foto o vídeo— y te orientamos sin compromiso.",
      },
      {
        q: "¿Desatascáis tuberías y bajantes?",
        a: "Sí. Desatascamos fregaderos, lavabos, duchas e inodoros, y también bajantes y colectores de comunidades.",
      },
      {
        q: "¿Instaláis la grifería o el sanitario si ya lo he comprado?",
        a: "Sí, instalamos material aportado por el cliente. Si lo prefieres, también te lo suministramos nosotros con garantía del fabricante.",
      },
    ],
    icon: "droplet",
    metaTitle: "Fontanero en Barcelona | FixArte BCN",
    metaDescription:
      "Fontanero en Barcelona y Badalona: fugas, atascos, grifos, sanitarios e instalaciones. Reparaciones con garantía y presupuesto sin compromiso. Llámanos.",
    schemaType: "Plumber",
    order: 2,
  },
  {
    slug: "pintores-barcelona",
    title: "Pintura",
    heroTitle: "Pintores en Barcelona",
    shortDesc:
      "Pintura interior y exterior, reparación de paredes, tratamiento de humedades y acabados de alta calidad.",
    longDesc: `## Pintores profesionales para viviendas y locales

En FixArte BCN pintamos pisos, casas, locales comerciales, oficinas y zonas comunes de comunidades en Barcelona y alrededores. Preparamos bien cada superficie —ese es el secreto de un buen acabado— y protegemos suelos y muebles para entregarte el espacio impecable.

## Mucho más que dar color

Reparamos grietas y desperfectos, alisamos paredes con gotelé, tratamos manchas de humedad y aplicamos pinturas antimoho en baños y cocinas. El resultado: paredes lisas, sanas y con un acabado uniforme que dura años.

## Interior y exterior

Pintura plástica lisa, esmaltes para carpintería y metal, fachadas, patios y vallados. Te asesoramos con colores y tipos de pintura según cada estancia y uso.`,
    bullets: [
      "Pintura de pisos y casas",
      "Pintura de locales y oficinas",
      "Alisado de paredes y quitar gotelé",
      "Tratamiento de humedades y antimoho",
      "Reparación de grietas y desperfectos",
      "Esmaltes en puertas, radiadores y metal",
    ],
    faqs: [
      {
        q: "¿El presupuesto incluye la pintura y los materiales?",
        a: "Sí, salvo que prefieras aportar tú la pintura. El presupuesto detalla mano de obra, materiales y plazos, cerrado antes de empezar.",
      },
      {
        q: "¿Cuánto se tarda en pintar un piso?",
        a: "Un piso medio (70–90 m²) suele estar listo en 3 a 5 días laborables, según el estado de las paredes y si hay alisado o reparaciones previas.",
      },
      {
        q: "¿Tratáis las manchas de humedad antes de pintar?",
        a: "Siempre. Identificamos el origen (condensación, filtración o capilaridad), lo tratamos y aplicamos productos específicos antes del acabado. Pintar encima sin tratar solo esconde el problema unas semanas.",
      },
      {
        q: "¿Protegéis los muebles y el suelo?",
        a: "Sí. Cubrimos suelos, muebles y carpinterías con plásticos y cartón, y al terminar dejamos el espacio limpio y listo para usar.",
      },
    ],
    icon: "paint",
    metaTitle: "Pintores en Barcelona | FixArte BCN",
    metaDescription:
      "Pintores en Barcelona: pisos, locales y comunidades. Alisado de paredes, humedades y acabados de calidad. Presupuesto cerrado y sin compromiso.",
    schemaType: "HousePainter",
    order: 3,
  },
  {
    slug: "pladur-barcelona",
    title: "Pladur y tabiquería",
    heroTitle: "Pladur en Barcelona",
    shortDesc:
      "Tabiques, falsos techos, cajones de pladur y adecuación de espacios con acabados perfectos.",
    longDesc: `## Especialistas en pladur y tabiquería seca

El pladur permite transformar un espacio con rapidez y limpieza: dividir una habitación, bajar un techo, ocultar instalaciones o mejorar el aislamiento. En FixArte BCN lo instalamos y reparamos con acabados listos para pintar.

## Qué hacemos con pladur

Tabiques divisorios con aislamiento acústico o térmico, falsos techos continuos o registrables, cajones para ocultar tuberías y conductos, hornacinas y muebles de obra, y trasdosados para renovar paredes en mal estado.

## Reparaciones de pladur

Reparamos agujeros, grietas, juntas marcadas y placas dañadas por golpes o humedad, dejando la superficie lisa y preparada para el pintado.`,
    bullets: [
      "Tabiques divisorios con aislamiento",
      "Falsos techos continuos y registrables",
      "Cajones para ocultar instalaciones",
      "Trasdosados de paredes",
      "Hornacinas y estanterías de obra",
      "Reparación de placas y grietas",
    ],
    faqs: [
      {
        q: "¿El pladur aísla bien del ruido?",
        a: "Con la configuración adecuada, sí. Combinamos placas con lana de roca u otros aislantes para mejorar notablemente el aislamiento acústico entre estancias.",
      },
      {
        q: "¿Se puede colgar una televisión o estanterías en un tabique de pladur?",
        a: "Sí, usando tacos específicos para placa de yeso o reforzando el interior del tabique en la zona de carga. Si sabemos de antemano qué vas a colgar, dejamos el refuerzo preparado.",
      },
      {
        q: "¿Cuánto se tarda en montar un tabique?",
        a: "Un tabique estándar de una habitación suele completarse en 1 o 2 días, incluyendo encintado y acabado listo para pintar.",
      },
      {
        q: "¿Genera mucha obra y suciedad?",
        a: "Es un sistema de construcción en seco: mucho más rápido y limpio que la obra tradicional. Protegemos la zona de trabajo y retiramos los restos al terminar.",
      },
    ],
    icon: "wall",
    metaTitle: "Pladur en Barcelona: tabiques y techos | FixArte BCN",
    metaDescription:
      "Montaje y reparación de pladur en Barcelona: tabiques, falsos techos, cajones y trasdosados. Acabados listos para pintar. Presupuesto sin compromiso.",
    schemaType: "GeneralContractor",
    order: 4,
  },
  {
    slug: "carpinteria-barcelona",
    title: "Carpintería",
    heroTitle: "Carpintería en Barcelona",
    shortDesc:
      "Instalación y ajuste de puertas, armarios, estanterías y todo tipo de trabajos de carpintería.",
    longDesc: `## Carpintería para tu hogar o negocio

Instalamos y reparamos puertas de paso, armarios, frentes de armario, estanterías, zócalos y todo tipo de elementos de madera. Trabajo preciso, herramientas profesionales y acabados cuidados.

## Puertas: instalación y ajuste

Colocamos puertas nuevas (con o sin premarco), cambiamos manillas y bisagras, y ajustamos puertas que rozan o no cierran bien por el uso o los movimientos del edificio.

## Armarios y almacenaje a medida

Montamos armarios empotrados, vestidores y estanterías aprovechando cada centímetro. También adaptamos interiores de armario con baldas, barras y cajoneras.`,
    bullets: [
      "Instalación y ajuste de puertas",
      "Armarios empotrados y vestidores",
      "Estanterías y almacenaje a medida",
      "Cambio de manillas y bisagras",
      "Zócalos y molduras",
      "Reparaciones de carpintería",
    ],
    faqs: [
      {
        q: "Mi puerta roza con el suelo, ¿tiene arreglo?",
        a: "Sí, casi siempre. Ajustamos bisagras, cepillamos la hoja o la recolocamos según el caso. Es una intervención rápida y económica.",
      },
      {
        q: "¿Hacéis muebles a medida?",
        a: "Montamos soluciones de almacenaje a medida con sistemas modulares de calidad y adaptamos armarios existentes. Para ebanistería artesanal compleja te orientamos sobre la mejor opción.",
      },
      {
        q: "¿Podéis cambiar solo las puertas sin obra?",
        a: "Sí. Si los marcos están en buen estado, sustituimos únicamente las hojas: renovación completa del piso en uno o dos días y sin obras.",
      },
      {
        q: "¿Instaláis puertas correderas?",
        a: "Sí, tanto sistemas vistos como encastados tipo casoneto (la puerta se esconde dentro del tabique), ideales para ganar espacio.",
      },
    ],
    icon: "hammer",
    metaTitle: "Carpintería en Barcelona: puertas y armarios | FixArte BCN",
    metaDescription:
      "Carpintero en Barcelona: instalación y ajuste de puertas, armarios, estanterías y reparaciones. Acabados profesionales y presupuesto sin compromiso.",
    schemaType: "GeneralContractor",
    order: 5,
  },
  {
    slug: "montaje-muebles-barcelona",
    title: "Montaje de muebles",
    heroTitle: "Montaje de muebles en Barcelona",
    shortDesc:
      "Montamos tus muebles de IKEA o de cualquier marca: rápido, sin daños y con todo anclado y nivelado.",
    longDesc: `## Tu mueble montado, nivelado y anclado

¿Muebles recién comprados y sin tiempo (o ganas) de pelearte con las instrucciones? Montamos muebles de IKEA, Leroy Merlin, Conforama y cualquier otra marca: armarios, camas, sofás, mesas, estanterías, escritorios y muebles de exterior.

## Seguridad ante todo

Anclamos a la pared los muebles altos (armarios, estanterías, cómodas) para evitar vuelcos —imprescindible con niños en casa—, usando la fijación adecuada para cada tipo de pared: ladrillo, pladur u hormigón.

## Montaje para empresas

Montamos mobiliario de oficina, comercios y consultas: mesas operativas, cajoneras, archivadores y recepciones, coordinándonos con tus horarios para no interrumpir la actividad.`,
    bullets: [
      "Muebles de IKEA y cualquier marca",
      "Armarios, camas y sofás",
      "Estanterías y escritorios",
      "Anclaje seguro a la pared",
      "Mobiliario de oficina",
      "Desmontaje y montaje en mudanzas",
    ],
    faqs: [
      {
        q: "¿Cuánto cuesta montar un mueble?",
        a: "Depende del tipo y tamaño del mueble. Envíanos por WhatsApp la referencia o una foto de la caja y te damos precio cerrado al momento.",
      },
      {
        q: "¿Montáis muebles PAX o armarios grandes de IKEA?",
        a: "Sí, es de lo que más montamos: armarios PAX con puertas correderas o batientes, interiores KOMPLEMENT y anclaje a pared incluido.",
      },
      {
        q: "¿Os lleváis el embalaje al terminar?",
        a: "Dejamos el embalaje plegado y listo para el punto de reciclaje. Si necesitas que lo retiremos, indícalo al pedir el presupuesto.",
      },
      {
        q: "¿Hacéis desmontaje y montaje para mudanzas?",
        a: "Sí. Desmontamos en origen, embalamos la tornillería identificada y volvemos a montar en destino, dejando cada mueble firme y nivelado.",
      },
    ],
    icon: "sofa",
    metaTitle: "Montaje de muebles en Barcelona | FixArte BCN",
    metaDescription:
      "Montaje de muebles en Barcelona y Badalona: IKEA y todas las marcas. Armarios, camas, estanterías y oficinas. Rápido, con anclaje seguro. Pide precio.",
    schemaType: "HomeAndConstructionBusiness",
    order: 6,
  },
  {
    slug: "instalacion-cocinas-barcelona",
    title: "Instalación de cocinas",
    heroTitle: "Instalación de cocinas en Barcelona",
    shortDesc:
      "Montaje completo de cocinas: muebles, encimera, electrodomésticos, fontanería y electricidad.",
    longDesc: `## Tu cocina instalada de principio a fin

Instalamos cocinas completas de IKEA y de cualquier fabricante: muebles altos y bajos, encimeras, zócalos, iluminación y electrodomésticos. Un solo equipo se encarga de todo, incluidas las conexiones de fontanería y electricidad.

## La ventaja de un equipo integral

Una cocina toca casi todos los oficios: nivelación de muebles, corte de encimera, tomas de agua y desagüe, conexión de placa y horno, campana extractora e iluminación. Al hacerlo todo el mismo equipo, evitas descoordinaciones y la cocina queda funcionando desde el primer día.

## Renovaciones parciales

¿No necesitas cambiarlo todo? Sustituimos encimeras, frentes, fregaderos, grifos o electrodomésticos concretos, renovando la cocina con una inversión contenida.`,
    bullets: [
      "Cocinas IKEA (METOD) y otras marcas",
      "Nivelación y montaje de muebles",
      "Encimeras y zócalos",
      "Conexión de agua y desagües",
      "Conexión de placa, horno y campana",
      "Iluminación de cocina",
    ],
    faqs: [
      {
        q: "¿Instaláis cocinas de IKEA?",
        a: "Sí, instalamos el sistema METOD completo: estructura, frentes, encimera, fregadero, grifo y electrodomésticos, con las conexiones incluidas.",
      },
      {
        q: "¿Cuánto se tarda en montar una cocina?",
        a: "Una cocina estándar suele instalarse en 2 a 4 días laborables, según metros, tipo de encimera y estado de las instalaciones existentes.",
      },
      {
        q: "¿Hacéis también la parte de agua y electricidad?",
        a: "Sí, es nuestra gran ventaja: el mismo equipo realiza las tomas de agua, desagües y conexiones eléctricas necesarias, con materiales homologados.",
      },
      {
        q: "¿Conectáis electrodomésticos de gas?",
        a: "La conexión de aparatos a gas debe realizarla una empresa habilitada de gas. Nosotros dejamos preparada la cocina y te orientamos para esa conexión; el resto de electrodomésticos los conectamos nosotros.",
      },
    ],
    icon: "kitchen",
    metaTitle: "Instalación de cocinas en Barcelona | FixArte BCN",
    metaDescription:
      "Montaje e instalación de cocinas en Barcelona: IKEA y todas las marcas, con fontanería y electricidad incluidas. Presupuesto cerrado sin compromiso.",
    schemaType: "GeneralContractor",
    order: 7,
  },
  {
    slug: "reparaciones-hogar-barcelona",
    title: "Reparaciones del hogar",
    heroTitle: "Reparaciones del hogar en Barcelona",
    shortDesc:
      "Un profesional de confianza para todas esas reparaciones pendientes: rápido, limpio y bien hecho.",
    longDesc: `## El profesional multiservicio que necesita tu casa

Persianas que no suben, grifos que gotean, puertas que rozan, cuadros por colgar, silicona ennegrecida, enchufes sueltos… En FixArte BCN resolvemos en una sola visita esa lista de pequeñas reparaciones que nunca encuentra hueco.

## Cómo funciona

Envíanos tu lista por WhatsApp (con fotos si puedes), te damos un presupuesto cerrado y agendamos una visita. Llegamos con las herramientas y materiales habituales para dejarlo todo resuelto el mismo día.

## Hogares, oficinas y locales

También damos servicio a oficinas, comercios y despachos: pequeñas reparaciones, colgado de elementos, ajustes de mobiliario y mantenimiento general sin interrumpir tu actividad.`,
    bullets: [
      "Reparación de persianas",
      "Colgar cuadros, lámparas y TV",
      "Cambio de silicona en baño y cocina",
      "Ajuste de puertas y ventanas",
      "Pequeñas reparaciones eléctricas",
      "Pequeñas reparaciones de fontanería",
    ],
    faqs: [
      {
        q: "¿Puedo agrupar varias reparaciones pequeñas en una sola visita?",
        a: "Sí, y es lo más rentable: agrupamos toda tu lista en una visita con un único desplazamiento. Envíanosla por WhatsApp y te damos precio cerrado.",
      },
      {
        q: "¿Reparáis persianas?",
        a: "Sí: cambio de cintas, lamas rotas, ejes y recogedores. Si la persiana no tiene arreglo, te proponemos la sustitución con presupuesto previo.",
      },
      {
        q: "¿Coláis una TV en la pared con la instalación oculta?",
        a: "Sí. Fijamos el soporte adecuado al tipo de pared y, si lo deseas, ocultamos el cableado con canaleta o empotrado.",
      },
      {
        q: "¿Dais servicio a tiendas y oficinas?",
        a: "Sí, con horarios flexibles para no interrumpir tu actividad, incluidos primeros turnos de mañana.",
      },
    ],
    icon: "wrench",
    metaTitle: "Reparaciones del hogar en Barcelona | FixArte BCN",
    metaDescription:
      "Manitas profesional en Barcelona: persianas, grifos, puertas, silicona, colgar TV y más. Todas tus reparaciones en una visita. Precio cerrado por WhatsApp.",
    schemaType: "HomeAndConstructionBusiness",
    order: 8,
  },
  {
    slug: "mantenimiento-comunidades-barcelona",
    title: "Mantenimiento de comunidades",
    heroTitle: "Mantenimiento de comunidades en Barcelona",
    shortDesc:
      "Mantenimiento preventivo y correctivo para comunidades de propietarios, edificios y empresas.",
    longDesc: `## Un único proveedor para toda la finca

Ofrecemos a comunidades de propietarios y administradores de fincas un servicio integral: electricidad de zonas comunes, fontanería, pintura de escaleras, pequeñas reparaciones y actuaciones urgentes. Un solo teléfono para resolverlo todo, con partes de trabajo documentados.

## Mantenimiento preventivo

Revisiones periódicas de iluminación, cuadros eléctricos, bombas de agua, bajantes y elementos comunes para detectar problemas antes de que se conviertan en averías costosas. Propuesta de plan de mantenimiento adaptado a cada finca.

## Mantenimiento correctivo y urgencias

Cuando surge una incidencia —una fuga en un bajante, un portal sin luz, un desperfecto en la escalera— respondemos con rapidez, informamos al administrador y documentamos la intervención con fotos del antes y el después.

## También para empresas

Oficinas, comercios y restaurantes: mantenimiento programado y bolsa de horas mensual para que tus instalaciones estén siempre a punto.`,
    bullets: [
      "Electricidad de zonas comunes",
      "Fontanería y bajantes",
      "Pintura de escaleras y portales",
      "Reparaciones y albañilería menor",
      "Atención de urgencias",
      "Partes de trabajo documentados",
    ],
    faqs: [
      {
        q: "¿Trabajáis con administradores de fincas?",
        a: "Sí, es parte esencial de nuestro servicio: canal directo con el administrador, presupuestos rápidos, partes de trabajo con fotos y facturación clara por comunidad.",
      },
      {
        q: "¿Ofrecéis contratos de mantenimiento?",
        a: "Sí, planes preventivos con visitas periódicas y condiciones preferentes en reparaciones, adaptados al tamaño y necesidades de cada finca o empresa.",
      },
      {
        q: "¿Atendéis urgencias en comunidades?",
        a: "Sí. Las incidencias que afectan a servicios esenciales de la finca (agua, luz de zonas comunes, filtraciones) se atienden con prioridad.",
      },
      {
        q: "¿Emitís factura y documentación de cada intervención?",
        a: "Siempre: factura, parte de trabajo y, cuando aplica, reportaje fotográfico del antes y el después para la comunidad o el administrador.",
      },
    ],
    icon: "building",
    metaTitle: "Mantenimiento de comunidades en Barcelona | FixArte BCN",
    metaDescription:
      "Mantenimiento integral de comunidades de propietarios en Barcelona: electricidad, fontanería, pintura y urgencias. Trabajamos con administradores de fincas.",
    schemaType: "HomeAndConstructionBusiness",
    order: 9,
  },
  {
    slug: "reformas-barcelona",
    title: "Reformas",
    heroTitle: "Reformas en Barcelona",
    shortDesc:
      "Reformas parciales de baños, cocinas y estancias, y adecuación de locales comerciales.",
    longDesc: `## Reformas con un equipo integral

Renovamos baños, cocinas y estancias completas coordinando todos los oficios: albañilería, fontanería, electricidad, pladur, carpintería y pintura. Un único interlocutor, un presupuesto claro y un plazo comprometido.

## Reformas de baño y cocina

Desde cambiar la bañera por un plato de ducha hasta renovar el baño o la cocina completos: alicatados, sanitarios, mamparas, muebles, grifería e iluminación, con materiales de calidad y acabados cuidados.

## Adecuación de locales

Preparamos locales comerciales, oficinas y consultas para su apertura o renovación: distribución con pladur, instalaciones, pintura e iluminación, ajustándonos a plazos de apertura.`,
    bullets: [
      "Reforma de baños",
      "Cambio de bañera por ducha",
      "Reforma de cocinas",
      "Renovación de estancias",
      "Adecuación de locales comerciales",
      "Coordinación integral de oficios",
    ],
    faqs: [
      {
        q: "¿Cuánto cuesta reformar un baño?",
        a: "Depende de los metros, calidades y alcance del cambio. Tras una visita técnica gratuita te entregamos un presupuesto cerrado por partidas, sin sorpresas.",
      },
      {
        q: "¿Cuánto se tarda en cambiar una bañera por un plato de ducha?",
        a: "Normalmente entre 2 y 4 días laborables, incluyendo retirada de la bañera, plato nuevo, alicatado de la zona y mampara.",
      },
      {
        q: "¿Os encargáis de todos los gremios?",
        a: "Sí. Coordinamos albañilería, fontanería, electricidad, pladur, carpintería y pintura con un único interlocutor y un calendario claro.",
      },
      {
        q: "¿Gestionáis los permisos de obra?",
        a: "Te orientamos sobre qué permisos requiere tu reforma según el municipio y te ayudamos con la documentación técnica necesaria.",
      },
    ],
    icon: "ruler",
    metaTitle: "Reformas en Barcelona: baños, cocinas y locales | FixArte BCN",
    metaDescription:
      "Reformas en Barcelona: baños, cocinas, estancias y locales comerciales. Equipo integral, presupuesto cerrado y plazos comprometidos. Visita gratuita.",
    schemaType: "GeneralContractor",
    order: 10,
  },
];

type PostSeed = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
};

const posts: PostSeed[] = [
  {
    slug: "como-prevenir-averias-electricas",
    title: "Cómo prevenir averías eléctricas en casa: 8 consejos prácticos",
    excerpt:
      "La mayoría de averías eléctricas domésticas se pueden evitar con revisiones sencillas y buenos hábitos. Estos son los consejos que damos a nuestros clientes.",
    content: `La mayoría de las averías eléctricas que atendemos podrían haberse evitado con pequeñas revisiones y buenos hábitos. Estos son los consejos que más repetimos a nuestros clientes en Barcelona y Badalona.

## 1. Prueba el diferencial una vez al mes

El diferencial es el interruptor que te protege de las descargas eléctricas. Pulsa el botón de "test" de tu cuadro una vez al mes: debe saltar de inmediato. Si no lo hace, llama a un electricista cuanto antes.

## 2. No sobrecargues las regletas

Conectar muchos aparatos de consumo alto (estufas, planchas, secadores) a una misma regleta calienta el cable y puede provocar un incendio. Los aparatos potentes, siempre a un enchufe de pared.

## 3. Vigila los enchufes que se calientan

Un enchufe o interruptor que se nota caliente, chisporrotea o huele a plástico quemado avisa de una conexión defectuosa. Deja de usarlo y haz que lo revisen: es una reparación rápida que evita males mayores.

## 4. Atención a las luces que parpadean

Si una zona de la casa parpadea o pierde intensidad al encender ciertos electrodomésticos, puede haber una conexión floja o un circuito sobrecargado. No lo normalices: revisarlo es barato, una avería mayor no.

## 5. Cuadros antiguos: mejor renovarlos

Si tu vivienda aún tiene un cuadro sin diferencial o con fusibles antiguos, estás sin las protecciones que hoy son obligatorias. Renovar el cuadro es una de las mejores inversiones en seguridad para tu familia.

## 6. Electrodomésticos con cables dañados, fuera

Cables pelados, doblados o con empalmes caseros de cinta aislante son una causa habitual de cortocircuitos. Sustituye el cable o el aparato.

## 7. En baños y cocinas, respeta las distancias

El agua y la electricidad no se llevan bien. No uses alargadores en zonas húmedas ni manipules aparatos enchufados con las manos mojadas.

## 8. Haz una revisión profesional periódica

Una revisión completa de la instalación cada pocos años detecta conexiones flojas, derivaciones y protecciones que no actúan. Es rápida y te da tranquilidad.

**¿Notas alguno de estos síntomas en tu instalación?** Escríbenos y un electricista de FixArte BCN la revisará y te dará una solución clara y sin compromiso.`,
    metaTitle: "Cómo prevenir averías eléctricas en casa | FixArte BCN",
    metaDescription:
      "8 consejos prácticos de electricista para prevenir averías eléctricas en casa: diferencial, regletas, enchufes calientes y cuándo renovar el cuadro.",
  },
  {
    slug: "evitar-atascos-tuberias",
    title: "Cómo evitar atascos en las tuberías de casa",
    excerpt:
      "Los atascos casi nunca aparecen de golpe: se forman poco a poco. Con estos hábitos alargarás la vida de tus desagües y evitarás visitas de urgencia.",
    content: `Los atascos casi nunca aparecen de golpe: se van formando durante meses. Con unos pocos hábitos puedes evitar la gran mayoría y ahorrarte una urgencia.

## En la cocina: el aceite es el enemigo número uno

El aceite y las grasas se solidifican dentro de la tubería y atrapan restos de comida hasta cerrar el paso del agua. Nunca los viertas por el fregadero: guárdalos en una botella y llévalos al punto de reciclaje. Usa siempre la rejilla del desagüe y tírala al cubo, no al fregadero.

## En el baño: pelos y toallitas

- **Pelos:** son la causa principal de atascos en duchas y lavabos. Una rejilla atrapapelos cuesta poco y evita casi todos.
- **Toallitas:** aunque el envase diga "desechables", no se deshacen como el papel. Tíralas siempre a la papelera. Son la causa número uno de atascos graves en bajantes comunitarios.
- **Restos de jabón:** una vez al mes, vierte agua muy caliente en el desagüe para arrastrar la película de jabón acumulada.

## Señales de que se acerca un atasco

El agua tarda más en irse, el desagüe hace glugluteos, o sube olor a tubería. Es el momento de actuar: resolverlo en esta fase es mucho más sencillo y barato que cuando el agua ya no baja.

## Lo que no recomendamos

Los productos químicos desatascadores agresivos pueden dañar tuberías antiguas y juntas, y rara vez eliminan el atasco de raíz: lo desplazan más adentro. Ante un atasco persistente, la solución profesional (desatasco mecánico) es definitiva y no daña la instalación.

## ¿Y en las comunidades?

Los bajantes comunitarios agradecen una revisión periódica, sobre todo en edificios antiguos. Detectar una obstrucción parcial a tiempo evita filtraciones y derramas mayores.

**¿El agua ya no baja o baja muy lenta?** Contacta con FixArte BCN: desatascamos fregaderos, duchas, inodoros y bajantes en Barcelona, Badalona y el área metropolitana.`,
    metaTitle: "Cómo evitar atascos en las tuberías | FixArte BCN",
    metaDescription:
      "Consejos de fontanero para evitar atascos en fregaderos, duchas y bajantes: qué no tirar por el desagüe, señales de aviso y cuándo llamar a un profesional.",
  },
  {
    slug: "mantenimiento-basico-hogar",
    title: "Mantenimiento básico del hogar: el calendario que te ahorra dinero",
    excerpt:
      "Revisar tu casa un par de veces al año evita la mayoría de averías caras. Te dejamos un calendario sencillo de mantenimiento preventivo.",
    content: `Una vivienda también necesita revisiones. Dedicarle un rato un par de veces al año evita la mayoría de las averías caras. Este es el calendario que recomendamos a nuestros clientes.

## Cada mes

- Pulsa el botón de **test del diferencial** del cuadro eléctrico: debe saltar.
- Revisa que no haya **humedad nueva** en techos y paredes (esquinas, detrás de muebles, bajo ventanas).

## Cada 3–6 meses

- **Silicona de ducha y bañera:** si está negra o despegada, sustitúyela. Es la primera barrera contra las filtraciones al vecino de abajo.
- **Grifos y cisternas:** un goteo constante puede suponer cientos de litros al mes. Se arregla rápido y se amortiza solo.
- **Filtros de la campana extractora:** límpialos o cámbialos; la grasa acumulada reduce la extracción y es inflamable.
- **Desagües:** agua muy caliente para arrastrar grasas y jabones (ver nuestro artículo sobre atascos).

## Una vez al año

- **Revisión de la caldera o termo** por un técnico, antes del invierno.
- **Juntas de ventanas:** si notas corriente con la ventana cerrada, la goma perimetral está gastada. Cambiarla mejora el aislamiento y la factura de calefacción.
- **Persianas:** engrasa los ejes y revisa las cintas antes de que se rompan.
- **Latiguillos de agua** (los tubos flexibles bajo fregadero y lavabo): si están oxidados o hinchados, sustitúyelos. Su rotura es una de las causas más comunes de inundación doméstica.

## Cada pocos años

- **Revisión de la instalación eléctrica** completa, sobre todo en pisos de más de 25 años.
- **Pintura de paredes y techos:** además de estética, la pintura protege el yeso y permite detectar grietas y humedades a tiempo.

## La regla de oro

Todo lo que gotea, parpadea, huele raro o se mueve **irá a peor**. Atenderlo pronto siempre es más barato que esperar a la avería.

**¿Prefieres que lo revisemos nosotros?** FixArte BCN ofrece visitas de mantenimiento para viviendas, oficinas y comunidades en Barcelona y alrededores. Pide tu presupuesto sin compromiso.`,
    metaTitle: "Calendario de mantenimiento básico del hogar | FixArte BCN",
    metaDescription:
      "Calendario práctico de mantenimiento preventivo del hogar: qué revisar cada mes, cada 6 meses y cada año para evitar averías caras en casa.",
  },
  {
    slug: "reparar-o-sustituir-instalaciones",
    title: "¿Reparar o sustituir? Guía rápida para decidir con cabeza",
    excerpt:
      "¿Merece la pena arreglar ese grifo, esa persiana o ese cuadro eléctrico, o es mejor cambiarlo? Los criterios que usamos los profesionales.",
    content: `Es la pregunta que más nos hacen: *"¿esto tiene arreglo o lo cambio?"*. No hay una respuesta única, pero sí criterios claros. Estos son los que usamos nosotros.

## La regla general: el 50 %

Si la reparación cuesta más de la mitad de lo que costaría el elemento nuevo instalado, y el elemento ya tiene años, suele compensar sustituir. Por debajo de ese umbral, reparar casi siempre gana.

## Grifería

- **Reparar:** un goteo por junta o cartucho gastado en un grifo de calidad.
- **Sustituir:** grifos con el cromado picado, cuerpos que pierden por varios puntos o modelos antiguos sin repuestos. Un monomando nuevo ahorra agua y evita averías en cadena.

## Persianas

- **Reparar:** cinta rota, recogedor o un par de lamas dañadas.
- **Sustituir:** ejes deformados o cajones en mal estado. Si vas a cambiar, valora el motor eléctrico: la diferencia de precio es menor de lo que parece.

## Cuadro eléctrico

Aquí no hay debate: un cuadro sin diferencial o con fusibles antiguos **se sustituye**. Es la protección de tu familia y de tu vivienda, y la normativa actual existe por buenas razones.

## Sanitarios y cisternas

- **Reparar:** mecanismos de descarga y flotadores (barato y rápido).
- **Sustituir:** tazas o lavabos con fisuras —una fisura siempre va a más— y cisternas antiguas de alto consumo.

## Electrodomésticos conectados a la instalación

En termos y calentadores, a partir de cierta edad las reparaciones se encadenan. Si el aparato supera los 10–12 años y la avería es del cuerpo o la resistencia, la sustitución suele salir más a cuenta que dos reparaciones seguidas.

## Nuestro compromiso

Cuando nos llames, te diremos con honestidad qué opción compensa en tu caso, con precio de ambas alternativas cuando tenga sentido. Preferimos un cliente bien asesorado que una reparación de más.

**¿Dudas con algún elemento de tu casa?** Envíanos una foto por WhatsApp y te orientamos sin compromiso.`,
    metaTitle: "¿Reparar o sustituir una instalación? Guía | FixArte BCN",
    metaDescription:
      "Criterios profesionales para decidir si reparar o sustituir grifos, persianas, cuadros eléctricos, sanitarios y termos. Consejos honestos de FixArte BCN.",
  },
];

async function main() {
  // Ajustes (solo se crean si no existen: el panel es la fuente de verdad después)
  for (const [key, value] of Object.entries(settings)) {
    await db.setting.upsert({
      where: { key },
      update: {},
      create: { key, value: value as object },
    });
  }

  // Servicios
  for (const s of services) {
    await db.service.upsert({
      where: { slug: s.slug },
      update: {
        title: s.title,
        heroTitle: s.heroTitle,
        shortDesc: s.shortDesc,
        longDesc: s.longDesc,
        bullets: s.bullets,
        faqs: s.faqs,
        icon: s.icon,
        metaTitle: s.metaTitle,
        metaDescription: s.metaDescription,
        schemaType: s.schemaType,
        order: s.order,
      },
      create: { ...s, bullets: s.bullets, faqs: s.faqs },
    });
  }

  // Artículos de consejos
  for (const p of posts) {
    await db.post.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
  }

  // Usuario del panel (solo si no existe ninguno)
  const adminCount = await db.adminUser.count();
  if (adminCount === 0) {
    const email = process.env.ADMIN_EMAIL || "contacto@fixartebcn.es";
    const password = process.env.ADMIN_PASSWORD;
    if (!password) {
      throw new Error("Falta ADMIN_PASSWORD en el entorno para crear el primer usuario del panel");
    }
    await db.adminUser.create({
      data: {
        email,
        name: "FixArte BCN",
        passwordHash: await bcrypt.hash(password, 12),
      },
    });
    console.log(`Usuario del panel creado: ${email}`);
  }

  console.log("Seed completado.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
