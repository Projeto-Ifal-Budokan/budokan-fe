import { instructors } from '@/data/instructors';
import { User2 } from 'lucide-react';
import Image from 'next/image';

export const InstructorsSection = () => {
  return (
    <section id='instructors' className='bg-white py-16'>
      <div className='container'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-blue-900'>
            Nossos Senseis
          </h2>
          <div className='bg-primary mx-auto mb-6 h-1 w-20'></div>
          <p className='mx-auto max-w-3xl text-gray-600'>
            Conheça os mestres que dedicam suas vidas à preservação e ao ensino
            das artes marciais tradicionais japonesas.
          </p>
        </div>

        <div className='grid gap-8 md:grid-cols-3'>
          {instructors.map((instructor, index) => (
            <div key={index} className='rounded-lg bg-blue-50 p-6 text-center'>
              <div className='relative mx-auto mb-4 h-32 w-32'>
                {instructor.imageSrc ? (
                  <Image
                    src={instructor.imageSrc ?? ''}
                    alt={instructor.alt}
                    fill
                    className='rounded-full object-cover'
                  />
                ) : (
                  <div className='flex h-full w-full items-center justify-center rounded-full bg-gray-200 text-gray-500'>
                    <User2 size={64} />
                  </div>
                )}
              </div>
              <h3 className='mb-1 text-xl font-bold text-blue-900'>
                {instructor.name}
              </h3>
              <p className='text-primary mb-3 font-medium'>
                {instructor.title}
              </p>
              <p className='text-gray-600'>{instructor.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
