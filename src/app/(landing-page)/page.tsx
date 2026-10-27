import HeroCarousel from '@/components/landing-page/hero-carousel';

import { AboutSection } from '@/components/landing-page/home/about';
import { ContactSection } from '@/components/landing-page/home/contact';
import { DisciplinesSection } from '@/components/landing-page/home/disciplines';
import { FeedbackSection } from '@/components/landing-page/home/feedback';
import { InstructorsSection } from '@/components/landing-page/home/instructors';
import { ScheduleSection } from '@/components/landing-page/home/schedule';
import { TestimonialsSection } from '@/components/landing-page/home/testimonials';

// a home passa a ser regenerada a cada 5 minutos: e o que faz um depoimento aprovado no
// painel do Strapi aparecer no site sem precisar de redeploy
export const revalidate = 300;

export default function Home() {
  return (
    <>
      <HeroCarousel />
      <AboutSection />
      <DisciplinesSection />
      <InstructorsSection />
      <ScheduleSection />
      <TestimonialsSection />
      <FeedbackSection />
      <ContactSection />
    </>
  );
}
