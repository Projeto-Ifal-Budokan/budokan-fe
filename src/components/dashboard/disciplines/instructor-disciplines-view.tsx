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
import { useManageInstructors } from '@/lib/api/queries/use-manage-instructors';
import { Eye, UserCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { DisciplinesSkeleton } from './disciplines-skeleton';

export default function InstructorDisciplinesView() {
  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Hooks
  const { data: currentUser } = useAuth().me;
  const { useInstructorDisciplines } = useManageInstructors();
  const { useDisciplines } = useManageDisciplines();
  const router = useRouter();

  // Get instructor's disciplines
  const {
    data: instructorDisciplinesResponse,
    isLoading: isLoadingInstructorDisciplines,
  } = useInstructorDisciplines(currentPage, pageSize, {
    search: currentUser?.email, // Filter by current user
  });

  // Get all disciplines for additional data
  const { data: allDisciplinesResponse, isLoading: isLoadingDisciplines } =
    useDisciplines();

  // Extract instructor's assigned disciplines
  const instructorDisciplines = useMemo(() => {
    if (
      !instructorDisciplinesResponse?.data?.items ||
      !allDisciplinesResponse?.data?.items
    ) {
      return [];
    }

    const assignments = instructorDisciplinesResponse.data.items.filter(
      (assignment) => assignment.idInstructor === currentUser?.id
    );

    return assignments
      .map((assignment) => {
        const discipline = allDisciplinesResponse.data.items.find(
          (d) => d.id === assignment.idDiscipline
        );
        if (!discipline) return null;

        return {
          ...discipline,
          assignment: {
            id: assignment.id,
            status: assignment.status,
            rankName: assignment.rankName,
            createdAt: assignment.createdAt,
          },
        };
      })
      .filter(Boolean);
  }, [instructorDisciplinesResponse, allDisciplinesResponse, currentUser?.id]);

  // Utility functions
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

  const handleViewDiscipline = (disciplineId: number) => {
    router.push(`/dashboard/disciplines/${disciplineId}`);
  };

  if (isLoadingInstructorDisciplines || isLoadingDisciplines) {
    return <DisciplinesSkeleton />;
  }

  return (
    <div className='min-h-screen'>
      <div className='mx-auto space-y-8'>
        {/* Header Section */}
        <div className='space-y-2'>
          <div className='flex items-center gap-3'>
            <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg'>
              <UserCheck className='h-6 w-6' />
            </div>
            <div>
              <h1 className='text-4xl font-bold tracking-tight text-gray-900'>
                Minhas Disciplinas de Ensino
              </h1>
              <p className='text-lg text-gray-600'>
                Disciplinas que você leciona
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          <Card className='relative overflow-hidden border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl'>
            <div className='absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10'></div>
            <CardHeader className='relative flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium opacity-90'>
                Total Lecionando
              </CardTitle>
              <UserCheck className='h-5 w-5 opacity-80' />
            </CardHeader>
            <CardContent className='relative'>
              <div className='text-3xl font-bold'>
                {instructorDisciplines.length}
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
              <UserCheck className='h-5 w-5 opacity-80' />
            </CardHeader>
            <CardContent className='relative'>
              <div className='text-3xl font-bold'>
                {
                  instructorDisciplines.filter(
                    (d) => d?.assignment.status === 'active'
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
                Sua Graduação
              </CardTitle>
              <UserCheck className='h-5 w-5 opacity-80' />
            </CardHeader>
            <CardContent className='relative'>
              <div className='text-lg font-bold'>
                {instructorDisciplines[0]?.assignment?.rankName || 'N/A'}
              </div>
              <p className='mt-1 text-xs opacity-80'>certificação</p>
            </CardContent>
          </Card>
        </div>

        {/* Disciplines Table */}
        <Card className='shadow-sm'>
          <CardHeader>
            <CardTitle className='text-xl font-semibold text-gray-900'>
              Disciplinas que Você Leciona
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
                      Status da Atribuição
                    </TableHead>
                    <TableHead className='font-semibold text-gray-700'>
                      Sua Graduação
                    </TableHead>
                    <TableHead className='font-semibold text-gray-700'>
                      Data de Atribuição
                    </TableHead>
                    <TableHead className='text-right font-semibold text-gray-700'>
                      Ações
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {instructorDisciplines.length === 0 ? (
                    <TableRow>
                      <td colSpan={6} className='py-12 text-center'>
                        <div className='text-gray-500'>
                          <UserCheck className='mx-auto mb-4 h-16 w-16 text-gray-300' />
                          <p className='text-lg font-medium'>
                            Você ainda não foi atribuído a nenhuma disciplina
                          </p>
                          <p className='text-sm'>
                            Entre em contato com a administração para receber
                            suas atribuições
                          </p>
                        </div>
                      </td>
                    </TableRow>
                  ) : (
                    instructorDisciplines.map((discipline) => (
                      <TableRow
                        key={discipline?.id}
                        className='hover:bg-gray-50/50'
                      >
                        <TableCell className='font-medium'>
                          <div className='flex items-center gap-3'>
                            <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-violet-500 text-sm font-semibold text-white'>
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
                              discipline?.assignment.status || ''
                            )}
                          >
                            {getStatusText(discipline?.assignment.status || '')}
                          </Badge>
                        </TableCell>
                        <TableCell className='font-medium text-amber-700'>
                          {discipline?.assignment.rankName || 'Não informado'}
                        </TableCell>
                        <TableCell className='text-gray-600'>
                          {new Date(
                            discipline?.assignment.createdAt || ''
                          ).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell className='text-right'>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() =>
                              handleViewDiscipline(discipline?.id || 0)
                            }
                            className='text-purple-600 hover:bg-purple-50 hover:text-purple-700'
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
