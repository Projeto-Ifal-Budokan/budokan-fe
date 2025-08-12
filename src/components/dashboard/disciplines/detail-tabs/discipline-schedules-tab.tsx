'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuth } from '@/lib/api/queries/use-auth';
import { useInstructorDisciplines } from '@/lib/api/queries/use-instructor-disciplines';
import { useManageDisciplines } from '@/lib/api/queries/use-manage-disciplines';
import { useManageTrainingSchedules } from '@/lib/api/queries/use-manage-training-schedules';
import { usePrivilegesByUser } from '@/lib/api/queries/use-privileges';
import { TrainingSchedule } from '@/lib/api/services/training-schedules-service';
import { Discipline } from '@/types/discipline';
import { InstructorDiscipline } from '@/types/instructor';
import { hasAccess } from '@/utils/access-control';
import { Calendar, Clock, Edit, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

// Import existing modals
import { AddTrainingScheduleModal } from '@/components/dashboard/training-schedules/add-training-schedule-modal';
import { DeleteTrainingScheduleModal } from '@/components/dashboard/training-schedules/delete-training-schedule-modal';
import { EditTrainingScheduleModal } from '@/components/dashboard/training-schedules/edit-training-schedule-modal';

interface DisciplineSchedulesTabProps {
  discipline: Discipline;
}

export function DisciplineSchedulesTab({
  discipline,
}: DisciplineSchedulesTabProps) {
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] =
    useState<TrainingSchedule | null>(null);

  // Hooks
  const {
    useTrainingSchedules,
    updateTrainingSchedule,
    deleteTrainingSchedule,
  } = useManageTrainingSchedules();
  const { useDisciplines } = useManageDisciplines();
  const { data: currentUser } = useAuth().me;
  const { data: currentUserPrivileges } = usePrivilegesByUser(
    currentUser?.id.toString() || ''
  );
  const { useInstructorDisciplinesList } = useInstructorDisciplines();
  const { data: instructorDisciplines } = useInstructorDisciplinesList(
    currentUser?.id || 0
  );
  const { data: allDisciplines } = useDisciplines(1, 100);

  const {
    data: schedulesResponse,
    isLoading,
    error,
  } = useTrainingSchedules(1, 100); // Get all schedules

  // Check permissions
  const isAdmin = currentUserPrivileges
    ? hasAccess('admin', currentUserPrivileges)
    : false;

  // Filter schedules for this specific discipline
  const schedules = useMemo(() => {
    if (!schedulesResponse?.data?.items) return [];
    return schedulesResponse.data.items.filter(
      (schedule: TrainingSchedule) => schedule.idDiscipline === discipline.id
    );
  }, [schedulesResponse, discipline.id]);

  // Get user's accessible disciplines for the add modal
  const userDisciplines: Discipline[] = useMemo(() => {
    if (!instructorDisciplines?.data?.items || !allDisciplines?.data?.items)
      return [];
    return instructorDisciplines.data.items
      .map((inst: InstructorDiscipline) =>
        allDisciplines.data.items.find(
          (d: Discipline) => d.id === inst.idDiscipline
        )
      )
      .filter(Boolean) as Discipline[];
  }, [instructorDisciplines, allDisciplines]);

  // Check if user can manage schedules for this discipline
  const canManage = useMemo(() => {
    if (isAdmin) return true;
    const userDisciplineIds = userDisciplines.map((d) => d.id);
    return userDisciplineIds.includes(discipline.id);
  }, [isAdmin, userDisciplines, discipline.id]);

  const getDayColor = (day: string) => {
    const colors = {
      monday: 'bg-blue-100 text-blue-800 border-blue-200',
      tuesday: 'bg-green-100 text-green-800 border-green-200',
      wednesday: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      thursday: 'bg-purple-100 text-purple-800 border-purple-200',
      friday: 'bg-pink-100 text-pink-800 border-pink-200',
      saturday: 'bg-orange-100 text-orange-800 border-orange-200',
      sunday: 'bg-red-100 text-red-800 border-red-200',
    };
    return (
      colors[day.toLowerCase() as keyof typeof colors] ||
      'bg-gray-100 text-gray-800 border-gray-200'
    );
  };

  const formatWeekday = (weekday: string) => {
    const weekdayMap = {
      monday: 'Segunda-feira',
      tuesday: 'Terça-feira',
      wednesday: 'Quarta-feira',
      thursday: 'Quinta-feira',
      friday: 'Sexta-feira',
      saturday: 'Sábado',
      sunday: 'Domingo',
    };
    return (
      weekdayMap[weekday.toLowerCase() as keyof typeof weekdayMap] || weekday
    );
  };

  const formatTime = (time: string) => {
    return time.length === 8 ? time.substring(0, 5) : time;
  };

  // Handler functions for modals
  const handleEdit = (schedule: TrainingSchedule) => {
    setSelectedSchedule(schedule);
    setIsEditModalOpen(true);
  };

  const handleDelete = (schedule: TrainingSchedule) => {
    setSelectedSchedule(schedule);
    setIsDeleteModalOpen(true);
  };

  const handleEditSubmit = async (scheduleData: Partial<TrainingSchedule>) => {
    await updateTrainingSchedule.mutateAsync(scheduleData);
    setIsEditModalOpen(false);
    setSelectedSchedule(null);
  };

  const handleDeleteSubmit = async () => {
    if (selectedSchedule) {
      await deleteTrainingSchedule.mutateAsync(String(selectedSchedule.id));
      setIsDeleteModalOpen(false);
      setSelectedSchedule(null);
    }
  };

  if (isLoading) {
    return (
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <div>
            <Skeleton className='mb-2 h-6 w-48' />
            <Skeleton className='h-4 w-64' />
          </div>
          <Skeleton className='h-10 w-32' />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className='h-6 w-40' />
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className='h-12 w-full' />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card className='border-2 border-dashed border-red-200'>
        <CardContent className='flex flex-col items-center justify-center py-12'>
          <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100'>
            <Calendar className='h-6 w-6 text-red-600' />
          </div>
          <h4 className='mb-2 text-lg font-medium text-gray-900'>
            Erro ao carregar horários
          </h4>
          <p className='mb-6 text-center text-gray-600'>
            Não foi possível carregar os horários desta disciplina.
          </p>
        </CardContent>
      </Card>
    );
  }

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
        {canManage && (
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className='bg-gradient-to-r from-orange-600 to-red-600'
          >
            <Plus className='mr-2 h-4 w-4' />
            Novo Horário
          </Button>
        )}
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
            {canManage && (
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className='bg-gradient-to-r from-orange-600 to-red-600'
              >
                <Plus className='mr-2 h-4 w-4' />
                Adicionar Horário
              </Button>
            )}
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
                  <TableHead>Disciplina</TableHead>
                  <TableHead>Data de Criação</TableHead>
                  {canManage && (
                    <TableHead className='text-right'>Ações</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedules.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell>
                      <div
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${getDayColor(schedule.weekday)}`}
                      >
                        {formatWeekday(schedule.weekday)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <Clock className='h-4 w-4 text-gray-400' />
                        <span className='font-medium'>
                          {formatTime(schedule.startTime)} -{' '}
                          {formatTime(schedule.endTime)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className='font-medium'>
                      {schedule.disciplineName}
                    </TableCell>
                    <TableCell>
                      {new Date(schedule.createdAt).toLocaleDateString('pt-BR')}
                    </TableCell>
                    {canManage && (
                      <TableCell className='text-right'>
                        <div className='flex items-center justify-end gap-2'>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => handleEdit(schedule)}
                          >
                            <Edit className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='text-red-600 hover:bg-red-50 hover:text-red-700'
                            onClick={() => handleDelete(schedule)}
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <AddTrainingScheduleModal
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        isAdmin={isAdmin}
        userDisciplines={userDisciplines}
        disciplineId={String(discipline.id)}
      />

      {selectedSchedule && (
        <EditTrainingScheduleModal
          isOpen={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          trainingSchedule={selectedSchedule}
          onEdit={handleEditSubmit}
          isPending={updateTrainingSchedule.isPending}
          isAdmin={isAdmin}
        />
      )}

      {selectedSchedule && (
        <DeleteTrainingScheduleModal
          isOpen={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          trainingSchedule={selectedSchedule}
          onDelete={handleDeleteSubmit}
          isPending={deleteTrainingSchedule.isPending}
        />
      )}
    </>
  );
}
