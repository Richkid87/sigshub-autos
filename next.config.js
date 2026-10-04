/** @type {import('next').NextConfig} */
const nextConfig = {
  // Prevent exposing client source maps in production
  productionBrowserSourceMaps: false,
  
  // Standalone output bundles necessary production dependencies for Hostinger & VPS deployment
  output: 'standalone',
  trailingSlash: true,
  
  // Security & performance optimizations
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,

  // Strip console logs in production (except errors and warnings)
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  images: {
    remotePatterns: [
      // Supabase storage (car images uploaded via admin)
      { protocol: 'https', hostname: '*.supabase.co' },
      // Google-hosted images used in seed data
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
}

module.exports = nextConfig
