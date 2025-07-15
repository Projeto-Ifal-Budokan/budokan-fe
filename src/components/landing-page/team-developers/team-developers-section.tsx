import { Button } from '@/components/ui/button';
import { getActiveTeamMembers } from '@/data/team-members';
import { githubService, GitHubUser } from '@/lib/api/services/github-service';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { DeveloperCard } from './developer-card';

interface DeveloperData {
  user: GitHubUser;
  role: string;
}

async function fetchDevelopers(): Promise<DeveloperData[]> {
  try {
    const activeMembers = getActiveTeamMembers();
    const usernames = activeMembers.map((member) => member.githubUsername);

    // Use batch fetch for better performance
    const users = await githubService.batchGetUsers(usernames);

    const developersData: DeveloperData[] = [];

    users.forEach((user, index) => {
      if (user) {
        developersData.push({
          user,
          role: activeMembers[index].role,
        });
      }
    });

    return developersData;
  } catch (error) {
    console.error('Error fetching developers:', error);
    throw new Error('Erro ao carregar dados dos desenvolvedores');
  }
}

function ErrorState({ error }: { error: string }) {
  return (
    <section className='bg-white py-16'>
      <div className='container'>
        <div className='text-center'>
          <AlertCircle className='mx-auto mb-4 h-16 w-16 text-red-500' />
          <h2 className='mb-4 text-2xl font-bold text-gray-900'>
            Oops! Algo deu errado
          </h2>
          <p className='mb-4 text-gray-600'>{error}</p>
          <Link href='/team-developers'>
            <Button className='flex items-center gap-2'>
              <RefreshCw className='h-4 w-4' />
              Tentar Novamente
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export async function TeamDevelopersSection() {
  let developers: DeveloperData[] = [];
  let error: string | null = null;

  try {
    developers = await fetchDevelopers();
  } catch (err) {
    error = err instanceof Error ? err.message : 'Erro desconhecido';
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  // Calculate team stats
  const totalRepos = developers.reduce(
    (sum, dev) => sum + dev.user.public_repos,
    0
  );
  const totalFollowers = developers.reduce(
    (sum, dev) => sum + dev.user.followers,
    0
  );

  return (
    <section id='team-developers' className='bg-white py-16'>
      <div className='container'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-blue-900'>
            Equipe de Desenvolvedores
          </h2>
          <div className='bg-primary mx-auto mb-6 h-1 w-20'></div>
          <p className='mx-auto max-w-3xl text-gray-600'>
            Conheça a equipe de desenvolvedores do IFAL (Instituto Federal de
            Alagoas) responsável pela criação desta plataforma.
          </p>
        </div>

        <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {developers.map((developer, index) => (
            <DeveloperCard
              key={developer.user.login}
              user={developer.user}
              role={developer.role}
              className={`animate-in fade-in-50 slide-in-from-bottom-4 duration-700 delay-${index * 100}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
