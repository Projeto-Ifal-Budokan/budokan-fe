/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        'budokanryu.com.br',
        'budokanryu.com.br:443',
        'https://budokanryu.com.br',
        'https://budokanryu.com.br:443',
      ],
      bodySizeLimit: '2mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'budokanryu.com.br',
      },
      {
        protocol: 'https',
        hostname: 'strapi.budokanryu.com.br',
      },
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
  poweredByHeader: false,
  compress: true,
};

module.exports = nextConfig;
