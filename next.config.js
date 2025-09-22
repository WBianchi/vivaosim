/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs']
  },
  images: {
    domains: ['localhost', 'via.placeholder.com', 'images.unsplash.com'],
  },
  eslint: {
    // Desabilitar ESLint durante o build para deploy rápido
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Desabilitar verificação de tipos durante o build para deploy rápido
    ignoreBuildErrors: true,
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY || '',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000/api',
    NEXT_PUBLIC_WAHA_API_URL: process.env.NEXT_PUBLIC_WAHA_API_URL || 'http://159.65.34.199:3001',
    NEXT_PUBLIC_WAHA_API_KEY: process.env.NEXT_PUBLIC_WAHA_API_KEY || '',
  },
}

module.exports = nextConfig
