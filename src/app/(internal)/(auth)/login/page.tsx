'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ArrowRight,
  ChevronLeft,
  Eye,
  EyeOff,
  Home,
  Lock,
  Mail,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className='flex min-h-screen'>
      {/* Left side - Image */}
      <div className='relative hidden overflow-hidden lg:block lg:w-1/2'>
        {/* Changed overlay to be less blue-dominant with warmer tones */}
        <div className='absolute inset-0 z-10 bg-gradient-to-b from-blue-900 via-blue-900/80' />
        <Image
          src='/placeholder.svg?height=1080&width=1080'
          alt='Budokan-Ryu Martial Arts'
          fill
          className='scale-110 object-cover object-center transition-transform duration-[3s] ease-in-out hover:scale-105'
          priority
        />
        {/* Decorative elements */}
        <div className="pointer-events-none absolute inset-0 z-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMC0zMHY2aDZ2LTZoLTZ6bTAgMTJ2Nmg2di02aC02em0wIDEydjZoNnYtNmgtNnptLTEyIDZoNnYtNmgtNnY2em0wLTEyaDZ2LTZoLTZ2NnptMC0xMmg2di02aC02djZ6bTAgMzBoNnYtNmgtNnY2em0tMTIgMGg2di02aC02djZ6bTAtMTJoNnYtNmgtNnY2em0wLTEyaDZ2LTZoLTZ2NnptMC0xMmg2di02aC02djZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10" />

        <div className='absolute inset-0 z-30 flex flex-col items-center justify-center p-12 text-center text-white'>
          {/* Home link on the left section */}
          <Link
            href='/'
            className='hover:text-primary absolute top-6 left-6 flex items-center text-white transition-colors'
          >
            <Home className='mr-2 h-5 w-5' />
            <span>Página Inicial</span>
          </Link>

          <div className='relative mb-8'>
            <Link href='/'>
              <Image
                src='/logo.jpg'
                alt='Budokan-Ryu Logo'
                width={120}
                height={120}
                className='relative rounded-full shadow-2xl transition-transform duration-300 hover:scale-105'
              />
            </Link>
          </div>
          <h1 className='mb-4 text-4xl font-bold tracking-tight'>
            Associação de Artes Marciais{' '}
            <span className='text-primary'>Budokan-Ryu</span>
          </h1>
          <p className='mb-8 max-w-lg text-xl leading-relaxed opacity-90'>
            Há mais de 30 anos formando campeões e transformando vidas através
            das artes marciais tradicionais japonesas.
          </p>
        </div>
      </div>

      {/* Right side - Login form */}
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
          <div className='mb-10 flex items-center justify-center lg:justify-start'>
            <div className='relative mr-4 lg:hidden'>
              <div className='absolute -inset-1 rounded-full bg-orange-200 blur-sm'></div>
              <Link href='/'>
                <Image
                  src='/logo.jpg'
                  alt='Budokan-Ryu Logo'
                  width={60}
                  height={60}
                  className='relative rounded-full transition-transform duration-300 hover:scale-105'
                />
              </Link>
            </div>
            <div>
              <h2 className='text-3xl font-bold text-blue-900'>
                Área do Aluno
              </h2>
              <p className='mt-1 text-gray-500'>
                Acesse sua conta para visualizar aulas, eventos e muito mais
              </p>
            </div>
          </div>

          <div className='rounded-2xl border border-gray-100 bg-white p-8 shadow-lg'>
            <div className='space-y-6'>
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
                  />
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
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none'
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                  >
                    {showPassword ? (
                      <EyeOff className='h-5 w-5' />
                    ) : (
                      <Eye className='h-5 w-5' />
                    )}
                  </button>
                </div>
              </div>

              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='remember'
                  className='text-primary focus:ring-primary rounded border-gray-300'
                />
                <Label
                  htmlFor='remember'
                  className='text-sm font-medium text-gray-600'
                >
                  Lembrar de mim
                </Label>
              </div>

              <Button className='group hover:from-primary/80 hover:to-primary flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-blue-800 to-blue-900 py-6 text-base font-medium text-white shadow-md transition-all duration-300 hover:shadow-lg'>
                Entrar
                <ArrowRight className='ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1' />
              </Button>
            </div>
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
    </div>
  );
}
