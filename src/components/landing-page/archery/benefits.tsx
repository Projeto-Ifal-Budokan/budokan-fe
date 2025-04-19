import { Award, ChevronRight, Users } from 'lucide-react';

export const BenefitsSection = () => {
  return (
    <section className='bg-gray-50 py-16'>
      <div className='container'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-blue-800'>
            Benefícios da Arquearia
          </h2>
          <div className='mx-auto mb-6 h-1 w-20 bg-yellow-500'></div>
          <p className='mx-auto max-w-3xl text-gray-600'>
            A prática regular da Arquearia proporciona inúmeros benefícios físicos,
            mentais e espirituais, contribuindo para o desenvolvimento integral
            do praticante.
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
                <span>
                  Fortalecimento dos músculos das costas, ombros e braços
                </span>
              </li>
              <li className='flex items-start'>
                <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                <span>Melhora da postura e alinhamento corporal</span>
              </li>
              <li className='flex items-start'>
                <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                <span>Desenvolvimento de estabilidade e equilíbrio</span>
              </li>
              <li className='flex items-start'>
                <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                <span>Aprimoramento da coordenação olho-mão</span>
              </li>
              <li className='flex items-start'>
                <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                <span>Controle respiratório e relaxamento muscular</span>
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
                <span>Desenvolvimento de concentração profunda</span>
              </li>
              <li className='flex items-start'>
                <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                <span>Redução significativa do estresse e ansiedade</span>
              </li>
              <li className='flex items-start'>
                <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                <span>Cultivo da paciência e perseverança</span>
              </li>
              <li className='flex items-start'>
                <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                <span>Melhora da capacidade de foco e atenção plena</span>
              </li>
              <li className='flex items-start'>
                <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                <span>Desenvolvimento de autocontrole emocional</span>
              </li>
            </ul>
          </div>

          <div className='rounded-lg bg-white p-6 shadow-md'>
            <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100'>
              <Users className='h-6 w-6 text-blue-800' />
            </div>
            <h3 className='mb-3 text-xl font-bold text-blue-800'>
              Benefícios Espirituais
            </h3>
            <ul className='space-y-2 text-gray-600'>
              <li className='flex items-start'>
                <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                <span>Prática de meditação em movimento</span>
              </li>
              <li className='flex items-start'>
                <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                <span>Desenvolvimento de autoconhecimento</span>
              </li>
              <li className='flex items-start'>
                <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                <span>Cultivo da harmonia entre corpo, mente e espírito</span>
              </li>
              <li className='flex items-start'>
                <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                <span>Conexão com tradições e valores ancestrais</span>
              </li>
              <li className='flex items-start'>
                <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                <span>Transcendência do ego através da prática</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
