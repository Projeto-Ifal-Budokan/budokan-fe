import Image from 'next/image';

import budokanMembersAsset from '@/assets/images/budokan-members.png';

export const AboutSection = () => {
  return (
    <section id='about' className='bg-white py-16'>
      <div className='container'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-blue-900'>
            Sobre a Budokan-Ryu
          </h2>
          <div className='bg-primary mx-auto mb-6 h-1 w-20'></div>
          <p className='mx-auto max-w-3xl text-gray-600'>
            Há mais de 30 anos formando campeões e transformando vidas através
            das artes marciais tradicionais japonesas.
          </p>
        </div>

        <div className='grid items-center gap-12 md:grid-cols-2'>
          <div className='relative h-[400px] overflow-hidden rounded-lg shadow-lg'>
            <Image
              src={budokanMembersAsset.src}
              alt='Budokan-Ryu Dojo'
              fill
              className='object-cover'
            />
          </div>
          <div>
            <h3 className='mb-4 text-2xl font-bold text-blue-900'>
              Nossa História
            </h3>
            <p className='mb-4 text-gray-600'>
              Fundada em 1985 pelo Sensei Tanaka, a Associação de Artes Marciais
              Budokan-Ryu nasceu com o objetivo de preservar e difundir as artes
              marciais tradicionais japonesas no Brasil, mantendo sua essência,
              filosofia e técnicas.
            </p>
            <p className='mb-4 text-gray-600'>
              Ao longo de mais de três décadas, a Budokan-Ryu se consolidou como uma
              referência no ensino de Karate-Do, Kendo e Arquearia (Tiro com
              Arco), formando não apenas atletas de alto rendimento, mas
              cidadãos íntegros e disciplinados.
            </p>
            <p className='text-gray-600'>
              Nossa escola já formou diversos campeões em competições nacionais
              e internacionais, mas nosso maior orgulho está em ver a
              transformação pessoal de cada aluno que passa por nossas portas,
              independente de idade ou objetivos.
            </p>
          </div>
        </div>

        <div className='mt-16 grid gap-8 md:grid-cols-3'>
          <div className='rounded-lg bg-blue-50 p-6 text-center'>
            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-900'>
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
                className='text-white'
              >
                <path d='M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z' />
                <path d='m9 12 2 2 4-4' />
              </svg>
            </div>
            <h4 className='mb-2 text-xl font-bold text-blue-900'>Missão</h4>
            <p className='text-gray-600'>
              Promover o desenvolvimento integral dos indivíduos por meio das
              artes marciais tradicionais, cultivando disciplina, respeito e
              harmonia entre corpo e mente, preservando as tradições culturais
              do karatê, kendô e arqueria.
            </p>
          </div>

          <div className='rounded-lg bg-blue-50 p-6 text-center'>
            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-900'>
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
                className='text-white'
              >
                <path d='M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z' />
                <circle cx='12' cy='12' r='3' />
              </svg>
            </div>
            <h4 className='mb-2 text-xl font-bold text-blue-900'>Visão</h4>
            <p className='text-gray-600'>
              Ser reconhecida como a principal escola de artes marciais
              tradicionais em Maceió, destacando-se pela excelência no ensino do
              karatê, kendô e arqueria, formando indivíduos que exemplifiquem os
              valores marciais na sociedade.
            </p>
          </div>

          <div className='rounded-lg bg-blue-50 p-6 text-center'>
            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-900'>
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
                className='text-white'
              >
                <path d='M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z' />
              </svg>
            </div>
            <h4 className='mb-2 text-xl font-bold text-blue-900'>Valores</h4>
            <p className='text-gray-600'>
              Disciplina, respeito, honra, perseverança, humildade, tradição e
              comunidade são os pilares que sustentam nossa filosofia de ensino
              e convivência.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
