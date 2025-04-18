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
              nossos alunos, com turmas separadas por níveis de experiência.
            </p>

            <div className='space-y-4'>
            <div className='rounded-lg bg-blue-50 p-4'>
                <h3 className='mb-4 flex items-center font-bold text-blue-800'>
                  <Clock className='mr-2 h-5 w-5 text-yellow-500' />
                  Terça-feira
                </h3>
                <ul className='flex w-full flex-row justify-between space-y-1 px-10 text-gray-600'>
                  <li className='flex flex-col justify-between'>
                    <span className='font-medium'>20:00 - 21:30</span>
                  </li>
                </ul>
              </div>

              <div className='rounded-lg bg-blue-50 p-4'>
                <h3 className='mb-4 flex items-center font-bold text-blue-800'>
                  <Clock className='mr-2 h-5 w-5 text-yellow-500' />
                  Quinta-feira
                </h3>
                <ul className='flex w-full flex-row justify-between space-y-1 px-10 text-gray-600'>
                  <li className='flex flex-col justify-between'>
                    <span className='font-medium'>20:00 - 21:30</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className='rounded-lg bg-blue-800 p-8 text-white'>
            <h3 className='mb-4 text-xl font-bold'>Sistema de Graduação</h3>
            <p className='mb-6 opacity-90'>
              No Kendo, o sistema de graduação é dividido em kyu (graus
              iniciantes) e dan (graus avançados), representando o progresso
              técnico e desenvolvimento do praticante.
            </p>
            <div className='space-y-4'>
              <div>
                <h4 className='mb-2 font-bold'>Graus Kyu (Iniciantes)</h4>
                <p className='mb-2 text-sm opacity-90'>
                  Do 6º ao 1º Kyu, em ordem decrescente (6º Kyu sendo o mais
                  básico)
                </p>
                <ul className='space-y-1 text-sm opacity-90'>
                  <li>• Foco em fundamentos básicos e etiqueta</li>
                  <li>• Desenvolvimento de postura e movimentação</li>
                  <li>• Introdução gradual ao uso do bogu (armadura)</li>
                </ul>
              </div>
              <div>
                <h4 className='mb-2 font-bold'>Graus Dan (Avançados)</h4>
                <p className='mb-2 text-sm opacity-90'>
                  Do 1º ao 8º Dan, em ordem crescente (1º Dan sendo a "faixa
                  preta" inicial)
                </p>
                <ul className='space-y-1 text-sm opacity-90'>
                  <li>• Aprofundamento técnico e tático</li>
                  <li>• Desenvolvimento de estilo pessoal</li>
                  <li>• Compreensão filosófica mais profunda</li>
                  <li>• Capacidade de ensinar (a partir de certos níveis)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
