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
  poweredByHeader: false,
  compress: true,
};

module.exports = nextConfig;
