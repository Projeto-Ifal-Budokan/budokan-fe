'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordStrengthMeter } from '@/components/ui/password-strength-meter';
import { authService } from '@/lib/api/services/auth-service';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

// Schema para solicitar reset de senha
const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
});

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

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

export const ForgotPasswordForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordData) => {
    setIsSubmitting(true);
    try {
      await authService.forgotPassword(data);
      toast.success(
        'Se o e-mail estiver registrado, uma instrução foi enviada.'
      );
      setEmailSent(true);
    } catch (error) {
      console.error('Error requesting password reset:', error);
      toast.error('Erro ao enviar email de recuperação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (emailSent) {
    return <EmailSentSuccess />;
  }

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
            <h2 className='text-3xl font-bold text-blue-900'>
              Recuperar Senha
            </h2>
            <p className='mt-1 text-gray-500'>
              Digite seu email para receber instruções de recuperação
            </p>
          </div>
        </div>

        <div className='rounded-2xl border border-gray-100 bg-white p-8 shadow-lg'>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <div className='relative'>
                <Mail className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400' />
                <Input
                  id='email'
                  type='email'
                  placeholder='Digite seu email'
                  className='pl-10'
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className='text-sm text-red-600'>{errors.email.message}</p>
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
                  Enviando...
                </>
              ) : (
                'Enviar Email de Recuperação'
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

export const ResetPasswordForm = ({ token }: { token: string }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');

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
      toast.error('Erro ao redefinir senha. Tente novamente.');
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
            <p className='mt-1 text-gray-500'>Digite sua nova senha</p>
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
                  className={`pr-10 pl-10 ${errors.password ? 'border-red-500' : ''}`}
                  {...register('password', {
                    onChange: (e) => setPasswordValue(e.target.value),
                  })}
                  aria-invalid={!!errors.password}
                  aria-describedby='password-error'
                />
                <button
                  type='button'
                  className='absolute top-1/2 right-3 -translate-y-1/2 text-gray-400'
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? (
                    <EyeOff className='h-4 w-4' />
                  ) : (
                    <Eye className='h-4 w-4' />
                  )}
                </button>
              </div>
              <PasswordStrengthMeter password={passwordValue} />
              {errors.password && (
                <p id='password-error' className='text-sm text-red-600'>
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
                  type={showConfirm ? 'text' : 'password'}
                  placeholder='Confirme sua nova senha'
                  className={`pr-10 pl-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  {...register('confirmPassword')}
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby='confirmPassword-error'
                />
                <button
                  type='button'
                  className='absolute top-1/2 right-3 -translate-y-1/2 text-gray-400'
                  tabIndex={-1}
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showConfirm ? (
                    <EyeOff className='h-4 w-4' />
                  ) : (
                    <Eye className='h-4 w-4' />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p id='confirmPassword-error' className='text-sm text-red-600'>
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

export const EmailSentSuccess = () => {
  return (
    <div className='flex w-full items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-8 lg:w-1/2'>
      <div className='w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-lg'>
        <div className='mb-6 flex justify-center'>
          <div className='rounded-full bg-green-100 p-3'>
            <CheckCircle2 className='h-12 w-12 text-green-600' />
          </div>
        </div>

        <h1 className='mb-4 text-2xl font-bold text-gray-900'>
          Email enviado!
        </h1>

        <p className='mb-8 text-gray-600'>
          Se o e-mail estiver registrado, uma instrução foi enviada.
        </p>

        <Link href='/login'>
          <Button className='w-full bg-gradient-to-r from-blue-800 to-blue-900 text-white hover:from-blue-900 hover:to-blue-950'>
            Voltar para o login
          </Button>
        </Link>
      </div>
    </div>
  );
};
