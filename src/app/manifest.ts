import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FixArte BCN",
    short_name: "FixArte BCN",
    description: "Mantenimiento, reparaciones y reformas en Barcelona y Badalona",
    start_url: "/",
    display: "standalone",
    background_color: "#faf9f5",
    theme_color: "#0c1f33",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
