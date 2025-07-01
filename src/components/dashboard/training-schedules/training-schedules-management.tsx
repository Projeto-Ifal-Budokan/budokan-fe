'use client';

import { AddTrainingScheduleModal } from '@/components/dashboard/training-schedules/add-training-schedule-modal';
import { TrainingSchedulesTable } from '@/components/dashboard/training-schedules/training-schedules-table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/lib/api/queries/use-auth';
import { useInstructorDisciplines } from '@/lib/api/queries/use-instructor-disciplines';
import { useManageDisciplines } from '@/lib/api/queries/use-manage-disciplines';
import { useManageTrainingSchedules } from '@/lib/api/queries/use-manage-training-schedules';
import { usePrivilegesByUser } from '@/lib/api/queries/use-privileges';
import { TrainingSchedule } from '@/lib/api/services/training-schedules-service';
import { Discipline } from '@/types/discipline';
import { InstructorDiscipline } from '@/types/instructor';
import { hasAccess } from '@/utils/access-control';
import { Calendar, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function TrainingSchedulesManagement() {
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDiscipline, setFilterDiscipline] = useState('all');
  const [filterWeekday, setFilterWeekday] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Hooks
  const { useTrainingSchedules } = useManageTrainingSchedules();
  const { data: currentUser } = useAuth().me;
  const { data: currentUserPrivileges } = usePrivilegesByUser(
    currentUser?.id.toString() || ''
  );
  const { useInstructorDisciplinesList } = useInstructorDisciplines();
  const { data: instructorDisciplines } = useInstructorDisciplinesList(
    currentUser?.id || 0
  );
  const { useDisciplines } = useManageDisciplines();
  const { data: allDisciplines } = useDisciplines(1, 100);

  const { data: trainingSchedulesResponse, isLoading } = useTrainingSchedules(
    currentPage,
    pageSize,
    {
      idDiscipline: filterDiscipline !== 'all' ? filterDiscipline : undefined,
      weekday: filterWeekday !== 'all' ? filterWeekday : undefined,
      search: searchTerm || undefined,
    }
  );

  // Extract pagination data from API response
  const trainingSchedules = useMemo(
    () => trainingSchedulesResponse?.data?.items || [],
    [trainingSchedulesResponse]
  );
  const totalItems = trainingSchedulesResponse?.data?.count || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Computed values
  const isAdmin = currentUserPrivileges
    ? hasAccess('admin', currentUserPrivileges)
    : false;

  // If not admin, filter schedules to only show disciplines the user is linked to
  const filteredTrainingSchedules = useMemo(() => {
    if (isAdmin) {
      return trainingSchedules;
    }

    const userDisciplineIds =
      instructorDisciplines?.data?.items?.map((item: InstructorDiscipline) =>
        item.idDiscipline.toString()
      ) || [];

    return trainingSchedules.filter((schedule: TrainingSchedule) =>
      userDisciplineIds.includes(schedule.idDiscipline.toString())
    );
  }, [trainingSchedules, isAdmin, instructorDisciplines]);

  // Check if user can manage (create/edit/delete)
  const canManage = useMemo(() => {
    return isAdmin || (instructorDisciplines?.data?.items?.length || 0) > 0;
  }, [isAdmin, instructorDisciplines]);

  // Utility functions
  const getWeekdayText = (weekday: string) => {
    const weekdays = {
      monday: 'Segunda-feira',
      tuesday: 'Terça-feira',
      wednesday: 'Quarta-feira',
      thursday: 'Quinta-feira',
      friday: 'Sexta-feira',
      saturday: 'Sábado',
      sunday: 'Domingo',
    };
    return weekdays[weekday as keyof typeof weekdays] || weekday;
  };

  const formatTime = (time: string) => {
    return time.substring(0, 5); // Remove seconds from HH:MM:SS
  };

  // Event handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

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

  if (isLoading) {
    return <Skeleton className='h-10 w-full' />;
  }

  return (
    <div className='min-h-screen'>
      <div className='mx-auto space-y-8'>
        {/* Header Section */}
        <div className='flex flex-col gap-6 md:flex-row md:items-center md:justify-between'>
          <div className='space-y-2'>
            <div className='flex items-center gap-3'>
              <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'>
                <Calendar className='h-6 w-6' />
              </div>
              <div>
                <h1 className='text-4xl font-bold tracking-tight text-gray-900'>
                  Horários de Treino
                </h1>
                <p className='text-lg text-gray-600'>
                  {isAdmin
                    ? 'Gerencie os horários de todas as disciplinas'
                    : 'Gerencie os horários das suas disciplinas'}
                </p>
              </div>
            </div>
          </div>

          {canManage && (
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className='bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
            >
              <Plus className='mr-2 h-4 w-4' />
              Adicionar Horário
            </Button>
          )}
        </div>

        {/* Filters Section */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700'>
              Buscar
            </label>
            <input
              type='text'
              placeholder='Buscar por disciplina...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
            />
          </div>

          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700'>
              Dia da Semana
            </label>
            <select
              value={filterWeekday}
              onChange={(e) => setFilterWeekday(e.target.value)}
              className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
            >
              <option value='all'>Todos os dias</option>
              <option value='monday'>Segunda-feira</option>
              <option value='tuesday'>Terça-feira</option>
              <option value='wednesday'>Quarta-feira</option>
              <option value='thursday'>Quinta-feira</option>
              <option value='friday'>Sexta-feira</option>
              <option value='saturday'>Sábado</option>
              <option value='sunday'>Domingo</option>
            </select>
          </div>

          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700'>
              Disciplina
            </label>
            <select
              value={filterDiscipline}
              onChange={(e) => setFilterDiscipline(e.target.value)}
              className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
            >
              <option value='all'>Todas as disciplinas</option>
              {/* TODO: Add discipline options from API */}
            </select>
          </div>
        </div>

        {/* Table Section */}
        <TrainingSchedulesTable
          trainingSchedules={filteredTrainingSchedules}
          canManage={canManage}
          isAdmin={isAdmin}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          getWeekdayText={getWeekdayText}
          formatTime={formatTime}
        />

        {/* Add Modal */}
        <AddTrainingScheduleModal
          isOpen={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
          isAdmin={isAdmin}
          userDisciplines={userDisciplines}
        />
      </div>
    </div>
  );
}
