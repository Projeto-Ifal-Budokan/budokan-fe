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
                alt='Budokan-Ryu Logo'
                width={50}
                height={50}
                className='rounded-full'
              />
              <span className='text-xl font-bold'>BUDOKAN-RYU</span>
            </div>
            <p className='mb-4 text-sm opacity-70'>
              Associação de Artes Marciais Budokan-Ryu, dedicada ao ensino e
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
                  href='/#about'
                  className='text-sm opacity-70 transition-colors hover:text-orange-300 hover:opacity-100'
                >
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link
                  href='/#instructors'
                  className='text-sm opacity-70 transition-colors hover:text-orange-300 hover:opacity-100'
                >
                  Senseis
                </Link>
              </li>
              <li>
                <Link
                  href='/#schedule'
                  className='text-sm opacity-70 transition-colors hover:text-orange-300 hover:opacity-100'
                >
                  Horários
                </Link>
              </li>
              <li>
                <Link
                  href='/#contact'
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
                href='https://www.instagram.com/budokanryu.al'
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
                href='https://www.youtube.com/@budokanalagoas'
                className='text-white transition-colors hover:text-orange-300'
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-2C18.88 4 12 4 12 4s-6.88 0-8.59.42a2.78 2.78 0 0 0-1.95 2A29.94 29.94 0 0 0 1 12a29.94 29.94 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 2C5.12 20 12 20 12 20s6.88 0 8.59-.42a2.78 2.78 0 0 0 1.95-2A29.94 29.94 0 0 0 23 12a29.94 29.94 0 0 0-.46-5.58z" />
                  <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className='mt-8 border-t border-white/10 pt-8 text-center'>
          <p className='text-sm opacity-70'>
            &copy; {new Date().getFullYear()} Associação de Artes Marciais
            Budokan-Ryu. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
