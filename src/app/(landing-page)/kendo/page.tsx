import { AboutSection } from '@/components/landing-page/kendo/about';
import { BenefitsSection } from '@/components/landing-page/kendo/benefits';
import { CTASection } from '@/components/landing-page/kendo/cta';
import { EquipamentsTechniquesSection } from '@/components/landing-page/kendo/equipaments-techniques';
import { FQASection } from '@/components/landing-page/kendo/fqa';
import { HeroSection } from '@/components/landing-page/kendo/hero';
import { HistorySection } from '@/components/landing-page/kendo/history';
import { ScheduleSection } from '@/components/landing-page/kendo/schedule';
import { TestimonialsSection } from '@/components/landing-page/kendo/testimonials';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kendo em Maceió | Aulas de Kendo Tradicional',
  description:
    'Aprenda Kendo tradicional em Maceió com instrutores qualificados. Aulas para todas as idades no Budokan-Ryu.',
  keywords: [
    'kendo Maceió',
    'kendo tradicional',
    'aulas kendo',
    'dojo kendo Maceió',
  ],
  openGraph: {
    title: 'Kendo em Maceió | Budokan-Ryu',
    description:
      'Aprenda Kendo tradicional em Maceió com instrutores qualificados',
    url: 'https://www.budokanryu.com.br/kendo',
  },
};

export default function Kendo() {
  return (
    <>
      <HeroSection />
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
