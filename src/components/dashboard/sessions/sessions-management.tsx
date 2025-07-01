'use client';

import { SessionsSkeleton } from '@/app/(internal)/dashboard/sessions/sessions-skeleton';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/use-debounce';
import { useAuth } from '@/lib/api/queries/use-auth';
import { useInstructorDisciplines } from '@/lib/api/queries/use-instructor-disciplines';
import { useManageDisciplines } from '@/lib/api/queries/use-manage-disciplines';
import { useManageSessions } from '@/lib/api/queries/use-manage-sessions';
import { usePrivilegesByUser } from '@/lib/api/queries/use-privileges';
import { Discipline } from '@/types/discipline';
import { InstructorDiscipline } from '@/types/instructor';
import { hasAccess } from '@/utils/access-control';
import { Calendar, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AddSessionModal } from './add-session-modal';

import { SessionFilters as SessionFiltersType } from '@/types/session';
import { SessionFilters } from './session-filters';
import { SessionsTable } from './sessions-table';

export default function SessionsManagement() {
  // State
  const [filterDiscipline, setFilterDiscipline] = useState('all');
  const [dateFilter, setDateFilter] = useState({
    initialDate: '',
    finalDate: '',
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Debounce date filters for better UX
  const debouncedDateFilter = useDebounce(dateFilter, 500);

  // Hooks
  const { useSessions } = useManageSessions();
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
  const { data: sessionsResponse, isLoading } = useSessions(sessionFilters);

  // Computed values
  const isAdmin = currentUserPrivileges
    ? hasAccess('admin', currentUserPrivileges)
    : false;

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

  // Show loading skeleton
  if (isLoading) {
    return <SessionsSkeleton />;
  }

  // Check if user has no linked disciplines (for non-admin)
  if (!isAdmin && (!userDisciplines || userDisciplines.length === 0)) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Aulas</h1>
            <p className='text-muted-foreground'>
              Gerencie as aulas das disciplinas
            </p>
          </div>
        </div>
        <div className='rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-center'>
          <Calendar className='mx-auto h-12 w-12 text-yellow-500' />
          <h3 className='mt-2 text-sm font-medium text-yellow-800'>
            Nenhuma disciplina vinculada
          </h3>
          <p className='mt-1 text-sm text-yellow-600'>
            Você não está vinculado a nenhuma disciplina. Entre em contato com o
            administrador para ter acesso às aulas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Aulas</h1>
          <p className='text-muted-foreground'>
            Gerencie as aulas das disciplinas
          </p>
        </div>
        {canManage && (
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className='mr-2 h-4 w-4' />
            Adicionar Aula
          </Button>
        )}
      </div>

      <SessionFilters
        disciplines={availableDisciplines}
        selectedDiscipline={filterDiscipline}
        onDisciplineChange={handleDisciplineFilterChange}
        onDateChange={handleDateFilterChange}
        initialDate={dateFilter.initialDate}
        finalDate={dateFilter.finalDate}
      />

      <SessionsTable
        sessions={sessionsResponse?.data?.items || []}
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={sessionsResponse?.data?.count || 0}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        canManage={canManage}
        isAdmin={isAdmin}
        userDisciplines={userDisciplines}
      />

      <AddSessionModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        isAdmin={isAdmin}
        userDisciplines={userDisciplines}
      />
    </div>
  );
}
