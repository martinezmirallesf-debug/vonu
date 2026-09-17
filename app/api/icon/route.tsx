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
          background: "#081f3a",
          borderRadius: "128px",
        }}
      >
        <svg viewBox="0 0 64 64" width="390" height="390" fill="none">
          <path d="M32 10.8 48 19v26L32 53.2 16 45V19L32 10.8Z" fill="#A7CAFF" stroke="#4DA3FF" strokeWidth="3.8" strokeLinejoin="round" />
          <path d="M23.5 21.5 32 17l8.5 4.5M20.5 28 32 22l11.5 6M20.5 36 32 42l11.5-6M23.5 42.5 32 47l8.5-4.5" stroke="#081F3A" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
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
