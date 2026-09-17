import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "512px",
          height: "512px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at 50% 42%, #0a2a55 0%, #061b3b 58%, #031329 100%)",
          borderRadius: "84px",
        }}
      >
        <svg viewBox="0 0 64 64" width="430" height="430" fill="none">
          <defs>
            <linearGradient id="vonuBlue" x1="14" y1="10" x2="50" y2="55" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#84d6ff" />
              <stop offset="100%" stopColor="#67a9ff" />
            </linearGradient>
          </defs>
          <g stroke="url(#vonuBlue)" strokeLinecap="round" strokeLinejoin="round">
            <path d="M32 8.5 52 20v24L32 55.5 12 44V20L32 8.5Z" strokeWidth="4.25" />
            <path d="M22 21 32 15.5 42 21" strokeWidth="3.55" />
            <path d="M20 27.5 32 20.8 44 27.5" strokeWidth="3.55" />
            <path d="M20 35.5 32 42.2 44 35.5" strokeWidth="3.55" />
            <path d="M22 42 32 47.5 42 42" strokeWidth="3.55" />
          </g>
        </svg>
      </div>
    ),
    {
      width: 512,
      height: 512,
      headers: { "Cache-Control": "public, max-age=86400, s-maxage=86400" },
    },
  );
}
