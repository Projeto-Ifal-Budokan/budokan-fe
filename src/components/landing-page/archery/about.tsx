import archeryAsset from '@/assets/images/archery-discipline.jpeg';
import Image from 'next/image';

export const AboutSection = () => {
  return (
    <section className='bg-white py-16'>
      <div className='container'>
        <div className='grid items-center gap-12 md:grid-cols-2'>
          <div>
            <h2 className='mb-4 text-3xl font-bold text-blue-800'>
              O Que é a Arquearia?
            </h2>
            <div className='mb-6 h-1 w-20 bg-yellow-500'></div>
            <p className='mb-4 text-gray-600'>
              A Arquearia é a prática do tiro com arco. Historicamente, utilizada tanto na caça quanto no combate. 
              Na atualidade, consolidou-se como um esporte competitivo e uma atividade de lazer que promove concentração e disciplina.
            </p>
            <p className='mb-4 text-gray-600'>
              A prática do tiro com arco desenvolve paciência, foco, estabilidade emocional a partir de uma profunda conexão entre o arqueiro, o arco e o alvo. 
              Mais do que uma técnica, a Arquearia é uma arte que busca, por meio da perfeição do tiro, o aperfeiçoamento do caráter.
            </p>
            <p className='text-gray-600'>
              Na Budokan, a Arquearia é praticada de acordo com os princípios e técnicas da Federação Field Brasil, vinculada à International Field Archery Association (IFAA).
            </p>
          </div>
          <div className='relative h-[400px] overflow-hidden rounded-lg shadow-lg'>
            <Image
              src={archeryAsset}
              alt='Arquearia Training'
              fill
              className='object-cover object-[center_70%]'
            />
          </div>
        </div>
      </div>
    </section>
  );
};
