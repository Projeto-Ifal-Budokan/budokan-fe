import { LoginImageSection } from '@/components/auth/login/image-section';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex min-h-screen'>
      <LoginImageSection />

      {children}
    </div>
  );
}
