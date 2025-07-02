import senseiKarateAsset from '@/assets/images/sensei-karate.jpg';
import senseiArcheryAsset from '@/assets/images/sensei-archery.jpeg';
import senseiKendoAsset from '@/assets/images/sensei-kendo.jpeg';

export const instructors = [
  {
    name: 'Sensei Chicão',
    title: 'Francisco Araújo',
    description:
      'Fundador da Budokan-Ryu, treina Karate há mais de 40 anos. Formado diretamente pelo Sensei Okuda e 5º Dan, é reconhecido nacionalmente por sua técnica e dedicação ao ensino.',
    imageSrc: senseiKarateAsset.src,
    alt: 'Sensei Chicão',
  },
  {
    name: 'Sensei Hsie',
    title: 'Hsie Sashan',
    description:
      'Com mais de 50 anos de experiência, é responsável pela divisão de Kendo da Budokan-Ryu. É referência na formação de novos kendokas e pela precisão e rápidez da sua técnica.',
    imageSrc: senseiKendoAsset.src,
    alt: 'Sensei Hsie',
  },
  {
    name: 'Sensei Yasuhiro',
    title: 'Yasuhiro Higashikawauchi',
    description:
      'Especialista em Arquearia. É reconhecido por sua precisão técnica e profundo conhecimento filosófico. Conquistou incontáveis titulos, estaduais e nacionais.',
    imageSrc: senseiArcheryAsset.src,
    alt: 'Sensei Yasuhiro',
  },
];
