import HeroCarousel from '@/components/landing-page/hero-carousel';

import { AboutSection } from '@/components/landing-page/home/about';
import { ContactSection } from '@/components/landing-page/home/contact';
import { DisciplinesSection } from '@/components/landing-page/home/disciplines';
import { InstructorsSection } from '@/components/landing-page/home/instructors';
import { ScheduleSection } from '@/components/landing-page/home/schedule';
import { TestimonialsSection } from '@/components/landing-page/home/testimonials';

export default function Home() {
  return (
    <>
      <HeroCarousel />
      <AboutSection />
      <DisciplinesSection />
      <InstructorsSection />
      <ScheduleSection />
      <TestimonialsSection />
      <ContactSection />
    </>
  );
}
