'use client';
import { SessionsSkeleton } from '@/app/(internal)/dashboard/sessions/sessions-skeleton';
import { SessionFilters } from '@/components/dashboard/sessions/session-filters';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TablePagination } from '@/components/ui/table-pagination';
import { useDebounce } from '@/hooks/use-debounce';
import { useAuth } from '@/lib/api/queries/use-auth';
import { useManageDisciplines } from '@/lib/api/queries/use-manage-disciplines';
import { useManageMatriculations } from '@/lib/api/queries/use-manage-matriculations';
import { useManageSessions } from '@/lib/api/queries/use-manage-sessions';
import { Discipline } from '@/types/discipline';
import { Session, SessionFilters as SessionFiltersType } from '@/types/session';
import {
  Calendar,
  CheckCircle,
  Clock,
  GraduationCap,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';

export function StudentSessionsView() {
  // State
  const [filterDiscipline, setFilterDiscipline] = useState('all');
  const [dateFilter, setDateFilter] = useState({
    initialDate: '',
    finalDate: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Debounce date filters for better UX
  const debouncedDateFilter = useDebounce(dateFilter, 500);

  // Hooks
  const { data: currentUser } = useAuth().me;
  const { useMatriculations } = useManageMatriculations();
  const { useDisciplines } = useManageDisciplines();
  const { useSessions } = useManageSessions();

  // Get student's matriculations (enrolled disciplines)
  const { data: matriculationsResponse, isLoading: isLoadingMatriculations } =
    useMatriculations(1, 50, {
      idStudent: currentUser?.id.toString(),
      status: 'active',
    });

  // Get all disciplines for reference
  const { data: allDisciplinesResponse, isLoading: isLoadingDisciplines } =
    useDisciplines(1, 100);

  // Extract student's enrolled disciplines
  const enrolledDisciplines = useMemo(() => {
    if (
      !matriculationsResponse?.data?.items ||
      !allDisciplinesResponse?.data?.items
    ) {
      return [];
    }

    const studentMatriculations = matriculationsResponse.data.items.filter(
      (matriculation) => matriculation.idStudent === currentUser?.id
    );

    return studentMatriculations
      .map((matriculation) => {
        const discipline = allDisciplinesResponse.data.items.find(
          (d) => d.id === matriculation.idDiscipline
        );
        if (!discipline) return null;
        return discipline;
      })
      .filter(Boolean) as Discipline[];
  }, [matriculationsResponse, allDisciplinesResponse, currentUser?.id]);

  // Get discipline IDs for filtering sessions
  const enrolledDisciplineIds = enrolledDisciplines.map((d) => d.id);

  // Build session filters
  const sessionFilters = useMemo(() => {
    const filters: SessionFiltersType = {
      page: currentPage,
      page_size: pageSize,
    };

    if (debouncedDateFilter.initialDate) {
      filters.initialDate = debouncedDateFilter.initialDate;
    }
    if (debouncedDateFilter.finalDate) {
      filters.finalDate = debouncedDateFilter.finalDate;
    }
    if (filterDiscipline !== 'all') {
      filters.idDiscipline = parseInt(filterDiscipline);
    }

    return filters;
  }, [currentPage, pageSize, debouncedDateFilter, filterDiscipline]);

  // Get sessions with filters
  const { data: sessionsResponse, isLoading: isLoadingSessions } =
    useSessions(sessionFilters);

  // Filter sessions to only include student's enrolled disciplines
  const studentSessions = useMemo(() => {
    if (!sessionsResponse?.data?.items) return [];
    return sessionsResponse.data.items.filter((session) =>
      enrolledDisciplineIds.includes(session.idDiscipline)
    );
  }, [sessionsResponse, enrolledDisciplineIds]);

  // Calculate session statistics
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sessionStats = useMemo(() => {
    if (!studentSessions.length) {
      return {
        total: 0,
        upcoming: 0,
        today: 0,
        thisWeek: 0,
      };
    }

    const todayString = today.toISOString().split('T')[0];
    const weekFromNow = new Date(today);
    weekFromNow.setDate(today.getDate() + 7);
    const weekFromNowString = weekFromNow.toISOString().split('T')[0];

    return {
      total: studentSessions.length,
      today: studentSessions.filter((session) => session.date === todayString)
        .length,
      upcoming: studentSessions.filter(
        (session) => new Date(session.date) >= today
      ).length,
      thisWeek: studentSessions.filter(
        (session) =>
          session.date >= todayString && session.date <= weekFromNowString
      ).length,
    };
  }, [studentSessions, today]);

  // Utility functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5); // Remove seconds from HH:MM:SS
  };

  // Event handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handleDisciplineFilterChange = (value: string) => {
    setFilterDiscipline(value);
    setCurrentPage(1);
  };

  const handleDateFilterChange = (initialDate: string, finalDate: string) => {
    setDateFilter({ initialDate, finalDate });
    setCurrentPage(1);
  };

  // Loading state
  const isLoading =
    isLoadingMatriculations || isLoadingDisciplines || isLoadingSessions;

  if (isLoading) {
    return <SessionsSkeleton />;
  }

  // No enrolled disciplines
  if (enrolledDisciplines.length === 0) {
    return (
      <div className='min-h-screen'>
        <div className='mx-auto space-y-8'>
          <div className='space-y-2'>
            <div className='flex items-center gap-3'>
              <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'>
                <Calendar className='h-6 w-6' />
              </div>
              <div>
                <h1 className='text-4xl font-bold tracking-tight text-gray-900'>
                  Minhas Aulas
                </h1>
                <p className='text-lg text-gray-600'>
                  Suas sessões de treino agendadas
                </p>
              </div>
            </div>
          </div>

          <div className='rounded-lg border border-yellow-200 bg-yellow-50 p-8 text-center'>
            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100'>
              <Users className='h-8 w-8 text-yellow-500' />
            </div>
            <h3 className='mb-2 text-lg font-medium text-yellow-800'>
              Nenhuma disciplina matriculada
            </h3>
            <p className='text-yellow-600'>
              Você ainda não está matriculado em nenhuma disciplina. Entre em
              contato com o administrador para se matricular.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen'>
      <div className='mx-auto space-y-8'>
        {/* Header Section */}
        <div className='space-y-2'>
          <div className='flex items-center gap-3'>
            <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'>
              <Calendar className='h-6 w-6' />
            </div>
            <div>
              <h1 className='text-4xl font-bold tracking-tight text-gray-900'>
                Minhas Aulas
              </h1>
              <p className='text-lg text-gray-600'>
                Suas sessões de treino agendadas
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          <Card className='relative overflow-hidden border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl'>
            <div className='absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10'></div>
            <CardHeader className='relative flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium opacity-90'>
                Total de Aulas
              </CardTitle>
              <Calendar className='h-5 w-5 opacity-80' />
            </CardHeader>
            <CardContent className='relative'>
              <div className='text-3xl font-bold'>{sessionStats.total}</div>
              <p className='mt-1 text-xs opacity-80'>aulas encontradas</p>
            </CardContent>
          </Card>

          <Card className='relative overflow-hidden border-0 bg-gradient-to-br from-green-500 to-green-600 text-white shadow-xl'>
            <div className='absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10'></div>
            <CardHeader className='relative flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium opacity-90'>
                Aulas Hoje
              </CardTitle>
              <Clock className='h-5 w-5 opacity-80' />
            </CardHeader>
            <CardContent className='relative'>
              <div className='text-3xl font-bold'>{sessionStats.today}</div>
              <p className='mt-1 text-xs opacity-80'>sessões de hoje</p>
            </CardContent>
          </Card>

          <Card className='relative overflow-hidden border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl'>
            <div className='absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10'></div>
            <CardHeader className='relative flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium opacity-90'>
                Próximas Aulas
              </CardTitle>
              <TrendingUp className='h-5 w-5 opacity-80' />
            </CardHeader>
            <CardContent className='relative'>
              <div className='text-3xl font-bold'>{sessionStats.upcoming}</div>
              <p className='mt-1 text-xs opacity-80'>aulas futuras</p>
            </CardContent>
          </Card>

          <Card className='relative overflow-hidden border-0 bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-xl'>
            <div className='absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10'></div>
            <CardHeader className='relative flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium opacity-90'>
                Esta Semana
              </CardTitle>
              <CheckCircle className='h-5 w-5 opacity-80' />
            </CardHeader>
            <CardContent className='relative'>
              <div className='text-3xl font-bold'>{sessionStats.thisWeek}</div>
              <p className='mt-1 text-xs opacity-80'>aulas da semana</p>
            </CardContent>
          </Card>
        </div>

        {/* Enrolled Disciplines Summary */}
        <Card className='shadow-sm'>
          <CardHeader>
            <CardTitle className='flex items-center gap-3 text-xl font-semibold'>
              <GraduationCap className='h-6 w-6 text-blue-600' />
              Minhas Modalidades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
              {enrolledDisciplines.map((discipline) => (
                <div
                  key={discipline.id}
                  className='flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50/50 p-3'
                >
                  <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-sm font-semibold text-white'>
                    {discipline.name.charAt(0)}
                  </div>
                  <div className='flex-1'>
                    <p className='font-medium text-gray-900'>
                      {discipline.name}
                    </p>
                    <p className='text-xs text-gray-500'>
                      {discipline.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <SessionFilters
          disciplines={enrolledDisciplines}
          selectedDiscipline={filterDiscipline}
          onDisciplineChange={handleDisciplineFilterChange}
          onDateChange={handleDateFilterChange}
          initialDate={dateFilter.initialDate}
          finalDate={dateFilter.finalDate}
        />

        {/* Sessions Table */}
        <Card className='shadow-sm'>
          <CardHeader>
            <CardTitle className='text-xl font-semibold text-gray-900'>
              Cronograma de Aulas
            </CardTitle>
          </CardHeader>
          <CardContent className='p-0'>
            {studentSessions.length === 0 ? (
              <div className='flex flex-col items-center justify-center py-12'>
                <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100'>
                  <Calendar className='h-8 w-8 text-gray-400' />
                </div>
                <h3 className='mb-2 text-lg font-medium text-gray-900'>
                  Nenhuma aula encontrada
                </h3>
                <p className='text-gray-500'>
                  Não há aulas agendadas com os filtros aplicados.
                </p>
              </div>
            ) : (
              <div className='space-y-4'>
                <div className='overflow-x-auto'>
                  <Table>
                    <TableHeader>
                      <TableRow className='bg-gray-50/50'>
                        <TableHead className='font-semibold text-gray-700'>
                          Disciplina
                        </TableHead>
                        <TableHead className='font-semibold text-gray-700'>
                          Instrutor
                        </TableHead>
                        <TableHead className='font-semibold text-gray-700'>
                          Data
                        </TableHead>
                        <TableHead className='font-semibold text-gray-700'>
                          Horário
                        </TableHead>
                        <TableHead className='font-semibold text-gray-700'>
                          Última Aula do Dia
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentSessions.map((session: Session) => (
                        <TableRow
                          key={session.id}
                          className='hover:bg-gray-50/50'
                        >
                          <TableCell className='font-medium'>
                            <div className='flex items-center gap-3'>
                              <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-sm font-semibold text-white'>
                                {(
                                  session.disciplineName ||
                                  `Disciplina ${session.idDiscipline}`
                                ).charAt(0)}
                              </div>
                              <span>
                                {session.disciplineName ||
                                  `Disciplina ${session.idDiscipline}`}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className='text-gray-600'>
                            {session.instructorFirstName}{' '}
                            {session.instructorSurname}
                          </TableCell>
                          <TableCell className='text-gray-600'>
                            {formatDate(session.date)}
                          </TableCell>
                          <TableCell className='text-gray-600'>
                            {formatTime(session.startingTime)} -{' '}
                            {formatTime(session.endingTime)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                session.isLastSessionOfDay
                                  ? 'default'
                                  : 'secondary'
                              }
                            >
                              {session.isLastSessionOfDay ? 'Sim' : 'Não'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <TablePagination
                  currentPage={currentPage}
                  pageSize={pageSize}
                  totalItems={studentSessions.length}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                  totalPages={Math.ceil(studentSessions.length / pageSize)}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
