import Image from "next/image";
import archeryAsset from '@/assets/images/arquearia.png'

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
              Arquearia, ou "O Caminho do Arco", é a arte marcial japonesa do tiro
              com arco tradicional. Mais que uma simples prática de precisão, a
              Arquearia é considerado uma forma de desenvolvimento espiritual e
              meditação em movimento, onde cada tiro representa uma jornada de
              autoconhecimento.
            </p>
            <p className='mb-4 text-gray-600'>
              Na Budokan, praticamos a Arquearia seguindo os princípios e técnicas
              estabelecidos pela Federação Japonesa de Arquearia, com ênfase na
              forma correta (kata), respiração, concentração e harmonia entre
              corpo e mente.
            </p>
            <p className='text-gray-600'>
              O treinamento da Arquearia desenvolve paciência, foco, estabilidade
              emocional e uma profunda conexão entre o praticante, o arco e o
              alvo. É uma arte que transcende a mera habilidade técnica,
              buscando a perfeição do caráter através da perfeição do tiro.
            </p>
          </div>
          <div className='relative h-[400px] overflow-hidden rounded-lg shadow-lg'>
            <Image
              src={archeryAsset}
              alt='Arquearia Training'
              fill
              className='object-cover object-[center_20%]'
            />
          </div>
        </div>
      </div>
    </section>
  );
};
