import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg,#080b12 0%,#0d1320 55%,#0b1714 100%)",
          color: "white",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ position: "absolute", width: 520, height: 520, borderRadius: 520, right: -70, top: -95, background: "rgba(52,211,153,.08)" }} />
        <div style={{ position: "absolute", width: 380, height: 380, borderRadius: 380, left: -120, bottom: -170, background: "rgba(56,189,248,.05)" }} />

        <div style={{ display: "flex", width: "100%", padding: "74px 82px", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column", width: 720 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 46 }}>
              <div style={{ display: "flex", width: 64, height: 64, border: "1px solid rgba(52,211,153,.28)", borderRadius: 18, alignItems: "center", justifyContent: "center", background: "rgba(52,211,153,.06)" }}>
                <svg viewBox="0 0 64 64" width="48" height="48" fill="none">
                  <path d="M32 6.1 54.1 17.6v28.8L32 57.9 9.9 46.4V17.6L32 6.1Z" fill="rgba(16,185,129,.035)" stroke="#34d399" strokeWidth="4.25" strokeLinejoin="round" />
                  <path d="M21.1 18 32 12.4 42.9 18M15.5 27.6 32 19.2l16.5 8.4M15.5 36.4 32 44.8l16.5-8.4M21.1 46 32 51.6 42.9 46" stroke="rgba(110,231,183,.52)" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-1.2px" }}>VONU</div>
            </div>

            <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.02, letterSpacing: "-3.6px" }}>
              Comprueba antes de confiar.
            </div>
            <div style={{ marginTop: 26, fontSize: 27, lineHeight: 1.45, color: "#a7b0bf" }}>
              Analiza URLs, capturas y mensajes sospechosos antes de pagar, responder o compartir datos.
            </div>
          </div>

          <div style={{ display: "flex", width: 260, height: 260, borderRadius: 130, alignItems: "center", justifyContent: "center", border: "1px solid rgba(52,211,153,.2)", boxShadow: "0 0 90px rgba(52,211,153,.12)" }}>
            <div style={{ display: "flex", width: 188, height: 188, borderRadius: 94, alignItems: "center", justifyContent: "center", border: "1px solid rgba(52,211,153,.28)", color: "#6ee7b7", fontSize: 24, fontWeight: 700, letterSpacing: "3px" }}>
              CHECK
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
