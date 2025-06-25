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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Discipline } from '@/types/discipline';
import { GraduationCap, Plus, UserCheck } from 'lucide-react';
import { useState } from 'react';

interface DisciplineEnrollmentsTabProps {
  disciplineId: string;
  discipline: Discipline;
}

export function DisciplineEnrollmentsTab({
  disciplineId,
  discipline,
}: DisciplineEnrollmentsTabProps) {
  const [activeTab, setActiveTab] = useState('students');

  // Mock data - replace with real API calls
  const studentEnrollments = [
    {
      id: 1,
      studentName: 'João Silva',
      currentRank: '3º Kyu',
      enrollmentDate: '2024-01-15',
      status: 'active',
    },
    {
      id: 2,
      studentName: 'Maria Santos',
      currentRank: '5º Kyu',
      enrollmentDate: '2024-02-20',
      status: 'active',
    },
  ];

  const instructorEnrollments = [
    {
      id: 1,
      instructorName: 'Sensei Takeshi',
      rank: '3º Dan',
      assignmentDate: '2023-06-01',
      status: 'active',
    },
  ];

  return (
    <>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-semibold text-gray-900'>
            Matrículas da Disciplina
          </h3>
          <p className='text-sm text-gray-600'>
            Gerencie estudantes e instrutores matriculados nesta disciplina
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='students' className='flex items-center gap-2'>
            <GraduationCap className='h-4 w-4' />
            Estudantes ({studentEnrollments.length})
          </TabsTrigger>
          <TabsTrigger value='instructors' className='flex items-center gap-2'>
            <UserCheck className='h-4 w-4' />
            Instrutores ({instructorEnrollments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value='students' className='space-y-4'>
          <div className='flex justify-end'>
            <Button className='bg-gradient-to-r from-blue-600 to-indigo-600'>
              <Plus className='mr-2 h-4 w-4' />
              Matricular Estudante
            </Button>
          </div>

          {studentEnrollments.length === 0 ? (
            <Card className='border-2 border-dashed border-gray-200'>
              <CardContent className='flex flex-col items-center justify-center py-12'>
                <GraduationCap className='mb-4 h-12 w-12 text-gray-400' />
                <h4 className='mb-2 text-lg font-medium text-gray-900'>
                  Nenhum estudante matriculado
                </h4>
                <p className='mb-6 text-center text-gray-600'>
                  Esta disciplina ainda não possui estudantes matriculados.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <GraduationCap className='h-5 w-5 text-blue-600' />
                  Estudantes Matriculados
                </CardTitle>
              </CardHeader>
              <CardContent className='p-0'>
                <Table>
                  <TableHeader>
                    <TableRow className='bg-gray-50/50'>
                      <TableHead>Nome do Estudante</TableHead>
                      <TableHead>Rank Atual</TableHead>
                      <TableHead>Data de Matrícula</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className='text-right'>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentEnrollments.map((enrollment) => (
                      <TableRow key={enrollment.id}>
                        <TableCell className='font-medium'>
                          {enrollment.studentName}
                        </TableCell>
                        <TableCell>
                          <Badge variant='outline'>
                            {enrollment.currentRank}
                          </Badge>
                        </TableCell>
                        <TableCell className='text-gray-600'>
                          {new Date(
                            enrollment.enrollmentDate
                          ).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              enrollment.status === 'active'
                                ? 'default'
                                : 'secondary'
                            }
                          >
                            {enrollment.status === 'active'
                              ? 'Ativo'
                              : 'Inativo'}
                          </Badge>
                        </TableCell>
                        <TableCell className='text-right'>
                          <Button variant='ghost' size='sm'>
                            Gerenciar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value='instructors' className='space-y-4'>
          <div className='flex justify-end'>
            <Button className='bg-gradient-to-r from-purple-600 to-pink-600'>
              <Plus className='mr-2 h-4 w-4' />
              Atribuir Instrutor
            </Button>
          </div>

          {instructorEnrollments.length === 0 ? (
            <Card className='border-2 border-dashed border-gray-200'>
              <CardContent className='flex flex-col items-center justify-center py-12'>
                <UserCheck className='mb-4 h-12 w-12 text-gray-400' />
                <h4 className='mb-2 text-lg font-medium text-gray-900'>
                  Nenhum instrutor atribuído
                </h4>
                <p className='mb-6 text-center text-gray-600'>
                  Esta disciplina ainda não possui instrutores atribuídos.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <UserCheck className='h-5 w-5 text-purple-600' />
                  Instrutores Atribuídos
                </CardTitle>
              </CardHeader>
              <CardContent className='p-0'>
                <Table>
                  <TableHeader>
                    <TableRow className='bg-gray-50/50'>
                      <TableHead>Nome do Instrutor</TableHead>
                      <TableHead>Rank</TableHead>
                      <TableHead>Data de Atribuição</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className='text-right'>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {instructorEnrollments.map((enrollment) => (
                      <TableRow key={enrollment.id}>
                        <TableCell className='font-medium'>
                          {enrollment.instructorName}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant='outline'
                            className='border-purple-200 bg-purple-50 text-purple-700'
                          >
                            {enrollment.rank}
                          </Badge>
                        </TableCell>
                        <TableCell className='text-gray-600'>
                          {new Date(
                            enrollment.assignmentDate
                          ).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              enrollment.status === 'active'
                                ? 'default'
                                : 'secondary'
                            }
                          >
                            {enrollment.status === 'active'
                              ? 'Ativo'
                              : 'Inativo'}
                          </Badge>
                        </TableCell>
                        <TableCell className='text-right'>
                          <Button variant='ghost' size='sm'>
                            Gerenciar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
}
