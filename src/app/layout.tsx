import '@/app/globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { QueryProvider } from '@/providers/QueryProvider';
import { Inter } from 'next/font/google';
import type React from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: {
    default: 'Budokan-Ryu | Centro de Artes Marciais em Maceió-AL',
    template: '%s | Budokan-Ryu',
  },
  description:
    'Centro de excelência em Karatê, Kendo e Arquearia em Maceió-AL. Tradição, disciplina e técnica com instrutores qualificados.',
  keywords: [
    'karate Maceió',
    'kendo Maceió',
    'arquearia Maceió',
    'artes marciais Maceió',
    'dojo Maceió',
    'karate tradicional',
    'budokan ryu',
  ],
  authors: [{ name: 'Budokan-Ryu' }],
  creator: 'Budokan-Ryu',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://www.budokanryu.com.br',
    title: 'Budokan-Ryu | Centro de Artes Marciais em Maceió-AL',
    description:
      'Centro de excelência em Karatê, Kendo e Arquearia em Maceió-AL',
    siteName: 'Budokan-Ryu',
    images: [
      {
        url: 'https://www.budokanryu.com.br/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'Budokan-Ryu Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Budokan-Ryu | Centro de Artes Marciais',
    description:
      'Centro de excelência em Karatê, Kendo e Arquearia em Maceió-AL',
    images: ['https://www.budokanryu.com.br/logo.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'N7_yd9YSjCRhENLb2Mex_U7xeTwyPxgP-Jz535aM5Q4', // Add when you get it
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='pt-BR'
      className='scroll-smooth'
      suppressHydrationWarning={true}
    >
      <body className={inter.className}>
        <QueryProvider>
          <ThemeProvider
            attribute='class'
            defaultTheme='light'
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
