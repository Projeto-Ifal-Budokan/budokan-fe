import { AboutSection } from '@/components/landing-page/karate/about';
import { BenefitsSection } from '@/components/landing-page/karate/benefits';
import { CTASection } from '@/components/landing-page/karate/cta';
import { FQASection } from '@/components/landing-page/karate/fqa';
import { HeroSection } from '@/components/landing-page/karate/hero';
import { HistorySection } from '@/components/landing-page/karate/history';
import { MaterialsSection } from '@/components/landing-page/karate/materials';
import { ScheduleSection } from '@/components/landing-page/karate/schedule';
import { TestimonialsSection } from '@/components/landing-page/karate/testimonials';
import { TrainingSection } from '@/components/landing-page/karate/training';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Karatê em Maceió | Aulas de Karatê Tradicional',
  description:
    'Aprenda Karatê tradicional em Maceió com instrutores qualificados. Aulas para todas as idades no Budokan-Ryu.',
  keywords: [
    'karate Maceió',
    'karate tradicional',
    'aulas karate',
    'dojo karate Maceió',
  ],
  openGraph: {
    title: 'Karatê em Maceió | Budokan-Ryu',
    description:
      'Aprenda Karatê tradicional em Maceió com instrutores qualificados',
    url: 'https://www.budokanryu.com.br/karate',
  },
};

export default function Karate() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <HistorySection />
      <TrainingSection />
      {/* <MaterialsSection /> */}
      <BenefitsSection />
      <ScheduleSection />
      <TestimonialsSection />
      <FQASection />
      <CTASection />
    </>
  );
}
