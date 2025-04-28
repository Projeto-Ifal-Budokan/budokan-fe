import { LoginFormSection } from '@/components/auth/login/LoginFormSection';
import { LoginImageSection } from '@/components/auth/login/LoginImageSection';

export default function LoginPage() {
  return (
    <div className='flex min-h-screen'>
      <LoginImageSection />
      <LoginFormSection />
    </div>
  );
}
