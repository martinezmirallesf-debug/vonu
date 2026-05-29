import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    position: "bottom-right",
  },

  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "app.vonuai.com",
          },
        ],
        destination: "https://vonuai.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;