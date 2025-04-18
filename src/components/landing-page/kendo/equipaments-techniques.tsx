import { ChevronRight } from 'lucide-react';
import Image from 'next/image';

export const EquipamentsTechniquesSection = () => {
  return (
    <>
      <section className='bg-white py-16'>
        <div className='container'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-bold text-blue-800'>
              Equipamentos e Técnicas
            </h2>
            <div className='mx-auto mb-6 h-1 w-20 bg-yellow-500'></div>
            <p className='mx-auto max-w-3xl text-gray-600'>
              O Kendo utiliza equipamentos específicos e técnicas refinadas ao
              longo de séculos, combinando tradição e funcionalidade.
            </p>
          </div>

          <div className='mb-16 grid items-center gap-12 md:grid-cols-2'>
            <div className='relative h-[400px] overflow-hidden rounded-lg shadow-lg'>
              <Image
                src={''}
                alt='Kendo Equipment'
                fill
                className='object-cover'
              />
            </div>
            <div>
              <h3 className='mb-4 text-xl font-bold text-blue-800'>
                Equipamentos (Bogu)
              </h3>
              <p className='mb-6 text-gray-600'>
                O equipamento de proteção no Kendo é essencial para a prática
                segura e eficaz. Cada peça tem uma função específica e uma
                história rica.
              </p>
              <ul className='space-y-4'>
                <li className='flex items-start'>
                  <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                  <div>
                    <span className='font-bold text-blue-800'>
                      Men (Máscara)
                    </span>
                    <p className='text-sm text-gray-600'>
                      Protege a cabeça, rosto e garganta. Possui uma grade
                      metálica na frente e protetores laterais para as têmporas.
                    </p>
                  </div>
                </li>
                <li className='flex items-start'>
                  <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                  <div>
                    <span className='font-bold text-blue-800'>
                      Kote (Luvas)
                    </span>
                    <p className='text-sm text-gray-600'>
                      Protegem as mãos e os pulsos, áreas vitais no manejo da
                      espada.
                    </p>
                  </div>
                </li>
                <li className='flex items-start'>
                  <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                  <div>
                    <span className='font-bold text-blue-800'>
                      Do (Protetor de Tronco)
                    </span>
                    <p className='text-sm text-gray-600'>
                      Cobre o tórax e o abdômen, protegendo órgãos vitais.
                    </p>
                  </div>
                </li>
                <li className='flex items-start'>
                  <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                  <div>
                    <span className='font-bold text-blue-800'>
                      Tare (Protetor de Quadril)
                    </span>
                    <p className='text-sm text-gray-600'>
                      Protege a região pélvica e as coxas.
                    </p>
                  </div>
                </li>
                <li className='flex items-start'>
                  <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                  <div>
                    <span className='font-bold text-blue-800'>
                      Shinai (Espada de Bambu)
                    </span>
                    <p className='text-sm text-gray-600'>
                      Composta por quatro lâminas de bambu unidas, representa a
                      katana (espada japonesa).
                    </p>
                  </div>
                </li>
                <li className='flex items-start'>
                  <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                  <div>
                    <span className='font-bold text-blue-800'>
                      Keikogi e Hakama
                    </span>
                    <p className='text-sm text-gray-600'>
                      Vestimenta tradicional composta por jaqueta e calça-saia
                      plissada.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className='grid items-center gap-12 md:grid-cols-2'>
            <div>
              <h3 className='mb-4 text-xl font-bold text-blue-800'>
                Técnicas Fundamentais
              </h3>
              <p className='mb-6 text-gray-600'>
                O treinamento de Kendo é estruturado em técnicas básicas que,
                com a prática, evoluem para movimentos mais complexos e
                estratégicos.
              </p>
              <div className='space-y-6'>
                <div>
                  <h4 className='mb-2 font-bold text-blue-800'>
                    Kamae (Posições)
                  </h4>
                  <p className='mb-2 text-gray-600'>
                    As cinco posições básicas que determinam a distância e a
                    estratégia no combate:
                  </p>
                  <ul className='grid grid-cols-2 gap-2 text-sm text-gray-600'>
                    <li className='flex items-center'>
                      <ChevronRight className='mr-1 h-4 w-4 text-yellow-500' />
                      <span>Chudan-no-kamae (central)</span>
                    </li>
                    <li className='flex items-center'>
                      <ChevronRight className='mr-1 h-4 w-4 text-yellow-500' />
                      <span>Jodan-no-kamae (alta)</span>
                    </li>
                    <li className='flex items-center'>
                      <ChevronRight className='mr-1 h-4 w-4 text-yellow-500' />
                      <span>Gedan-no-kamae (baixa)</span>
                    </li>
                    <li className='flex items-center'>
                      <ChevronRight className='mr-1 h-4 w-4 text-yellow-500' />
                      <span>Hasso-no-kamae (lateral)</span>
                    </li>
                    <li className='flex items-center'>
                      <ChevronRight className='mr-1 h-4 w-4 text-yellow-500' />
                      <span>Waki-gamae (oculta)</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className='mb-2 font-bold text-blue-800'>
                    Suburi (Prática de Golpes)
                  </h4>
                  <p className='mb-2 text-gray-600'>
                    Movimentos repetitivos para desenvolver técnica, força e
                    resistência:
                  </p>
                  <ul className='text-sm text-gray-600'>
                    <li className='flex items-center'>
                      <ChevronRight className='mr-1 h-4 w-4 text-yellow-500' />
                      <span>
                        Joge-suburi, Naname-suburi, Shomen-suburi, etc.
                      </span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className='mb-2 font-bold text-blue-800'>
                    Datotsu (Golpes Pontuáveis)
                  </h4>
                  <p className='mb-2 text-gray-600'>
                    Os quatro alvos válidos para pontuação:
                  </p>
                  <ul className='grid grid-cols-2 gap-2 text-sm text-gray-600'>
                    <li className='flex items-center'>
                      <ChevronRight className='mr-1 h-4 w-4 text-yellow-500' />
                      <span>Men (cabeça)</span>
                    </li>
                    <li className='flex items-center'>
                      <ChevronRight className='mr-1 h-4 w-4 text-yellow-500' />
                      <span>Kote (pulso)</span>
                    </li>
                    <li className='flex items-center'>
                      <ChevronRight className='mr-1 h-4 w-4 text-yellow-500' />
                      <span>Do (tronco)</span>
                    </li>
                    <li className='flex items-center'>
                      <ChevronRight className='mr-1 h-4 w-4 text-yellow-500' />
                      <span>Tsuki (garganta)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className='relative h-[400px] overflow-hidden rounded-lg shadow-lg'>
              <Image
                src={''}
                alt='Kendo Techniques'
                fill
                className='object-cover'
              />
            </div>
          </div>

          <div className='mt-12 rounded-lg bg-blue-800 p-8 text-white'>
            <h3 className='mb-4 text-xl font-bold'>
              Conceitos Fundamentais do Kendo
            </h3>
            <div className='grid gap-6 md:grid-cols-3'>
              <div className='space-y-2'>
                <h4 className='font-bold text-yellow-500'>Ki-Ken-Tai-Ichi</h4>
                <p className='text-sm opacity-90'>
                  A unificação do espírito (ki), da espada (ken) e do corpo
                  (tai) em um único momento. Este princípio é essencial para um
                  golpe efetivo no Kendo.
                </p>
              </div>
              <div className='space-y-2'>
                <h4 className='font-bold text-yellow-500'>Ma-ai</h4>
                <p className='text-sm opacity-90'>
                  A distância espacial e temporal entre os oponentes. Dominar o
                  ma-ai é fundamental para o timing correto dos ataques e
                  defesas.
                </p>
              </div>
              <div className='space-y-2'>
                <h4 className='font-bold text-yellow-500'>Zanshin</h4>
                <p className='text-sm opacity-90'>
                  Estado de alerta contínuo e consciência total, mesmo após a
                  execução de um golpe. Representa a prontidão física e mental
                  do praticante.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
