import { ChevronRight } from 'lucide-react';

export const KarateTrainingSection = () => {
  return (
    <section className='bg-white py-16'>
      <div className='container'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-blue-800'>
            Técnicas e Treinamento
          </h2>
          <div className='mx-auto mb-6 h-1 w-20 bg-yellow-500'></div>
          <p className='mx-auto max-w-3xl text-gray-600'>
            O treinamento de Karate-Do na Budokan é estruturado em três pilares
            fundamentais, proporcionando um desenvolvimento completo do
            praticante.
          </p>
        </div>

        <div className='grid gap-8 md:grid-cols-3'>
          <div className='rounded-lg bg-blue-50 p-6'>
            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-800'>
              <span className='text-2xl font-bold text-white'>1</span>
            </div>
            <h3 className='mb-3 text-center text-xl font-bold text-blue-800'>
              Kihon (Fundamentos)
            </h3>
            <p className='mb-4 text-gray-600'>
              Prática repetitiva de técnicas básicas como socos, chutes,
              bloqueios e posições. O kihon é a base de todo o treinamento, onde
              se desenvolve força, precisão e compreensão dos movimentos
              fundamentais.
            </p>
            <ul className='space-y-2 text-gray-600'>
              <li className='flex items-start'>
                <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                <span>
                  Posições (Dachi): Zenkutsu-dachi, Kokutsu-dachi, Kiba-dachi
                </span>
              </li>
              <li className='flex items-start'>
                <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                <span>Socos (Tsuki): Gyaku-tsuki, Oi-tsuki, Kizami-tsuki</span>
              </li>
              <li className='flex items-start'>
                <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                <span>Chutes (Geri): Mae-geri, Yoko-geri, Mawashi-geri</span>
              </li>
              <li className='flex items-start'>
                <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                <span>Bloqueios (Uke): Age-uke, Soto-uke, Gedan-barai</span>
              </li>
            </ul>
          </div>

          <div className='rounded-lg bg-blue-50 p-6'>
            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-800'>
              <span className='text-2xl font-bold text-white'>2</span>
            </div>
            <h3 className='mb-3 text-center text-xl font-bold text-blue-800'>
              Kata (Formas)
            </h3>
            <p className='mb-4 text-gray-600'>
              Sequências pré-determinadas de movimentos que simulam combate
              contra múltiplos oponentes imaginários. Os katas preservam as
              técnicas tradicionais e desenvolvem coordenação, ritmo e expressão
              técnica.
            </p>
            <ul className='space-y-2 text-gray-600'>
              <li className='flex items-start'>
                <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                <span>Katas Básicos: Heian Shodan a Godan</span>
              </li>
              <li className='flex items-start'>
                <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                <span>Katas Intermediários: Tekki Shodan, Bassai Dai</span>
              </li>
              <li className='flex items-start'>
                <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                <span>Katas Avançados: Kanku Dai, Jion, Empi</span>
              </li>
              <li className='flex items-start'>
                <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                <span>Aplicações práticas (Bunkai) de cada movimento</span>
              </li>
            </ul>
          </div>

          <div className='rounded-lg bg-blue-50 p-6'>
            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-800'>
              <span className='text-2xl font-bold text-white'>3</span>
            </div>
            <h3 className='mb-3 text-center text-xl font-bold text-blue-800'>
              Kumite (Combate)
            </h3>
            <p className='mb-4 text-gray-600'>
              Prática de combate com oponente real, aplicando as técnicas
              aprendidas em situações dinâmicas. O kumite desenvolve timing,
              distância, estratégia e controle emocional.
            </p>
            <ul className='space-y-2 text-gray-600'>
              <li className='flex items-start'>
                <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                <span>Kihon Kumite: Combate pré-arranjado para iniciantes</span>
              </li>
              <li className='flex items-start'>
                <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                <span>
                  Jiyu Ippon Kumite: Combate semi-livre com ataques definidos
                </span>
              </li>
              <li className='flex items-start'>
                <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                <span>Jiyu Kumite: Combate livre com regras de segurança</span>
              </li>
              <li className='flex items-start'>
                <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                <span>Shiai Kumite: Combate competitivo com pontuação</span>
              </li>
            </ul>
          </div>
        </div>

        <div className='mt-12 rounded-lg bg-blue-800 p-8 text-white'>
          <h3 className='mb-4 text-xl font-bold'>
            Filosofia e Etiqueta do Karate-Do
          </h3>
          <p className='mb-6'>
            O Karate-Do vai muito além das técnicas físicas. Na Budokan,
            enfatizamos os princípios filosóficos que guiam o verdadeiro
            praticante:
          </p>
          <div className='grid gap-6 md:grid-cols-2'>
            <div className='space-y-3'>
              <div className='flex items-start'>
                <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                <div>
                  <span className='font-bold'>
                    Dojo Kun (Preceitos do Dojo):
                  </span>
                  <p className='mt-1 text-sm opacity-80'>
                    Buscar a perfeição do caráter, ser fiel, esforçar-se,
                    respeitar os outros e abster-se de comportamento violento.
                  </p>
                </div>
              </div>
              <div className='flex items-start'>
                <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                <div>
                  <span className='font-bold'>Rei (Etiqueta):</span>
                  <p className='mt-1 text-sm opacity-80'>
                    Demonstração de respeito através de saudações
                    (cumprimentos), postura adequada e comportamento respeitoso
                    no dojo.
                  </p>
                </div>
              </div>
            </div>
            <div className='space-y-3'>
              <div className='flex items-start'>
                <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                <div>
                  <span className='font-bold'>Zanshin (Consciência):</span>
                  <p className='mt-1 text-sm opacity-80'>
                    Estado de alerta relaxado e consciência plena, dentro e fora
                    do dojo.
                  </p>
                </div>
              </div>
              <div className='flex items-start'>
                <ChevronRight className='mt-0.5 mr-2 h-5 w-5 shrink-0 text-yellow-500' />
                <div>
                  <span className='font-bold'>Kime (Foco):</span>
                  <p className='mt-1 text-sm opacity-80'>
                    Concentração total de energia física e mental no momento da
                    execução técnica.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
