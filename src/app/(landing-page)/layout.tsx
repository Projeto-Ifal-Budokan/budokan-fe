import { Footer } from '@/components/landing-page/footer';
import { Header } from '@/components/landing-page/header';

export default function LandingPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex min-h-screen flex-col bg-gray-100'>
      <Header />
      <main className='flex-1'>{children}</main>
      <Footer />
    </div>
  );
}
