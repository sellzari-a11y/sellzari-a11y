import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — Luxury Real Estate`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "#0B2545",
        color: "#FFFFFF",
      }}
    >
      <div style={{ fontSize: 24, letterSpacing: 6, textTransform: "uppercase", color: "#D9C3A5" }}>
        Luxury real estate — California
      </div>
      <div style={{ display: "flex", fontSize: 168, fontWeight: 700, letterSpacing: -8, lineHeight: 0.9 }}>
        {site.shortName}
        <span style={{ color: "#D9C3A5" }}>.</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, color: "rgba(255,255,255,0.8)" }}>
        <span>{site.tagline}</span>
        <span style={{ width: 120, height: 6, background: "#1D4ED8", marginTop: 14 }} />
      </div>
    </div>,
    size,
  );
}
