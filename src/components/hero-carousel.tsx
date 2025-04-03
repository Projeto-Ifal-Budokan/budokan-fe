'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import { scrollToSection } from '@/utils/scroll-utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

interface CarouselSlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
}

export default function HeroCarousel() {
  const slides: CarouselSlide[] = [
    {
      id: 1,
      image: '/placeholder.svg?height=600&width=1920',
      title: 'Karate-Do',
      subtitle: 'O caminho das mãos vazias: disciplina, técnica e filosofia',
    },
    {
      id: 2,
      image: '/placeholder.svg?height=600&width=1920',
      title: 'Kendo',
      subtitle: 'O caminho da espada: a arte marcial dos samurais',
    },
    {
      id: 3,
      image: '/placeholder.svg?height=600&width=1920',
      title: 'Kyudo',
      subtitle: 'O caminho do arco: a arte milenar do tiro com arco japonês',
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 5 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  // Auto-play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isAutoPlaying) {
      interval = setInterval(() => {
        nextSlide();
      }, 5000); // Change slide every 5 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoPlaying, nextSlide]);

  // Pause auto-play when user interacts with controls
  const handleControlClick = (callback: () => void) => {
    setIsAutoPlaying(false);
    callback();
    // Resume auto-play after 5 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  // Handle scroll to disciplines section
  const handleExploreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToSection('disciplines');
  };

  return (
    <div className='relative h-[600px] overflow-hidden'>
      {/* Carousel slides */}
      <div className='relative h-full'>
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentSlide === index ? 'z-10 opacity-100' : 'z-0 opacity-0'
            }`}
          >
            <div className='absolute inset-0 z-10 bg-gradient-to-r from-blue-900/90 to-blue-800/90' />
            <Image
              src={slide.image || '/placeholder.svg'}
              alt={slide.title}
              fill
              className='object-cover'
              priority={index === 0}
            />
            <div className='absolute inset-0 z-20 container flex flex-col items-center justify-center text-center text-white'>
              <div className='mb-6'>
                <Image
                  src='https://hebbkx1anhila5yf.public.blob.vercel-storage.com/budokan.jpg-agJBqgCaSEzyDWGHfvAUrKFDnFWaS2.jpeg'
                  alt='Budokan Logo'
                  width={120}
                  height={120}
                  className='mx-auto rounded-full'
                />
              </div>
              <h1 className='mb-4 text-4xl font-bold md:text-6xl'>
                Associação de Artes Marciais Budokan
              </h1>
              <h2 className='mb-2 text-2xl font-semibold md:text-3xl'>
                {slide.title}
              </h2>
              <p className='mb-8 max-w-3xl text-lg md:text-xl'>
                {slide.subtitle}
              </p>
              <div className='flex flex-col gap-4 sm:flex-row'>
                <Button className='border-0 bg-orange-500 px-8 py-6 text-lg font-bold text-blue-900 hover:bg-orange-600'>
                  Agende uma Aula Experimental
                </Button>
                <Button
                  variant='outline'
                  className='border-white bg-blue-900 px-8 py-6 text-lg text-yellow-500 hover:bg-yellow-500/90'
                  onClick={handleExploreClick}
                >
                  Conheça Nossas Modalidades
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={() => handleControlClick(prevSlide)}
        className='absolute top-1/2 left-4 z-30 -translate-y-1/2 rounded-full bg-blue-900/50 p-2 text-white transition-all hover:bg-blue-900/70'
        aria-label='Previous slide'
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={() => handleControlClick(nextSlide)}
        className='absolute top-1/2 right-4 z-30 -translate-y-1/2 rounded-full bg-blue-900/50 p-2 text-white transition-all hover:bg-blue-900/70'
        aria-label='Next slide'
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots navigation */}
      <div className='absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 space-x-3'>
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-3 w-3 rounded-full transition-all ${
              currentSlide === index
                ? 'w-8 bg-orange-500'
                : 'bg-white/60 hover:bg-white'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// ChevronDown component for the scroll indicator
function ChevronDown({ size = 24 }: { size?: number }) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='m6 9 6 6 6-6' />
    </svg>
  );
}
