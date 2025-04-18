import AvatarAldemarAraujo from '@/assets/images/avatar-aldemar-araujo.png';
import AvatarLilianCarmen from '@/assets/images/avatar-lilian-carmen.jpg';
import AvatarRobertoAsset from '@/assets/images/avatar-roberto.png';

export interface Testimonial {
  id: number;
  name: string;
  discipline: string;
  title: string;
  image: string;
  quote: string;
}

export const testimonialsData: Testimonial[] = [
  {
    id: 1,
    name: 'Aldemar Araújo',
    discipline: 'Karate-Do',
    title: 'Praticante de Karate-Do',
    image: AvatarAldemarAraujo.src,
    quote:
      '"Iniciei minha jornada no Karate em 2006 na Budokan-Ryu, atraído pela excelência técnica e pelo ambiente acolhedor que a escola proporciona. Ao longo dos anos, a combinação de instrução de alta qualidade e uma atmosfera de respeito mútuo permitiu-me desenvolver habilidades técnicas sólidas e crescer pessoalmente. A ênfase na disciplina, filosofia e tradição do Karate-Do na Budokan-Ryu tem sido fundamental para minha formação, reforçando valores essenciais que aplico em todas as áreas da minha vida."',
  },
  {
    id: 2,
    name: 'Lilian Carmen',
    discipline: 'Arquearia',
    title: 'Praticante de Arquearia',
    image: AvatarLilianCarmen.src,
    quote:
      '"Comecei a praticar tiro com arco em 2019 e, ao longo dos treinos, fui desenvolvendo a forma de execução correta para um tiro preciso. Em 2021 inicio a prática de tiro com arco na Budokan Arquearia, onde aprimorei, com a prática constante, a percepção do corpo, controle da respiração, forma de segurar o arco e a tensão aplicada à corda. Princípios fundamentais que ajudam na formação intrapessoal e interpessoal."',
  },
  {
    id: 3,
    name: 'Roberto Tanaka',
    discipline: 'Kendo',
    title: 'Praticante de Arquearia há 7 anos',
    image: AvatarRobertoAsset.src,
    quote:
      '"O Arquearia na Budokan é uma experiência transformadora. Mais que uma arte marcial, é uma jornada de autoconhecimento. Cada tiro com o arco é uma oportunidade de conectar corpo, mente e espírito em perfeita harmonia."',
  },
];
