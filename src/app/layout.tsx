import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { SITE_URL, SITE_NAME } from "@/lib/seo";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Reformas y Mantenimiento en Barcelona`,
    template: `%s`,
  },
  description:
    "Mantenimiento, reparaciones, instalaciones y reformas para hogares, empresas y comunidades en Barcelona, Badalona y el área metropolitana.",
  applicationName: SITE_NAME,
  formatDetection: { telephone: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  );
}
