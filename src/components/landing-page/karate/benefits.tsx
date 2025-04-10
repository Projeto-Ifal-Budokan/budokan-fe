import { Award, ChevronRight, Users } from 'lucide-react';

export const BenefitsSection = () => {
  return (
    <section className='bg-gray-50 py-16'>
      <div className='container'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-blue-800'>
            Benefícios do Karate-Do
          </h2>
          <div className='mx-auto mb-6 h-1 w-20 bg-yellow-500'></div>
          <p className='mx-auto max-w-3xl text-gray-600'>
            A prática regular do Karate-Do proporciona inúmeros benefícios
            físicos, mentais e sociais, contribuindo para uma vida mais saudável
            e equilibrada.
          </p>
        </div>

        <div className='grid gap-8 md:grid-cols-3'>
          <div className='rounded-lg bg-white p-6 shadow-md'>
            <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100'>
              <Award className='h-6 w-6 text-blue-800' />
            </div>
            <h3 className='mb-3 text-xl font-bold text-blue-800'>
              Benefícios Físicos
            </h3>
            <ul className='space-y-2 text-gray-600'>
              <li className='flex items-start'>
                <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                <span>Melhora da força, flexibilidade e resistência</span>
              </li>
              <li className='flex items-start'>
                <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                <span>Desenvolvimento da coordenação motora e equilíbrio</span>
              </li>
              <li className='flex items-start'>
                <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                <span>Aumento da capacidade cardiovascular</span>
              </li>
              <li className='flex items-start'>
                <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                <span>Melhora da postura e alinhamento corporal</span>
              </li>
              <li className='flex items-start'>
                <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                <span>Desenvolvimento de reflexos rápidos e precisos</span>
              </li>
            </ul>
          </div>

          <div className='rounded-lg bg-white p-6 shadow-md'>
            <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='h-6 w-6 text-blue-800'
              >
                <path d='M12 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16z' />
                <path d='M12 8v4l3 3' />
              </svg>
            </div>
            <h3 className='mb-3 text-xl font-bold text-blue-800'>
              Benefícios Mentais
            </h3>
            <ul className='space-y-2 text-gray-600'>
              <li className='flex items-start'>
                <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                <span>Redução do estresse e ansiedade</span>
              </li>
              <li className='flex items-start'>
                <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                <span>Aumento da concentração e foco</span>
              </li>
              <li className='flex items-start'>
                <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                <span>Desenvolvimento da disciplina e perseverança</span>
              </li>
              <li className='flex items-start'>
                <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                <span>Melhora da autoconfiança e autoestima</span>
              </li>
              <li className='flex items-start'>
                <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                <span>Desenvolvimento de resiliência emocional</span>
              </li>
            </ul>
          </div>

          <div className='rounded-lg bg-white p-6 shadow-md'>
            <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100'>
              <Users className='h-6 w-6 text-blue-800' />
            </div>
            <h3 className='mb-3 text-xl font-bold text-blue-800'>
              Benefícios Sociais
            </h3>
            <ul className='space-y-2 text-gray-600'>
              <li className='flex items-start'>
                <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                <span>Desenvolvimento de respeito pelos outros</span>
              </li>
              <li className='flex items-start'>
                <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                <span>Integração em uma comunidade de praticantes</span>
              </li>
              <li className='flex items-start'>
                <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                <span>Aprendizado de trabalho em equipe</span>
              </li>
              <li className='flex items-start'>
                <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                <span>Desenvolvimento de liderança e responsabilidade</span>
              </li>
              <li className='flex items-start'>
                <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                <span>Criação de amizades duradouras</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
