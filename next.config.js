const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: path.resolve(__dirname)
  },
  // Vercel serverless optimizations
  reactStrictMode: true,
  compress: true,
  productionBrowserSourceMaps: false,
  // Enable automatic static optimization
  staticPageGenerationTimeout: 60,
  // Image optimization
  images: {
    unoptimized: false,
    minimumCacheTTL: 60 * 60 * 24 * 365 // 1 year
  },
  // Headers for performance
  async headers() {
    return [
      {
        source: "/public/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable"
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
