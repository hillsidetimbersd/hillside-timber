import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the project root so Turbopack does not infer it from a stray
  // package-lock.json in a parent directory (which breaks tailwindcss resolution).
  turbopack: {
    root: import.meta.dirname,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: '**.squarespace-cdn.com' },
      // Instagram Graph API CDN
      { protocol: 'https', hostname: '**.cdninstagram.com' },
      { protocol: 'https', hostname: '**.fbcdn.net' },
    ],
  },
};

export default nextConfig;
