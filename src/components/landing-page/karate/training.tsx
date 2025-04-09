import { ChevronRight } from "lucide-react";

export const KarateTrainingSection = () => {
    return (
        <section className="py-16 bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-blue-800 mb-4">Técnicas e Treinamento</h2>
              <div className="w-20 h-1 bg-yellow-500 mx-auto mb-6"></div>
              <p className="max-w-3xl mx-auto text-gray-600">
                O treinamento de Karate-Do na Budokan é estruturado em três pilares fundamentais, proporcionando um
                desenvolvimento completo do praticante.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="w-16 h-16 bg-blue-800 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-white text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold text-blue-800 mb-3 text-center">Kihon (Fundamentos)</h3>
                <p className="text-gray-600 mb-4">
                  Prática repetitiva de técnicas básicas como socos, chutes, bloqueios e posições. O kihon é a base de
                  todo o treinamento, onde se desenvolve força, precisão e compreensão dos movimentos fundamentais.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-yellow-500 mr-2 shrink-0 mt-0.5" />
                    <span>Posições (Dachi): Zenkutsu-dachi, Kokutsu-dachi, Kiba-dachi</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-yellow-500 mr-2 shrink-0 mt-0.5" />
                    <span>Socos (Tsuki): Gyaku-tsuki, Oi-tsuki, Kizami-tsuki</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-yellow-500 mr-2 shrink-0 mt-0.5" />
                    <span>Chutes (Geri): Mae-geri, Yoko-geri, Mawashi-geri</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-yellow-500 mr-2 shrink-0 mt-0.5" />
                    <span>Bloqueios (Uke): Age-uke, Soto-uke, Gedan-barai</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <div className="w-16 h-16 bg-blue-800 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-white text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold text-blue-800 mb-3 text-center">Kata (Formas)</h3>
                <p className="text-gray-600 mb-4">
                  Sequências pré-determinadas de movimentos que simulam combate contra múltiplos oponentes imaginários.
                  Os katas preservam as técnicas tradicionais e desenvolvem coordenação, ritmo e expressão técnica.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-yellow-500 mr-2 shrink-0 mt-0.5" />
                    <span>Katas Básicos: Heian Shodan a Godan</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-yellow-500 mr-2 shrink-0 mt-0.5" />
                    <span>Katas Intermediários: Tekki Shodan, Bassai Dai</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-yellow-500 mr-2 shrink-0 mt-0.5" />
                    <span>Katas Avançados: Kanku Dai, Jion, Empi</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-yellow-500 mr-2 shrink-0 mt-0.5" />
                    <span>Aplicações práticas (Bunkai) de cada movimento</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <div className="w-16 h-16 bg-blue-800 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-white text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold text-blue-800 mb-3 text-center">Kumite (Combate)</h3>
                <p className="text-gray-600 mb-4">
                  Prática de combate com oponente real, aplicando as técnicas aprendidas em situações dinâmicas. O
                  kumite desenvolve timing, distância, estratégia e controle emocional.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-yellow-500 mr-2 shrink-0 mt-0.5" />
                    <span>Kihon Kumite: Combate pré-arranjado para iniciantes</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-yellow-500 mr-2 shrink-0 mt-0.5" />
                    <span>Jiyu Ippon Kumite: Combate semi-livre com ataques definidos</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-yellow-500 mr-2 shrink-0 mt-0.5" />
                    <span>Jiyu Kumite: Combate livre com regras de segurança</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-yellow-500 mr-2 shrink-0 mt-0.5" />
                    <span>Shiai Kumite: Combate competitivo com pontuação</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-12 bg-blue-800 text-white p-8 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Filosofia e Etiqueta do Karate-Do</h3>
              <p className="mb-6">
                O Karate-Do vai muito além das técnicas físicas. Na Budokan, enfatizamos os princípios filosóficos que
                guiam o verdadeiro praticante:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-yellow-500 mr-2 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Dojo Kun (Preceitos do Dojo):</span>
                      <p className="opacity-80 text-sm mt-1">
                        Buscar a perfeição do caráter, ser fiel, esforçar-se, respeitar os outros e abster-se de
                        comportamento violento.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-yellow-500 mr-2 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Rei (Etiqueta):</span>
                      <p className="opacity-80 text-sm mt-1">
                        Demonstração de respeito através de saudações (cumprimentos), postura adequada e comportamento
                        respeitoso no dojo.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-yellow-500 mr-2 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Zanshin (Consciência):</span>
                      <p className="opacity-80 text-sm mt-1">
                        Estado de alerta relaxado e consciência plena, dentro e fora do dojo.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-yellow-500 mr-2 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Kime (Foco):</span>
                      <p className="opacity-80 text-sm mt-1">
                        Concentração total de energia física e mental no momento da execução técnica.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
    );
}