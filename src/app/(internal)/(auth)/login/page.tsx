import { LoginFormSection } from '@/components/auth/login/form-section';
import { Suspense } from 'react';

function Loading() {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900'></div>
    </div>
  );
}

export default async function LoginPage() {
  return (
    <Suspense fallback={<Loading />}>
      <LoginFormSection />
    </Suspense>
  );
}
