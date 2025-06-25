import { LoginImageSection } from '@/components/auth/login/image-section';
import { ReactNode } from 'react';

export default function AuthLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className='flex min-h-screen'>
      <LoginImageSection />

      {children}
    </div>
  );
}
