import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import path from "path";

export const alt = "FixArte BCN — Reformas y mantenimiento en Barcelona";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  let logoSrc = "";
  try {
    const buf = await readFile(path.join(process.cwd(), "public", "logo.jpg"));
    logoSrc = `data:image/jpeg;base64,${buf.toString("base64")}`;
  } catch {}

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 64,
          background: "linear-gradient(135deg, #0c1f33 0%, #1b3a5c 100%)",
          padding: 80,
        }}
      >
        {logoSrc && (
          <img
            src={logoSrc}
            width={300}
            height={300}
            style={{ borderRadius: 32 }}
            alt=""
          />
        )}
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 640 }}>
          <div style={{ display: "flex", fontSize: 72, fontWeight: 800, color: "#ffffff" }}>
            FixArte&nbsp;<span style={{ color: "#ee8722" }}>BCN</span>
          </div>
          <div style={{ display: "flex", marginTop: 20, fontSize: 32, color: "#dce7f2", lineHeight: 1.4 }}>
            Soluciones profesionales para tu hogar, negocio y comunidad
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 24, color: "#ee8722", fontWeight: 700 }}>
            Barcelona · Badalona · Área metropolitana
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
