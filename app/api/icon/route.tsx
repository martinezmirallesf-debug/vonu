import { ImageResponse } from "next/og";

export const runtime = "edge";

const MARK_PATH = "M 27.92 2.00 L 27.83 2.27 L 26.68 2.62 L 25.00 3.59 L 23.76 4.92 L 23.49 5.54 L 23.23 5.80 L 22.61 8.01 L 22.61 9.43 L 22.79 10.05 L 22.79 11.73 L 22.61 12.44 L 21.99 13.68 L 20.93 14.83 L 19.96 15.44 L 18.89 15.89 L 17.13 16.06 L 16.15 15.89 L 13.94 14.65 L 11.73 13.94 L 9.70 13.94 L 8.81 14.12 L 7.13 14.74 L 5.63 15.80 L 4.83 16.59 L 4.12 17.66 L 3.50 19.25 L 3.24 19.34 L 3.24 22.61 L 3.50 22.70 L 4.03 24.11 L 4.74 25.26 L 5.63 26.15 L 6.42 26.77 L 7.57 27.39 L 9.43 27.92 L 11.46 27.92 L 12.97 27.56 L 14.65 26.77 L 16.42 25.44 L 18.01 24.82 L 19.96 24.73 L 21.02 25.09 L 22.43 26.24 L 22.96 27.21 L 23.05 29.15 L 22.70 30.30 L 22.70 32.43 L 23.05 33.67 L 23.94 35.26 L 25.09 36.41 L 26.94 37.47 L 27.83 37.73 L 27.92 38.00 L 31.19 38.00 L 31.28 37.73 L 32.16 37.47 L 33.75 36.58 L 34.99 35.52 L 35.79 34.55 L 36.50 32.87 L 36.76 32.78 L 36.76 29.24 L 36.41 29.07 L 35.43 27.03 L 34.02 25.71 L 32.52 24.82 L 31.19 24.47 L 30.39 24.47 L 28.89 23.85 L 27.92 22.96 L 27.47 22.34 L 26.94 21.02 L 26.94 19.07 L 27.47 17.66 L 28.80 16.24 L 29.86 15.71 L 31.19 15.53 L 32.52 15.09 L 34.20 14.03 L 35.17 13.06 L 36.14 11.20 L 36.50 9.43 L 36.76 9.34 L 36.76 8.46 L 36.50 8.37 L 36.23 6.95 L 35.52 5.27 L 34.99 4.57 L 33.75 3.42 L 32.52 2.71 L 31.01 2.27 L 30.92 2.00 Z";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requested = Number(searchParams.get("size"));
  const size = requested === 192 ? 192 : 512;
  const markSize = Math.round(size * 0.727);
  const radius = Math.round(size * 0.164);

  return new ImageResponse(
    (
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#020b24",
          borderRadius: `${radius}px`,
        }}
      >
        <svg viewBox="0 0 40 40" width={markSize} height={markSize} fill="none">
          <path d={MARK_PATH} fill="#7bb7ff" />
        </svg>
      </div>
    ),
    {
      width: size,
      height: size,
      headers: { "Cache-Control": "public, max-age=86400, s-maxage=86400" },
    },
  );
}
