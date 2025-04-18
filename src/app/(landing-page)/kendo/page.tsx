import { AboutSection } from '@/components/landing-page/kendo/about';
import { HeroSection } from '@/components/landing-page/kendo/hero';
import { HistorySection } from '@/components/landing-page/kendo/history';
import { EquipamentsTechniquesSection } from '@/components/landing-page/kendo/equipaments-techniques';
import { BenefitsSection } from '@/components/landing-page/kendo/benefits';
import { ScheduleSection } from '@/components/landing-page/kendo/schedule';
import { TestimonialsSection } from '@/components/landing-page/kendo/testimonials';
import { FQASection } from '@/components/landing-page/kendo/fqa';
import { CTASection } from '@/components/landing-page/kendo/cta';

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
