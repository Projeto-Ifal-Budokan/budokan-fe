'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useManageDisciplines } from '@/lib/api/queries/use-manage-disciplines';
import { Award, BookOpen, Calendar, ChevronLeft, Users } from 'lucide-react';
import Link from 'next/link';

import { useInstructorDisciplines } from '@/lib/api/queries/use-instructor-disciplines';
import { useManageMatriculations } from '@/lib/api/queries/use-manage-matriculations';
import { useManageRankings } from '@/lib/api/queries/use-manage-rankings';
import { DisciplineEnrollmentsTab } from './detail-tabs/discipline-enrollments-tab';
import { DisciplineRanksTab } from './detail-tabs/discipline-ranks-tab';
import { DisciplineSchedulesTab } from './detail-tabs/discipline-schedules-tab';
import { DisciplineDetailSkeleton } from './discipline-detail-skeleton';

interface DisciplineDetailViewProps {
  disciplineId: string;
}

export function DisciplineDetailView({
  disciplineId,
}: DisciplineDetailViewProps) {
  const { useDiscipline } = useManageDisciplines();
  const { useRankings } = useManageRankings();
  const { data: ranks } = useRankings(disciplineId);
  const { data: discipline, isLoading } = useDiscipline(disciplineId);
  const { useMatriculations } = useManageMatriculations();
  const { useInstructorDisciplinesList } = useInstructorDisciplines();
  const { data: matriculations } = useMatriculations(1, 1000, {
    discipline: disciplineId,
  });
  const { data: instructors } = useInstructorDisciplinesList(1, 1000, {
    discipline: disciplineId,
  });

  if (isLoading) {
    return <DisciplineDetailSkeleton />;
  }

  if (!discipline) {
    return (
      <div className='flex min-h-[400px] flex-col items-center justify-center text-center'>
        <BookOpen className='mb-4 h-16 w-16 text-gray-400' />
        <h2 className='mb-2 text-2xl font-semibold text-gray-900'>
          Disciplina não encontrada
        </h2>
        <p className='mb-6 text-gray-600'>
          A disciplina que você está procurando não existe ou foi removida.
        </p>
        <Link href='/dashboard/disciplines'>
          <Button>
            <ChevronLeft className='mr-2 h-4 w-4' />
            Voltar para Disciplinas
          </Button>
        </Link>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'inactive':
        return 'Inativo';
      default:
        return 'Inativo';
    }
  };

  return (
    <div className='min-h-screen'>
      <div className='mx-auto space-y-8'>
        {/* Header with Breadcrumb */}
        <div className='space-y-6'>
          <div className='flex items-center gap-2 text-sm text-gray-600'>
            <Link
              href='/dashboard/disciplines'
              className='transition-colors hover:text-emerald-600'
            >
              Disciplinas
            </Link>
            <span>/</span>
            <span className='font-medium text-gray-900'>{discipline.name}</span>
          </div>

          <div className='flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between'>
            <div className='space-y-4'>
              <div className='flex items-center gap-4'>
                <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-xl'>
                  <BookOpen className='h-8 w-8' />
                </div>
                <div>
                  <div className='mb-2 flex items-center gap-3'>
                    <h1 className='text-3xl font-bold tracking-tight text-gray-900'>
                      {discipline.name}
                    </h1>
                    <Badge variant={getStatusColor(discipline.status)}>
                      {getStatusText(discipline.status)}
                    </Badge>
                  </div>
                  <p className='text-lg text-gray-600'>
                    {discipline.description}
                  </p>
                </div>
              </div>
            </div>

            <Link href='/dashboard/disciplines'>
              <Button variant='outline' className='flex items-center gap-2'>
                <ChevronLeft className='h-4 w-4' />
                Voltar
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          <Card className='border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/50'>
            <CardHeader className='pb-3'>
              <CardTitle className='text-sm font-medium text-emerald-700'>
                Total de Ranks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex items-center gap-2'>
                <Award className='h-5 w-5 text-emerald-600' />
                <span className='text-2xl font-bold text-emerald-900'>
                  {ranks?.data.count || 0}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className='border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50'>
            <CardHeader className='pb-3'>
              <CardTitle className='text-sm font-medium text-blue-700'>
                Estudantes Matriculados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex items-center gap-2'>
                <Users className='h-5 w-5 text-blue-600' />
                <span className='text-2xl font-bold text-blue-900'>
                  {matriculations?.data.count || 0}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className='border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100/50'>
            <CardHeader className='pb-3'>
              <CardTitle className='text-sm font-medium text-purple-700'>
                Instrutores Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex items-center gap-2'>
                <Users className='h-5 w-5 text-purple-600' />
                <span className='text-2xl font-bold text-purple-900'>
                  {instructors?.data.count || 0}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Card className='shadow-sm'>
          <CardContent className='p-0'>
            <Tabs defaultValue='ranks' className='w-full'>
              <TabsList className='grid w-full grid-cols-3 rounded-none border-b bg-gray-50/50'>
                <TabsTrigger
                  value='ranks'
                  className='flex items-center gap-2 data-[state=active]:bg-white'
                >
                  <Award className='h-4 w-4' />
                  Ranks
                </TabsTrigger>
                <TabsTrigger
                  value='enrollments'
                  className='flex items-center gap-2 data-[state=active]:bg-white'
                >
                  <Users className='h-4 w-4' />
                  Matrículas
                </TabsTrigger>
                <TabsTrigger
                  value='schedules'
                  className='flex items-center gap-2 data-[state=active]:bg-white'
                >
                  <Calendar className='h-4 w-4' />
                  Horários
                </TabsTrigger>
              </TabsList>

              <TabsContent value='ranks' className='space-y-6 p-6'>
                <DisciplineRanksTab
                  disciplineId={disciplineId}
                  discipline={discipline}
                />
              </TabsContent>

              <TabsContent value='enrollments' className='space-y-6 p-6'>
                <DisciplineEnrollmentsTab
                  disciplineId={disciplineId}
                  discipline={discipline}
                />
              </TabsContent>

              <TabsContent value='schedules' className='space-y-6 p-6'>
                <DisciplineSchedulesTab
                  disciplineId={disciplineId}
                  discipline={discipline}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
