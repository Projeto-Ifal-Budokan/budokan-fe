const STRAPI_BASE_URL = 'https://strapi.budokanryu.com.br';

export const getStrapiImageUrl = (imageUrl: string): string => {
  if (!imageUrl) return '';
  
  // Se já é uma URL completa, retorna como está
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // Remove a barra inicial se existir
  const cleanUrl = imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl;
  
  // Constrói a URL completa
  return `${STRAPI_BASE_URL}/${cleanUrl}`;
};

export const getStrapiImageFormat = (
  image: { url: string; formats?: Record<string, { url: string }> } | null | undefined,
  format: 'thumbnail' | 'small' | 'medium' | 'large' = 'medium'
): string => {
  if (!image) return '';
  
  // Tenta usar o formato especificado
  if (image.formats?.[format]?.url) {
    return getStrapiImageUrl(image.formats[format].url);
  }
  
  // Fallback para a URL original
  return getStrapiImageUrl(image.url);
}; 