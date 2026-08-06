"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import {
  requireAdmin,
  createSessionToken,
  setSessionCookie,
  clearSessionCookie,
} from "@/lib/auth";
import { rateLimit } from "@/lib/ratelimit";
import { deleteUpload } from "@/lib/uploads";
import { slugify, parseLines, parseFaqs, parseTitledLines } from "@/lib/utils";

/** Revalida toda la web pública tras un cambio de contenido. */
function revalidateWeb() {
  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");
}

function str(form: FormData, key: string, max = 10000): string {
  return String(form.get(key) ?? "").trim().slice(0, max);
}

/** Lista de vídeos del panel: JSON [{src, poster}]. */
function parseVideos(raw: string): { src: string; poster: string }[] {
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr
      .filter((v) => v && typeof v.src === "string" && v.src.startsWith("/uploads/"))
      .map((v) => ({ src: String(v.src), poster: String(v.poster || "") }));
  } catch {
    return [];
  }
}

// ─────────────────────────────── AUTENTICACIÓN ───────────────────────────────

export async function loginAction(form: FormData) {
  const hdrs = await headers();
  const ip = (hdrs.get("x-forwarded-for") || "local").split(",")[0].trim();
  if (!rateLimit(`login:${ip}`, 8, 15 * 60 * 1000)) {
    redirect("/panel/login?error=rate");
  }

  const email = str(form, "email", 160).toLowerCase();
  const password = String(form.get("password") ?? "");
  const user = await db.adminUser.findUnique({ where: { email } });
  const ok = user && (await bcrypt.compare(password, user.passwordHash));
  if (!ok || !user) {
    redirect("/panel/login?error=credentials");
  }

  await setSessionCookie(await createSessionToken({ uid: user.id, email: user.email }));
  redirect("/panel");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/panel/login");
}

export async function changePasswordAction(form: FormData) {
  const session = await requireAdmin();
  const current = String(form.get("current") ?? "");
  const next = String(form.get("next") ?? "");
  if (next.length < 10) redirect("/panel/ajustes?error=pwd-short");

  const user = await db.adminUser.findUnique({ where: { id: session.uid } });
  if (!user || !(await bcrypt.compare(current, user.passwordHash))) {
    redirect("/panel/ajustes?error=pwd-current");
  }
  await db.adminUser.update({
    where: { id: user.id },
    data: { passwordHash: await bcrypt.hash(next, 12) },
  });
  redirect("/panel/ajustes?ok=pwd");
}

// ─────────────────────────────── SERVICIOS ───────────────────────────────

export async function saveServiceAction(form: FormData) {
  await requireAdmin();
  const id = Number(form.get("id") || 0);
  const title = str(form, "title", 120);
  const data = {
    title,
    slug: slugify(str(form, "slug", 120) || title),
    heroTitle: str(form, "heroTitle", 160) || title,
    shortDesc: str(form, "shortDesc", 400),
    longDesc: str(form, "longDesc", 20000),
    bullets: parseLines(str(form, "bullets", 4000)),
    faqs: parseFaqs(str(form, "faqs", 12000)),
    icon: str(form, "icon", 40) || "wrench",
    image: str(form, "image", 400) || null,
    metaTitle: str(form, "metaTitle", 70) || title,
    metaDescription: str(form, "metaDescription", 170),
    schemaType: str(form, "schemaType", 60) || "HomeAndConstructionBusiness",
    order: Number(form.get("order") || 0),
    published: form.get("published") === "on",
  };

  if (!title) redirect("/panel/servicios");

  if (id > 0) {
    await db.service.update({ where: { id }, data });
  } else {
    await db.service.create({ data });
  }
  revalidateWeb();
  redirect("/panel/servicios");
}

export async function deleteServiceAction(form: FormData) {
  await requireAdmin();
  const id = Number(form.get("id") || 0);
  const service = await db.service.findUnique({ where: { id } });
  if (service) {
    if (service.image) await deleteUpload(service.image);
    await db.service.delete({ where: { id } });
    revalidateWeb();
  }
  redirect("/panel/servicios");
}

// ─────────────────────────────── TRABAJOS ───────────────────────────────

export async function saveProjectAction(form: FormData) {
  await requireAdmin();
  const id = Number(form.get("id") || 0);
  const data = {
    title: str(form, "title", 160),
    category: str(form, "category", 80) || "General",
    description: str(form, "description", 2000),
    beforeImage: str(form, "beforeImage", 400) || null,
    afterImage: str(form, "afterImage", 400) || null,
    images: parseLines(str(form, "images", 4000)),
    videos: parseVideos(str(form, "videos", 20000)),
    featured: form.get("featured") === "on",
    published: form.get("published") === "on",
    order: Number(form.get("order") || 0),
  };
  if (!data.title) redirect("/panel/trabajos");

  if (id > 0) {
    await db.project.update({ where: { id }, data });
  } else {
    await db.project.create({ data });
  }
  revalidateWeb();
  redirect("/panel/trabajos");
}

export async function deleteProjectAction(form: FormData) {
  await requireAdmin();
  const id = Number(form.get("id") || 0);
  const project = await db.project.findUnique({ where: { id } });
  if (project) {
    for (const img of [project.beforeImage, project.afterImage, ...((project.images as string[]) || [])]) {
      if (img) await deleteUpload(img);
    }
    for (const v of (project.videos as { src: string; poster: string }[]) || []) {
      await deleteUpload(v.src);
      if (v.poster) await deleteUpload(v.poster);
    }
    await db.project.delete({ where: { id } });
    revalidateWeb();
  }
  redirect("/panel/trabajos");
}

// ─────────────────────────────── OPINIONES ───────────────────────────────

export async function saveTestimonialAction(form: FormData) {
  await requireAdmin();
  const id = Number(form.get("id") || 0);
  const data = {
    name: str(form, "name", 120),
    role: str(form, "role", 160),
    title: str(form, "title", 120),
    service: str(form, "service", 120),
    text: str(form, "text", 2000),
    rating: Math.min(5, Math.max(1, Number(form.get("rating") || 5))),
    published: form.get("published") === "on",
    order: Number(form.get("order") || 0),
  };
  if (!data.name || !data.text) redirect("/panel/opiniones");

  if (id > 0) {
    await db.testimonial.update({ where: { id }, data });
  } else {
    await db.testimonial.create({ data });
  }
  revalidateWeb();
  redirect("/panel/opiniones");
}

export async function toggleTestimonialAction(form: FormData) {
  await requireAdmin();
  const id = Number(form.get("id") || 0);
  const t = await db.testimonial.findUnique({ where: { id } });
  if (t) {
    await db.testimonial.update({ where: { id }, data: { published: !t.published } });
    revalidateWeb();
  }
  redirect("/panel/opiniones");
}

export async function deleteTestimonialAction(form: FormData) {
  await requireAdmin();
  const id = Number(form.get("id") || 0);
  const t = await db.testimonial.findUnique({ where: { id } });
  if (t?.photo) await deleteUpload(t.photo);
  await db.testimonial.deleteMany({ where: { id } });
  revalidateWeb();
  redirect("/panel/opiniones");
}

// ─────────────────────────────── CONSEJOS (BLOG) ───────────────────────────────

export async function savePostAction(form: FormData) {
  await requireAdmin();
  const id = Number(form.get("id") || 0);
  const title = str(form, "title", 160);
  const data = {
    title,
    slug: slugify(str(form, "slug", 120) || title),
    excerpt: str(form, "excerpt", 400),
    content: str(form, "content", 60000),
    coverImage: str(form, "coverImage", 400) || null,
    metaTitle: str(form, "metaTitle", 70),
    metaDescription: str(form, "metaDescription", 170),
    published: form.get("published") === "on",
  };
  if (!title) redirect("/panel/consejos");

  if (id > 0) {
    await db.post.update({ where: { id }, data });
  } else {
    await db.post.create({ data });
  }
  revalidateWeb();
  redirect("/panel/consejos");
}

export async function deletePostAction(form: FormData) {
  await requireAdmin();
  const id = Number(form.get("id") || 0);
  const post = await db.post.findUnique({ where: { id } });
  if (post) {
    if (post.coverImage) await deleteUpload(post.coverImage);
    await db.post.delete({ where: { id } });
    revalidateWeb();
  }
  redirect("/panel/consejos");
}

// ─────────────────────────────── SOLICITUDES ───────────────────────────────

export async function updateLeadAction(form: FormData) {
  await requireAdmin();
  const id = Number(form.get("id") || 0);
  const status = String(form.get("status") || "");
  const notes = form.get("notes");
  const data: { status?: "NUEVO" | "EN_CURSO" | "CERRADO"; notes?: string } = {};
  if (status === "NUEVO" || status === "EN_CURSO" || status === "CERRADO") data.status = status;
  if (typeof notes === "string") data.notes = notes.trim().slice(0, 4000);
  if (Object.keys(data).length > 0) {
    await db.lead.update({ where: { id }, data });
  }
  redirect("/panel/solicitudes");
}

export async function deleteLeadAction(form: FormData) {
  await requireAdmin();
  const id = Number(form.get("id") || 0);
  const lead = await db.lead.findUnique({ where: { id } });
  if (lead) {
    for (const photo of (lead.photos as string[]) || []) {
      await deleteUpload(photo);
    }
    await db.lead.delete({ where: { id } });
  }
  redirect("/panel/solicitudes");
}

// ─────────────────────────────── CONTENIDO / AJUSTES ───────────────────────────────

async function saveSetting(key: string, value: object) {
  await db.setting.upsert({ where: { key }, update: { value }, create: { key, value } });
}

export async function saveContactAction(form: FormData) {
  await requireAdmin();
  const phoneDisplay = str(form, "phoneDisplay", 30);
  const phone = "+" + phoneDisplay.replace(/[^0-9]/g, "");
  await saveSetting("contact", {
    phone,
    phoneDisplay,
    whatsapp: str(form, "whatsapp", 20).replace(/[^0-9]/g, ""),
    email: str(form, "email", 160),
    address: str(form, "address", 300),
    city: str(form, "city", 80) || "Barcelona",
    hours: str(form, "hours", 160),
  });
  revalidateWeb();
  redirect("/panel/ajustes?ok=contact");
}

export async function saveSocialAction(form: FormData) {
  await requireAdmin();
  await saveSetting("social", {
    instagram: str(form, "instagram", 300),
    facebook: str(form, "facebook", 300),
    youtube: str(form, "youtube", 300),
    wallapop: str(form, "wallapop", 300),
    milanuncios: str(form, "milanuncios", 300),
    linkedin: str(form, "linkedin", 300),
    maps: str(form, "maps", 500),
  });
  revalidateWeb();
  redirect("/panel/ajustes?ok=social");
}

export async function saveEmailAction(form: FormData) {
  await requireAdmin();
  const to = str(form, "to", 600)
    .split(",")
    .map((e) => e.trim())
    .filter((e) => /.+@.+\..+/.test(e));
  await saveSetting("email", { to });
  redirect("/panel/ajustes?ok=email");
}

export async function saveHomeAction(form: FormData) {
  await requireAdmin();
  await saveSetting("home", {
    heroKicker: str(form, "heroKicker", 120),
    heroTitle: str(form, "heroTitle", 200),
    heroText: str(form, "heroText", 1500),
    whyTitle: str(form, "whyTitle", 160),
    why: parseTitledLines(str(form, "why", 4000)),
  });
  revalidateWeb();
  redirect("/panel/contenido?ok=home");
}

export async function saveAboutAction(form: FormData) {
  await requireAdmin();
  await saveSetting("about", {
    intro: str(form, "intro", 4000),
    mission: str(form, "mission", 1500),
    vision: str(form, "vision", 1500),
    values: parseLines(str(form, "values", 1500)),
  });
  revalidateWeb();
  redirect("/panel/contenido?ok=about");
}

export async function saveEngineeringAction(form: FormData) {
  await requireAdmin();
  await saveSetting("engineering", {
    title: str(form, "title", 160) || "Ingeniería y soluciones técnicas",
    paragraphs: str(form, "paragraphs", 6000)
      .split("\n\n")
      .map((p) => p.trim())
      .filter(Boolean),
    items: parseTitledLines(str(form, "items", 4000)),
  });
  revalidateWeb();
  redirect("/panel/contenido?ok=engineering");
}

export async function saveEmergencyAction(form: FormData) {
  await requireAdmin();
  await saveSetting("emergency", {
    intro: str(form, "intro", 1500),
    body: str(form, "body", 2500),
    zones: parseLines(str(form, "zones", 1500)),
    outside: str(form, "outside", 800),
  });
  revalidateWeb();
  redirect("/panel/contenido?ok=emergency");
}

export async function saveFooterAction(form: FormData) {
  await requireAdmin();
  await saveSetting("footer", { tagline: str(form, "tagline", 300) });
  revalidateWeb();
  redirect("/panel/contenido?ok=footer");
}
