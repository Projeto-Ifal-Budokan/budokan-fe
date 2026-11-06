'use client';

import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import {
  disciplineLabel,
  type PublishedFeedback,
} from '@/lib/api/services/feedback-service';
import { cn } from '@/lib/utils';

/**
 * Carrossel dos depoimentos publicados.
 *
 * Sem dependencia nova: e o mesmo molde do `hero-carousel.tsx` que ja esta no ar — estado de
 * pagina, intervalo, pausa no hover. Uma biblioteca de carrossel para virar tres cards com
 * seta seria mais coisa para instalar, atualizar e quebrar do que os cem linhas aqui.
 *
 * A navegacao e por paginas inteiras, nao por card: cada pagina e `w-full` dentro de uma
 * faixa com `translateX`, entao nunca sobra espaco vazio no fim da lista nem card cortado na
 * borda. Quantos cards por pagina vem da largura da janela — tres no desktop, dois no
 * tablet, um no celular.
 *
 * Quem usa o teclado ou prefere menos movimento nao e obrigado a ver nada passar sozinho:
 * `prefers-reduced-motion` desliga o autoplay, e mexer em seta ou bolinha pausa por alguns
 * segundos em vez de brigar com a pessoa.
 */

const AUTOPLAY_MS = 6_000;
const RESUME_AFTER_MS = 5_000;

const perViewFor = (width: number): number => {
  if (width >= 1024) return 3;
  if (width >= 640) return 2;
  return 1;
};

const Stars = ({ rating }: { rating: number | null }) => {
  if (!rating) return null;
  return (
    <div className='mt-1 flex gap-0.5' aria-label={`Nota ${rating} de 5`}>
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          size={14}
          aria-hidden='true'
          className={
            value <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
          }
        />
      ))}
    </div>
  );
};

const FeedbackCard = ({ feedback }: { feedback: PublishedFeedback }) => (
  <article className='flex h-full flex-col rounded-lg bg-blue-50 p-6'>
    <div className='mb-4 flex items-center gap-4'>
      {feedback.authorPhotoUrl && (
        // img simples, nao next/image: a foto vem do CMS, e cada dominio registrado no
        // next.config e mais uma chance de quebrar o build
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={feedback.authorPhotoUrl}
          alt={`Foto de ${feedback.authorName}`}
          width={48}
          height={48}
          loading='lazy'
          className='h-12 w-12 shrink-0 rounded-full object-cover'
        />
      )}
      <div className='min-w-0'>
        <h4 className='font-bold text-blue-900'>{feedback.authorName}</h4>
        <p className='text-sm text-gray-500'>
          {disciplineLabel(feedback.discipline)}
        </p>
        <Stars rating={feedback.rating} />
      </div>
    </div>
    <p className='whitespace-pre-line text-sm leading-relaxed text-gray-600 italic'>
      {feedback.message}
    </p>
  </article>
);

export const TestimonialsCarousel = ({
  items,
}: {
  items: PublishedFeedback[];
}) => {
  // comecar em 3 e o que o servidor tambem renderiza; o efeito corrige para a janela real
  // antes de a pessoa chegar aqui embaixo da pagina
  const [perView, setPerView] = useState(3);
  const [page, setPage] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pages = useMemo(() => {
    const chunks: PublishedFeedback[][] = [];
    for (let start = 0; start < items.length; start += perView) {
      chunks.push(items.slice(start, start + perView));
    }
    return chunks;
  }, [items, perView]);

  useEffect(() => {
    const onResize = () => setPerView(perViewFor(window.innerWidth));
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    setAutoPlay(!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  // encurtar a lista (janela menor, menos depoimentos publicados) nao pode deixar a pessoa
  // numa pagina que nao existe mais
  useEffect(() => {
    setPage((current) => Math.min(current, pages.length - 1));
  }, [pages.length]);

  useEffect(() => {
    if (!autoPlay || pages.length < 2) return;
    const id = setInterval(
      () => setPage((current) => (current + 1) % pages.length),
      AUTOPLAY_MS
    );
    return () => clearInterval(id);
  }, [autoPlay, pages.length]);

  useEffect(
    () => () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    },
    []
  );

  /** navegar no pedido da pessoa pausa o autoplay um pouco: nada pior que o card pulando enquanto ela escolhe */
  const goTo = (next: number) => {
    setPage(((next % pages.length) + pages.length) % pages.length);
    setAutoPlay(false);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setAutoPlay(true), RESUME_AFTER_MS);
  };

  if (pages.length === 0) return null;

  const navigable = pages.length > 1;

  return (
    <div
      className='relative'
      role='region'
      aria-roledescription='carrossel'
      aria-label='Depoimentos de praticantes'
      onMouseEnter={() => setAutoPlay(false)}
      onMouseLeave={() => setAutoPlay(true)}
    >
      <div className='overflow-hidden'>
        <div
          className='flex transition-transform duration-500 ease-out'
          style={{ transform: `translateX(-${page * 100}%)` }}
        >
          {pages.map((chunk, index) => (
            <div
              key={index}
              className='grid w-full shrink-0 gap-8 sm:grid-cols-2 lg:grid-cols-3'
              aria-hidden={index !== page}
            >
              {chunk.map((feedback) => (
                <FeedbackCard key={feedback.id} feedback={feedback} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {navigable && (
        <div className='mt-8 flex items-center justify-center gap-4'>
          <button
            type='button'
            onClick={() => goTo(page - 1)}
            aria-label='Depoimentos anteriores'
            className='rounded-full border border-blue-200 bg-white p-2 text-blue-900 shadow-sm transition-colors hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none'
          >
            <ChevronLeft size={20} />
          </button>

          <div className='flex items-center gap-2'>
            {pages.map((_, index) => (
              <button
                key={index}
                type='button'
                onClick={() => goTo(index)}
                aria-label={`Ir para o grupo ${index + 1} de depoimentos`}
                aria-current={index === page}
                className={cn(
                  'h-2.5 rounded-full transition-all focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none',
                  index === page
                    ? 'bg-blue-900 w-6'
                    : 'bg-blue-200 w-2.5 hover:bg-blue-400'
                )}
              />
            ))}
          </div>

          <button
            type='button'
            onClick={() => goTo(page + 1)}
            aria-label='Próximos depoimentos'
            className='rounded-full border border-blue-200 bg-white p-2 text-blue-900 shadow-sm transition-colors hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none'
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};
