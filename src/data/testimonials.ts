import AvatarCarlosAsset from '@/assets/images/avatar-carlos.png';
import AvatarMarianaAsset from '@/assets/images/avatar-mariana.png';
import AvatarRobertoAsset from '@/assets/images/avatar-roberto.png';

export interface Testimonial {
  id: number;
  name: string;
  title: string;
  image: string;
  quote: string;
}

export const testimonialsData: Testimonial[] = [
  {
    id: 1,
    name: 'Carlos Silva',
    title: 'Praticante de Karate-Do há 5 anos',
    image: AvatarCarlosAsset.src,
    quote:
      '"A Budokan mudou minha vida. Além de melhorar minha condição física, o Karate-Do me ensinou disciplina, foco e respeito, valores que aplico diariamente em minha vida pessoal e profissional."',
  },
  {
    id: 2,
    name: 'Mariana Santos',
    title: 'Praticante de Kendo há 3 anos',
    image: AvatarMarianaAsset.src,
    quote:
      '"O ambiente na Budokan é acolhedor e ao mesmo tempo desafiador. Os senseis são extremamente qualificados e atenciosos. O Kendo me trouxe equilíbrio emocional e físico que eu não encontrei em nenhuma outra atividade."',
  },
  {
    id: 3,
    name: 'Roberto Tanaka',
    title: 'Praticante de Arquearia há 7 anos',
    image: AvatarRobertoAsset.src,
    quote:
      '"O Arquearia na Budokan é uma experiência transformadora. Mais que uma arte marcial, é uma jornada de autoconhecimento. Cada tiro com o arco é uma oportunidade de conectar corpo, mente e espírito em perfeita harmonia."',
  },
];
