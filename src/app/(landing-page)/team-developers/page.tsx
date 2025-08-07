import { TeamDevelopersLoading } from '@/components/landing-page/team-developers/team-developers-loading';
import { TeamDevelopersSection } from '@/components/landing-page/team-developers/team-developers-section';
import { getActiveTeamMembers, getTeamStats } from '@/data/team-members';
import { Metadata } from 'next';
import { Suspense } from 'react';

// Generate dynamic metadata based on actual team data
export async function generateMetadata(): Promise<Metadata> {
  const activeMembers = getActiveTeamMembers();
  const teamStats = getTeamStats();

  // Extract unique roles and technologies from team members
  const roles = [...new Set(activeMembers.map((member) => member.role))];
  const roleKeywords = roles.flatMap((role) =>
    role
      .toLowerCase()
      .split(/[&\s]+/)
      .filter((word) => word.length > 2)
  );

  const teamMemberNames = activeMembers
    .map((member) => member.githubUsername)
    .join(', ');

  return {
    title: 'Equipe de Desenvolvedores IFAL | Budokan-Ryu - Portfolio GitHub',
    description: `Conheça os ${teamStats.totalMembers} desenvolvedores do IFAL responsáveis pelo sistema Budokan-Ryu. Especialistas em ${roles.join(', ').toLowerCase()}. Explore seus projetos, contribuições e perfis no GitHub.`,
    keywords: [
      // Core team keywords
      'equipe desenvolvedores ifal',
      'desenvolvedores budokan',
      'portfolio github ifal',
      'programadores instituto federal alagoas',

      // Role-specific keywords
      ...roleKeywords,
      'full stack developer',
      'frontend developer',
      'backend developer',
      'ui ux designer',
      'devops engineer',

      // Technology and platform keywords
      'github portfolio',
      'projetos open source',
      'contribuições github',
      'repositórios públicos',
      'tecnologia educacional',

      // Institution and context
      'ifal',
      'instituto federal alagoas',
      'budokan ryu',
      'sistema gestão dojo',
      'plataforma educacional',

      // SEO and discovery
      'desenvolvedores brasileiros',
      'equipe desenvolvimento',
      'perfis github',
      'portfolio programadores',
    ],
    authors: [
      { name: 'Equipe IFAL Budokan' },
      ...activeMembers.map((member) => ({ name: member.githubUsername })),
    ],
    creator: 'Instituto Federal de Alagoas - IFAL',
    publisher: 'Budokan-Ryu Platform',
    openGraph: {
      title: 'Equipe de Desenvolvedores IFAL | Budokan-Ryu',
      description: `Conheça os ${teamStats.totalMembers} talentosos desenvolvedores do IFAL que criaram o sistema Budokan-Ryu. Explore seus projetos e contribuições no GitHub.`,
      type: 'profile',
      siteName: 'Budokan-Ryu',
      locale: 'pt_BR',
      images: [
        {
          url: '/logo.jpeg', // Assuming this exists in public folder
          width: 1200,
          height: 630,
          alt: 'Equipe de Desenvolvedores Budokan-Ryu IFAL',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Desenvolvedores IFAL | Budokan-Ryu',
      description: `${teamStats.totalMembers} desenvolvedores talentosos do IFAL. Especialistas em desenvolvimento full-stack, UI/UX e DevOps.`,
      images: ['/logo.jpeg'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: '/team-developers',
    },
    other: {
      'github-usernames': teamMemberNames,
      'team-size': teamStats.totalMembers.toString(),
      institution: 'Instituto Federal de Alagoas',
    },
  };
}

export default function TeamDevelopersPage() {
  return (
    <div className='min-h-screen'>
      <Suspense fallback={<TeamDevelopersLoading />}>
        <TeamDevelopersSection />
      </Suspense>
    </div>
  );
}
