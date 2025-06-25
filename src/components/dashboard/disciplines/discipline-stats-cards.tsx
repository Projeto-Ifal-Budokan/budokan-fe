import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Discipline } from '@/types/discipline';

import { Award, BookOpen, TrendingUp, Users } from 'lucide-react';

interface DisciplineStatsCardsProps {
  disciplines: Discipline[] | undefined;
}

export function DisciplineStatsCards({
  disciplines,
}: DisciplineStatsCardsProps) {
  const activeDisciplines =
    disciplines?.filter((d) => d.status === 'active').length || 0;
  const totalRanks =
    disciplines?.reduce(
      (acc, discipline) => acc + (discipline.ranks?.length || 0),
      0
    ) || 0;
  const totalInstructors =
    disciplines?.reduce(
      (acc, discipline) => acc + (discipline.instructors?.length || 0),
      0
    ) || 0;
  const activeInstructors =
    disciplines?.reduce(
      (acc, discipline) =>
        acc +
        (discipline.instructors?.filter((i) => i.status === 'active').length ||
          0),
      0
    ) || 0;

  return (
    <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
      <Card className='relative overflow-hidden border-0 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-xl'>
        <div className='absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10'></div>
        <CardHeader className='relative flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium opacity-90'>
            Total Disciplinas
          </CardTitle>
          <BookOpen className='h-5 w-5 opacity-80' />
        </CardHeader>
        <CardContent className='relative'>
          <div className='text-3xl font-bold'>{disciplines?.length || 0}</div>
          <p className='mt-1 text-xs opacity-80'>{activeDisciplines} ativas</p>
        </CardContent>
      </Card>

      <Card className='relative overflow-hidden border-0 bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-xl'>
        <div className='absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10'></div>
        <CardHeader className='relative flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium opacity-90'>
            Total Ranks
          </CardTitle>
          <Award className='h-5 w-5 opacity-80' />
        </CardHeader>
        <CardContent className='relative'>
          <div className='text-3xl font-bold'>{totalRanks}</div>
          <p className='mt-1 text-xs opacity-80'>Ranks cadastradas</p>
        </CardContent>
      </Card>

      <Card className='relative overflow-hidden border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl'>
        <div className='absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10'></div>
        <CardHeader className='relative flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium opacity-90'>
            Instrutores Ativos
          </CardTitle>
          <Users className='h-5 w-5 opacity-80' />
        </CardHeader>
        <CardContent className='relative'>
          <div className='text-3xl font-bold'>{activeInstructors}</div>
          <p className='mt-1 text-xs opacity-80'>lecionando atualmente</p>
        </CardContent>
      </Card>

      <Card className='relative overflow-hidden border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl'>
        <div className='absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10'></div>
        <CardHeader className='relative flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium opacity-90'>
            Total Instrutores
          </CardTitle>
          <TrendingUp className='h-5 w-5 opacity-80' />
        </CardHeader>
        <CardContent className='relative'>
          <div className='text-3xl font-bold'>{totalInstructors}</div>
          <p className='mt-1 text-xs opacity-80'>instrutores cadastrados</p>
        </CardContent>
      </Card>
    </div>
  );
}
