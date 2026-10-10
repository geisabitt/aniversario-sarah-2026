import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["54.232.189.113"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;

