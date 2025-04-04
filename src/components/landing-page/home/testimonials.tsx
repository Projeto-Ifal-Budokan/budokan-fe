import Image from 'next/image';

export const TestimonialssSection = () => {
  return (
    <section className='bg-white py-16'>
      <div className='container'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-blue-900'>Depoimentos</h2>
          <div className='bg-primary mx-auto mb-6 h-1 w-20'></div>
          <p className='mx-auto max-w-3xl text-gray-600'>
            Veja o que nossos alunos dizem sobre sua experiência na Budokan e
            como as artes marciais transformaram suas vidas.
          </p>
        </div>

        <div className='grid gap-8 md:grid-cols-3'>
          <div className='rounded-lg bg-blue-50 p-6'>
            <div className='mb-4 flex items-center'>
              <div className='relative mr-4 h-12 w-12'>
                <Image
                  src='/placeholder.svg?height=50&width=50'
                  alt='Student'
                  fill
                  className='rounded-full object-cover'
                />
              </div>
              <div>
                <h4 className='font-bold text-blue-900'>Carlos Silva</h4>
                <p className='text-sm text-gray-500'>
                  Praticante de Karate-Do há 5 anos
                </p>
              </div>
            </div>
            <p className='text-gray-600 italic'>
              "A Budokan mudou minha vida. Além de melhorar minha condição
              física, o Karate-Do me ensinou disciplina, foco e respeito,
              valores que aplico diariamente em minha vida pessoal e
              profissional."
            </p>
          </div>

          <div className='rounded-lg bg-blue-50 p-6'>
            <div className='mb-4 flex items-center'>
              <div className='relative mr-4 h-12 w-12'>
                <Image
                  src='/placeholder.svg?height=50&width=50'
                  alt='Student'
                  fill
                  className='rounded-full object-cover'
                />
              </div>
              <div>
                <h4 className='font-bold text-blue-900'>Mariana Santos</h4>
                <p className='text-sm text-gray-500'>
                  Praticante de Kendo há 3 anos
                </p>
              </div>
            </div>
            <p className='text-gray-600 italic'>
              "O ambiente na Budokan é acolhedor e ao mesmo tempo desafiador. Os
              senseis são extremamente qualificados e atenciosos. O Kendo me
              trouxe equilíbrio emocional e físico que eu não encontrei em
              nenhuma outra atividade."
            </p>
          </div>

          <div className='rounded-lg bg-blue-50 p-6'>
            <div className='mb-4 flex items-center'>
              <div className='relative mr-4 h-12 w-12'>
                <Image
                  src='/placeholder.svg?height=50&width=50'
                  alt='Student'
                  fill
                  className='rounded-full object-cover'
                />
              </div>
              <div>
                <h4 className='font-bold text-blue-900'>Roberto Tanaka</h4>
                <p className='text-sm text-gray-500'>
                  Praticante de Arquearia há 7 anos
                </p>
              </div>
            </div>
            <p className='text-gray-600 italic'>
              "O Arquearia na Budokan é uma experiência transformadora. Mais que
              uma arte marcial, é uma jornada de autoconhecimento. Cada tiro com
              o arco é uma oportunidade de conectar corpo, mente e espírito em
              perfeita harmonia."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
