'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuth } from '@/lib/api/queries/use-auth';
import { useManageDisciplines } from '@/lib/api/queries/use-manage-disciplines';
import { useManageMatriculations } from '@/lib/api/queries/use-manage-matriculations';
import { useManageRankings } from '@/lib/api/queries/use-manage-rankings';
import { Ranking } from '@/types/ranking';
import { GraduationCap, Search, Target, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { RankingsSkeleton } from './rankings-skeleton';

export default function StudentRankingsView() {
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDiscipline, setFilterDiscipline] = useState('all');

  // Hooks
  const { data: currentUser } = useAuth().me;
  const { useMatriculations } = useManageMatriculations();
  const { useDisciplines } = useManageDisciplines();
  const { useRankings } = useManageRankings();
  const router = useRouter();

  // Get student's matriculations to find enrolled disciplines
  const { data: matriculationsResponse, isLoading: isLoadingMatriculations } =
    useMatriculations(1, 50, {
      idStudent: currentUser?.id.toString(),
      status: 'active',
    });

  // Get all disciplines
  const { data: disciplinesResponse, isLoading: isLoadingDisciplines } =
    useDisciplines(1, 50);

  // Get rankings data
  const disciplineId =
    filterDiscipline === 'all' ? undefined : filterDiscipline;
  const { data: rankingsResponse, isLoading: isLoadingRankings } =
    useRankings(disciplineId);

  // Extract enrolled disciplines for the current student
  const enrolledDisciplines = useMemo(() => {
    if (
      !matriculationsResponse?.data?.items ||
      !disciplinesResponse?.data?.items
    ) {
      return [];
    }

    const studentMatriculations = matriculationsResponse.data.items.filter(
      (matriculation) => matriculation.idStudent === currentUser?.id
    );

    return studentMatriculations
      .map((matriculation) => {
        const discipline = disciplinesResponse.data.items.find(
          (d) => d.id === matriculation.idDiscipline
        );
        if (!discipline) return null;

        return {
          ...discipline,
          matriculation: {
            id: matriculation.id,
            status: matriculation.status,
            rankName: matriculation.rankName,
            idRank: matriculation.idRank,
            createdAt: matriculation.createdAt,
          },
        };
      })
      .filter(Boolean);
  }, [matriculationsResponse, disciplinesResponse, currentUser?.id]);

  // Get rankings for enrolled disciplines
  const availableRankings = useMemo(() => {
    if (!rankingsResponse?.data?.items) return [];

    const enrolledDisciplineIds = enrolledDisciplines.map((d) => d?.id);

    return rankingsResponse.data.items.filter((ranking) =>
      enrolledDisciplineIds.includes(ranking.idDiscipline)
    );
  }, [rankingsResponse, enrolledDisciplines]);

  // Filter rankings based on search and discipline filter
  const filteredRankings = useMemo(() => {
    let filtered = availableRankings;

    // Apply discipline filter
    if (filterDiscipline !== 'all') {
      filtered = filtered.filter(
        (ranking) => ranking.idDiscipline.toString() === filterDiscipline
      );
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((ranking) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          ranking.name.toLowerCase().includes(searchLower) ||
          ranking.description.toLowerCase().includes(searchLower) ||
          ranking.disciplineName?.toLowerCase().includes(searchLower)
        );
      });
    }

    return filtered;
  }, [availableRankings, filterDiscipline, searchTerm]);

  // Utility functions
  const getBeltColor = (description: string) => {
    const colorMap: { [key: string]: string } = {
      'Faixa Branca': 'bg-gray-100 text-gray-800',
      'Faixa Amarela': 'bg-yellow-100 text-yellow-800',
      'Faixa Laranja': 'bg-orange-100 text-orange-800',
      'Faixa Verde': 'bg-green-100 text-green-800',
      'Faixa Roxa': 'bg-purple-100 text-purple-800',
      'Faixa Marrom': 'bg-amber-100 text-amber-800',
      'Faixa Preta': 'bg-gray-900 text-white',
      'Faixa Azul': 'bg-blue-100 text-blue-800',
    };
    return colorMap[description] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleViewRanking = (rankingId: number) => {
    router.push(`/dashboard/rankings/${rankingId}`);
  };

  const isCurrentRank = (ranking: Ranking) => {
    return enrolledDisciplines.some(
      (discipline) =>
        discipline?.id === ranking.idDiscipline &&
        discipline.matriculation.idRank === ranking.id
    );
  };

  const getCurrentRankForDiscipline = (disciplineId: number) => {
    const discipline = enrolledDisciplines.find((d) => d?.id === disciplineId);
    return discipline?.matriculation.rankName;
  };

  // Calculate stats
  const totalEnrolledDisciplines = enrolledDisciplines.length;
  const totalAvailableRankings = availableRankings.length;
  const achievedRanks = enrolledDisciplines.filter(
    (d) =>
      d?.matriculation.rankName && d.matriculation.rankName !== 'Não informado'
  ).length;

  // Loading state
  const isLoading =
    isLoadingMatriculations || isLoadingDisciplines || isLoadingRankings;

  if (isLoading) {
    return <RankingsSkeleton />;
  }

  return (
    <div className='min-h-screen'>
      <div className='mx-auto space-y-8'>
        {/* Header Section */}
        <div className='space-y-2'>
          <div className='flex items-center gap-3'>
            <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-lg'>
              <Trophy className='h-6 w-6' />
            </div>
            <div>
              <h1 className='text-4xl font-bold tracking-tight text-gray-900'>
                Meus Rankings
              </h1>
              <p className='text-lg text-gray-600'>
                Acompanhe sua progressão nas modalidades
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          <Card className='relative overflow-hidden border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl'>
            <div className='absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10'></div>
            <CardHeader className='relative flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium opacity-90'>
                Disciplinas Matriculadas
              </CardTitle>
              <GraduationCap className='h-5 w-5 opacity-80' />
            </CardHeader>
            <CardContent className='relative'>
              <div className='text-3xl font-bold'>
                {totalEnrolledDisciplines}
              </div>
              <p className='mt-1 text-xs opacity-80'>disciplinas ativas</p>
            </CardContent>
          </Card>

          <Card className='relative overflow-hidden border-0 bg-gradient-to-br from-green-500 to-green-600 text-white shadow-xl'>
            <div className='absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10'></div>
            <CardHeader className='relative flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium opacity-90'>
                Graduações Obtidas
              </CardTitle>
              <Target className='h-5 w-5 opacity-80' />
            </CardHeader>
            <CardContent className='relative'>
              <div className='text-3xl font-bold'>{achievedRanks}</div>
              <p className='mt-1 text-xs opacity-80'>graduações definidas</p>
            </CardContent>
          </Card>

          <Card className='relative overflow-hidden border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl'>
            <div className='absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10'></div>
            <CardHeader className='relative flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium opacity-90'>
                Rankings Disponíveis
              </CardTitle>
              <Trophy className='h-5 w-5 opacity-80' />
            </CardHeader>
            <CardContent className='relative'>
              <div className='text-3xl font-bold'>{totalAvailableRankings}</div>
              <p className='mt-1 text-xs opacity-80'>níveis de graduação</p>
            </CardContent>
          </Card>
        </div>

        {/* Current Ranks Summary */}
        {enrolledDisciplines.length > 0 && (
          <Card className='shadow-sm'>
            <CardHeader>
              <CardTitle className='text-xl font-semibold text-gray-900'>
                Minhas Graduações Atuais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                {enrolledDisciplines.map((discipline) => (
                  <div
                    key={discipline?.id}
                    className='flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50/50 p-4'
                  >
                    <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-sm font-semibold text-white'>
                      {discipline?.name.charAt(0)}
                    </div>
                    <div className='flex-1'>
                      <p className='font-medium text-gray-900'>
                        {discipline?.name}
                      </p>
                      <div className='mt-1'>
                        {discipline?.matriculation.rankName &&
                        discipline.matriculation.rankName !==
                          'Não informado' ? (
                          <Badge
                            className={`${getBeltColor(discipline.matriculation.rankName)} border-0 text-xs`}
                          >
                            {discipline.matriculation.rankName}
                          </Badge>
                        ) : (
                          <span className='text-xs text-gray-500'>
                            Graduação não definida
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card className='border-0 bg-white/80 shadow-lg backdrop-blur-sm'>
          <CardHeader className='pb-4'>
            <CardTitle className='text-lg'>Filtros e Busca</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col gap-4 md:flex-row md:items-center'>
              <div className='relative max-w-md flex-1'>
                <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400' />
                <Input
                  placeholder='Buscar por nome, descrição ou modalidade...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='h-11 border-gray-200 bg-white pl-10 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                />
              </div>

              <div className='flex gap-3'>
                <Select
                  value={filterDiscipline}
                  onValueChange={setFilterDiscipline}
                >
                  <SelectTrigger className='h-11 w-48 border-gray-200 bg-white shadow-sm'>
                    <SelectValue placeholder='Filtrar por modalidade' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>Todas as modalidades</SelectItem>
                    {enrolledDisciplines.map((discipline) => (
                      <SelectItem
                        key={discipline?.id}
                        value={discipline?.id.toString() || ''}
                      >
                        {discipline?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rankings Table */}
        <Card className='shadow-sm'>
          <CardHeader>
            <CardTitle className='text-xl font-semibold text-gray-900'>
              Rankings Disponíveis
            </CardTitle>
          </CardHeader>
          <CardContent className='p-1'>
            <div className='overflow-x-auto'>
              <Table className='w-full'>
                <TableHeader>
                  <TableRow className='bg-gray-50/50'>
                    <TableHead className='font-semibold text-gray-700'>
                      Nome
                    </TableHead>
                    <TableHead className='font-semibold text-gray-700'>
                      Modalidade
                    </TableHead>
                    <TableHead className='font-semibold text-gray-700'>
                      Graduação
                    </TableHead>
                    <TableHead className='font-semibold text-gray-700'>
                      Status
                    </TableHead>
                    <TableHead className='font-semibold text-gray-700'>
                      Criado em
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRankings.length === 0 ? (
                    <TableRow>
                      <td colSpan={6} className='py-12 text-center'>
                        <div className='text-gray-500'>
                          <p className='text-lg font-medium'>
                            Nenhum ranking encontrado
                          </p>
                          <p className='text-sm'>
                            {enrolledDisciplines.length === 0
                              ? 'Você não está matriculado em nenhuma disciplina'
                              : 'Tente ajustar os filtros'}
                          </p>
                        </div>
                      </td>
                    </TableRow>
                  ) : (
                    filteredRankings.map((ranking) => (
                      <TableRow key={ranking.id} className='hover:bg-gray-50'>
                        <TableCell className='py-4'>
                          <div className='flex flex-col'>
                            <span className='font-medium text-gray-900'>
                              {ranking.name}
                            </span>
                            {ranking.description && (
                              <span className='line-clamp-1 text-sm text-gray-500'>
                                {ranking.description}
                              </span>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className='py-4'>
                          <span className='text-gray-900'>
                            {ranking.disciplineName}
                          </span>
                        </TableCell>

                        <TableCell className='py-4'>
                          <Badge
                            className={`${getBeltColor(ranking.description)} border-0`}
                          >
                            {ranking.description}
                          </Badge>
                        </TableCell>

                        <TableCell className='py-4'>
                          {isCurrentRank(ranking) ? (
                            <Badge className='border-0 bg-green-100 text-green-800'>
                              Atual
                            </Badge>
                          ) : (
                            <span className='text-sm text-gray-500'>
                              Disponível
                            </span>
                          )}
                        </TableCell>

                        <TableCell className='py-4'>
                          <span className='text-sm text-gray-600'>
                            {formatDate(ranking.createdAt)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
