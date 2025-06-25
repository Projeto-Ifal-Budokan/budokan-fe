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
import { Discipline } from '@/types/discipline';
import { Calendar, Clock, Edit, MapPin, Plus, Trash2 } from 'lucide-react';

interface DisciplineSchedulesTabProps {
  disciplineId: string;
  discipline: Discipline;
}

export function DisciplineSchedulesTab({
  disciplineId,
  discipline,
}: DisciplineSchedulesTabProps) {
  // Mock data - replace with real API calls
  const schedules = [
    {
      id: 1,
      dayOfWeek: 'Segunda-feira',
      startTime: '19:00',
      endTime: '20:30',
      location: 'Dojo Principal',
      instructor: 'Sensei Takeshi',
      capacity: 20,
      enrolled: 15,
      status: 'active',
    },
    {
      id: 2,
      dayOfWeek: 'Quarta-feira',
      startTime: '19:00',
      endTime: '20:30',
      location: 'Dojo Principal',
      instructor: 'Sensei Takeshi',
      capacity: 20,
      enrolled: 12,
      status: 'active',
    },
    {
      id: 3,
      dayOfWeek: 'Sábado',
      startTime: '09:00',
      endTime: '10:30',
      location: 'Dojo Auxiliar',
      instructor: 'Sensei Takeshi',
      capacity: 15,
      enrolled: 8,
      status: 'active',
    },
  ];

  const getDayColor = (day: string) => {
    const colors = {
      'Segunda-feira': 'bg-blue-100 text-blue-800 border-blue-200',
      'Terça-feira': 'bg-green-100 text-green-800 border-green-200',
      'Quarta-feira': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Quinta-feira': 'bg-purple-100 text-purple-800 border-purple-200',
      'Sexta-feira': 'bg-pink-100 text-pink-800 border-pink-200',
      Sábado: 'bg-orange-100 text-orange-800 border-orange-200',
      Domingo: 'bg-red-100 text-red-800 border-red-200',
    };
    return (
      colors[day as keyof typeof colors] ||
      'bg-gray-100 text-gray-800 border-gray-200'
    );
  };

  const getCapacityColor = (enrolled: number, capacity: number) => {
    const percentage = (enrolled / capacity) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-orange-600';
    return 'text-green-600';
  };

  return (
    <>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-semibold text-gray-900'>
            Horários da Disciplina
          </h3>
          <p className='text-sm text-gray-600'>
            Gerencie os horários de aulas desta disciplina
          </p>
        </div>
        <Button className='bg-gradient-to-r from-orange-600 to-red-600'>
          <Plus className='mr-2 h-4 w-4' />
          Novo Horário
        </Button>
      </div>

      {schedules.length === 0 ? (
        <Card className='border-2 border-dashed border-gray-200'>
          <CardContent className='flex flex-col items-center justify-center py-12'>
            <Calendar className='mb-4 h-12 w-12 text-gray-400' />
            <h4 className='mb-2 text-lg font-medium text-gray-900'>
              Nenhum horário cadastrado
            </h4>
            <p className='mb-6 text-center text-gray-600'>
              Esta disciplina ainda não possui horários de aula definidos.
            </p>
            <Button className='bg-gradient-to-r from-orange-600 to-red-600'>
              <Plus className='mr-2 h-4 w-4' />
              Adicionar Horário
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Calendar className='h-5 w-5 text-orange-600' />
              Horários de Aula ({schedules.length})
            </CardTitle>
          </CardHeader>
          <CardContent className='p-0'>
            <Table>
              <TableHeader>
                <TableRow className='bg-gray-50/50'>
                  <TableHead>Dia da Semana</TableHead>
                  <TableHead>Horário</TableHead>
                  <TableHead>Local</TableHead>
                  <TableHead>Instrutor</TableHead>
                  <TableHead>Ocupação</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='text-right'>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedules.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell>
                      <div
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${getDayColor(schedule.dayOfWeek)}`}
                      >
                        {schedule.dayOfWeek}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <Clock className='h-4 w-4 text-gray-400' />
                        <span className='font-medium'>
                          {schedule.startTime} - {schedule.endTime}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <MapPin className='h-4 w-4 text-gray-400' />
                        <span>{schedule.location}</span>
                      </div>
                    </TableCell>
                    <TableCell className='font-medium'>
                      {schedule.instructor}
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <span
                          className={`font-medium ${getCapacityColor(schedule.enrolled, schedule.capacity)}`}
                        >
                          {schedule.enrolled}/{schedule.capacity}
                        </span>
                        <div className='h-2 w-16 rounded-full bg-gray-200'>
                          <div
                            className={`h-2 rounded-full ${
                              schedule.enrolled / schedule.capacity >= 0.9
                                ? 'bg-red-500'
                                : schedule.enrolled / schedule.capacity >= 0.7
                                  ? 'bg-orange-500'
                                  : 'bg-green-500'
                            }`}
                            style={{
                              width: `${(schedule.enrolled / schedule.capacity) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          schedule.status === 'active' ? 'default' : 'secondary'
                        }
                      >
                        {schedule.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-right'>
                      <div className='flex items-center justify-end gap-2'>
                        <Button variant='ghost' size='sm'>
                          <Edit className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='text-red-600 hover:bg-red-50 hover:text-red-700'
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </>
  );
}
