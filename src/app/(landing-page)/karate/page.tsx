import { ScheduleSection } from '@/components/landing-page/karate/schedule';
import { AboutSection } from '@/components/landing-page/karate/about';
import { BenefitsSection } from '@/components/landing-page/karate/benefits';
import { HeroSection } from '@/components/landing-page/karate/hero';
import { HistorySection } from '@/components/landing-page/karate/history';
import { MaterialsSection } from '@/components/landing-page/karate/materials';
import { TrainingSection } from '@/components/landing-page/karate/training';
import { TestimonialsSection } from '@/components/landing-page/karate/testimonials';
import { FQASection } from '@/components/landing-page/karate/fqa';
import { CTASection } from '@/components/landing-page/karate/cta';

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
