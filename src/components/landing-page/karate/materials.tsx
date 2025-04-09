import DownloadableMaterials, {
  DownloadableItem,
} from '@/components/landing-page/karate/downloadable-materials';

const karateMaterials: Array<DownloadableItem> = [
  {
    title: 'Guia do Iniciante em Karate-Do',
    description:
      'Um guia completo para iniciantes, abordando história, filosofia, etiqueta e técnicas básicas do Karate-Do Shotokan.',
    fileType: 'pdf',
    fileSize: '2.4 MB',
    downloadUrl: '/downloads/karate/guia-iniciante-karate.pdf',
  },
  {
    title: 'Katas Heian - Passo a Passo',
    description:
      'Descrição detalhada e ilustrada dos cinco katas Heian, fundamentais para o desenvolvimento técnico no Karate Shotokan.',
    fileType: 'pdf',
    fileSize: '3.8 MB',
    downloadUrl: '/downloads/karate/katas-heian.pdf',
  },
  {
    title: 'Glossário de Termos do Karate',
    description:
      'Lista completa de termos japoneses utilizados no treinamento de Karate, com pronúncia e significado.',
    fileType: 'doc',
    fileSize: '1.2 MB',
    downloadUrl: '/downloads/karate/glossario-karate.doc',
  },
  {
    title: 'Preparação Física para Karatecas',
    description:
      'Programa de exercícios específicos para melhorar o desempenho no Karate, incluindo força, flexibilidade e resistência.',
    fileType: 'pdf',
    fileSize: '1.7 MB',
    downloadUrl: '/downloads/karate/preparacao-fisica-karate.pdf',
  },
  {
    title: 'Introdução ao Kumite',
    description:
      'Vídeo introdutório sobre as técnicas básicas de combate (kumite) no Karate Shotokan, com demonstrações práticas.',
    fileType: 'video',
    fileSize: '45 MB',
    downloadUrl: '/downloads/karate/introducao-kumite.mp4',
  },
  {
    title: 'História do Karate no Brasil',
    description:
      'Documento sobre a história e evolução do Karate-Do no Brasil, desde sua introdução até os dias atuais.',
    fileType: 'doc',
    fileSize: '2.1 MB',
    downloadUrl: '/downloads/karate/historia-karate-brasil.doc',
  },
];

export const MaterialsSection = () => {
  return (
    <DownloadableMaterials
      title='Materiais para Download'
      description='Acesse e baixe materiais introdutórios e complementares sobre Karate-Do para enriquecer seu aprendizado.'
      materials={karateMaterials}
    />
  );
};
