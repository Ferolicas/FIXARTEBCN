import { db } from "./db";

export type Contact = {
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  hours: string;
};

export type Social = {
  instagram: string;
  facebook: string;
  youtube: string;
  wallapop: string;
  milanuncios: string;
  linkedin: string;
  maps: string;
};

export type HomeContent = {
  heroKicker: string;
  heroTitle: string;
  heroText: string;
  whyTitle: string;
  why: { title: string; text: string }[];
};

export type AboutContent = {
  intro: string;
  mission: string;
  vision: string;
  values: string[];
};

export type EngineeringContent = {
  title: string;
  paragraphs: string[];
  items: { title: string; text: string }[];
};

export type EmergencyContent = {
  intro: string;
  body: string;
  zones: string[];
  outside: string;
};

export type FooterContent = { tagline: string };
export type EmailContent = { to: string[] };

const defaults: Record<string, unknown> = {
  contact: {
    phone: "+34634390345",
    phoneDisplay: "+34 634 39 03 45",
    whatsapp: "34634390345",
    email: "contacto@fixartebcn.es",
    address: "",
    city: "Barcelona",
    hours: "Lun–Dom",
  },
  social: { instagram: "", facebook: "", youtube: "", wallapop: "", milanuncios: "", linkedin: "", maps: "" },
  footer: { tagline: "FixArte BCN | Soluciones profesionales para hogares, empresas y comunidades." },
  email: { to: ["contacto@fixartebcn.es"] },
};

export async function getSetting<T>(key: string): Promise<T> {
  const row = await db.setting.findUnique({ where: { key } });
  return ((row?.value as T) ?? (defaults[key] as T)) as T;
}

export const getContact = () => getSetting<Contact>("contact");
export const getSocial = () => getSetting<Social>("social");
export const getHome = () => getSetting<HomeContent>("home");
export const getAbout = () => getSetting<AboutContent>("about");
export const getEngineering = () => getSetting<EngineeringContent>("engineering");
export const getEmergency = () => getSetting<EmergencyContent>("emergency");
export const getFooter = () => getSetting<FooterContent>("footer");
export const getEmailSettings = () => getSetting<EmailContent>("email");

export function waLink(whatsapp: string, text?: string) {
  const base = `https://wa.me/${whatsapp}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
