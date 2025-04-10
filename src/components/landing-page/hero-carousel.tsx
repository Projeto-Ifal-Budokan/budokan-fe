'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import { scrollToSection } from '@/utils/scroll-utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

import arqueariaCarouselAsset from '@/assets/images/arquearia-carousel.png';
import karetdoCarouselAsset from '@/assets/images/karatedo-carousel.png';
import kendoCarouselAsset from '@/assets/images/kendo-carousel.png';
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
      image: karetdoCarouselAsset.src,
      title: 'Karate-Do',
      subtitle: 'O caminho das mãos vazias: disciplina, técnica e filosofia',
    },
    {
      id: 2,
      image: kendoCarouselAsset.src,
      title: 'Kendo',
      subtitle: 'O caminho da espada: a arte marcial dos samurais',
    },
    {
      id: 3,
      image: arqueariaCarouselAsset.src,
      title: 'Arquearia',
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
            <div className='absolute inset-0 z-10 bg-gradient-to-r from-blue-900/30 to-blue-800/30' />
            <Image
              src={slide.image || '/placeholder.svg'}
              alt={slide.title}
              fill
              className='object-cover object-center'
              priority={index === 0}
            />
            <div className='absolute inset-0 z-20 container flex flex-col items-center justify-center text-center text-white'>
              <div className='mb-6'>
                <Image
                  src='/logo.jpeg'
                  alt='Budokan-Ryu Logo'
                  width={120}
                  height={120}
                  className='mx-auto rounded-full'
                />
              </div>
              <h1 className='mb-4 text-4xl font-bold md:text-6xl'>
                Associação de Artes Marciais
                <br />
                Budokan-Ryu
              </h1>
              <h2 className='mb-2 text-2xl font-semibold md:text-3xl'>
                {slide.title}
              </h2>
              <p className='mb-8 max-w-3xl text-lg md:text-xl'>
                {slide.subtitle}
              </p>
              <div className='flex flex-col gap-4 sm:flex-row'>
                <Button className='bg-primary hover:bg-primary/90 border-0 px-8 py-6 text-lg font-bold text-white'>
                  Agende uma Aula Experimental
                </Button>
                <Button
                  className='bg-blue-900 px-8 py-6 text-lg text-white hover:bg-blue-900/90'
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
        className='absolute top-1/2 left-4 z-30 -translate-y-1/2 cursor-pointer rounded-full bg-blue-900/50 p-2 text-white transition-all hover:bg-blue-900/70'
        aria-label='Previous slide'
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={() => handleControlClick(nextSlide)}
        className='absolute top-1/2 right-4 z-30 -translate-y-1/2 cursor-pointer rounded-full bg-blue-900/50 p-2 text-white transition-all hover:bg-blue-900/70'
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
                ? 'bg-primary w-8'
                : 'bg-white/60 hover:bg-white'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
