import { Footer } from '@/components/landing-page/footer';
import { Header } from '@/components/landing-page/header';
import { WhatsappButton } from '@/components/landing-page/whatsapp-button';

export default function LandingPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex min-h-screen flex-col bg-gray-100'>
      <Header />
      <main className='flex-1'>
        <WhatsappButton />
        {children}
      </main>
      <Footer />
    </div>
  );
}
