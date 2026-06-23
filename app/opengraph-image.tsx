import { ImageResponse } from "next/og";
import { brand, seoContent } from "@/content/contentBible";

export const alt = seoContent.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Dark + neon brand card (Blueprint §7.2). Self-contained — no asset deps. */
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0a0a0f",
        backgroundImage:
          "radial-gradient(60% 60% at 25% 20%, rgba(0,191,255,0.22), transparent 60%), radial-gradient(60% 60% at 80% 80%, rgba(167,139,250,0.22), transparent 60%)",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          fontSize: 150,
          fontWeight: 700,
          letterSpacing: "-0.03em",
          background: "linear-gradient(100deg, #00bfff, #a78bfa, #34d399)",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        {brand.name}
      </div>
      <div style={{ marginTop: 16, fontSize: 44, color: "#f2f4ff" }}>{brand.tagline}</div>
    </div>,
    { ...size },
  );
}
