import type { Metadata } from "next";
import Image from "next/image";
import { db } from "@/lib/db";
import { getContact } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { Icon } from "@/components/site/Icons";
import { ReviewForm } from "@/components/site/ReviewForm";

export const revalidate = 600;

export const metadata: Metadata = pageMetadata({
  title: "Deja tu reseña | FixArte BCN",
  description: "¿Has trabajado con FixArte BCN? Cuéntanos tu experiencia: tu opinión ayuda a otros vecinos de Barcelona.",
  path: "/opinar",
  noIndex: true,
});

export default async function OpinarPage() {
  const [services, contact] = await Promise.all([
    db.service.findMany({ where: { published: true }, orderBy: { order: "asc" }, select: { title: true } }),
    getContact(),
  ]);

  return (
    <section className="container-site py-16 sm:py-24">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <Image src="/logo.webp" alt="FixArte BCN" width={140} height={140} className="mx-auto h-24 w-24" />
          <p className="slash-gold mt-4">Tu opinión</p>
          <h1 className="mt-4 text-4xl leading-[1.1] sm:text-5xl">¿Qué tal fue nuestro trabajo?</h1>
          <p className="mt-4 font-medium leading-relaxed text-noir">
            Gracias por confiar en nosotros. Contarnos tu experiencia nos lleva un minuto y ayuda a otras personas,
            empresas y comunidades de Barcelona a decidir con confianza.
          </p>
        </div>

        <div className="mt-10">
          <ReviewForm services={services} whatsapp={contact.whatsapp} />
        </div>

        <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs font-medium text-noir/70">
          <Icon name="shield" className="h-4 w-4 text-gold-700" />
          Revisamos cada reseña antes de publicarla para evitar mensajes falsos o spam.
        </p>
      </div>
    </section>
  );
}
