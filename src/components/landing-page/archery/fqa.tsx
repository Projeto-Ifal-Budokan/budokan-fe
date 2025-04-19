import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export const FQASection = () => {
  return (
    <section className='bg-white py-16'>
      <div className='container'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-blue-800'>
            Perguntas Frequentes
          </h2>
          <div className='mx-auto mb-6 h-1 w-20 bg-yellow-500'></div>
          <p className='mx-auto max-w-3xl text-gray-600'>
            Encontre respostas para as dúvidas mais comuns sobre a prática de
            Arquearia na Budokan-Ryu.
          </p>
        </div>

        <div className='mx-auto max-w-3xl'>
          <Accordion type='single' collapsible className='space-y-4'>
            <AccordionItem value='item-1' className='rounded-lg border p-2'>
              <AccordionTrigger className='text-left font-medium text-blue-800 hover:no-underline'>
                Qual a idade mínima para começar a praticar Arquearia?
              </AccordionTrigger>
              <AccordionContent className='pt-2 text-gray-600'>
                Na Budokan-Ryu, aceitamos alunos a partir dos 14 anos de idade. Isso
                se deve à necessidade de força física para manusear o arco e à
                maturidade necessária para a concentração exigida. Não há idade
                máxima, temos praticantes de todas as idades, inclusive
                seniores.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-2' className='rounded-lg border p-2'>
              <AccordionTrigger className='text-left font-medium text-blue-800 hover:no-underline'>
                Preciso ter experiência prévia com arco e flecha?
              </AccordionTrigger>
              <AccordionContent className='pt-2 text-gray-600'>
                Não é necessária experiência prévia. Na verdade, muitas vezes é
                mais fácil ensinar quem nunca teve contato com outros estilos de
                tiro com arco, pois a Arquearia tem técnicas e filosofia muito
                específicas. Começamos do zero, com muita atenção aos
                fundamentos.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-3' className='rounded-lg border p-2'>
              <AccordionTrigger className='text-left font-medium text-blue-800 hover:no-underline'>
                Preciso comprar todo o equipamento logo no início?
              </AccordionTrigger>
              <AccordionContent className='pt-2 text-gray-600'>
                Não. A Budokan-Ryu disponibiliza equipamentos para iniciantes
                durante os primeiros meses de prática. Conforme você avança,
                orientamos na aquisição gradual dos equipamentos, começando pelo
                mais essencial. O arco (yumi) geralmente é a última peça a ser
                adquirida, pois precisa ser adequado ao seu nível técnico e
                características físicas.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-4' className='rounded-lg border p-2'>
              <AccordionTrigger className='text-left font-medium text-blue-800 hover:no-underline'>
                É necessário ter muita força física?
              </AccordionTrigger>
              <AccordionContent className='pt-2 text-gray-600'>
                O Arquearia não exige força extrema, mas sim técnica adequada e
                condicionamento gradual. Iniciantes começam com arcos de menor
                potência e progridem conforme desenvolvem a técnica correta. A
                prática regular fortalece naturalmente os músculos necessários.
                Pessoas de diferentes biotipos e condições físicas podem
                praticar Arquearia com sucesso.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-5' className='rounded-lg border p-2'>
              <AccordionTrigger className='text-left font-medium text-blue-800 hover:no-underline'>
                Com que frequência devo treinar?
              </AccordionTrigger>
              <AccordionContent className='pt-2 text-gray-600'>
                Recomendamos participar dos treinos semanais regulares (sábado e
                domingo). Complementarmente, é benéfico realizar exercícios
                específicos em casa, como fortalecimento dos músculos das costas
                e prática dos movimentos sem o arco (karabiki). A consistência é
                mais importante que a intensidade na Arquearia.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-6' className='rounded-lg border p-2'>
              <AccordionTrigger className='text-left font-medium text-blue-800 hover:no-underline'>
                O Arquearia é competitivo?
              </AccordionTrigger>
              <AccordionContent className='pt-2 text-gray-600'>
                Embora existam competições de Arquearia, a essência desta arte não é
                competitiva. O verdadeiro "adversário" é você mesmo, buscando
                sempre aperfeiçoar sua técnica e estado mental. Na Budokan-Ryu,
                participamos de eventos competitivos, mas enfatizamos o
                desenvolvimento pessoal acima dos resultados.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-7' className='rounded-lg border p-2'>
              <AccordionTrigger className='text-left font-medium text-blue-800 hover:no-underline'>
                Quanto tempo leva para dominar a Arquearia?
              </AccordionTrigger>
              <AccordionContent className='pt-2 text-gray-600'>
                O Arquearia é considerado um caminho de vida, não tendo um ponto
                final de "domínio completo". Mesmo mestres com décadas de
                prática continuam aprendendo e refinando sua técnica.
                Tipicamente, leva-se cerca de 3-5 anos de prática consistente
                para desenvolver uma compreensão sólida dos fundamentos e
                começar a experimentar a verdadeira essência do Arquearia.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
};
