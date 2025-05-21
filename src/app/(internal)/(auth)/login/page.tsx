import { LoginFormSection } from '@/components/auth/login/form-section';
import { isAuthenticated } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const isLoggedIn = await isAuthenticated();

  if (isLoggedIn) {
    redirect('/dashboard');
  }

  return <LoginFormSection />;
}
