import { Testimonial, testimonialsData } from '@/data/testimonials';
import Image from 'next/image';

export const TestimonialsSection = () => {
  return (
    <section className='bg-gray-50 py-16'>
      <div className='container'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-blue-800'>
            Depoimentos de Alunos
          </h2>
          <div className='mx-auto mb-6 h-1 w-20 bg-yellow-500'></div>
          <p className='mx-auto max-w-3xl text-gray-600'>
            Conheça as experiências de quem já pratica Arquearia na Budokan-Ryu
            e como esta arte marcial transformou suas vidas.
          </p>
        </div>

        <div className='grid gap-8 md:grid-cols-3'>
          {testimonialsData.map((testimonial: Testimonial) => {
            if (testimonial.discipline === 'Archery') {
              return (
                <div key={testimonial.id} className='rounded-lg bg-blue-50 p-6'>
                  <div className='mb-4 flex items-center'>
                    <div className='relative mr-4 h-12 w-12'>
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className='rounded-full object-cover'
                      />
                    </div>
                    <div>
                      <h4 className='font-bold text-blue-800'>
                        {testimonial.name}
                      </h4>
                      <p className='text-sm text-gray-500'>
                        {testimonial.title}
                      </p>
                    </div>
                  </div>
                  <p className='text-gray-600 italic'>{testimonial.quote}</p>
                </div>
              );
            }
          })}
        </div>
      </div>
    </section>
  );
};
