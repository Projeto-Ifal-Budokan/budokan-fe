import { TeamDevelopersLoading } from '@/components/landing-page/team-developers/team-developers-loading';
import { TeamDevelopersSection } from '@/components/landing-page/team-developers/team-developers-section';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Equipe de Desenvolvedores | Budokan-Ryu',
  description:
    'Conheça nossa equipe de desenvolvedores talentosos e apaixonados por tecnologia. Descubra seus projetos, especialidades e contribuições no GitHub.',
  keywords: [
    'equipe',
    'desenvolvedores',
    'programadores',
    'github',
    'tecnologia',
    'budokan',
    'portfolio',
  ],
  openGraph: {
    title: 'Equipe de Desenvolvedores | Budokan-Ryu',
    description:
      'Conheça nossa equipe de desenvolvedores talentosos e apaixonados por tecnologia.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Equipe de Desenvolvedores | Budokan-Ryu',
    description:
      'Conheça nossa equipe de desenvolvedores talentosos e apaixonados por tecnologia.',
  },
};

export default function TeamDevelopersPage() {
  return (
    <div className='min-h-screen'>
      <Suspense fallback={<TeamDevelopersLoading />}>
        <TeamDevelopersSection />
      </Suspense>
    </div>
  );
}
