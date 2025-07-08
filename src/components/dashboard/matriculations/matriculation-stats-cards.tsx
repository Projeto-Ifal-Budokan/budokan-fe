import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, GraduationCap, TrendingUp, Users } from 'lucide-react';

interface EnrollmentStatsItem {
  type: 'student' | 'instructor';
  status: 'active' | 'inactive' | 'graduated';
}

interface MatriculationStatsCardsProps {
  matriculations: EnrollmentStatsItem[] | undefined;
}

export function MatriculationStatsCards({
  matriculations,
}: MatriculationStatsCardsProps) {
  const totalMatriculations = matriculations?.length || 0;
  const activeStudents =
    matriculations?.filter((m) => m.type === 'student' && m.status === 'active')
      .length || 0;
  const activeInstructors =
    matriculations?.filter(
      (m) => m.type === 'instructor' && m.status === 'active'
    ).length || 0;
  const graduatedStudents =
    matriculations?.filter(
      (m) => m.type === 'student' && m.status === 'graduated'
    ).length || 0;

  return (
    <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
      <Card className='relative overflow-hidden border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl'>
        <div className='absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10'></div>
        <CardHeader className='relative flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium opacity-90'>
            Total Matrículas
          </CardTitle>
          <GraduationCap className='h-5 w-5 opacity-80' />
        </CardHeader>
        <CardContent className='relative'>
          <div className='text-3xl font-bold'>{totalMatriculations}</div>
          <p className='mt-1 text-xs opacity-80'>matrículas cadastradas</p>
        </CardContent>
      </Card>

      <Card className='relative overflow-hidden border-0 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-xl'>
        <div className='absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10'></div>
        <CardHeader className='relative flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium opacity-90'>
            Alunos Ativos
          </CardTitle>
          <Users className='h-5 w-5 opacity-80' />
        </CardHeader>
        <CardContent className='relative'>
          <div className='text-3xl font-bold'>{activeStudents}</div>
          <p className='mt-1 text-xs opacity-80'>estudando atualmente</p>
        </CardContent>
      </Card>

      <Card className='relative overflow-hidden border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl'>
        <div className='absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10'></div>
        <CardHeader className='relative flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium opacity-90'>
            Instrutores Ativos
          </CardTitle>
          <TrendingUp className='h-5 w-5 opacity-80' />
        </CardHeader>
        <CardContent className='relative'>
          <div className='text-3xl font-bold'>{activeInstructors}</div>
          <p className='mt-1 text-xs opacity-80'>lecionando atualmente</p>
        </CardContent>
      </Card>

      <Card className='relative overflow-hidden border-0 bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-xl'>
        <div className='absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10'></div>
        <CardHeader className='relative flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium opacity-90'>
            Alunos Graduados
          </CardTitle>
          <Award className='h-5 w-5 opacity-80' />
        </CardHeader>
        <CardContent className='relative'>
          <div className='text-3xl font-bold'>{graduatedStudents}</div>
          <p className='mt-1 text-xs opacity-80'>já formados</p>
        </CardContent>
      </Card>
    </div>
  );
}
