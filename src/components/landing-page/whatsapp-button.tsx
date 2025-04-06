'use client';

import { useEffect, useState } from 'react';
import { FloatingWhatsApp } from 'react-floating-whatsapp';

export const WhatsappButton = () => {
  const [isLoaded, setIsloaded] = useState(false);

  useEffect(() => {
    setIsloaded(true);
  }, []);

  if (!isLoaded) return;

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
