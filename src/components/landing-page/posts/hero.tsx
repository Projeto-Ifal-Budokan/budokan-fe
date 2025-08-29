import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const HeroSection = () => {
  return (
    <section className='relative bg-gradient-to-r from-blue-900 to-blue-800 py-20'>
      <div className='container'>
        <div className='flex flex-col items-center text-center text-white'>
          <Link
            href='/'
            className='absolute top-4 left-4 flex items-center text-white transition-colors hover:text-yellow-500'
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            <span>Voltar</span>
          </Link>
          <h1 className='mb-4 text-4xl font-bold md:text-6xl'>Blog</h1>
          <p className='mb-8 max-w-3xl text-lg md:text-xl'>
            Fique por dentro das novidades, eventos e informações sobre artes
            marciais
          </p>
          <div className='h-1 w-20 bg-yellow-500'></div>
        </div>
      </div>
    </section>
  );
};
