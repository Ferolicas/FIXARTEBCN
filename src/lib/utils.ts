/** Convierte un texto a slug SEO: minúsculas, sin acentos/ñ, guiones. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ñ/g, "n")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Parsea un textarea con una entrada por línea. */
export function parseLines(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

/** Parsea bloques "P: pregunta / R: respuesta" de un textarea. */
export function parseFaqs(text: string): { q: string; a: string }[] {
  const faqs: { q: string; a: string }[] = [];
  let q = "";
  let a: string[] = [];
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (/^p\s*:/i.test(line)) {
      if (q && a.length) faqs.push({ q, a: a.join(" ") });
      q = line.replace(/^p\s*:/i, "").trim();
      a = [];
    } else if (/^r\s*:/i.test(line)) {
      a.push(line.replace(/^r\s*:/i, "").trim());
    } else if (line && a.length) {
      a.push(line);
    }
  }
  if (q && a.length) faqs.push({ q, a: a.join(" ") });
  return faqs;
}

/** Serializa faqs al formato editable del panel. */
export function faqsToText(faqs: { q: string; a: string }[]): string {
  return faqs.map((f) => `P: ${f.q}\nR: ${f.a}`).join("\n\n");
}

/** Parsea líneas "Título | texto" a objetos. */
export function parseTitledLines(text: string): { title: string; text: string }[] {
  return parseLines(text).map((l) => {
    const [title, ...rest] = l.split("|");
    return { title: title.trim(), text: rest.join("|").trim() };
  });
}

export function titledLinesToText(items: { title: string; text: string }[]): string {
  return items.map((i) => `${i.title} | ${i.text}`).join("\n");
}
