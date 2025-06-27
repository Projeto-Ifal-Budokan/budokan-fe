/** @type {import('next').NextConfig} */
const nextConfig = {
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

  // SOLUÇÃO: Configurar o hostname para não incluir porta
  async rewrites() {
    return [];
  },

  // Headers customizados para resolver o problema
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Força o host sem porta em produção
          ...(process.env.NODE_ENV === 'production'
            ? [
                {
                  key: 'X-Forwarded-Host',
                  value: 'budokanryu.com.br',
                },
              ]
            : []),
        ],
      },
    ];
  },

  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },

  poweredByHeader: false,
  compress: true,
};

module.exports = nextConfig;
