import { AboutSection } from '@/components/landing-page/archery/about';
import { BenefitsSection } from '@/components/landing-page/archery/benefits';
import { CTASection } from '@/components/landing-page/archery/cta';
import { EquipamentsTechniquesSection } from '@/components/landing-page/archery/equipaments-techniques';
import { FQASection } from '@/components/landing-page/archery/fqa';
import { Hero } from '@/components/landing-page/archery/hero';
import { HistorySection } from '@/components/landing-page/archery/history';
import { ScheduleSection } from '@/components/landing-page/archery/schedule';
import { TestimonialsSection } from '@/components/landing-page/archery/testimonials';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Archery em Maceió | Aulas de Archery Tradicional',
  description:
    'Aprenda Archery tradicional em Maceió com instrutores qualificados. Aulas para todas as idades no Budokan-Ryu.',
  keywords: [
    'archery Maceió',
    'archery tradicional',
    'aulas archery',
    'dojo archery Maceió',
  ],
  openGraph: {
    title: 'Archery em Maceió | Budokan-Ryu',
    description:
      'Aprenda Archery tradicional em Maceió com instrutores qualificados',
    url: 'https://www.budokanryu.com.br/archery',
  },
};

export default function Archery() {
  return (
    <>
      <Hero />
      <AboutSection />
      <HistorySection />
      <EquipamentsTechniquesSection />
      <BenefitsSection />
      <ScheduleSection />
      <TestimonialsSection />
      <FQASection />
      <CTASection />
    </>
  );
}
