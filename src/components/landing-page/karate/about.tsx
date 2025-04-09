import karateDoAsset from '@/assets/images/karate-do.png';
import Image from 'next/image';

export const AboutSection = () => {
  return (
    <section className='bg-white py-16'>
      <div className='container'>
        <div className='grid items-center gap-12 md:grid-cols-2'>
          <div>
            <h2 className='mb-4 text-3xl font-bold text-blue-800'>
              O Que é Karate-Do?
            </h2>
            <div className='mb-6 h-1 w-20 bg-yellow-500'></div>
            <p className='mb-4 text-gray-600'>
              Karate-Do, ou "O Caminho das Mãos Vazias", é uma arte marcial
              japonesa que se originou em Okinawa e foi posteriormente
              desenvolvida no Japão. É caracterizada por golpes lineares,
              bloqueios e chutes, utilizando todas as partes do corpo como armas
              naturais para defesa pessoal.
            </p>
            <p className='mb-4 text-gray-600'>
              Na Budokan-Ryu, praticamos o estilo Shotokan, um dos mais
              tradicionais e difundidos no mundo. Nossa abordagem enfatiza não
              apenas a técnica física, mas também o desenvolvimento do caráter,
              disciplina e respeito, seguindo o verdadeiro espírito do
              Karate-Do.
            </p>
            <p className='text-gray-600'>
              O treinamento de Karate-Do na Budokan-Ryu é adequado para pessoas
              de todas as idades e níveis de condicionamento físico,
              proporcionando benefícios que vão muito além da defesa pessoal.
            </p>
          </div>
          <div className='relative h-[400px] overflow-hidden rounded-lg shadow-lg'>
            <Image
              src={karateDoAsset}
              alt='Karate Training'
              fill
              className='object-cover object-[center_15%]'
            />
          </div>
        </div>
      </div>
    </section>
  );
};
