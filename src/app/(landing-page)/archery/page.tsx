import { AboutSection } from '@/components/landing-page/archery/about';
import { BenefitsSection } from '@/components/landing-page/archery/benefits';
import { CTASection } from '@/components/landing-page/archery/cta';
import { EquipamentsTechniquesSection } from '@/components/landing-page/archery/equipaments-techniques';
import { FQASection } from '@/components/landing-page/archery/fqa';
import { Hero } from '@/components/landing-page/archery/hero';
import { HistorySection } from '@/components/landing-page/archery/history';
import { TestimonialsSection } from '@/components/landing-page/archery/testimonials';
import { ScheduleSection } from '@/components/landing-page/archery/schedule';

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
