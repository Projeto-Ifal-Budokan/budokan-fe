'use client';

import { TrainingSchedulesSkeleton } from '@/app/(internal)/dashboard/training-schedules/training-schedules-skeleton';
import { AddTrainingScheduleModal } from '@/components/dashboard/training-schedules/add-training-schedule-modal';
import { TrainingScheduleFilters } from '@/components/dashboard/training-schedules/training-schedule-filters';
import { TrainingSchedulesTable } from '@/components/dashboard/training-schedules/training-schedules-table';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/use-debounce';
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

  // Pagination state for display (client-side pagination)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Debounce search term for better UX
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

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

  // Get all training schedules (we'll filter client-side)
  const { data: trainingSchedulesResponse, isLoading } = useTrainingSchedules(
    1,
    1000
  );

  // Extract all training schedules from API response
  const allTrainingSchedules = useMemo(
    () => trainingSchedulesResponse?.data?.items || [],
    [trainingSchedulesResponse]
  );

  // Computed values
  const isAdmin = currentUserPrivileges
    ? hasAccess('admin', currentUserPrivileges)
    : false;

  // If not admin, filter schedules to only show disciplines the user is linked to
  const userAccessibleSchedules = useMemo(() => {
    if (isAdmin) {
      return allTrainingSchedules;
    }

    const userDisciplineIds =
      instructorDisciplines?.data?.items?.map((item: InstructorDiscipline) =>
        item.idDiscipline.toString()
      ) || [];

    return allTrainingSchedules.filter((schedule: TrainingSchedule) =>
      userDisciplineIds.includes(schedule.idDiscipline.toString())
    );
  }, [allTrainingSchedules, isAdmin, instructorDisciplines]);

  // Apply client-side filters
  const filteredTrainingSchedules = useMemo(() => {
    let filtered = userAccessibleSchedules;

    // Apply search filter
    if (debouncedSearchTerm.trim()) {
      const searchLower = debouncedSearchTerm.toLowerCase().trim();
      filtered = filtered.filter((schedule: TrainingSchedule) =>
        schedule.disciplineName.toLowerCase().includes(searchLower)
      );
    }

    // Apply discipline filter
    if (filterDiscipline !== 'all') {
      filtered = filtered.filter(
        (schedule: TrainingSchedule) =>
          schedule.idDiscipline.toString() === filterDiscipline
      );
    }

    // Apply weekday filter
    if (filterWeekday !== 'all') {
      filtered = filtered.filter(
        (schedule: TrainingSchedule) => schedule.weekday === filterWeekday
      );
    }

    return filtered;
  }, [
    userAccessibleSchedules,
    debouncedSearchTerm,
    filterDiscipline,
    filterWeekday,
  ]);

  // Client-side pagination
  const paginatedSchedules = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredTrainingSchedules.slice(startIndex, endIndex);
  }, [filteredTrainingSchedules, currentPage, pageSize]);

  // Pagination calculations
  const totalItems = filteredTrainingSchedules.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Check if user can manage (create/edit/delete)
  const canManage = useMemo(() => {
    return isAdmin || (instructorDisciplines?.data?.items?.length || 0) > 0;
  }, [isAdmin, instructorDisciplines]);

  // Available disciplines for filtering
  const availableDisciplines = useMemo(() => {
    if (isAdmin) {
      return allDisciplines?.data?.items || [];
    }
    // For non-admin users, only show disciplines they're linked to
    if (!instructorDisciplines?.data?.items || !allDisciplines?.data?.items)
      return [];
    return instructorDisciplines.data.items
      .map((inst: InstructorDiscipline) =>
        allDisciplines.data.items.find(
          (d: Discipline) => d.id === inst.idDiscipline
        )
      )
      .filter(Boolean) as Discipline[];
  }, [isAdmin, allDisciplines, instructorDisciplines]);

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

  // Reset to first page when filters change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleDisciplineFilterChange = (value: string) => {
    setFilterDiscipline(value);
    setCurrentPage(1);
  };

  const handleWeekdayFilterChange = (value: string) => {
    setFilterWeekday(value);
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

  if (isLoading && !trainingSchedulesResponse) {
    return <TrainingSchedulesSkeleton />;
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
        <TrainingScheduleFilters
          searchTerm={searchTerm}
          setSearchTerm={handleSearchChange}
          filterDiscipline={filterDiscipline}
          setFilterDiscipline={handleDisciplineFilterChange}
          filterWeekday={filterWeekday}
          setFilterWeekday={handleWeekdayFilterChange}
          availableDisciplines={availableDisciplines}
        />

        {/* Loading state */}
        {isLoading && (
          <div className='flex justify-center py-4'>
            <div className='flex items-center gap-2 text-sm text-gray-600'>
              <div className='h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600'></div>
              Carregando horários...
            </div>
          </div>
        )}

        {/* Table Section */}
        <TrainingSchedulesTable
          trainingSchedules={paginatedSchedules}
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
