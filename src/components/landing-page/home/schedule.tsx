import { Button } from '@/components/ui/button';

export const ScheduleSection = () => {
  return (
    <section id='schedule' className='bg-blue-900 py-16 text-white'>
      <div className='container'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-bold'>Horários de Aulas</h2>
          <div className='bg-primary mx-auto mb-6 h-1 w-20'></div>
          <p className='mx-auto max-w-3xl opacity-80'>
            Oferecemos horários flexíveis para atender às necessidades de nossos
            alunos, com turmas para diferentes níveis e faixas etárias.
          </p>
        </div>

        <div className='grid gap-8 md:grid-cols-3'>
          <div className='rounded-lg bg-white/10 p-6 backdrop-blur-sm'>
            <h3 className='text-primary mb-4 text-xl font-bold'>Karate-Do</h3>
            <ul className='space-y-4'>
              <li className='flex justify-between'>
                <span>Segunda, Quarta e Sexta</span>
                <span>17:00 - 18:00</span>
              </li>
              <li className='flex justify-between'>
                <span>Segunda, Quarta e Sexta</span>
                <span>18:00 - 19:30</span>
              </li>
              <li className='flex justify-between'>
                <span>Segunda, Quarta e Sexta</span>
                <span>19:30 - 21:00</span>
              </li>
            </ul>
            <div className='mt-6 border-t border-white/20 pt-4'>
              <h4 className='mb-2 font-medium'>Níveis</h4>
              <div className='flex flex-wrap gap-2'>
                <span className='bg-primary rounded-full px-2 py-1 text-xs text-white'>
                  Infantil
                </span>
                <span className='bg-primary rounded-full px-2 py-1 text-xs text-white'>
                  Juvenil
                </span>
                <span className='bg-primary rounded-full px-2 py-1 text-xs text-white'>
                  Adulto
                </span>
              </div>
            </div>
          </div>

          <div className='rounded-lg bg-white/10 p-6 backdrop-blur-sm'>
            <h3 className='text-primary mb-4 text-xl font-bold'>Kendo</h3>
            <ul className='space-y-4'>
              <li className='flex justify-between'>
                <span>Terça e Quinta</span>
                <span>18:00 - 19:30</span>
              </li>
              <li className='flex justify-between'>
                <span>Terça e Quinta</span>
                <span>19:30 - 21:00</span>
              </li>
              <li className='flex justify-between'>
                <span>Sábado</span>
                <span>10:00 - 12:00</span>
              </li>
            </ul>
            <div className='mt-6 border-t border-white/20 pt-4'>
              <h4 className='mb-2 font-medium'>Níveis</h4>
              <div className='flex flex-wrap gap-2'>
                <span className='bg-primary rounded-full px-2 py-1 text-xs text-white'>
                  Iniciantes
                </span>
                <span className='bg-primary rounded-full px-2 py-1 text-xs text-white'>
                  Intermediários
                </span>
                <span className='bg-primary rounded-full px-2 py-1 text-xs text-white'>
                  Avançados
                </span>
              </div>
            </div>
          </div>

          <div className='rounded-lg bg-white/10 p-6 backdrop-blur-sm'>
            <h3 className='text-primary mb-4 text-xl font-bold'>
              Kyudo (Tiro com Arco)
            </h3>
            <ul className='space-y-4'>
              <li className='flex justify-between'>
                <span>Sábado</span>
                <span>09:00 - 12:00</span>
              </li>
              <li className='flex justify-between'>
                <span>Domingo</span>
                <span>09:00 - 12:00</span>
              </li>
              <li className='flex justify-between'>
                <span>Quarta-feira</span>
                <span>19:00 - 21:00</span>
              </li>
            </ul>
            <div className='mt-6 border-t border-white/20 pt-4'>
              <h4 className='mb-2 font-medium'>Níveis</h4>
              <div className='flex flex-wrap gap-2'>
                <span className='bg-primary rounded-full px-2 py-1 text-xs text-white'>
                  Iniciantes
                </span>
                <span className='bg-primary rounded-full px-2 py-1 text-xs text-white'>
                  Intermediários
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-12 text-center'>
          <p className='mb-6 opacity-80'>
            Interessado em começar? Agende uma aula experimental gratuita!
          </p>
          <Button className='bg-primary hover:bg-primary/90/80 border-0 px-8 py-6 text-lg font-bold text-white'>
            Agendar Aula Experimental
          </Button>
        </div>
      </div>
    </section>
  );
};
