import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InstructorDiscipline } from '@/types/instructor';
import { Award, TrendingUp, Users } from 'lucide-react';
import { useMemo } from 'react';

interface InstructorStatsCardsProps {
  instructors: InstructorDiscipline[];
}

export function InstructorStatsCards({
  instructors,
}: InstructorStatsCardsProps) {
  const stats = useMemo(() => {
    const total = instructors.length;
    const active = instructors.filter((i) => i.status === 'active').length;
    const inactive = instructors.filter((i) => i.status === 'inactive').length;

    return {
      total,
      active,
      inactive,
    };
  }, [instructors]);

  const cards = [
    {
      title: 'Total Instrutores',
      value: stats.total,
      description: `${stats.active} ativos, ${stats.inactive} inativos`,
      icon: Users,
      trend: '+12%',
    },
    {
      title: 'Instrutores Ativos',
      value: stats.active,
      description: 'Ministrando aulas',
      icon: TrendingUp,
      trend: '+8%',
    },
    {
      title: 'Experiência Média',
      value: '15+',
      description: 'anos de experiência',
      icon: Award,
      trend: '+5%',
    },
  ];

  return (
    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className='transition-all hover:shadow-md'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-3'>
              <CardTitle className='text-sm font-medium text-gray-600'>
                {card.title}
              </CardTitle>
              <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100'>
                <Icon className='h-4 w-4 text-blue-600' />
              </div>
            </CardHeader>
            <CardContent className='space-y-2'>
              <div className='text-3xl font-bold text-gray-900'>
                {card.value}
              </div>
              <div className='flex items-center gap-2'>
                <span className='text-sm text-gray-600'>
                  {card.description}
                </span>
                <span className='text-xs font-medium text-green-600'>
                  {card.trend}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
