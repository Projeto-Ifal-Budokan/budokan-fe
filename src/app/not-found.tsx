import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-white px-4'>
      <div className='w-full max-w-md text-center'>
        {/* Error Icon */}
        <div className='mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-blue-50'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='48'
            height='48'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='text-blue-900'
          >
            <circle cx='12' cy='12' r='10' />
            <path d='M12 6v6' />
            <path d='M12 16h.01' />
          </svg>
        </div>

        {/* 404 Number */}
        <h1 className='mb-4 text-6xl font-bold text-blue-900'>404</h1>

        {/* Title */}
        <h2 className='mb-4 text-2xl font-bold text-blue-900'>
          Caminho Perdido
        </h2>

        {/* Divider */}
        <div className='bg-primary mx-auto mb-6 h-1 w-20'></div>

        {/* Description */}
        <p className='mb-8 leading-relaxed text-gray-600'>
          Como um guerreiro que perdeu o caminho do dojo, esta página não foi
          encontrada. Que tal retornar ao início da sua jornada nas artes
          marciais?
        </p>

        {/* Action Buttons */}
        <div className='space-y-4'>
          <Link href='/' className='block'>
            <Button className='w-full bg-blue-900 hover:bg-blue-800'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='mr-2'
              >
                <path d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' />
                <polyline points='9,22 9,12 15,12 15,22' />
              </svg>
              Voltar ao Início
            </Button>
          </Link>

          <Link href='/dashboard' className='block'>
            <Button
              variant='outline'
              className='w-full border-blue-900 text-blue-900 hover:bg-blue-50'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='mr-2'
              >
                <rect width='7' height='9' x='3' y='3' rx='1' />
                <rect width='7' height='5' x='14' y='3' rx='1' />
                <rect width='7' height='9' x='14' y='12' rx='1' />
                <rect width='7' height='5' x='3' y='16' rx='1' />
              </svg>
              Acessar Dashboard
            </Button>
          </Link>
        </div>

        {/* Quote */}
        <div className='mt-12 rounded-lg bg-blue-50 p-6'>
          <blockquote className='text-sm text-blue-900 italic'>
            &quot;O caminho de mil milhas começa com um único passo&quot;
          </blockquote>
          <cite className='mt-2 block text-xs text-blue-700'>
            - Provérbio das Artes Marciais
          </cite>
        </div>
      </div>
    </div>
  );
}
