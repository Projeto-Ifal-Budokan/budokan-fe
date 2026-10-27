import { Star } from 'lucide-react';

import {
  disciplineLabel,
  getPublishedFeedbacks,
} from '@/lib/api/services/feedback-service';

import { FeedbackForm } from './feedback-form';

const Stars = ({ rating }: { rating: number | null }) => {
  if (!rating) return null;
  return (
    <div className='mt-1 flex gap-0.5'>
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          size={14}
          className={value <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
        />
      ))}
    </div>
  );
};

/**
 * Secao de feedback da comunidade.
 *
 * Componente de servidor: a lista vem do Strapi pelo alias interno, entao funciona mesmo
 * antes do dominio strapi. existir no DNS. O formulario e o unico pedaço de cliente aqui.
 */
export const FeedbackSection = async () => {
  const feedbacks = await getPublishedFeedbacks(6);

  return (
    <section id='feedback' className='bg-slate-50 py-16'>
      <div className='container'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-blue-900'>
            O que os praticantes dizem
          </h2>
          <div className='bg-primary mx-auto mb-6 h-1 w-20'></div>
          <p className='mx-auto max-w-3xl text-gray-600'>
            Depoimentos enviados por quem treina com a gente. Diferente dos
            depoimentos em destaque, estes chegam direto pelo site e aparecem
            depois de aprovados.
          </p>
        </div>

        {feedbacks.length === 0 ? (
          <p className='text-center text-gray-500'>
            Ainda nao há depoimentos publicados. Seja o primeiro a contar sua
            experiência.
          </p>
        ) : (
          <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {feedbacks.map((feedback) => (
              <article key={feedback.id} className='rounded-lg bg-white p-6 shadow-sm'>
                <div className='mb-3'>
                  <h4 className='font-bold text-blue-900'>{feedback.authorName}</h4>
                  <p className='text-sm text-gray-500'>
                    {disciplineLabel(feedback.discipline)}
                  </p>
                  <Stars rating={feedback.rating} />
                </div>
                <p className='whitespace-pre-line text-gray-600'>{feedback.message}</p>
              </article>
            ))}
          </div>
        )}

        <FeedbackForm />
      </div>
    </section>
  );
};
