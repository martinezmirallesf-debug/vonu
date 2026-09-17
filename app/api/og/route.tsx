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
          background: "linear-gradient(135deg,#020b24 0%,#07142f 55%,#0d1b3d 100%)",
          color: "white",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ position: "absolute", width: 560, height: 560, borderRadius: 560, right: -80, top: -110, background: "rgba(123,183,255,.10)" }} />
        <div style={{ position: "absolute", width: 390, height: 390, borderRadius: 390, left: -125, bottom: -180, background: "rgba(142,194,255,.055)" }} />

        <div style={{ display: "flex", width: "100%", padding: "74px 82px", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column", width: 690, height: "100%", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ display: "flex", width: 68, height: 68, border: "1px solid rgba(123,183,255,.30)", borderRadius: 19, alignItems: "center", justifyContent: "center", background: "rgba(123,183,255,.07)" }}>
                <svg viewBox="0 0 64 64" width="50" height="50" fill="none">
                  <path d="M32 10.8 48 19v26L32 53.2 16 45V19L32 10.8Z" fill="#A7CAFF" stroke="#4DA3FF" strokeWidth="3.8" strokeLinejoin="round" />
                  <path d="M23.5 21.5 32 17l8.5 4.5M20.5 28 32 22l11.5 6M20.5 36 32 42l11.5-6M23.5 42.5 32 47l8.5-4.5" stroke="#081F3A" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-1.6px" }}>VONU</div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div style={{ display: "flex", gap: 16 }}>
                {["↗", "▣", "≡", "✓"].map((symbol) => (
                  <div
                    key={symbol}
                    style={{
                      width: 92,
                      height: 92,
                      borderRadius: 26,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid rgba(123,183,255,.20)",
                      background: "rgba(123,183,255,.055)",
                      color: "#A7CAFF",
                      fontSize: 36,
                      fontWeight: 700,
                    }}
                  >
                    {symbol}
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 25, color: "#9fb1c5", letterSpacing: ".3px" }}>vonuai.com</div>
            </div>
          </div>

          <div style={{ display: "flex", width: 304, height: 304, borderRadius: 152, alignItems: "center", justifyContent: "center", border: "1px solid rgba(123,183,255,.25)", boxShadow: "0 0 100px rgba(123,183,255,.18)" }}>
            <div style={{ display: "flex", width: 224, height: 224, borderRadius: 72, alignItems: "center", justifyContent: "center", border: "2px solid rgba(77,163,255,.42)", background: "rgba(123,183,255,.055)" }}>
              <svg viewBox="0 0 64 64" width="158" height="158" fill="none">
                <path d="M32 10.8 48 19v26L32 53.2 16 45V19L32 10.8Z" fill="#A7CAFF" stroke="#4DA3FF" strokeWidth="3.8" strokeLinejoin="round" />
                <path d="M23.5 21.5 32 17l8.5 4.5M20.5 28 32 22l11.5 6M20.5 36 32 42l11.5-6M23.5 42.5 32 47l8.5-4.5" stroke="#081F3A" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: { "Cache-Control": "public, max-age=3600, s-maxage=3600" },
    },
  );
}
