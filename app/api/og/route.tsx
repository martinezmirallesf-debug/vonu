import { ImageResponse } from "next/og";
import { OFFICIAL_VONU_PATH } from "@/app/components/VonuMark";

export const runtime = "edge";

/**
 * Main social preview.
 * VONÜ's actual mark comes directly from app/components/VonuMark.tsx.
 * No artificial certification badges or fabricated UI/scan results.
 */
const COPY = {
  es: {
    lines: ["COMPRUEBA", "ANTES DE", "CONFIAR."],
    subjects: "URLS  ·  CAPTURAS  ·  MENSAJES  ·  DOCUMENTOS",
  },
  en: {
    lines: ["CHECK", "BEFORE YOU", "TRUST."],
    subjects: "URLS  ·  SCREENSHOTS  ·  MESSAGES  ·  DOCUMENTS",
  },
} as const;

function OfficialMark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 2000 2000" aria-hidden="true">
      <path d={OFFICIAL_VONU_PATH} fill="#7bb7ff" />
    </svg>
  );
}

function OrbitArtwork() {
  return (
    <svg width="500" height="520" viewBox="0 0 500 520" aria-hidden="true">
      {[225, 204, 181].map((r, i) => (
        <circle
          key={r}
          cx="250"
          cy="260"
          r={r}
          fill="none"
          stroke="#7bb7ff"
          strokeWidth={i === 0 ? 1.3 : 1}
          strokeOpacity={i === 0 ? 0.39 : i === 1 ? 0.28 : 0.20}
        />
      ))}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
        <line
          key={i}
          x1={50 + 38 * i}
          x2={50 + 38 * i}
          y1="0"
          y2="520"
          stroke="#7bb7ff"
          strokeWidth="1"
          strokeOpacity="0.09"
        />
      ))}
      {[
        [412, 80, 1.8], [44, 284, 1.8], [76, 151, 3.2],
        [410, 417, 2.2], [463, 348, 2.7], [111, 454, 1.8],
        [224, 44, 1.7], [342, 472, 1.6],
      ].map(([x, y, radius], i) => (
        <circle key={i} cx={x} cy={y} r={radius} fill="#7bb7ff" opacity="0.65" />
      ))}
    </svg>
  );
}

export async function GET(request: Request) {
  const lang = new URL(request.url).searchParams.get("lang") === "en" ? "en" : "es";
  const copy = COPY[lang];

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          width: 1200,
          height: 630,
          overflow: "hidden",
          background: "linear-gradient(112deg, #020b24 0%, #04102d 54%, #071b42 100%)",
          color: "#fff",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            display: "flex",
            right: -64,
            top: 44,
            width: 620,
            height: 520,
            background: "radial-gradient(ellipse at center, rgba(52,116,214,.23) 0%, rgba(7,27,66,.05) 65%, rgba(7,27,66,0) 100%)",
          }}
        />
        <div
          style={{ position: "absolute", display: "flex", right: -8, top: 10, width: 500, height: 520 }}
        >
          <OrbitArtwork />
        </div>

        <div
          style={{
            position: "absolute",
            display: "flex",
            alignItems: "center",
            top: 48,
            left: 68,
            gap: 12,
          }}
        >
          <OfficialMark size={55} />
          <div style={{ fontSize: 43, fontWeight: 750, letterSpacing: "-1.8px", color: "#fff" }}>Vonü</div>
        </div>

        <div
          style={{
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            left: 80,
            top: lang === "es" ? 199 : 190,
            width: 650,
          }}
        >
          {copy.lines.map((line, index) => (
            <div
              key={line}
              style={{
                display: "flex",
                fontWeight: 800,
                fontSize: lang === "es" ? (index === 2 ? 77 : 69) : (index === 1 ? 66 : 78),
                lineHeight: lang === "es" ? 1.08 : 1.06,
                letterSpacing: "-3.6px",
                color: index === 2 ? "#7bb7ff" : "#ffffff",
                whiteSpace: "nowrap",
              }}
            >
              {line}
            </div>
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            display: "flex",
            left: 80,
            top: 466,
            color: "#a3b8da",
            letterSpacing: "0.25px",
            fontSize: lang === "es" ? 20 : 19,
            fontWeight: 600,
          }}
        >
          {copy.subjects}
        </div>

        <div
          style={{
            position: "absolute",
            display: "flex",
            right: 64,
            top: 127,
            width: 370,
            height: 370,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <OfficialMark size={364} />
        </div>

        <div
          style={{
            position: "absolute",
            display: "flex",
            left: 80,
            right: 80,
            bottom: 82,
            borderBottom: "1px solid rgba(143,175,223,.3)",
          }}
        />

        <div
          style={{
            position: "absolute",
            display: "flex",
            bottom: 37,
            left: 80,
            color: "#7bb7ff",
            fontSize: 23,
            fontWeight: 650,
          }}
        >
          vonuai.com
        </div>

        <div
          style={{
            position: "absolute",
            display: "flex",
            bottom: 41,
            right: 82,
            color: "#8298be",
            fontSize: 17,
            letterSpacing: ".5px",
          }}
        >
          CHECK BEFORE YOU TRUST
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400" },
    },
  );
}
