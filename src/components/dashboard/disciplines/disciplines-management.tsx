'use client';

import { AddDisciplineModal } from '@/components/dashboard/disciplines/add-discipline-modal';
import { DisciplineFilters } from '@/components/dashboard/disciplines/discipline-filters';
import { DisciplineStatsCards } from '@/components/dashboard/disciplines/discipline-stats-cards';
import { DisciplinesSkeleton } from '@/components/dashboard/disciplines/disciplines-skeleton';
import { DisciplinesTable } from '@/components/dashboard/disciplines/disciplines-table';
import { StatusChangeModal } from '@/components/dashboard/disciplines/status-change-modal';
import { useAuth } from '@/lib/api/queries/use-auth';
import { useManageDisciplines } from '@/lib/api/queries/use-manage-disciplines';

import { usePrivilegesByUser } from '@/lib/api/queries/use-privileges';
import { Discipline } from '@/types/discipline';
import { hasAccess } from '@/utils/access-control';
import { BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

export default function DisciplinesManagement() {
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isStatusChangeModalOpen, setIsStatusChangeModalOpen] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    discipline: Discipline;
    newStatus: 'active' | 'inactive';
  } | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Hooks
  const { updateDiscipline, useDisciplines } = useManageDisciplines();
  const router = useRouter();
  const { data: currentUser } = useAuth().me;
  const { data: currentUserPrivileges } = usePrivilegesByUser(
    currentUser?.id.toString() || ''
  );

  const { data: disciplinesResponse, isLoading } = useDisciplines(
    currentPage,
    pageSize
  );

  // Extract pagination data from API response
  const disciplines = useMemo(
    () => disciplinesResponse?.data?.items || [],
    [disciplinesResponse]
  );
  const totalItems = disciplinesResponse?.data?.count || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Computed values
  const isAdmin = currentUserPrivileges
    ? hasAccess('admin', currentUserPrivileges)
    : false;

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

  const getStatusChangeMessage = (currentStatus: string, newStatus: string) => {
    const statusMessages = {
      active: 'ativar',
      inactive: 'desativar',
    };
    return statusMessages[newStatus as keyof typeof statusMessages];
  };

  const getStatusChangeDescription = (newStatus: string) => {
    const descriptions = {
      active: 'A disciplina ficará disponível para uso no sistema.',
      inactive: 'A disciplina ficará indisponível para novas atribuições.',
    };
    return descriptions[newStatus as keyof typeof descriptions];
  };

  // Event handlers
  const handleStatusChangeRequest = (
    discipline: Discipline,
    newStatus: string
  ) => {
    if (!isAdmin) {
      toast.error(
        'Você não tem permissão para alterar o status das disciplinas'
      );
      return;
    }

    if (discipline.status === newStatus) {
      return;
    }

    setPendingStatusChange({
      discipline,
      newStatus: newStatus as 'active' | 'inactive',
    });
    setIsStatusChangeModalOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!pendingStatusChange) return;

    const { discipline, newStatus } = pendingStatusChange;

    try {
      await updateDiscipline.mutateAsync({
        id: discipline.id,
        status: newStatus,
      });

      const statusMessages = {
        active: 'ativada',
        inactive: 'desativada',
      };

      toast.success(
        `Disciplina ${statusMessages[newStatus as keyof typeof statusMessages]} com sucesso!`
      );
    } catch (error) {
      console.error('Error updating discipline status:', error);
      toast.error('Erro ao alterar status da disciplina');
    } finally {
      setIsStatusChangeModalOpen(false);
      setPendingStatusChange(null);
    }
  };

  const cancelStatusChange = () => {
    setIsStatusChangeModalOpen(false);
    setPendingStatusChange(null);
  };

  const handleViewDiscipline = (disciplineId: number) => {
    router.push(`/dashboard/disciplines/${disciplineId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  // Filter disciplines client-side
  const filteredDisciplines = useMemo(() => {
    return disciplines.filter((discipline) => {
      const matchesSearch =
        discipline.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        discipline.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === 'todos' || discipline.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [disciplines, searchTerm, filterStatus]);

  if (isLoading) {
    return <DisciplinesSkeleton />;
  }

  return (
    <div className='min-h-screen'>
      <div className='mx-auto space-y-8'>
        {/* Header Section */}
        <div className='flex flex-col gap-6 md:flex-row md:items-center md:justify-between'>
          <div className='space-y-2'>
            <div className='flex items-center gap-3'>
              <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'>
                <BookOpen className='h-6 w-6' />
              </div>
              <div>
                <h1 className='text-4xl font-bold tracking-tight text-gray-900'>
                  Gerenciamento de Disciplinas
                </h1>
                <p className='text-lg text-gray-600'>
                  Controle total sobre as modalidades e graduações do sistema
                </p>
              </div>
            </div>
          </div>

          <AddDisciplineModal
            isOpen={isAddModalOpen}
            onOpenChange={setIsAddModalOpen}
          />
        </div>

        {/* Stats Cards */}
        <DisciplineStatsCards disciplines={disciplines} />

        {/* Filters */}
        <DisciplineFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />

        {/* Disciplines Table */}
        <DisciplinesTable
          disciplines={filteredDisciplines}
          isAdmin={isAdmin}
          isPending={updateDiscipline.isPending}
          onStatusChange={handleStatusChangeRequest}
          onViewDiscipline={handleViewDiscipline}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />

        {/* Status Change Modal */}
        <StatusChangeModal
          isOpen={isStatusChangeModalOpen}
          onOpenChange={setIsStatusChangeModalOpen}
          pendingChange={pendingStatusChange}
          isPending={updateDiscipline.isPending}
          onConfirm={confirmStatusChange}
          onCancel={cancelStatusChange}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
          getStatusChangeMessage={getStatusChangeMessage}
          getStatusChangeDescription={getStatusChangeDescription}
        />
      </div>
    </div>
  );
}
