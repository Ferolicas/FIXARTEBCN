import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

/* Rastreadores de los buscadores con IA. Se listan explícitamente porque
   varios de ellos NO siguen la regla genérica "*": si no aparecen por su
   nombre, algunos no rastrean, y sin rastreo la web no puede salir citada
   cuando alguien pregunta "fontanero en Barcelona" a una IA. */
const BOTS_IA = [
  "GPTBot", // entrenamiento de OpenAI
  "OAI-SearchBot", // búsqueda de ChatGPT
  "ChatGPT-User", // navegación a petición del usuario
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended", // Gemini / resúmenes con IA de Google
  "Applebot",
  "Applebot-Extended",
  "Bingbot",
  "Amazonbot",
  "meta-externalagent",
  "cohere-ai",
  "YouBot",
];

export default function robots(): MetadataRoute.Robots {
  const bloqueado = ["/panel", "/panel/", "/api/"];

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: bloqueado },
      ...BOTS_IA.map((userAgent) => ({ userAgent, allow: "/", disallow: bloqueado })),
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/").replace(/\/$/, ""),
  };
}
