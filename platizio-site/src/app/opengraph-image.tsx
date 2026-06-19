import { ImageResponse } from "next/og";

export const alt = "Platizio — Become a SEBI Accredited Investor";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Site-wide default Open Graph image. No external font fetch (uses the default
// system font stack via inline styles) so the build can't fail on a network call.
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #7A2000, #C85A1E 55%, #E8854A)",
          fontFamily:
            "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 110,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "-2px",
            lineHeight: 1,
          }}
        >
          Platizio
        </div>

        <div
          style={{
            display: "flex",
            width: 220,
            height: 4,
            marginTop: 36,
            marginBottom: 36,
            borderRadius: 9999,
            background: "rgba(255, 248, 243, 0.65)",
          }}
        />

        <div
          style={{
            display: "flex",
            fontSize: 40,
            fontWeight: 500,
            color: "#fff8f3",
            textAlign: "center",
          }}
        >
          Become a SEBI Accredited Investor
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 26,
            color: "rgba(255, 248, 243, 0.78)",
            textAlign: "center",
          }}
        >
          Net Worth Certificate · NDML Accreditation
        </div>
      </div>
    ),
    { ...size },
  );
}
