'use client';

import { User2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '../ui/button';

// Navigation links data
const navLinks = [
  { href: '#about', label: 'Sobre Nós' },
  { href: '#disciplines', label: 'Modalidades' },
  { href: '#instructors', label: 'Senseis' },
  { href: '#schedule', label: 'Horários' },
  { href: '#contact', label: 'Contato' },
];

const Logo = () => {
  return (
    <div className='flex items-center gap-2'>
      <Image
        src='/logo.jpeg'
        alt='Budokan Logo'
        width={50}
        height={50}
        className='rounded-full'
      />
      <span className='text-xl font-bold text-white'>BUDOKAN</span>
    </div>
  );
};

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className='sticky top-0 z-50 w-full bg-blue-900 py-2 text-white shadow-lg'>
      <div className='container flex h-16 items-center justify-between'>
        <Logo />

        {/* Desktop Navigation */}
        <nav
          className='hidden items-center gap-6 md:flex'
          aria-label='Main navigation'
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className='text-sm font-medium text-white transition-colors hover:text-orange-300'
            >
              {link.label}
            </Link>
          ))}
          <Link href='/login'>
            <Button
              size='lg'
              className='bg-primary hover:bg-primary/90 border-0 text-white'
            >
              <User2 className='size-4' />
              Área do Aluno
            </Button>
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <Button
          variant='outline'
          size='icon'
          className='border-white text-white hover:bg-blue-800 md:hidden'
          onClick={toggleMobileMenu}
          aria-expanded={isMobileMenuOpen}
          aria-controls='mobile-menu'
          aria-label='Toggle menu'
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
            {isMobileMenuOpen ? (
              <g>
                <line x1='18' y1='6' x2='6' y2='18' />
                <line x1='6' y1='6' x2='18' y2='18' />
              </g>
            ) : (
              <g>
                <line x1='4' x2='20' y1='12' y2='12' />
                <line x1='4' x2='20' y1='6' y2='6' />
                <line x1='4' x2='20' y1='18' y2='18' />
              </g>
            )}
          </svg>
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          id='mobile-menu'
          className='bg-blue-900 px-6 py-4 shadow-lg md:hidden'
        >
          <nav className='flex flex-col space-y-4'>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className='text-sm font-medium text-white transition-colors hover:text-orange-300'
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link href='/login'>
              <Button className='bg-primary hover:bg-primary/90 h-10 w-full border-0 text-white'>
                Área do Aluno
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
