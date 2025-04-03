import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';

export const Header = () => {
  return (
    <header className='sticky top-0 z-50 w-full bg-blue-900 py-2 text-white shadow-lg'>
      <div className='container flex h-16 items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Image
            src='https://hebbkx1anhila5yf.public.blob.vercel-storage.com/budokan.jpg-agJBqgCaSEzyDWGHfvAUrKFDnFWaS2.jpeg'
            alt='Budokan Logo'
            width={50}
            height={50}
            className='rounded-full'
          />
          <span className='text-xl font-bold text-white'>BUDOKAN</span>
        </div>
        <nav className='hidden items-center gap-6 md:flex'>
          <Link
            href='#about'
            className='text-sm font-medium text-white transition-colors hover:text-orange-300'
          >
            Sobre Nós
          </Link>
          <Link
            href='#disciplines'
            className='text-sm font-medium text-white transition-colors hover:text-orange-300'
          >
            Modalidades
          </Link>
          <Link
            href='#instructors'
            className='text-sm font-medium text-white transition-colors hover:text-orange-300'
          >
            Senseis
          </Link>
          <Link
            href='#schedule'
            className='text-sm font-medium text-white transition-colors hover:text-orange-300'
          >
            Horários
          </Link>
          <Link
            href='#contact'
            className='text-sm font-medium text-white transition-colors hover:text-orange-300'
          >
            Contato
          </Link>
          <Button className='border-0 bg-orange-500 text-white hover:bg-orange-600'>
            Área do Aluno
          </Button>
        </nav>
        <Button
          variant='outline'
          size='icon'
          className='border-white text-white hover:bg-blue-800 md:hidden'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='h-6 w-6'
          >
            <line x1='4' x2='20' y1='12' y2='12' />
            <line x1='4' x2='20' y1='6' y2='6' />
            <line x1='4' x2='20' y1='18' y2='18' />
          </svg>
        </Button>
      </div>
    </header>
  );
};
