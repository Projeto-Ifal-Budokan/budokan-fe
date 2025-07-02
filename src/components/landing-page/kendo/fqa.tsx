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
            Encontre respostas para as perguntas mais comuns sobre a prática de
            Kendo na Budokan-Ryu.
          </p>
        </div>

        <div className='mx-auto max-w-3xl'>
          <Accordion type='single' collapsible className='space-y-4'>
            <AccordionItem value='item-1' className='rounded-lg border p-2'>
              <AccordionTrigger className='text-left font-medium text-blue-800 hover:no-underline'>
                Qual a idade mínima para começar a praticar Kendo?
              </AccordionTrigger>
              <AccordionContent className='pt-2 text-gray-600'>
                Na Budokan-Ryu, aceitamos alunos a partir dos 10 anos de idade.
                Para crianças mais novas, recomendamos aguardar um pouco mais
                devido à necessidade de força e coordenação para manejar o
                shinai (espada de bambu). Não há idade máxima, temos praticantes
                de todas as idades!
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-2' className='rounded-lg border p-2'>
              <AccordionTrigger className='text-left font-medium text-blue-800 hover:no-underline'>
                Preciso comprar todo o equipamento (bogu) logo no início?
              </AccordionTrigger>
              <AccordionContent className='pt-2 text-gray-600'>
                Não. Os iniciantes treinam sem bogu (armadura) por vários meses,
                focando nos fundamentos. Inicialmente, você precisará apenas de
                um keikogi (parte superior do uniforme), hakama (calça
                tradicional) e um shinai (espada de bambu). O bogu completo só
                será necessário quando você atingir um nível técnico adequado.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-3' className='rounded-lg border p-2'>
              <AccordionTrigger className='text-left font-medium text-blue-800 hover:no-underline'>
                O Kendo é muito doloroso ou perigoso?
              </AccordionTrigger>
              <AccordionContent className='pt-2 text-gray-600'>
                O Kendo é uma arte marcial tradicional praticada com alto padrão de segurança. 
                Utilizamos equipamentos de proteção específicos (bogu), projetados para absorver 
                os impactos dos golpes e proporcionar um ambiente de treino controlado. 
                Desde o início, os praticantes são orientados com cuidado para desenvolverem 
                técnica e autocontrole. Lesões são extremamente raras, pois a segurança é sempre 
                uma prioridade em nossos treinos.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-4' className='rounded-lg border p-2'>
              <AccordionTrigger className='text-left font-medium text-blue-800 hover:no-underline'>
                Preciso ter conhecimento prévio sobre cultura japonesa?
              </AccordionTrigger>
              <AccordionContent className='pt-2 text-gray-600'>
                Não é necessário conhecimento prévio. O Kendo é uma excelente
                porta de entrada para a cultura japonesa, e você aprenderá
                gradualmente os aspectos culturais relevantes durante os
                treinos. Nossos senseis explicam a etiqueta, terminologia e
                filosofia de forma acessível a todos os praticantes.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-5' className='rounded-lg border p-2'>
              <AccordionTrigger className='text-left font-medium text-blue-800 hover:no-underline'>
                Com que frequência devo treinar?
              </AccordionTrigger>
              <AccordionContent className='pt-2 text-gray-600'>
                Recomendamos um mínimo de duas vezes por semana para um
                progresso consistente. O ideal é participar de todos os treinos
                disponíveis para seu nível. A prática regular é essencial no
                Kendo, pois muitas técnicas exigem repetição constante para
                serem incorporadas.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-6' className='rounded-lg border p-2'>
              <AccordionTrigger className='text-left font-medium text-blue-800 hover:no-underline'>
                Quanto tempo leva para obter a primeira graduação (1º Dan)?
              </AccordionTrigger>
              <AccordionContent className='pt-2 text-gray-600'>
                Em média, leva-se de 3 a 5 anos de prática consistente para
                atingir o nível de 1º Dan, que equivale à &quot;faixa
                preta&quot; inicial. Este tempo varia de acordo com a frequência
                nos treinos, dedicação e aptidão individual. O foco deve estar
                sempre no aprendizado e não na graduação em si.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-7' className='rounded-lg border p-2'>
              <AccordionTrigger className='text-left font-medium text-blue-800 hover:no-underline'>
                Posso participar de competições?
              </AccordionTrigger>
              <AccordionContent className='pt-2 text-gray-600'>
                Sim. A Budokan-Ryu participa regularmente de competições
                regionais, nacionais e até internacionais. A participação é
                opcional, mas incentivada como parte do desenvolvimento do
                praticante. Preparamos nossos alunos tanto para competições
                individuais quanto por equipes.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
};
