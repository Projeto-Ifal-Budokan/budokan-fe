'use client';

import { FloatingWhatsApp } from 'react-floating-whatsapp';

export const WhatsappButton = () => {
  return (
    <FloatingWhatsApp
      phoneNumber='8299996674'
      accountName='Budokan'
      statusMessage='Respodemos em instantes ;)'
      chatMessage='Olá, como vai? Que tal conhecer melhor a instituição?'
      avatar='/logo.jpeg'
      placeholder='Digite uma mensagem...'
      allowEsc
    />
  );
};
