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
                  <path d="M32 10 46.5 18.5v17L32 44 17.5 35.5v-17L32 10Z" fill="rgba(16,185,129,.08)" stroke="#34d399" strokeWidth="2.8" strokeLinejoin="round" />
                  <path d="M32 14.3 41.6 19.7 32 25.1l-9.6-5.4L32 14.3Z" stroke="#6ee7b7" strokeWidth="1.8" />
                  <path d="M22.4 19.7v10.7L32 35.8l9.6-5.4V19.7M32 25.1v10.7" stroke="rgba(110,231,183,.7)" strokeWidth="1.8" />
                  <path d="M32 6.2c3 0 5.1 1.7 5.1 4.1 0 1.5-.8 2.7-2 3.4h-6.2c-1.3-.7-2-1.9-2-3.4 0-2.4 2.1-4.1 5.1-4.1Z" fill="#34d399" />
                  <path d="M15 22.4 9.7 20c-2-.9-4.4.7-3.9 3 .4 2.1 2.4 3.3 4.4 2.6l5-1.7M49 22.4l5.3-2.4c2-.9 4.4.7 3.9 3-.4 2.1-2.4 3.3-4.4 2.6l-5-1.7" stroke="#34d399" strokeWidth="2.3" strokeLinecap="round" />
                  <path d="M20.2 36.8 15.8 41.4c-1.6 1.6-.8 4.4 1.4 4.9 1.9.4 3.7-.7 4.3-2.5l1.6-4.8M43.8 36.8l4.4 4.6c1.6 1.6.8 4.4-1.4 4.9-1.9.4-3.7-.7-4.3-2.5L40.9 39" stroke="#34d399" strokeWidth="2.3" strokeLinecap="round" />
                </svg>
              </div>
              <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-1.4px" }}>VONU</div>
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
