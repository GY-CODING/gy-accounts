/* eslint-disable no-undef */
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Expone PUBLIC_ROLES al cliente (por defecto Next solo expone las que empiezan por NEXT_PUBLIC_).
  // Roles visibles en el perfil, separados por comas; vacío = todos.
  env: {
    PUBLIC_ROLES: process.env.PUBLIC_ROLES ?? '',
  },
  images: {
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 's.gravatar.com',
      },
      {
        protocol: 'https',
        hostname: 'api.gycoding.com',
      },
    ],
  },
};

module.exports = nextConfig;
