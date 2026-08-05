import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "watckq5u97.ufs.sh" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
    ]
  },
  devIndicators: false,
  typescript: {
    ignoreBuildErrors: true
  },
  turbopack: {},
  cacheComponents: true,
  serverExternalPackages: [
    '@lancedb/lancedb',
    '@mastra/lance',
    // Add the platform-specific binary package explicitly
    '@lancedb/lancedb-win32-x64-msvc',
    'playwright-core',
    'playwright',
    'playwright-chromium'
  ],

}

export default nextConfig