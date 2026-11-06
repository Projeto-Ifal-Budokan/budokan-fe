import { getPublishedFeedbacks } from '@/lib/api/services/feedback-service';

import { FeedbackForm } from './feedback-form';
import { TestimonialsCarousel } from './testimonials-carousel';

/**
 * Depoimentos.
 *
 * Componente de servidor: a lista vem do Strapi pelo alias interno da rede do proxy, entao
 * funciona mesmo antes do dominio publico do CMS existir no DNS, e o navegador nunca fala
 * com o CMS. O carrossel e o formulario sao os unicos pedacos de cliente aqui.
 *
 * Esta secao era `testimonials.tsx` (tres depoimentos colados no codigo) e `feedback.tsx`
 * ("O que os praticantes dizem", alimentada pelo CMS) eram duas secoes dizendo a mesma
 * coisa, uma com dados falsos e outra vazia. Ficou uma so, com os dados no lugar onde o
 * conteudo vive: o CMS.
 *
 * `revalidate = 300` na home e o que faz um depoimento aprovado no painel aparecer no site
 * sem redeploy.
 */
const HOME_FEEDBACK_LIMIT = 9;

export const TestimonialsSection = async () => {
  const feedbacks = await getPublishedFeedbacks(HOME_FEEDBACK_LIMIT);

  return (
    <section id='feedback' className='bg-white py-16'>
      <div className='container'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-blue-900'>Depoimentos</h2>
          <div className='bg-primary mx-auto mb-6 h-1 w-20'></div>
          <p className='mx-auto max-w-3xl text-gray-600'>
            Veja o que nossos alunos dizem sobre sua experiência na Budokan-Ryu
            e como as artes marciais transformaram suas vidas.
          </p>
        </div>

        {feedbacks.length === 0 ? (
          <p className='text-center text-gray-500'>
            Ainda não há depoimentos publicados. Seja o primeiro a contar sua
            experiência.
          </p>
        ) : (
          <TestimonialsCarousel items={feedbacks} />
        )}

        <FeedbackForm />
      </div>
    </section>
  );
};
