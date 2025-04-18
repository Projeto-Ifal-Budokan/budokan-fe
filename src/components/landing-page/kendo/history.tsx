export const HistorySection = () => {
  return (
    <>
      <section className='bg-blue-50 py-16'>
        <div className='container'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-bold text-blue-800'>
              História do Kendo
            </h2>
            <div className='mx-auto mb-6 h-1 w-20 bg-yellow-500'></div>
            <p className='mx-auto max-w-3xl text-gray-600'>
              Conheça a evolução desta arte marcial desde os campos de batalha
              dos samurais até os dojos modernos.
            </p>
          </div>

          <div className='grid gap-12 md:grid-cols-2'>
            <div className='space-y-6'>
              <div>
                <h3 className='mb-2 text-xl font-bold text-blue-800'>
                  Origens no Japão Feudal
                </h3>
                <p className='text-gray-600'>
                  As raízes do Kendo remontam às técnicas de combate com espada
                  (kenjutsu) desenvolvidas pelos samurais durante o período
                  feudal japonês. Estas técnicas eram letais e destinadas ao
                  campo de batalha, sendo transmitidas em escolas tradicionais
                  (ryuha).
                </p>
              </div>
              <div>
                <h3 className='mb-2 text-xl font-bold text-blue-800'>
                  Transformação em Arte Moderna
                </h3>
                <p className='text-gray-600'>
                  No final do período Edo (1603-1868), com a diminuição dos
                  conflitos armados, foram desenvolvidos equipamentos de
                  proteção e espadas de bambu que permitiram a prática segura.
                  Esta evolução transformou o kenjutsu letal em uma disciplina
                  educativa e esportiva.
                </p>
              </div>
              <div>
                <h3 className='mb-2 text-xl font-bold text-blue-800'>
                  Era Moderna
                </h3>
                <p className='text-gray-600'>
                  Após a Segunda Guerra Mundial, o Kendo foi reorganizado e
                  padronizado, com a fundação da Federação Japonesa de Kendo em
                  1952 e posteriormente a Federação Internacional de Kendo.
                  Hoje, é praticado em mais de 50 países, mantendo viva a
                  tradição marcial japonesa.
                </p>
              </div>
            </div>
            <div className='space-y-6'>
              <div>
                <h3 className='mb-2 text-xl font-bold text-blue-800'>
                  Kendo na Budokan-Ryu
                </h3>
                <p className='text-gray-600'>
                  Na Budokan-Ryu, o Kendo é ensinado seguindo a tradição japonesa
                  autêntica, com instrutores qualificados que receberam
                  treinamento no Japão. Nossa linhagem técnica conecta-se
                  diretamente aos grandes mestres japoneses, garantindo a
                  preservação da essência desta arte.
                </p>
              </div>
              <div>
                <h3 className='mb-2 text-xl font-bold text-blue-800'>
                  Competições e Eventos
                </h3>
                <p className='text-gray-600'>
                  Nossos praticantes participam regularmente de competições
                  nacionais e internacionais, além de seminários com mestres
                  visitantes. A Budokan-Ryu também organiza exames de graduação e
                  eventos especiais que celebram a cultura e tradição do Kendo.
                </p>
              </div>
              <div>
                <h3 className='mb-2 text-xl font-bold text-blue-800'>
                  Filosofia e Valores
                </h3>
                <p className='text-gray-600'>
                  Mantemos vivos os valores tradicionais do Kendo: respeito
                  (rei), cortesia (reigi), pureza de coração (sei), e esforço
                  constante (doryoku). Estes princípios transcendem o dojo e são
                  aplicados na vida cotidiana de nossos praticantes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
