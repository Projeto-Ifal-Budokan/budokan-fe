import Image from 'next/image';

export const TestimonialsSection = () => {
  return (
    <section className='bg-gray-50 py-16'>
      <div className='container'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-blue-800'>
            Depoimentos de Alunos
          </h2>
          <div className='mx-auto mb-6 h-1 w-20 bg-yellow-500'></div>
          <p className='mx-auto max-w-3xl text-gray-600'>
            Conheça as experiências de quem já pratica Karate-Do na Budokan e
            como esta arte marcial transformou suas vidas.
          </p>
        </div>

        <div className='grid gap-8 md:grid-cols-3'>
          <div className='rounded-lg bg-white p-6 shadow-md'>
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
                <h4 className='font-bold text-blue-800'>Ricardo Mendes</h4>
                <p className='text-sm text-gray-500'>
                  Faixa Marrom - 5 anos de prática
                </p>
              </div>
            </div>
            <p className='text-gray-600 italic'>
              "O Karate-Do na Budokan mudou completamente minha vida. Além da
              condição física, ganhei disciplina e foco que aplico em todos os
              aspectos do meu dia a dia. O Sensei Tanaka é um mestre excepcional
              que sabe equilibrar tradição e modernidade."
            </p>
          </div>

          <div className='rounded-lg bg-white p-6 shadow-md'>
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
                <h4 className='font-bold text-blue-800'>Juliana Costa</h4>
                <p className='text-sm text-gray-500'>
                  Faixa Azul - 2 anos de prática
                </p>
              </div>
            </div>
            <p className='text-gray-600 italic'>
              "Comecei o Karate aos 35 anos, achando que seria tarde demais. A
              Budokan me mostrou que nunca é tarde para começar. O ambiente é
              acolhedor e respeitoso, e os professores têm paciência com alunos
              de todos os níveis. Minha confiança aumentou significativamente."
            </p>
          </div>

          <div className='rounded-lg bg-white p-6 shadow-md'>
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
                <h4 className='font-bold text-blue-800'>Pedro Oliveira</h4>
                <p className='text-sm text-gray-500'>
                  Faixa Verde - Pai de aluno
                </p>
              </div>
            </div>
            <p className='text-gray-600 italic'>
              "Matriculei meu filho de 9 anos e acabei me juntando também. Ver a
              transformação dele em termos de disciplina e respeito foi
              incrível. As aulas são desafiadoras mas divertidas, e o Karate se
              tornou uma atividade que fazemos juntos, fortalecendo nosso
              vínculo."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
