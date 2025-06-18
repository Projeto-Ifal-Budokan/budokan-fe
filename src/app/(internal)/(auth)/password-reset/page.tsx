'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authService } from '@/lib/api/services/auth-service';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Eye, EyeOff, Loader2, Lock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

// Schema para redefinir senha
const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

const ResetPasswordForm = ({ token }: { token: string }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordData) => {
    setIsSubmitting(true);
    try {
      await authService.resetPassword({
        token,
        password: data.password,
      });
      toast.success('Senha redefinida com sucesso!');
      router.push('/login');
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error(
        'Erro ao redefinir senha. O link pode ter expirado ou ser inválido.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex w-full items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-8 lg:w-1/2'>
      <div className='w-full max-w-md'>
        <div className='mb-10 flex items-center justify-center lg:justify-start'>
          <div className='relative mr-4 lg:hidden'>
            <div className='absolute -inset-1 rounded-full bg-orange-200 blur-sm'></div>
            <Link href='/'>
              <Image
                src='/logo.jpg'
                alt='Budokan Logo'
                width={60}
                height={60}
                className='relative rounded-full transition-transform duration-300 hover:scale-105'
              />
            </Link>
          </div>
          <div>
            <h2 className='text-3xl font-bold text-blue-900'>Nova Senha</h2>
            <p className='mt-1 text-gray-500'>
              Digite sua nova senha para continuar
            </p>
          </div>
        </div>

        <div className='rounded-2xl border border-gray-100 bg-white p-8 shadow-lg'>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='space-y-2'>
              <Label htmlFor='password'>Nova Senha</Label>
              <div className='relative'>
                <Lock className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400' />
                <Input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Digite sua nova senha'
                  className='pr-10 pl-10'
                  {...register('password')}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none'
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className='h-4 w-4' />
                  ) : (
                    <Eye className='h-4 w-4' />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className='text-sm text-red-600'>
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='confirmPassword'>Confirmar Nova Senha</Label>
              <div className='relative'>
                <Lock className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400' />
                <Input
                  id='confirmPassword'
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder='Confirme sua nova senha'
                  className='pr-10 pl-10'
                  {...register('confirmPassword')}
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none'
                  aria-label={
                    showConfirmPassword ? 'Hide password' : 'Show password'
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className='h-4 w-4' />
                  ) : (
                    <Eye className='h-4 w-4' />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className='text-sm text-red-600'>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type='submit'
              className='w-full bg-gradient-to-r from-blue-800 to-blue-900 text-white hover:from-blue-900 hover:to-blue-950'
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Redefinindo...
                </>
              ) : (
                'Redefinir Senha'
              )}
            </Button>
          </form>

          <div className='mt-6 text-center'>
            <Link
              href='/login'
              className='flex items-center justify-center text-blue-800 transition-colors hover:text-orange-500'
            >
              <ArrowLeft className='mr-1 h-4 w-4' />
              Voltar para o login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const InvalidToken = () => {
  return (
    <div className='flex w-full items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-8 lg:w-1/2'>
      <div className='w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-lg'>
        <div className='mb-6 flex justify-center'>
          <div className='rounded-full bg-red-100 p-3'>
            <Lock className='h-12 w-12 text-red-600' />
          </div>
        </div>

        <h1 className='mb-4 text-2xl font-bold text-gray-900'>
          Link Inválido ou Expirado
        </h1>

        <p className='mb-8 text-gray-600'>
          O link de recuperação de senha é inválido ou expirou. Solicite um novo
          link de recuperação.
        </p>

        <div className='space-y-4'>
          <Link href='/forgot-password'>
            <Button className='w-full bg-gradient-to-r from-blue-800 to-blue-900 text-white hover:from-blue-900 hover:to-blue-950'>
              Solicitar Novo Link
            </Button>
          </Link>

          <Link href='/login'>
            <Button variant='outline' className='w-full'>
              Voltar para o login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function PasswordResetPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  // Se não há token na URL, mostra erro
  if (!token) {
    return <InvalidToken />;
  }

  // Se há token, mostra o formulário de redefinição
  return <ResetPasswordForm token={token} />;
}
