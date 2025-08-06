'use client';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useManageAttendance } from '@/lib/api/queries/use-manage-attendance';
import { useManageMatriculations } from '@/lib/api/queries/use-manage-matriculations';
import { useManageSessions } from '@/lib/api/queries/use-manage-sessions';
import { Matriculation } from '@/types/matriculation';
import { Session } from '@/types/session';
import {
  BookOpen,
  Calendar,
  Clock,
  GraduationCap,
  Target,
  Trophy,
  User,
  Users,
} from 'lucide-react';
import Link from 'next/link';

interface StudentDashboardProps {
  userId: number;
}

export function StudentDashboard({ userId }: StudentDashboardProps) {
  // Get today's date for filtering sessions
  const today = new Date().toISOString().split('T')[0];

  // Fetch student's matriculations (enrolled disciplines)
  const { data: matriculations, isLoading: loadingMatriculations } =
    useManageMatriculations().useMatriculations(1, 50, {
      idStudent: String(userId),
      status: 'active',
    });

  // Get discipline IDs from matriculations
  const disciplineIds =
    matriculations?.data?.items?.map((m) => m.idDiscipline) || [];

  // Fetch today's sessions for student's disciplines
  const { data: todaySessions, isLoading: loadingSessions } =
    useManageSessions().useSessions({
      initialDate: today,
      finalDate: today,
      page: 1,
      page_size: 50,
    });

  // Filter sessions for student's disciplines
  const studentTodaySessions =
    todaySessions?.data?.items?.filter((session) =>
      disciplineIds.includes(session.idDiscipline)
    ) || [];

  // Fetch recent attendance for student
  const { data: attendanceData, isLoading: loadingAttendance } =
    useManageAttendance().useSessionAttendances({
      page: 1,
      page_size: 10,
    });

  // Calculate attendance stats
  const studentAttendances =
    attendanceData?.data?.items?.filter((att) => att.idStudent === userId) ||
    [];
  const presentCount = studentAttendances.filter(
    (att) => att.status === 'present'
  ).length;
  const totalAttendances = studentAttendances.length;
  const attendancePercentage =
    totalAttendances > 0
      ? Math.round((presentCount / totalAttendances) * 100)
      : 0;

  if (loadingMatriculations) {
    return <StudentDashboardSkeleton />;
  }

  const enrolledDisciplines = matriculations?.data?.items || [];

  return (
    <div className='min-h-screen'>
      <div className='mx-auto space-y-8'>
        {/* Enhanced Header Section */}
        <div className='flex flex-col gap-6 md:flex-row md:items-center md:justify-between'>
          <div className='space-y-2'>
            <div className='flex items-center gap-3'>
              <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'>
                <GraduationCap className='h-6 w-6' />
              </div>
              <div>
                <h1 className='text-4xl font-bold tracking-tight text-gray-900'>
                  Meu Dashboard
                </h1>
                <p className='text-lg text-gray-600'>
                  Acompanhe seu progresso e atividades
                </p>
              </div>
            </div>
          </div>
        </div>

        <Card className='border-0 bg-white/90 shadow-xl backdrop-blur-sm'>
          <CardHeader className='border-b border-gray-100'>
            <CardTitle className='flex items-center gap-3 text-xl font-semibold'>
              <div className='rounded-lg bg-purple-100 p-2'>
                <Target className='h-5 w-5 text-purple-600' />
              </div>
              Ações Rápidas
            </CardTitle>
            <CardDescription className='text-base'>
              Acesso rápido às principais funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent className='p-6'>
            <div className='grid gap-6 md:grid-cols-3'>
              <Link href='/dashboard/profile' className='group'>
                <div className='flex items-center gap-4 rounded-xl border border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 transition-all hover:border-blue-300 hover:shadow-md'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg'>
                    <User className='h-6 w-6' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-900'>Meu Perfil</h3>
                    <p className='text-sm text-gray-600'>
                      Atualizar informações
                    </p>
                  </div>
                </div>
              </Link>
              {/* <Link href='/dashboard/attendance' className='group'>
                <div className='flex items-center gap-4 rounded-xl border border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50 p-6 transition-all hover:border-green-300 hover:shadow-md'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-green-600 text-white shadow-lg'>
                    <CheckCircle className='h-6 w-6' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-900'>Frequência</h3>
                    <p className='text-sm text-gray-600'>Ver histórico</p>
                  </div>
                </div>
              </Link> */}
              <Link href='/dashboard/rankings' className='group'>
                <div className='flex items-center gap-4 rounded-xl border border-gray-200 bg-gradient-to-r from-yellow-50 to-amber-50 p-6 transition-all hover:border-yellow-300 hover:shadow-md'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-600 text-white shadow-lg'>
                    <Trophy className='h-6 w-6' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-900'>Rankings</h3>
                    <p className='text-sm text-gray-600'>Ver graduações</p>
                  </div>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Stats Cards */}
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          <Card className='relative overflow-hidden border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl'>
            <div className='absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10'></div>
            <CardHeader className='relative flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium opacity-90'>
                Modalidades
              </CardTitle>
              <BookOpen className='h-5 w-5 opacity-80' />
            </CardHeader>
            <CardContent className='relative'>
              <div className='text-3xl font-bold'>
                {enrolledDisciplines.length}
              </div>
              <p className='mt-1 text-xs opacity-80'>
                disciplinas matriculadas
              </p>
            </CardContent>
          </Card>

          <Card className='relative overflow-hidden border-0 bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-xl'>
            <div className='absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10'></div>
            <CardHeader className='relative flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium opacity-90'>
                Aulas Hoje
              </CardTitle>
              <Calendar className='h-5 w-5 opacity-80' />
            </CardHeader>
            <CardContent className='relative'>
              <div className='text-3xl font-bold'>
                {studentTodaySessions.length}
              </div>
              <p className='mt-1 text-xs opacity-80'>sessões agendadas</p>
            </CardContent>
          </Card>

          {/* <Card className='relative overflow-hidden border-0 bg-gradient-to-br from-yellow-500 to-amber-600 text-white shadow-xl'>
            <div className='absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10'></div>
            <CardHeader className='relative flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium opacity-90'>
                Frequência
              </CardTitle>
              <TrendingUp className='h-5 w-5 opacity-80' />
            </CardHeader>
            <CardContent className='relative'>
              <div className='text-3xl font-bold'>{attendancePercentage}%</div>
              <p className='mt-1 text-xs opacity-80'>taxa de presença</p>
            </CardContent>
          </Card>

          <Card className='relative overflow-hidden border-0 bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-xl'>
            <div className='absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10'></div>
            <CardHeader className='relative flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium opacity-90'>
                Presenças
              </CardTitle>
              <CheckCircle className='h-5 w-5 opacity-80' />
            </CardHeader>
            <CardContent className='relative'>
              <div className='text-3xl font-bold'>
                {presentCount}/{totalAttendances}
              </div>
              <p className='mt-1 text-xs opacity-80'>total de presenças</p>
            </CardContent>
          </Card> */}
        </div>

        <div className='grid gap-6 md:grid-cols-2'>
          {/* Enhanced Enrolled Disciplines */}
          <Card className='border-0 bg-white/90 shadow-xl backdrop-blur-sm'>
            <CardHeader className='border-b border-gray-100'>
              <CardTitle className='flex items-center gap-3 text-xl font-semibold'>
                <div className='rounded-lg bg-blue-100 p-2'>
                  <BookOpen className='h-5 w-5 text-blue-600' />
                </div>
                Minhas Modalidades
              </CardTitle>
              <CardDescription className='text-base'>
                Disciplinas em que você está matriculado
              </CardDescription>
            </CardHeader>
            <CardContent className='p-6'>
              {enrolledDisciplines.length === 0 ? (
                <div className='py-8 text-center'>
                  <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100'>
                    <Users className='h-6 w-6 text-gray-400' />
                  </div>
                  <h3 className='mb-2 text-sm font-medium text-gray-900'>
                    Nenhuma modalidade
                  </h3>
                  <p className='text-sm text-gray-500'>
                    Você ainda não está matriculado em nenhuma disciplina
                  </p>
                </div>
              ) : (
                <div className='space-y-4'>
                  {enrolledDisciplines.map((matriculation) => (
                    <DisciplineCard
                      key={matriculation.id}
                      matriculation={matriculation}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Enhanced Today's Sessions */}
          <Card className='border-0 bg-white/90 shadow-xl backdrop-blur-sm'>
            <CardHeader className='border-b border-gray-100'>
              <CardTitle className='flex items-center gap-3 text-xl font-semibold'>
                <div className='rounded-lg bg-green-100 p-2'>
                  <Clock className='h-5 w-5 text-green-600' />
                </div>
                Aulas de Hoje
              </CardTitle>
              <CardDescription className='text-base'>
                Suas sessões de treino agendadas para hoje
              </CardDescription>
            </CardHeader>
            <CardContent className='p-6'>
              {loadingSessions ? (
                <div className='space-y-3'>
                  {[1, 2].map((i) => (
                    <Skeleton key={i} className='h-16 w-full' />
                  ))}
                </div>
              ) : studentTodaySessions.length === 0 ? (
                <div className='py-8 text-center'>
                  <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100'>
                    <Calendar className='h-6 w-6 text-gray-400' />
                  </div>
                  <h3 className='mb-2 text-sm font-medium text-gray-900'>
                    Nenhuma aula hoje
                  </h3>
                  <p className='text-sm text-gray-500'>
                    Nenhuma aula agendada para hoje
                  </p>
                </div>
              ) : (
                <div className='space-y-4'>
                  {studentTodaySessions.map((session) => (
                    <SessionCard key={session.id} session={session} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Quick Actions */}
      </div>
    </div>
  );
}

function DisciplineCard({ matriculation }: { matriculation: Matriculation }) {
  return (
    <div className='flex items-center justify-between rounded-xl border border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50 p-4 transition-all hover:border-blue-300 hover:shadow-sm'>
      <div className='flex items-center gap-4'>
        <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white'>
          <BookOpen className='h-5 w-5' />
        </div>
        <div>
          <h4 className='font-semibold text-gray-900'>
            {matriculation.disciplineName}
          </h4>
          <div className='mt-2 flex items-center gap-2'>
            <Badge variant='secondary' className='text-xs font-medium'>
              {matriculation.rankName}
            </Badge>
            <Badge
              variant={
                matriculation.status === 'active' ? 'default' : 'secondary'
              }
              className='text-xs font-medium'
            >
              {matriculation.status === 'active' ? 'Ativo' : 'Inativo'}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

function SessionCard({ session }: { session: Session }) {
  return (
    <div className='flex items-center gap-4 rounded-xl border border-gray-200 bg-gradient-to-r from-gray-50 to-green-50 p-4 transition-all hover:border-green-300 hover:shadow-sm'>
      <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-green-600 text-white'>
        <Clock className='h-5 w-5' />
      </div>
      <div className='flex-1'>
        <h4 className='font-semibold text-gray-900'>
          {session.disciplineName}
        </h4>
        <p className='text-sm text-gray-600'>
          {session.startingTime} - {session.endingTime}
        </p>
        <p className='text-xs text-gray-500'>
          Prof. {session.instructorFirstName} {session.instructorSurname}
        </p>
      </div>
    </div>
  );
}

function StudentDashboardSkeleton() {
  return (
    <div className='min-h-screen'>
      <div className='mx-auto space-y-8'>
        <div className='space-y-2'>
          <Skeleton className='h-8 w-48' />
          <Skeleton className='h-4 w-96' />
        </div>

        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className='h-32' />
          ))}
        </div>

        <div className='grid gap-6 md:grid-cols-2'>
          <Skeleton className='h-80' />
          <Skeleton className='h-80' />
        </div>

        <Skeleton className='h-64' />
      </div>
    </div>
  );
}
