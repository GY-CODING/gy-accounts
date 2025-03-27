/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Ignorar warnings específicos
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  // Silenciar warnings específicos
  onDemandEntries: {
    // Silenciar warnings de cookies
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  experimental: {
    // Desactivar warnings de cookies en rutas de API
    serverActions: {
      bodySizeLimit: "2mb",
      allowedOrigins: ["localhost:3000"],
      allowedHeaders: ["content-type", "authorization"],
      allowedMethods: ["GET", "POST"],
    },
  },
  images: {
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "s.gravatar.com",
      },
      {
        protocol: "https",
        hostname: "api.gycoding.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
