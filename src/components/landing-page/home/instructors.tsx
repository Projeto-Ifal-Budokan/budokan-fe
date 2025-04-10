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
          <div className='rounded-lg bg-blue-50 p-6 text-center'>
            <div className='relative mx-auto mb-4 h-32 w-32'>
              <Image
                src='/placeholder.svg?height=150&width=150'
                alt='Sensei Tanaka'
                fill
                className='rounded-full object-cover'
              />
            </div>
            <h3 className='mb-1 text-xl font-bold text-blue-900'>
              Sensei Tanaka
            </h3>
            <p className='text-primary mb-3 font-medium'>Karate-Do - 7º Dan</p>
            <p className='text-gray-600'>
              Fundador da Budokan-Ryu, treina Karate há mais de 40 anos. Formado
              diretamente pelos grandes mestres japoneses, é reconhecido
              internacionalmente por sua técnica e dedicação ao ensino.
            </p>
          </div>

          <div className='rounded-lg bg-blue-50 p-6 text-center'>
            <div className='relative mx-auto mb-4 h-32 w-32'>
              <Image
                src='/placeholder.svg?height=150&width=150'
                alt='Sensei Yamamoto'
                fill
                className='rounded-full object-cover'
              />
            </div>
            <h3 className='mb-1 text-xl font-bold text-blue-900'>
              Sensei Yamamoto
            </h3>
            <p className='text-primary mb-3 font-medium'>Kendo - 5º Dan</p>
            <p className='text-gray-600'>
              Com mais de 25 anos de experiência, é responsável pela divisão de
              Kendo da Budokan-Ryu. Participou de diversos campeonatos mundiais
              e é referência na formação de novos kendokas.
            </p>
          </div>

          <div className='rounded-lg bg-blue-50 p-6 text-center'>
            <div className='relative mx-auto mb-4 h-32 w-32'>
              <Image
                src='/placeholder.svg?height=150&width=150'
                alt='Sensei Sato'
                fill
                className='rounded-full object-cover'
              />
            </div>
            <h3 className='mb-1 text-xl font-bold text-blue-900'>
              Sensei Sato
            </h3>
            <p className='text-primary mb-3 font-medium'>Arquearia - 6º Dan</p>
            <p className='text-gray-600'>
              Especialista em Arquearia, treinou por mais de 15 anos no Japão
              antes de retornar ao Brasil para difundir esta arte milenar. É
              reconhecido por sua precisão técnica e profundo conhecimento
              filosófico.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
