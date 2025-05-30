import { LoginFormSection } from '@/components/auth/login/form-section';
import { Suspense } from 'react';

export default async function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginFormSection />
    </Suspense>
  );
}
