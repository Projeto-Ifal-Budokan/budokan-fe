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
    alt: 'Sensei Tanaka',
  },
  {
    name: 'Sensei Hsie',
    title: 'Hsie Sashan',
    description:
      'Com mais de 25 anos de experiência, foi responsável pela divisão de Kendo da Budokan-Ryu. Participou de diversos campeonatos mundiais e é referência na formação de novos kendokas.',
    imageSrc: senseiKendoAsset.src,
    alt: 'Sensei Yamamoto',
  },
  {
    name: 'Sensei Yasuhiro',
    title: 'Yasuhiro Higashikawauchi',
    description:
      'Especialista em Arquearia, treinou por mais de 15 anos no Japão antes de retornar ao Brasil para difundir esta arte milenar. É reconhecido por sua precisão técnica e profundo conhecimento filosófico.',
    imageSrc: senseiArcheryAsset.src,
    alt: 'Sensei Sato',
  },
];
