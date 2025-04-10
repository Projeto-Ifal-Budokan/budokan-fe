import { Clock } from 'lucide-react';

export const ScheduleSection = () => {
  return (
    <section className='bg-white py-16'>
      <div className='container'>
        <div className='grid items-center gap-12 md:grid-cols-2'>
          <div>
            <h2 className='mb-4 text-3xl font-bold text-blue-800'>
              Horários de Treinamento
            </h2>
            <div className='mb-6 h-1 w-20 bg-yellow-500'></div>
            <p className='mb-6 text-gray-600'>
              Oferecemos horários flexíveis para atender às necessidades de
              nossos alunos, com turmas separadas por níveis de experiência e
              faixas etárias.
            </p>

            <div className='space-y-4'>
              <div className='rounded-lg bg-blue-50 p-4'>
                <h3 className='mb-4 flex items-center font-bold text-blue-800'>
                  <Clock className='mr-2 h-5 w-5 text-yellow-500' />
                  Segunda-feira
                </h3>
                <ul className='flex w-full flex-row justify-between space-y-1 px-10 text-gray-600'>
                  <li className='flex flex-col justify-between'>
                    <span className='font-medium'>07:00 - 08:00</span>
                  </li>
                  <li className='flex flex-col justify-between'>
                    <span className='font-medium'>17:00 - 18:00</span>
                  </li>
                  <li className='flex flex-col justify-between'>
                    <span className='font-medium'>18:30 - 19:30</span>
                    <span className='font-medium'>19:30 - 20:30</span>
                  </li>
                </ul>
              </div>

              <div className='rounded-lg bg-blue-50 p-4'>
                <h3 className='mb-4 flex items-center font-bold text-blue-800'>
                  <Clock className='mr-2 h-5 w-5 text-yellow-500' />
                  Quarta-feira
                </h3>
                <ul className='flex w-full flex-row justify-between space-y-1 px-10 text-gray-600'>
                  <li className='flex flex-col justify-between'>
                    <span className='font-medium'>07:00 - 08:00</span>
                  </li>
                  <li className='flex flex-col justify-between'>
                    <span className='font-medium'>16:00 - 17:00</span>
                    <span className='font-medium'>17:00 - 18:00</span>
                  </li>
                  <li className='flex flex-col justify-between'>
                    <span className='font-medium'>18:30 - 19:30</span>
                    <span className='font-medium'>19:30 - 20:30</span>
                  </li>
                </ul>
              </div>

              <div className='rounded-lg bg-blue-50 p-4'>
                <h3 className='mb-4 flex items-center font-bold text-blue-800'>
                  <Clock className='mr-2 h-5 w-5 text-yellow-500' />
                  Sexta-feira
                </h3>
                <ul className='flex w-full flex-row justify-between space-y-1 px-10 text-gray-600'>
                  <li className='flex flex-col justify-between'>
                    <span className='font-medium'>07:00 - 08:00</span>
                  </li>
                  <li className='flex flex-col justify-between'>
                    <span className='font-medium'>16:00 - 17:00</span>
                    <span className='font-medium'>17:00 - 18:00</span>
                  </li>
                  <li className='flex flex-col justify-between'>
                    <span className='font-medium'>18:30 - 19:30</span>
                    <span className='font-medium'>19:30 - 20:30</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className='rounded-lg bg-blue-800 p-8 text-white'>
            <h3 className='mb-4 text-xl font-bold'>Sistema de Graduação</h3>
            <p className='mb-6 opacity-90'>
              No Karate-Do Shotokan, o sistema de graduação é dividido em kyu
              (faixas coloridas) e dan (faixas pretas), representando o
              progresso técnico e desenvolvimento do praticante.
            </p>
            <div className='space-y-4'>
              <div>
                <h4 className='mb-2 font-bold'>
                  Faixas Kyu (Iniciantes a Intermediários)
                </h4>
                <div className='grid-cols grid gap-2'>
                  <div className='flex items-center'>
                    <div className='mr-2 h-4 w-4 rounded-full bg-white'></div>
                    <span>7º Kyu - Branca</span>
                  </div>
                  <div className='flex items-center'>
                    <div className='mr-2 h-4 w-4 rounded-full bg-yellow-300'></div>
                    <span>6º Kyu - Amarela</span>
                  </div>
                  <div className='flex items-center'>
                    <div className='mr-2 h-4 w-4 rounded-full bg-red-500'></div>
                    <span>5º Kyu - Vermelha</span>
                  </div>
                  <div className='flex items-center'>
                    <div className='mr-2 h-4 w-4 rounded-full bg-orange-500'></div>
                    <span>4º Kyu - Laranja</span>
                  </div>
                  <div className='flex items-center'>
                    <div className='mr-2 h-4 w-4 rounded-full bg-green-700'></div>
                    <span>3º Kyu - Verde</span>
                  </div>
                  <div className='flex items-center'>
                    <div className='mr-2 h-4 w-4 rounded-full bg-purple-500'></div>
                    <span>2º Kyu - Roxa</span>
                  </div>
                  <div className='flex items-center'>
                    <div className='mr-2 h-4 w-4 rounded-full bg-amber-950'></div>
                    <span>1º Kyu - Marron</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className='mb-2 font-bold'>Faixas Dan (Avançados)</h4>
                <p className='mb-2 text-sm opacity-90'>
                  Do 1º ao 10º Dan - Faixa Preta (com diferentes níveis de
                  experiência e conhecimento)
                </p>
                <div className='flex items-center'>
                  <div className='mr-2 h-4 w-4 rounded-full border border-white bg-black'></div>
                  <span>
                    Faixa Preta - Representa dedicação e domínio técnico
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
