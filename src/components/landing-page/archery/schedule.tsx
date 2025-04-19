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
              nossos alunos, com treinos realizados em nosso dojo especialmente
              adaptado para a prática da Arquearia.
            </p>

            <div className='space-y-4'>
              <div className='rounded-lg bg-blue-50 p-4'>
                <h3 className='mb-2 flex items-center font-bold text-blue-800'>
                  <Clock className='mr-2 h-5 w-5 text-yellow-500' />
                  Treinos Regulares
                </h3>
                <ul className='space-y-1 text-gray-600'>
                  <li className='flex justify-between'>
                    <span>Sábado</span>
                    <span className='font-medium'>09:00 - 12:00</span>
                  </li>
                  <li className='flex justify-between'>
                    <span>Domingo</span>
                    <span className='font-medium'>09:00 - 12:00</span>
                  </li>
                </ul>
              </div>
              <div className='rounded-lg bg-blue-50 p-4'>
                <h3 className='mb-2 flex items-center font-bold text-blue-800'>
                  <Clock className='mr-2 h-5 w-5 text-yellow-500' />
                  Treinos Especiais (Mediante Agendamento)
                </h3>
                <ul className='space-y-1 text-gray-600'>
                  <li className='flex justify-between'>
                    <span>Quarta-feira</span>
                    <span className='font-medium'>19:00 - 21:00</span>
                  </li>
                </ul>
              </div>
              <div className='rounded-lg bg-blue-50 p-4'>
                <h3 className='mb-2 flex items-center font-bold text-blue-800'>
                  <Clock className='mr-2 h-5 w-5 text-yellow-500' />
                  Demonstrações e Eventos Especiais
                </h3>
                <p className='text-sm text-gray-600'>
                  Realizamos periodicamente demonstrações públicas e eventos
                  especiais como o Toshiya (competição tradicional) e cerimônias
                  de abertura do ano. Consulte nosso calendário para as próximas
                  datas.
                </p>
              </div>
            </div>
          </div>
          <div className='rounded-lg bg-blue-800 p-8 text-white'>
            <h3 className='mb-4 text-xl font-bold'>Sistema de Graduação</h3>
            <p className='mb-6 opacity-90'>
              Na Arquearia, o sistema de graduação segue o padrão tradicional
              japonês de kyu e dan, representando o progresso técnico e
              desenvolvimento do praticante.
            </p>
            <div className='space-y-4'>
              <div>
                <h4 className='mb-2 font-bold'>Graus Kyu (Iniciantes)</h4>
                <p className='mb-2 text-sm opacity-90'>
                  Do 6º ao 1º Kyu, em ordem decrescente (6º Kyu sendo o mais
                  básico)
                </p>
                <ul className='space-y-1 text-sm opacity-90'>
                  <li>• Foco em postura, respiração e movimentos básicos</li>
                  <li>• Aprendizado da sequência das oito etapas (Hassetsu)</li>
                  <li>
                    • Desenvolvimento da forma correta sem preocupação com
                    acertos
                  </li>
                </ul>
              </div>
              <div>
                <h4 className='mb-2 font-bold'>Graus Dan (Avançados)</h4>
                <p className='mb-2 text-sm opacity-90'>
                  Do 1º ao 10º Dan, em ordem crescente (1º Dan sendo a "faixa
                  preta" inicial)
                </p>
                <ul className='space-y-1 text-sm opacity-90'>
                  <li>
                    • Refinamento técnico e desenvolvimento de estilo pessoal
                  </li>
                  <li>
                    • Compreensão mais profunda dos princípios filosóficos
                  </li>
                  <li>• Capacidade de ensinar (a partir de certos níveis)</li>
                  <li>• Participação em cerimônias formais e demonstrações</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
