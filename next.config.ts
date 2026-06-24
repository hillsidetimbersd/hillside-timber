import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the project root so Turbopack does not infer it from a stray
  // package-lock.json in a parent directory (which breaks tailwindcss resolution).
  turbopack: {
    root: import.meta.dirname,
  },
  // Keep this shared preview out of search engines so it cannot compete with
  // the live Squarespace store. Remove this headers() block to go fully public.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
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
