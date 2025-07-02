import archeryAsset from '@/assets/images/arquearia-carousel.png';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const Hero = () => {
  return (
    <section className='relative'>
      <div className='relative h-[400px]'>
        <Image
          src={archeryAsset}
          alt='Archery Training'
          fill
          className='object-cover'
          priority
        />
      </div>
      <div className='absolute inset-0 z-20 container flex flex-col items-center justify-center text-center text-white'>
        <Link
          href='/'
          className='absolute top-4 left-4 flex items-center text-white transition-colors hover:text-yellow-500'
        >
          <ArrowLeft className='mr-2 h-4 w-4' />
          <span>Voltar</span>
        </Link>
        <h1 className='mb-4 text-4xl font-bold md:text-6xl'>Arquearia</h1>
        <p className='mb-8 max-w-3xl text-lg md:text-xl'>
          A arte do tiro com arco
        </p>
      </div>
    </section>
  );
};
