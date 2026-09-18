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
          background: "#020b24",
          borderRadius: "84px",
        }}
      >
        <svg viewBox="0 0 40 40" width="372" height="372" fill="none">
          <g fill="#7bb7ff">
            <circle cx="24.6" cy="8.7" r="7.2" />
            <circle cx="8.6" cy="20.1" r="7.2" />
            <circle cx="25.1" cy="31.1" r="7.2" />
            <circle cx="18.7" cy="20.1" r="5.9" />
            <path d="M12.8 16.3 19.7 10.9 24.8 15.4 20.8 20.1 25.4 25.5 20.7 30.1 14.2 23.8Z" />
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
