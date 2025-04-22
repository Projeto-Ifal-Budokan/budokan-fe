import { Button } from '@/components/ui/button';

export const CTASection = () => {
  return (
    <section className='bg-blue-800 py-16 text-white'>
      <div className='container text-center'>
        <h2 className='mb-4 text-3xl font-bold'>
          Comece Sua Jornada no Caminho do Arco
        </h2>
        <p className='mx-auto mb-8 max-w-2xl opacity-80'>
          Transforme sua vida através da disciplina, concentração e harmonia da
          Arquearia tradicional. Agende uma visita para conhecer nossa prática e
          conheça a Budokan-Ryu.
        </p>
        <div className='flex flex-col justify-center gap-4 sm:flex-row'>
          <Button className='bg-yellow-500 px-8 py-6 text-lg font-bold text-blue-900 hover:bg-yellow-600'>
            Agende uma Visita
          </Button>
          <Button
            variant='outline'
            className='border-white bg-blue-900 px-8 py-6 text-lg text-yellow-500 hover:bg-yellow-500/90'
          >
            Entre em Contato
          </Button>
        </div>
      </div>
    </section>
  );
};
