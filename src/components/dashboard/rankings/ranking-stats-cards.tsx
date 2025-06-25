import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Ranking } from '@/types/ranking';
import { BookOpen, TrendingUp, Trophy } from 'lucide-react';
import { useMemo } from 'react';

interface RankingStatsCardsProps {
  totalRankings: number;
  totalDisciplines: number;
  rankings: Ranking[];
}

export function RankingStatsCards({
  totalRankings,
  totalDisciplines,
  rankings,
}: RankingStatsCardsProps) {
  const beltStats = useMemo(() => {
    const beltCounts = rankings.reduce(
      (acc, ranking) => {
        const belt = ranking.description;
        acc[belt] = (acc[belt] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const mostCommonBelt = Object.entries(beltCounts).reduce(
      (max, [belt, count]) => (count > max.count ? { belt, count } : max),
      { belt: 'N/A', count: 0 }
    );

    return mostCommonBelt;
  }, [rankings]);

  return (
    <div className='grid gap-4 md:grid-cols-3'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>
            Total de Rankings
          </CardTitle>
          <Trophy className='h-4 w-4 text-blue-600' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{totalRankings}</div>
          <p className='text-xs text-gray-600'>
            Rankings cadastrados no sistema
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>
            Modalidades Ativas
          </CardTitle>
          <BookOpen className='h-4 w-4 text-green-600' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{totalDisciplines}</div>
          <p className='text-xs text-gray-600'>Modalidades com rankings</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>
            Graduação Mais Comum
          </CardTitle>
          <TrendingUp className='h-4 w-4 text-purple-600' />
        </CardHeader>
        <CardContent>
          <div className='text-lg font-bold'>{beltStats.belt}</div>
          <p className='text-xs text-gray-600'>
            {beltStats.count} {beltStats.count === 1 ? 'ranking' : 'rankings'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
