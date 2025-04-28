import { Home } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function LoginImageSection() {
  return (
    <div className='relative hidden overflow-hidden lg:block lg:w-1/2'>
      {/* Changed overlay to be less blue-dominant with warmer tones */}
      <div className='absolute inset-0 z-10 bg-blue-800/40 bg-gradient-to-b from-blue-900 via-blue-900/80' />
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
          Há mais de 30 anos formando campeões e transformando vidas através das
          artes marciais tradicionais japonesas.
        </p>
      </div>
    </div>
  );
}
