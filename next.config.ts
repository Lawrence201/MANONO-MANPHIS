import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'demos.codezeel.com',
      },
      {
        protocol: 'https',
        hostname: 'secure.gravatar.com',
      }
    ],
  },
};

export default nextConfig;
