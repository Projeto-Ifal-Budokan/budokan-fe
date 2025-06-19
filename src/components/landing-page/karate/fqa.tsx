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
            Karate-Do na Budokan-Ryu.
          </p>
        </div>

        <div className='mx-auto max-w-3xl'>
          <Accordion type='single' collapsible className='space-y-4'>
            <AccordionItem value='item-1' className='rounded-lg border p-2'>
              <AccordionTrigger className='text-left font-medium text-blue-800 hover:no-underline'>
                Qual a idade mínima para começar a praticar Karate-Do?
              </AccordionTrigger>
              <AccordionContent className='pt-2 text-gray-600'>
                Na Budokan-Ryu, aceitamos alunos a partir dos 7 anos de idade.
                Para crianças mais novas, oferecemos uma avaliação individual
                para verificar se já possuem maturidade suficiente para
                acompanhar as aulas. Não há idade máxima, temos alunos de todas
                as idades!
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-2' className='rounded-lg border p-2'>
              <AccordionTrigger className='text-left font-medium text-blue-800 hover:no-underline'>
                Preciso ter experiência prévia para começar?
              </AccordionTrigger>
              <AccordionContent className='pt-2 text-gray-600'>
                Não é necessária experiência prévia. Nossas turmas são divididas
                por níveis, e os iniciantes recebem atenção especial para
                aprenderem os fundamentos corretamente. Todos começam como faixa
                branca e progridem conforme seu próprio ritmo.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-3' className='rounded-lg border p-2'>
              <AccordionTrigger className='text-left font-medium text-blue-800 hover:no-underline'>
                Qual equipamento preciso para começar?
              </AccordionTrigger>
              <AccordionContent className='pt-2 text-gray-600'>
                Para as primeiras aulas, basta vir com roupas confortáveis que
                permitam movimentos amplos. Após decidir continuar, será
                necessário adquirir um kimono (gi) de Karate. Conforme avança,
                outros equipamentos como luvas e protetores podem ser
                necessários para treinos específicos.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-4' className='rounded-lg border p-2'>
              <AccordionTrigger className='text-left font-medium text-blue-800 hover:no-underline'>
                Com que frequência devo treinar?
              </AccordionTrigger>
              <AccordionContent className='pt-2 text-gray-600'>
                Recomendamos um mínimo de duas vezes por semana para um
                progresso consistente. O ideal é treinar três vezes por semana,
                conforme nosso cronograma de aulas. A prática regular é
                essencial para o desenvolvimento técnico e para incorporar os
                princípios do Karate-Do.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-5' className='rounded-lg border p-2'>
              <AccordionTrigger className='text-left font-medium text-blue-800 hover:no-underline'>
                Quanto tempo leva para mudar de faixa?
              </AccordionTrigger>
              <AccordionContent className='pt-2 text-gray-600'>
                O tempo varia de acordo com a dedicação, frequência nos treinos
                e aptidão individual. Em média, as primeiras graduações ocorrem
                a cada 3-6 meses, aumentando o intervalo conforme se avança. O
                foco deve estar sempre no aprendizado e não na cor da faixa.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-6' className='rounded-lg border p-2'>
              <AccordionTrigger className='text-left font-medium text-blue-800 hover:no-underline'>
                O Karate-Do é violento?
              </AccordionTrigger>
              <AccordionContent className='pt-2 text-gray-600'>
                Não. Embora o Karate-Do ensine técnicas de defesa pessoal, sua
                filosofia é centrada no desenvolvimento do caráter e no
                princípio de que &quot;o Karate começa e termina com
                cortesia&quot;. Ensinamos que as técnicas só devem ser usadas
                como último recurso em situações de perigo real.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-7' className='rounded-lg border p-2'>
              <AccordionTrigger className='text-left font-medium text-blue-800 hover:no-underline'>
                Posso participar de competições?
              </AccordionTrigger>
              <AccordionContent className='pt-2 text-gray-600'>
                Sim. A Budokan-Ryu participa regularmente de competições
                regionais e nacionais. A participação é opcional, mas
                incentivada como parte do desenvolvimento do praticante.
                Preparamos nossos alunos tanto para competições de kata (formas)
                quanto de kumite (combate).
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
};
