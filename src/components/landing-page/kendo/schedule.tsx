import { Clock } from 'lucide-react';

export const ScheduleSection = () => {
  return (
    <section className='bg-white py-16'>
      <div className='container'>
        <div className='mb-12 text-center'>
          <div>
            <h2 className='mb-4 text-3xl font-bold text-blue-800'>
              Horários de Treinamento
            </h2>
            <div className='mx-auto mb-6 h-1 w-20 bg-yellow-500'></div>
            <p className='mx-auto mb-8 max-w-3xl text-gray-600'>
              Oferecemos horários flexíveis para atender às necessidades de
              nossos alunos, com turmas separadas por níveis de experiência.
            </p>

            <div className='grid grid-cols-2 gap-8'>
              <div className='rounded-lg bg-blue-50 p-4'>
                <h3 className='mb-2 flex items-center justify-center font-bold text-blue-800'>
                  <Clock className='mr-2 h-5 w-5 text-yellow-500' />
                  Terça-feira
                </h3>
                <ul className='mt-5 text-gray-600'>
                  <li className='flex items-center justify-center'>
                    <span className='font-bold'>20:00 - 21:30</span>
                  </li>
                </ul>
              </div>

              <div className='rounded-lg bg-blue-50 p-4'>
                <h3 className='mb-2 flex items-center justify-center font-bold text-blue-800'>
                  <Clock className='mr-2 h-5 w-5 text-yellow-500' />
                  Quinta-feira
                </h3>
                <ul className='mt-5 text-gray-600'>
                  <li className='flex items-center justify-center'>
                    <span className='font-bold'>20:00 - 21:30</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
