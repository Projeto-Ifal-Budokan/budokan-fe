export const generateWhatsAppLink = (message?: string) => {
  const phoneNumber = '8299996674';
  const defaultMessage =
    'Olá! Gostaria de agendar uma aula experimental na Budokan-Ryu.';
  const finalMessage = message || defaultMessage;

  const encodedMessage = encodeURIComponent(finalMessage);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
};

export const openWhatsApp = (message?: string) => {
  const whatsappLink = generateWhatsAppLink(message);
  window.open(whatsappLink, '_blank');
};
