import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nlc-db.pockethost.io',
        pathname: '/api/files/**',
      },
    ],
  },
};

export default nextConfig;
