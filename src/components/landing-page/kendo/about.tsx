import kendoAsset from '@/assets/images/kendo.png';
import Image from 'next/image';

export const AboutSection = () => {
  return (
    <>
      <section className='bg-white py-16'>
        <div className='container'>
          <div className='grid items-center gap-12 md:grid-cols-2'>
            <div>
              <h2 className='mb-4 text-3xl font-bold text-blue-800'>
                O Que é Kendo?
              </h2>
              <div className='mb-6 h-1 w-20 bg-yellow-500'></div>
              <p className='mb-4 text-gray-600'>
                Kendo, ou &quot;O Caminho da Espada&quot;, é uma arte marcial
                japonesa moderna que descende diretamente das técnicas de
                combate dos samurais. Utilizando espadas de bambu (shinai) e
                armaduras protetoras (bogu), o Kendo preserva a essência do
                combate com espadas japonesas em um formato seguro e esportivo.
              </p>
              <p className='mb-4 text-gray-600'>
                Na Budokan-Ryu, praticamos o Kendo seguindo os princípios e
                técnicas estabelecidos pela Federação Internacional de Kendo,
                com ênfase tanto no aspecto técnico quanto no desenvolvimento
                espiritual e filosófico desta arte.
              </p>
              <p className='text-gray-600'>
                O treinamento de Kendo desenvolve força, velocidade, precisão e,
                acima de tudo, um espírito forte e determinado. É uma prática
                que transcende o simples combate, tornando-se um caminho para o
                aperfeiçoamento pessoal.
              </p>
            </div>
            <div className='relative h-[400px] overflow-hidden rounded-lg shadow-lg'>
              <Image
                src={kendoAsset}
                alt='Kendo Training'
                fill
                className='object-cover object-[center_15%]'
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
