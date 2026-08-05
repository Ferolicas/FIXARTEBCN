import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { FloatingCta } from "@/components/site/FloatingCta";
import { JsonLd, localBusinessSchema } from "@/lib/seo";
import { getContact, getSocial } from "@/lib/content";

export const revalidate = 600;

export default async function WebLayout({ children }: { children: React.ReactNode }) {
  const [contact, social] = await Promise.all([getContact(), getSocial()]);

  return (
    <>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-ink-900 focus:px-4 focus:py-2 focus:text-white"
      >
        Saltar al contenido
      </a>
      <JsonLd data={localBusinessSchema(contact, social)} />
      <Header />
      <main id="contenido">{children}</main>
      <Footer />
      <FloatingCta phone={contact.phone} whatsapp={contact.whatsapp} />
    </>
  );
}
