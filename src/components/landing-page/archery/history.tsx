export const HistorySection = () => {
  return (
    <section className='bg-blue-50 py-16'>
      <div className='container'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-blue-800'>
            História da Arquearia
          </h2>
          <div className='mx-auto mb-6 h-1 w-20 bg-yellow-500'></div>
          <p className='mx-auto max-w-3xl text-gray-600'>
            Conheça a evolução desta arte milenar desde suas origens como
            ferramenta de caça e guerra até sua transformação em caminho de
            desenvolvimento espiritual.
          </p>
        </div>

        <div className='grid gap-12 md:grid-cols-2'>
          <div className='space-y-6'>
            <div>
              <h3 className='mb-2 text-xl font-bold text-blue-800'>
                Origens Ancestrais
              </h3>
              <p className='text-gray-600'>
                O arco e flecha foram introduzidos no Japão na era
                pré-histórica, inicialmente como ferramentas de caça e
                posteriormente como armas de guerra. Durante o período Heian
                (794-1185), o tiro com arco a cavalo (Yabusame) tornou-se uma
                habilidade essencial para a classe guerreira.
              </p>
            </div>
            <div>
              <h3 className='mb-2 text-xl font-bold text-blue-800'>
                Influência Zen
              </h3>
              <p className='text-gray-600'>
                No período Kamakura (1185-1333), o tiro com arco foi fortemente
                influenciado pelo Zen Budismo, transformando-se de uma
                habilidade puramente marcial em uma prática espiritual. Esta
                influência estabeleceu as bases filosóficas do Arquearia
                moderno.
              </p>
            </div>
            <div>
              <h3 className='mb-2 text-xl font-bold text-blue-800'>
                Era Moderna
              </h3>
              <p className='text-gray-600'>
                Após a restauração Meiji (1868), com o declínio do sistema
                feudal, a Arquearia foi preservada como arte tradicional e
                prática educativa. Em 1949, foi fundada a Federação Japonesa de
                Arquearia, padronizando estilos e técnicas. Hoje, é praticado em
                todo o mundo como caminho de desenvolvimento pessoal.
              </p>
            </div>
          </div>
          <div className='space-y-6'>
            <div>
              <h3 className='mb-2 text-xl font-bold text-blue-800'>
                Arquearia na Budokan-Ryu
              </h3>
              <p className='text-gray-600'>
                Na Budokan-Ryu, o Arquearia é ensinado seguindo a tradição
                japonesa autêntica, com instrutores qualificados que receberam
                treinamento no Japão. Nossa abordagem enfatiza tanto a técnica
                precisa quanto os aspectos filosóficos e espirituais desta arte.
              </p>
            </div>
            <div>
              <h3 className='mb-2 text-xl font-bold text-blue-800'>
                Prática e Eventos
              </h3>
              <p className='text-gray-600'>
                Realizamos sessões regulares de prática em nosso dojo
                especialmente adaptado para Arquearia, além de participar de
                demonstrações, competições e seminários com mestres visitantes.
                A Budokan-Ryu também organiza eventos especiais como o Toshiya
                (competição tradicional de tiro com arco) e cerimônias de
                abertura do ano.
              </p>
            </div>
            <div>
              <h3 className='mb-2 text-xl font-bold text-blue-800'>
                Filosofia e Valores
              </h3>
              <p className='text-gray-600'>
                Mantemos vivos os valores tradicionais da Arquearia, resumidos
                no conceito de &quot;Shin-Zen-Bi&quot; (Verdade-Bondade-Beleza).
                Cada tiro deve ser verdadeiro em intenção, bom em ética e belo
                em forma. Estes princípios transcendem o dojo e são aplicados na
                vida cotidiana de nossos praticantes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
