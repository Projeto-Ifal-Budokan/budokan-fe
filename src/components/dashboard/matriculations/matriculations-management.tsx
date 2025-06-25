'use client';

import { useAuth } from '@/lib/api/queries/use-auth';
import { useManageMatriculations } from '@/lib/api/queries/use-manage-matriculations';
import { usePrivilegesByUser } from '@/lib/api/queries/use-privileges';
import { Matriculation } from '@/types/matriculation';
import { hasAccess } from '@/utils/access-control';
import { GraduationCap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { AddMatriculationModal } from './add-matriculation-modal';
import { MatriculationFilters } from './matriculation-filters';
import { MatriculationStatsCards } from './matriculation-stats-cards';
import { MatriculationsSkeleton } from './matriculations-skeleton';
import { MatriculationsTable } from './matriculations-table';
import { StatusChangeModal } from './status-change-modal';

export default function MatriculationsManagement() {
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDiscipline, setFilterDiscipline] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isStatusChangeModalOpen, setIsStatusChangeModalOpen] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    matriculation: Matriculation;
    newStatus: 'active' | 'inactive' | 'graduated';
  } | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Hooks
  const { updateMatriculation, useMatriculations } = useManageMatriculations();
  const router = useRouter();
  const { data: currentUser } = useAuth().me;
  const { data: currentUserPrivileges } = usePrivilegesByUser(
    currentUser?.id.toString() || ''
  );

  const filters = useMemo(
    () => ({
      type: filterType !== 'all' ? filterType : undefined,
      status: filterStatus !== 'all' ? filterStatus : undefined,
      discipline: filterDiscipline !== 'all' ? filterDiscipline : undefined,
      search: searchTerm || undefined,
    }),
    [filterType, filterStatus, filterDiscipline, searchTerm]
  );

  const { data: matriculationsResponse, isLoading } = useMatriculations(
    currentPage,
    pageSize,
    filters
  );

  // Extract pagination data from API response
  const matriculations = useMemo(
    () => matriculationsResponse?.data?.items || [],
    [matriculationsResponse]
  );
  const totalItems = matriculationsResponse?.data?.count || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Computed values
  const isAdmin = currentUserPrivileges
    ? hasAccess('admin', currentUserPrivileges)
    : false;

  // Utility functions
  const getStatusColor = (
    status: string
  ): 'default' | 'secondary' | 'destructive' => {
    switch (status) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'secondary';
      case 'graduated':
        return 'destructive';
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
      case 'graduated':
        return 'Graduado';
      default:
        return 'Inativo';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'student':
        return 'Aluno';
      case 'instructor':
        return 'Instrutor';
      default:
        return 'Aluno';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'student':
        return 'blue';
      case 'instructor':
        return 'purple';
      default:
        return 'gray';
    }
  };

  const getStatusChangeMessage = (currentStatus: string, newStatus: string) => {
    const statusMessages = {
      active: 'ativar',
      inactive: 'desativar',
      graduated: 'graduar',
    };
    return statusMessages[newStatus as keyof typeof statusMessages];
  };

  const getStatusChangeDescription = (newStatus: string) => {
    const descriptions = {
      active: 'A matrícula ficará ativa no sistema.',
      inactive: 'A matrícula ficará inativa no sistema.',
      graduated: 'O aluno será marcado como graduado.',
    };
    return descriptions[newStatus as keyof typeof descriptions];
  };

  // Event handlers
  const handleStatusChangeRequest = (
    matriculation: Matriculation,
    newStatus: string
  ) => {
    if (!isAdmin) {
      toast.error(
        'Você não tem permissão para alterar o status das matrículas'
      );
      return;
    }

    if (matriculation.status === newStatus) {
      return;
    }

    setPendingStatusChange({
      matriculation,
      newStatus: newStatus as 'active' | 'inactive' | 'graduated',
    });
    setIsStatusChangeModalOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!pendingStatusChange) return;

    const { matriculation, newStatus } = pendingStatusChange;

    try {
      await updateMatriculation.mutateAsync({
        id: matriculation.id,
        status: newStatus,
      });

      const statusMessages = {
        active: 'ativada',
        inactive: 'desativada',
        graduated: 'graduada',
      };

      toast.success(
        `Matrícula ${statusMessages[newStatus as keyof typeof statusMessages]} com sucesso!`
      );
    } catch (error) {
      console.error('Error updating matriculation status:', error);
      toast.error('Erro ao alterar status da matrícula');
    } finally {
      setIsStatusChangeModalOpen(false);
      setPendingStatusChange(null);
    }
  };

  const cancelStatusChange = () => {
    setIsStatusChangeModalOpen(false);
    setPendingStatusChange(null);
  };

  const handleViewMatriculation = (matriculationId: number) => {
    router.push(`/dashboard/matriculations/${matriculationId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  if (isLoading) {
    return <MatriculationsSkeleton />;
  }

  return (
    <div className='min-h-screen'>
      <div className='mx-auto space-y-8'>
        {/* Header Section */}
        <div className='flex flex-col gap-6 md:flex-row md:items-center md:justify-between'>
          <div className='space-y-2'>
            <div className='flex items-center gap-3'>
              <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'>
                <GraduationCap className='h-6 w-6' />
              </div>
              <div>
                <h1 className='text-4xl font-bold tracking-tight text-gray-900'>
                  Gerenciamento de Matrículas
                </h1>
                <p className='text-lg text-gray-600'>
                  Controle de matrículas de alunos e instrutores nas modalidades
                </p>
              </div>
            </div>
          </div>

          <AddMatriculationModal
            isOpen={isAddModalOpen}
            onOpenChange={setIsAddModalOpen}
          />
        </div>

        {/* Stats Cards */}
        <MatriculationStatsCards matriculations={matriculations} />

        {/* Filters */}
        <MatriculationFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterType={filterType}
          setFilterType={setFilterType}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterDiscipline={filterDiscipline}
          setFilterDiscipline={setFilterDiscipline}
        />

        {/* Matriculations Table */}
        <MatriculationsTable
          matriculations={matriculations}
          isAdmin={isAdmin}
          isPending={updateMatriculation.isPending}
          onStatusChange={handleStatusChangeRequest}
          onViewMatriculation={handleViewMatriculation}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
          getTypeText={getTypeText}
          getTypeColor={getTypeColor}
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
          isPending={updateMatriculation.isPending}
          onConfirm={confirmStatusChange}
          onCancel={cancelStatusChange}
          getStatusColor={getStatusColor}
          getStatusChangeMessage={getStatusChangeMessage}
          getStatusChangeDescription={getStatusChangeDescription}
        />
      </div>
    </div>
  );
}
