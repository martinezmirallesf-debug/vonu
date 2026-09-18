import { ImageResponse } from "next/og";

export const runtime = "edge";

function TriNodeMark({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} fill="none">
      <g fill="#7bb7ff">
        <circle cx="24.6" cy="8.7" r="7.2" />
        <circle cx="8.6" cy="20.1" r="7.2" />
        <circle cx="25.1" cy="31.1" r="7.2" />
        <circle cx="18.7" cy="20.1" r="5.9" />
        <path d="M12.8 16.3 19.7 10.9 24.8 15.4 20.8 20.1 25.4 25.5 20.7 30.1 14.2 23.8Z" />
      </g>
    </svg>
  );
}

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
          background: "#020b24",
          color: "white",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ position: "absolute", width: 520, height: 520, borderRadius: 520, right: -110, top: -145, background: "rgba(123,183,255,.08)" }} />
        <div style={{ position: "absolute", width: 360, height: 360, borderRadius: 360, left: -150, bottom: -190, background: "rgba(123,183,255,.045)" }} />

        <div style={{ display: "flex", width: "100%", padding: "76px 84px", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column", width: 720, height: "100%", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
              <TriNodeMark size={76} />
              <div style={{ fontSize: 42, fontWeight: 750, letterSpacing: "-1.8px", color: "#ffffff" }}>VONU</div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ fontSize: 58, fontWeight: 740, lineHeight: 1.03, letterSpacing: "-2.8px", color: "#ffffff" }}>
                Comprueba antes de confiar.
              </div>
              <div style={{ fontSize: 25, lineHeight: 1.35, color: "#9fb1c5" }}>
                URLs, capturas y mensajes sospechosos, en un solo análisis.
              </div>
              <div style={{ fontSize: 23, color: "#7bb7ff", letterSpacing: ".2px" }}>vonuai.com</div>
            </div>
          </div>

          <div style={{ display: "flex", width: 310, height: 310, borderRadius: 155, alignItems: "center", justifyContent: "center", border: "1px solid rgba(123,183,255,.24)", background: "rgba(123,183,255,.045)" }}>
            <TriNodeMark size={232} />
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
