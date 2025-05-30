'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authService } from '@/lib/api/services/auth-service';
import { LoginFormData } from '@/types/login';
import { ArrowRight, ChevronLeft, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export function LoginFormSection() {
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/dashboard';

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors }, // Access errors here if needed
  } = useForm<LoginFormData>();

  // Placeholder onSubmit function
  const onSubmit = async (credentials: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      console.log({ response });
      if (!response.ok) {
        return toast.error(response.data.message);
      }

      toast.success('Login com sucesso!');
      router.push(from);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex w-full items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-8 lg:w-1/2'>
      {/* Back to home link for mobile */}
      <div className='absolute top-4 left-4 lg:hidden'>
        <Link
          href='/'
          className='hover:text-primary flex items-center text-blue-800 transition-colors'
        >
          <ChevronLeft className='mr-1 h-4 w-4' />
          <span>Voltar</span>
        </Link>
      </div>

      <div className='w-full max-w-md'>
        <div className='mb-10 flex flex-col items-center justify-center lg:items-start lg:justify-start'>
          <div className='relative my-4 lg:hidden'>
            <Link href='/'>
              <Image
                src='/logo.jpg'
                alt='Budokan-Ryu Logo'
                width={80}
                height={80}
                className='relative rounded-full transition-transform duration-300 hover:scale-105'
              />
            </Link>
          </div>
          <div>
            <h2 className='text-center text-3xl font-bold text-blue-900 lg:text-start'>
              Área do Aluno
            </h2>
            <p className='mt-1 text-gray-500'>
              Acesse sua conta para visualizar aulas e muito mais!
            </p>
          </div>
        </div>

        <div className='rounded-2xl border border-gray-100 bg-white p-8 shadow-lg'>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='space-y-2'>
              <Label
                htmlFor='email'
                className='flex items-center text-base font-medium text-gray-700'
              >
                <Mail className='text-primary mr-2 h-4 w-4' />
                Email
              </Label>
              <div className='relative'>
                <Input
                  id='email'
                  type='email'
                  placeholder='seu.email@exemplo.com'
                  className='focus:border-primary focus:ring-primary w-full rounded-lg border-gray-300 py-3 pr-4 pl-4 transition-all duration-200 focus:ring-2'
                  autoComplete='email'
                  // Register email input
                  {...register('email', { required: 'Email is required' })}
                />
                {errors.email && (
                  <p className='mt-1 text-sm text-red-500'>
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label
                  htmlFor='password'
                  className='flex items-center text-base font-medium text-gray-700'
                >
                  <Lock className='text-primary mr-2 h-4 w-4' />
                  Senha
                </Label>
                <Link
                  href='/forgot-password'
                  className='hover:text-primary text-sm font-medium text-blue-700 transition-colors duration-200 hover:underline'
                >
                  Esqueceu a senha?
                </Link>
              </div>

              <div className='relative'>
                <Input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='••••••••'
                  className='focus:border-primary focus:ring-primary w-full rounded-lg border-gray-300 py-3 pr-10 pl-4 transition-all duration-200 focus:ring-2'
                  autoComplete='current-password'
                  // Register password input
                  {...register('password', {
                    required: 'Password is required',
                  })}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none'
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className='h-5 w-5' />
                  ) : (
                    <Eye className='h-5 w-5' />
                  )}
                </button>
                {errors.password && (
                  <p className='mt-1 text-sm text-red-500'>
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <div className='flex items-center space-x-2'>
              <Checkbox
                id='remember'
                className='text-primary focus:ring-primary rounded border-gray-300'
                {...register('rememberMe')}
              />
              <Label
                htmlFor='remember'
                className='text-sm font-medium text-gray-600'
              >
                Lembrar de mim
              </Label>
            </div>

            <Button
              type='submit'
              disabled={isLoading}
              className='group hover:from-primary/80 hover:to-primary flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-blue-800 to-blue-900 py-6 text-base font-medium text-white shadow-md transition-all duration-300 hover:shadow-lg'
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
              {!isLoading && (
                <ArrowRight className='ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1' />
              )}
            </Button>
          </form>
        </div>

        <div className='mt-8 text-center'>
          <p className='text-gray-600'>
            Não tem uma conta?{' '}
            <Link
              href='/signup'
              className='text-primary font-medium transition-colors duration-200 hover:text-orange-700 hover:underline'
            >
              Cadastre-se
            </Link>
          </p>
        </div>

        <div className='mt-12 border-t border-gray-200 pt-6'>
          <p className='text-center text-sm text-gray-500'>
            &copy; {new Date().getFullYear()} Associação de Artes Marciais
            Budokan-Ryu.
            <br />
            Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
