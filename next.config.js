/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost',
      'apiwhatsapp.vyzer.com.br',
      'api.deepseek.com'
    ],
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
