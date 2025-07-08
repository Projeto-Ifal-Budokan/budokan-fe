'use client';

import { Button } from '@/components/ui/button';
import { openWhatsApp } from '@/utils/whatsapp-utils';

export const CTASection = () => {
  // Handle WhatsApp redirect for scheduling
  const handleScheduleClick = () => {
    openWhatsApp(
      'Olá! Gostaria de agendar uma aula experimental de Kendo na Budokan-Ryu.'
    );
  };

  // Handle WhatsApp redirect for contact
  const handleContactClick = () => {
    openWhatsApp(
      'Olá! Gostaria de mais informações sobre o Kendo na Budokan-Ryu.'
    );
  };

  return (
    <section className='bg-blue-800 py-16 text-white'>
      <div className='container text-center'>
        <h2 className='mb-4 text-3xl font-bold'>
          Comece Sua Jornada no Caminho da Espada
        </h2>
        <p className='mx-auto mb-8 max-w-2xl opacity-80'>
          Transforme sua vida através da disciplina, respeito e excelência do
          Kendo tradicional. Agende uma aula experimental gratuita e conheça a
          Budokan-Ryu.
        </p>
        <div className='flex flex-col justify-center gap-4 sm:flex-row'>
          <Button
            className='bg-yellow-500 px-8 py-6 text-lg font-bold text-blue-900 hover:bg-yellow-600'
            onClick={handleScheduleClick}
          >
            Agende uma Aula Experimental
          </Button>
          <Button
            variant='outline'
            className='border-white bg-blue-900 px-8 py-6 text-lg text-yellow-500 hover:bg-yellow-500/90'
            onClick={handleContactClick}
          >
            Entre em Contato
          </Button>
        </div>
      </div>
    </section>
  );
};
