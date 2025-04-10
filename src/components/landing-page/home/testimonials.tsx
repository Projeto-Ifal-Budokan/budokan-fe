import { Testimonial, testimonialsData } from '@/data/testimonials';
import Image from 'next/image';

export const TestimonialsSection = () => {
  return (
    <section className='bg-white py-16'>
      <div className='container'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-blue-900'>Depoimentos</h2>
          <div className='bg-primary mx-auto mb-6 h-1 w-20'></div>
          <p className='mx-auto max-w-3xl text-gray-600'>
            Veja o que nossos alunos dizem sobre sua experiência na Budokan-Ryu
            e como as artes marciais transformaram suas vidas.
          </p>
        </div>

        <div className='grid gap-8 md:grid-cols-3'>
          {testimonialsData.map((testimonial: Testimonial) => (
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
                  <h4 className='font-bold text-blue-900'>
                    {testimonial.name}
                  </h4>
                  <p className='text-sm text-gray-500'>{testimonial.title}</p>
                </div>
              </div>
              <p className='text-gray-600 italic'>{testimonial.quote}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
