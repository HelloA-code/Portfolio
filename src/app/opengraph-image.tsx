import { ImageResponse } from "next/og";
import { albumTitle, profile } from "@/data/portfolio";

export const alt = `${albumTitle} by ${profile.name}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Album-cover style share card */
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 64,
          padding: 72,
          background: "#05050a",
          color: "#f5f5f7",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            width: 430,
            height: 430,
            borderRadius: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #22d3ee 0%, #8b5cf6 45%, #ff2d75 100%)",
            boxShadow: "0 0 120px rgba(139,92,246,0.55)",
            fontSize: 64,
            fontWeight: 800,
            letterSpacing: -3,
          }}
        >
          {albumTitle}
        </div>
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ fontSize: 22, color: "#22d3ee", letterSpacing: 4 }}>{"// NOW PLAYING"}</div>
          <div style={{ fontSize: 76, fontWeight: 800, letterSpacing: -3, lineHeight: 1.02, marginTop: 16 }}>{profile.name}</div>
          <div style={{ fontSize: 30, color: "rgba(245,245,247,0.65)", marginTop: 20, lineHeight: 1.3 }}>
            Full-stack, ML & embedded systems builder.
          </div>
          <div style={{ display: "flex", marginTop: 36 }}>
            <div style={{ background: "#ff2d75", color: "white", borderRadius: 999, padding: "14px 30px", fontSize: 26, fontWeight: 700 }}>▶ Play my resume</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
