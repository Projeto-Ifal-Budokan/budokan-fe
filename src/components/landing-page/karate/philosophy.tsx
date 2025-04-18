import { Manner, dojoManners } from '@/data/dojo-manners';
import { ChevronRight } from 'lucide-react';

export const PhiloshophySession = () => {
  const numberOfRows = Math.ceil(dojoManners.length / 2);

  const gridRowsClass = `md:grid-rows-${numberOfRows}`;

  return (
    <div className='mt-12 rounded-lg bg-blue-800 p-8 text-white'>
      <h3 className='mb-4 text-xl font-bold'>
        Filosofia e Etiqueta do Karate-Do
      </h3>
      <p className='mb-6'>
        O Karate-Do vai muito além das técnicas físicas. Na Budokan, enfatizamos
        os princípios filosóficos que guiam o verdadeiro praticante:
      </p>

      <div
        className={`grid grid-flow-col gap-6 md:grid-cols-2 ${gridRowsClass}`}
      >
        {dojoManners.map((manner: Manner) => (
          <div key={manner.id} className='flex items-start'>
            <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
            <div>
              <span className='font-bold'>
                {manner.id}. {manner.description}
              </span>
              <p className='mt-1 text-sm opacity-80'>{manner.comment}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
