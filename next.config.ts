import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['budokanryu.com.br', 'budokanryu.com.br:443'],
    },
  },
};

export default nextConfig;
