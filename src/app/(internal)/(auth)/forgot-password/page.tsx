'use client';

import {
  ForgotPasswordForm,
  ResetPasswordForm,
} from '@/components/auth/forgot-password/forgot-password-form';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

// Component that uses useSearchParams
function ForgotPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  if (token) {
    return <ResetPasswordForm token={token} />;
  }

  return <ForgotPasswordForm />;
}

// Loading component
function Loading() {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900'></div>
    </div>
  );
}

// Main page component
export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ForgotPasswordContent />
    </Suspense>
  );
}
