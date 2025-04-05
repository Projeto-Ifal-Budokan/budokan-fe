import Image from 'next/image';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className='bg-blue-900 py-12 text-white'>
      <div className='container'>
        <div className='grid gap-8 md:grid-cols-4'>
          <div>
            <div className='mb-4 flex items-center gap-2'>
              <Image
                src='https://hebbkx1anhila5yf.public.blob.vercel-storage.com/budokan.jpg-agJBqgCaSEzyDWGHfvAUrKFDnFWaS2.jpeg'
                alt='Budokan Logo'
                width={50}
                height={50}
                className='rounded-full'
              />
              <span className='text-xl font-bold'>BUDOKAN</span>
            </div>
            <p className='mb-4 text-sm opacity-70'>
              Associação de Artes Marciais Budokan, dedicada ao ensino e
              preservação de artes marciais tradicionais japonesas desde 1985.
            </p>
          </div>
          <div>
            <h4 className='mb-4 text-lg font-bold'>Modalidades</h4>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='/karate'
                  className='text-sm opacity-70 transition-colors hover:text-orange-300 hover:opacity-100'
                >
                  Karate-Do
                </Link>
              </li>
              <li>
                <Link
                  href='/kendo'
                  className='text-sm opacity-70 transition-colors hover:text-orange-300 hover:opacity-100'
                >
                  Kendo
                </Link>
              </li>
              <li>
                <Link
                  href='/arquearia'
                  className='text-sm opacity-70 transition-colors hover:text-orange-300 hover:opacity-100'
                >
                  Arquearia
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className='mb-4 text-lg font-bold'>Links Rápidos</h4>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='#about'
                  className='text-sm opacity-70 transition-colors hover:text-orange-300 hover:opacity-100'
                >
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link
                  href='#instructors'
                  className='text-sm opacity-70 transition-colors hover:text-orange-300 hover:opacity-100'
                >
                  Senseis
                </Link>
              </li>
              <li>
                <Link
                  href='#schedule'
                  className='text-sm opacity-70 transition-colors hover:text-orange-300 hover:opacity-100'
                >
                  Horários
                </Link>
              </li>
              <li>
                <Link
                  href='#contact'
                  className='text-sm opacity-70 transition-colors hover:text-orange-300 hover:opacity-100'
                >
                  Contato
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className='mb-4 text-lg font-bold'>Redes Sociais</h4>
            <div className='flex space-x-4'>
              <a
                href='#'
                className='text-white transition-colors hover:text-orange-300'
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
                  <path d='M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' />
                </svg>
              </a>
              <a
                href='#'
                className='text-white transition-colors hover:text-orange-300'
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
                  <rect width='20' height='20' x='2' y='2' rx='5' ry='5' />
                  <path d='M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z' />
                  <line x1='17.5' x2='17.51' y1='6.5' y2='6.5' />
                </svg>
              </a>
              <a
                href='#'
                className='text-white transition-colors hover:text-orange-300'
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
                  <path d='M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z' />
                </svg>
              </a>
              <a
                href='#'
                className='text-white transition-colors hover:text-orange-300'
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
                  <path d='M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z' />
                  <rect width='4' height='12' x='2' y='9' />
                  <circle cx='4' cy='4' r='2' />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className='mt-8 border-t border-white/10 pt-8 text-center'>
          <p className='text-sm opacity-70'>
            &copy; {new Date().getFullYear()} Associação de Artes Marciais
            Budokan. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
