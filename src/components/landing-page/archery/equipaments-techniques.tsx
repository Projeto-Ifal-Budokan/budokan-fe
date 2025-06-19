import archeryAsset from '@/assets/images/arquearia.png';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';

export const EquipamentsTechniquesSection = () => {
  return (
    <section className='bg-white py-16'>
      <div className='container'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-blue-800'>
            Equipamentos e Técnicas
          </h2>
          <div className='w- 20 mx-auto mb-6 h-1 bg-yellow-500'></div>
          <p className='mx-auto max-w-3xl text-gray-600'>
            A Arquearia utiliza equipamentos tradicionais e técnicas refinadas
            ao longo de séculos, combinando funcionalidade, estética e
            simbolismo.
          </p>
        </div>

        <div className='mb-16 grid items-center gap-12 md:grid-cols-2'>
          <div className='relative h-[400px] overflow-hidden rounded-lg shadow-lg'>
            <Image
              src={archeryAsset}
              alt='Arquearia Equipment'
              fill
              className='object-cover object-[center_25%]'
            />
          </div>
          <div>
            <h3 className='mb-4 text-xl font-bold text-blue-800'>
              Equipamentos
            </h3>
            <p className='mb-6 text-gray-600'>
              Os equipamentos do Arquearia são cuidadosamente elaborados,
              seguindo tradições centenárias e utilizando materiais naturais.
            </p>
            <ul className='space-y-4'>
              <li className='flex items-start'>
                <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                <div>
                  <span className='font-bold text-blue-800'>Yumi (Arco)</span>
                  <p className='text-sm text-gray-600'>
                    Arco assimétrico feito de bambu, madeira e outros materiais
                    naturais, medindo aproximadamente 2,2 metros. É um dos
                    maiores arcos do mundo.
                  </p>
                </div>
              </li>
              <li className='flex items-start'>
                <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                <div>
                  <span className='font-bold text-blue-800'>Ya (Flechas)</span>
                  <p className='text-sm text-gray-600'>
                    Flechas de bambu com penas naturais, geralmente de águia ou
                    falcão. Cada flecha é cuidadosamente equilibrada e
                    personalizada para o arqueiro.
                  </p>
                </div>
              </li>
              <li className='flex items-start'>
                <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                <div>
                  <span className='font-bold text-blue-800'>Yugake (Luva)</span>
                  <p className='text-sm text-gray-600'>
                    Luva especial para a mão direita, feita de couro endurecido,
                    que protege os dedos e permite puxar a corda com força.
                  </p>
                </div>
              </li>
              <li className='flex items-start'>
                <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                <div>
                  <span className='font-bold text-blue-800'>
                    Kyudogi e Hakama
                  </span>
                  <p className='text-sm text-gray-600'>
                    Vestimenta tradicional composta por quimono branco com
                    mangas especiais e hakama (calça-saia plissada).
                  </p>
                </div>
              </li>
              <li className='flex items-start'>
                <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                <div>
                  <span className='font-bold text-blue-800'>Mato (Alvo)</span>
                  <p className='text-sm text-gray-600'>
                    Alvo circular tradicionalmente feito de palha de arroz
                    coberto com papel, medindo 36 cm de diâmetro e posicionado a
                    28 metros de distância.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className='grid items-center gap-12 md:grid-cols-2'>
          <div>
            <h3 className='mb-4 text-xl font-bold text-blue-800'>
              Hassetsu: As Oito Etapas do Tiro
            </h3>
            <p className='mb-6 text-gray-600'>
              O tiro na Arquearia é dividido em oito etapas sequenciais
              (Hassetsu), cada uma com significado técnico e espiritual próprio.
            </p>
            <ol className='space-y-4'>
              <li className='flex items-start'>
                <div className='mt-0.5 mr-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-800'>
                  <span className='text-xs text-white'>1</span>
                </div>
                <div>
                  <span className='font-bold text-blue-800'>Ashibumi</span>
                  <p className='text-sm text-gray-600'>
                    Posicionamento dos pés, estabelecendo uma base estável e
                    equilibrada.
                  </p>
                </div>
              </li>
              <li className='flex items-start'>
                <div className='mt-0.5 mr-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-800'>
                  <span className='text-xs text-white'>2</span>
                </div>
                <div>
                  <span className='font-bold text-blue-800'>Dozukuri</span>
                  <p className='text-sm text-gray-600'>
                    Alinhamento do corpo, criando a postura correta para o tiro.
                  </p>
                </div>
              </li>
              <li className='flex items-start'>
                <div className='mt-0.5 mr-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-800'>
                  <span className='text-xs text-white'>3</span>
                </div>
                <div>
                  <span className='font-bold text-blue-800'>Yugamae</span>
                  <p className='text-sm text-gray-600'>
                    Preparação do arco, posicionando a flecha e ajustando as
                    mãos.
                  </p>
                </div>
              </li>
              <li className='flex items-start'>
                <div className='mt-0.5 mr-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-800'>
                  <span className='text-xs text-white'>4</span>
                </div>
                <div>
                  <span className='font-bold text-blue-800'>Uchiokoshi</span>
                  <p className='text-sm text-gray-600'>
                    Elevação do arco acima da cabeça, simbolizando a conexão
                    entre céu e terra.
                  </p>
                </div>
              </li>
              <li className='flex items-start'>
                <div className='mt-0.5 mr-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-800'>
                  <span className='text-xs text-white'>5</span>
                </div>
                <div>
                  <span className='font-bold text-blue-800'>Hikiwake</span>
                  <p className='text-sm text-gray-600'>
                    Abertura do arco, criando a tensão necessária para o tiro.
                  </p>
                </div>
              </li>
              <li className='flex items-start'>
                <div className='mt-0.5 mr-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-800'>
                  <span className='text-xs text-white'>6</span>
                </div>
                <div>
                  <span className='font-bold text-blue-800'>Kai</span>
                  <p className='text-sm text-gray-600'>
                    Momento de completa extensão e concentração antes do
                    disparo.
                  </p>
                </div>
              </li>
              <li className='flex items-start'>
                <div className='mt-0.5 mr-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-800'>
                  <span className='text-xs text-white'>7</span>
                </div>
                <div>
                  <span className='font-bold text-blue-800'>Hanare</span>
                  <p className='text-sm text-gray-600'>
                    Liberação da flecha, que deve ocorrer naturalmente, sem
                    esforço consciente.
                  </p>
                </div>
              </li>
              <li className='flex items-start'>
                <div className='mt-0.5 mr-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-800'>
                  <span className='text-xs text-white'>8</span>
                </div>
                <div>
                  <span className='font-bold text-blue-800'>Zanshin</span>
                  <p className='text-sm text-gray-600'>
                    Continuidade da forma e da mente após o disparo, mantendo a
                    postura e a concentração.
                  </p>
                </div>
              </li>
            </ol>
          </div>
          <div className='relative h-[400px] overflow-hidden rounded-lg shadow-lg'>
            <Image
              src={archeryAsset}
              alt='Archery Techniques'
              fill
              className='object-cover object-[center_25%]'
            />
          </div>
        </div>

        <div className='mt-12 rounded-lg bg-blue-800 p-8 text-white'>
          <h3 className='mb-4 text-xl font-bold'>
            Conceitos Fundamentais do Arquearia
          </h3>
          <div className='grid gap-6 md:grid-cols-3'>
            <div className='space-y-2'>
              <h4 className='font-bold text-yellow-500'>Shin-Zen-Bi</h4>
              <p className='text-sm opacity-90'>
                Verdade, Bondade e Beleza - os três elementos que devem estar
                presentes em cada tiro. Representa a harmonia entre técnica,
                ética e estética.
              </p>
            </div>
            <div className='space-y-2'>
              <h4 className='font-bold text-yellow-500'>Seisha Hitchu</h4>
              <p className='text-sm opacity-90'>
                &quot;Atirar corretamente é acertar&quot; - princípio que
                enfatiza que a forma correta naturalmente leva ao acerto, sem
                focar no resultado.
              </p>
            </div>
            <div className='space-y-2'>
              <h4 className='font-bold text-yellow-500'>Mushin</h4>
              <p className='text-sm opacity-90'>
                &quot;Mente vazia&quot; - estado mental ideal durante o tiro,
                livre de pensamentos, julgamentos ou expectativas, permitindo
                ação natural e espontânea.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
