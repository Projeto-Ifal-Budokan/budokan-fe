'use client';

import { useAuth } from '@/lib/api/queries/use-auth';
import { useInstructorDisciplines } from '@/lib/api/queries/use-instructor-disciplines';
import { useManageMatriculations } from '@/lib/api/queries/use-manage-matriculations';
import { usePrivilegesByUser } from '@/lib/api/queries/use-privileges';
import { InstructorDiscipline } from '@/types/instructor';
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

// Unified interface for both student matriculations and instructor disciplines
interface UnifiedEnrollment {
  id: number;
  idStudent?: number;
  idInstructor?: number;
  idDiscipline: number;
  idRank: number;
  type: 'student' | 'instructor';
  status: 'active' | 'inactive' | 'graduated';
  paymentExempt?: boolean;
  isPaymentExempt?: boolean;
  activatedBy?: number | null;
  inactivatedBy?: number | null;
  createdAt: string;
  updatedAt: string;
  userName: string;
  userEmail?: string;
  disciplineName: string;
  rankName: string;
  source: 'matriculation' | 'instructor-discipline';
}

export default function MatriculationsManagement() {
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDiscipline, setFilterDiscipline] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isStatusChangeModalOpen, setIsStatusChangeModalOpen] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    matriculation: UnifiedEnrollment;
    newStatus: 'active' | 'inactive' | 'graduated';
  } | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Hooks
  const { updateMatriculation, useMatriculations } = useManageMatriculations();
  const { useInstructorDisciplinesList, updateInstructorDiscipline } =
    useInstructorDisciplines();
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

  // Fetch both student matriculations and instructor disciplines
  const { data: matriculationsResponse, isLoading: isLoadingMatriculations } =
    useMatriculations(currentPage, pageSize, filters);

  const {
    data: instructorDisciplinesResponse,
    isLoading: isLoadingInstructorDisciplines,
  } = useInstructorDisciplinesList(currentPage, pageSize, {
    ...filters,
    // Convert type filter for instructor disciplines endpoint
    instructorId: filters.type === 'instructor' ? undefined : null, // Adjust based on API
  });

  // Transform and combine data
  const combinedEnrollments = useMemo(() => {
    const studentEnrollments: UnifiedEnrollment[] =
      filters.type === 'instructor'
        ? []
        : (matriculationsResponse?.data?.items || []).map(
            (matriculation: Matriculation) => ({
              ...matriculation,
              userName: matriculation.studentName,
              userEmail: undefined,
              source: 'matriculation' as const,
            })
          );

    const instructorEnrollments: UnifiedEnrollment[] =
      filters.type === 'student'
        ? []
        : (instructorDisciplinesResponse?.data?.items || []).map(
            (instructorDiscipline: InstructorDiscipline) => ({
              id: instructorDiscipline.id,
              idInstructor: instructorDiscipline.idInstructor,
              idDiscipline: instructorDiscipline.idDiscipline,
              idRank: instructorDiscipline.idRank,
              type: 'instructor' as const,
              status: instructorDiscipline.status as 'active' | 'inactive',
              createdAt: instructorDiscipline.createdAt,
              updatedAt: instructorDiscipline.updatedAt,
              userName:
                instructorDiscipline.instructorName || 'Unknown Instructor',
              userEmail: undefined,
              disciplineName: instructorDiscipline.disciplineName,
              rankName: instructorDiscipline.rankName,
              source: 'instructor-discipline' as const,
            })
          );

    let combined = [...studentEnrollments, ...instructorEnrollments];

    // Apply client-side filtering
    if (filters.status && filters.status !== 'all') {
      combined = combined.filter((item) => item.status === filters.status);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      combined = combined.filter(
        (item) =>
          item.userName.toLowerCase().includes(searchLower) ||
          item.disciplineName.toLowerCase().includes(searchLower) ||
          item.rankName.toLowerCase().includes(searchLower)
      );
    }

    // Sort by creation date (newest first)
    combined.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return combined;
  }, [matriculationsResponse, instructorDisciplinesResponse, filters]);

  // Calculate pagination for combined data
  const totalItems = combinedEnrollments.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedEnrollments = combinedEnrollments.slice(startIndex, endIndex);

  const isLoading = isLoadingMatriculations || isLoadingInstructorDisciplines;

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
    };
    return descriptions[newStatus as keyof typeof descriptions];
  };

  // Event handlers
  const handleStatusChangeRequest = (
    enrollment: UnifiedEnrollment,
    newStatus: string
  ) => {
    if (!isAdmin) {
      toast.error(
        'Você não tem permissão para alterar o status das matrículas'
      );
      return;
    }

    if (enrollment.status === newStatus) {
      return;
    }

    setPendingStatusChange({
      matriculation: enrollment,
      newStatus: newStatus as 'active' | 'inactive' | 'graduated',
    });
    setIsStatusChangeModalOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!pendingStatusChange) return;

    const { matriculation, newStatus } = pendingStatusChange;

    try {
      if (matriculation.source === 'matriculation') {
        await updateMatriculation.mutateAsync({
          id: matriculation.id,
          status: newStatus,
        });
      } else {
        // Handle instructor discipline status change
        await updateInstructorDiscipline.mutateAsync({
          id: matriculation.id,
          status: newStatus as 'active' | 'inactive',
        });
      }

      const statusMessages = {
        active: 'ativada',
        inactive: 'desativada',
        graduated: 'graduada',
      };

      toast.success(
        `${matriculation.type === 'student' ? 'Matrícula' : 'Disciplina do instrutor'} ${statusMessages[newStatus as keyof typeof statusMessages]} com sucesso!`
      );
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Erro ao alterar status');
    } finally {
      setIsStatusChangeModalOpen(false);
      setPendingStatusChange(null);
    }
  };

  const cancelStatusChange = () => {
    setIsStatusChangeModalOpen(false);
    setPendingStatusChange(null);
  };

  const handleViewMatriculation = (enrollmentId: number) => {
    router.push(`/dashboard/matriculations/${enrollmentId}`);
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
    <div className='space-y-6 p-6'>
      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div className='flex items-center gap-3'>
          <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600'>
            <GraduationCap className='h-6 w-6 text-white' />
          </div>
          <div>
            <h1 className='text-2xl font-bold tracking-tight text-gray-900'>
              Matrículas e Disciplinas
            </h1>
            <p className='text-gray-600'>
              Gerencie matrículas de alunos e disciplinas de instrutores
            </p>
          </div>
        </div>

        {isAdmin && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className='inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-blue-600 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none'
          >
            <GraduationCap className='h-4 w-4' />
            Nova Matrícula
          </button>
        )}
      </div>

      <MatriculationStatsCards matriculations={combinedEnrollments} />

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

      {isLoading ? (
        <MatriculationsSkeleton />
      ) : (
        <MatriculationsTable
          matriculations={paginatedEnrollments}
          isAdmin={isAdmin}
          isPending={
            updateMatriculation.isPending ||
            updateInstructorDiscipline.isPending
          }
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
      )}

      {isAddModalOpen && (
        <AddMatriculationModal
          isOpen={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
        />
      )}

      {isStatusChangeModalOpen && pendingStatusChange && (
        <StatusChangeModal
          isOpen={isStatusChangeModalOpen}
          onOpenChange={setIsStatusChangeModalOpen}
          pendingChange={pendingStatusChange}
          isPending={
            updateMatriculation.isPending ||
            updateInstructorDiscipline.isPending
          }
          onConfirm={confirmStatusChange}
          onCancel={cancelStatusChange}
          getStatusColor={getStatusColor}
          getStatusChangeMessage={getStatusChangeMessage}
          getStatusChangeDescription={getStatusChangeDescription}
        />
      )}
    </div>
  );
}
