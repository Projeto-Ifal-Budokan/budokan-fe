'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Eye, GraduationCap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { DisciplinesSkeleton } from './disciplines-skeleton';

export default function StudentDisciplinesView() {
  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Hooks
  const { data: currentUser } = useAuth().me;
  const { useMatriculations } = useManageMatriculations();
  const { useDisciplines } = useManageDisciplines();
  const router = useRouter();

  // Get student's matriculations
  const { data: matriculationsResponse, isLoading: isLoadingMatriculations } =
    useMatriculations(currentPage, pageSize, {
      type: 'student',
      search: currentUser?.email, // Filter by current user
    });

  // Get all disciplines
  const { data: allDisciplinesResponse, isLoading: isLoadingDisciplines } =
    useDisciplines();

  // Extract student's enrolled disciplines
  const studentDisciplines = useMemo(() => {
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

        return {
          ...discipline,
          matriculation: {
            id: matriculation.id,
            status: matriculation.status,
            rankName: matriculation.rankName,
            createdAt: matriculation.createdAt,
          },
        };
      })
      .filter(Boolean);
  }, [matriculationsResponse, allDisciplinesResponse, currentUser?.id]);

  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'secondary';
      case 'graduated':
        return 'outline';
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

  const handleViewDiscipline = (disciplineId: number) => {
    router.push(`/dashboard/disciplines/${disciplineId}`);
  };

  if (isLoadingMatriculations || isLoadingDisciplines) {
    return <DisciplinesSkeleton />;
  }

  return (
    <div className='min-h-screen'>
      <div className='mx-auto space-y-8'>
        {/* Header Section */}
        <div className='space-y-2'>
          <div className='flex items-center gap-3'>
            <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'>
              <GraduationCap className='h-6 w-6' />
            </div>
            <div>
              <h1 className='text-4xl font-bold tracking-tight text-gray-900'>
                Minhas Disciplinas
              </h1>
              <p className='text-lg text-gray-600'>
                Disciplinas em que você está matriculado
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
                Total Matriculado
              </CardTitle>
              <GraduationCap className='h-5 w-5 opacity-80' />
            </CardHeader>
            <CardContent className='relative'>
              <div className='text-3xl font-bold'>
                {studentDisciplines.length}
              </div>
              <p className='mt-1 text-xs opacity-80'>disciplinas</p>
            </CardContent>
          </Card>

          <Card className='relative overflow-hidden border-0 bg-gradient-to-br from-green-500 to-green-600 text-white shadow-xl'>
            <div className='absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10'></div>
            <CardHeader className='relative flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium opacity-90'>
                Ativas
              </CardTitle>
              <GraduationCap className='h-5 w-5 opacity-80' />
            </CardHeader>
            <CardContent className='relative'>
              <div className='text-3xl font-bold'>
                {
                  studentDisciplines.filter(
                    (d) => d?.matriculation.status === 'active'
                  ).length
                }
              </div>
              <p className='mt-1 text-xs opacity-80'>em andamento</p>
            </CardContent>
          </Card>

          <Card className='relative overflow-hidden border-0 bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-xl'>
            <div className='absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10'></div>
            <CardHeader className='relative flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium opacity-90'>
                Graduado
              </CardTitle>
              <GraduationCap className='h-5 w-5 opacity-80' />
            </CardHeader>
            <CardContent className='relative'>
              <div className='text-3xl font-bold'>
                {
                  studentDisciplines.filter(
                    (d) => d?.matriculation.status === 'graduated'
                  ).length
                }
              </div>
              <p className='mt-1 text-xs opacity-80'>concluído</p>
            </CardContent>
          </Card>
        </div>

        {/* Disciplines Table */}
        <Card className='shadow-sm'>
          <CardHeader>
            <CardTitle className='text-xl font-semibold text-gray-900'>
              Suas Disciplinas
            </CardTitle>
          </CardHeader>
          <CardContent className='p-1'>
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow className='bg-gray-50/50'>
                    <TableHead className='font-semibold text-gray-700'>
                      Disciplina
                    </TableHead>
                    <TableHead className='font-semibold text-gray-700'>
                      Descrição
                    </TableHead>
                    <TableHead className='font-semibold text-gray-700'>
                      Status da Matrícula
                    </TableHead>
                    <TableHead className='font-semibold text-gray-700'>
                      Graduação Atual
                    </TableHead>
                    <TableHead className='font-semibold text-gray-700'>
                      Data de Matrícula
                    </TableHead>
                    <TableHead className='text-right font-semibold text-gray-700'>
                      Ações
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentDisciplines.length === 0 ? (
                    <TableRow>
                      <td colSpan={6} className='py-12 text-center'>
                        <div className='text-gray-500'>
                          <GraduationCap className='mx-auto mb-4 h-16 w-16 text-gray-300' />
                          <p className='text-lg font-medium'>
                            Você ainda não está matriculado em nenhuma
                            disciplina
                          </p>
                          <p className='text-sm'>
                            Entre em contato com a administração para se
                            matricular
                          </p>
                        </div>
                      </td>
                    </TableRow>
                  ) : (
                    studentDisciplines.map((discipline) => (
                      <TableRow
                        key={discipline?.id}
                        className='hover:bg-gray-50/50'
                      >
                        <TableCell className='font-medium'>
                          <div className='flex items-center gap-3'>
                            <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-sm font-semibold text-white'>
                              {discipline?.name.charAt(0)}
                            </div>
                            <span>{discipline?.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className='text-gray-600'>
                          {discipline?.description}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getStatusColor(
                              discipline?.matriculation.status || ''
                            )}
                          >
                            {getStatusText(
                              discipline?.matriculation.status || ''
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell className='font-medium text-amber-700'>
                          {discipline?.matriculation.rankName ||
                            'Não informado'}
                        </TableCell>
                        <TableCell className='text-gray-600'>
                          {new Date(
                            discipline?.matriculation.createdAt || ''
                          ).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell className='text-right'>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() =>
                              handleViewDiscipline(discipline?.id || 0)
                            }
                            className='text-blue-600 hover:bg-blue-50 hover:text-blue-700'
                          >
                            <Eye className='mr-1 h-4 w-4' />
                            Ver Detalhes
                          </Button>
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
