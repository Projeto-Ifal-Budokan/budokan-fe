'use client';

import {
  ForgotPasswordForm,
  ResetPasswordForm,
} from '@/components/auth/forgot-password/forgot-password-form';
import { useSearchParams } from 'next/navigation';

function ForgotPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  if (token) {
    return <ResetPasswordForm token={token} />;
  }

  return <ForgotPasswordForm />;
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordContent />;
}
