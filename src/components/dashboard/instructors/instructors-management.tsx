'use client';

import { InstructorsSkeleton } from '@/app/(internal)/dashboard/instructors/instructors-skeleton';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/api/queries/use-auth';
import { useManageInstructors } from '@/lib/api/queries/use-manage-instructors';
import { usePrivilegesByUser } from '@/lib/api/queries/use-privileges';
import { InstructorDiscipline, InstructorStatus } from '@/types/instructor';
import { hasAccess } from '@/utils/access-control';
import { motion } from 'framer-motion';
import { Grid3X3, List, Sparkles, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { AddInstructorDisciplineModal } from './add-instructor-discipline-modal';
import { InstructorFilters } from './instructor-filters';
import { InstructorStatsCards } from './instructor-stats-cards';
import { InstructorsCards } from './instructors-cards';
import { InstructorsTable } from './instructors-table';
import { StatusChangeModal } from './status-change-modal';

export default function InstructorsManagement() {
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [filterDiscipline, setFilterDiscipline] = useState('todos');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddDisciplineModalOpen, setIsAddDisciplineModalOpen] =
    useState(false);
  const [isStatusChangeModalOpen, setIsStatusChangeModalOpen] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    instructor: InstructorDiscipline;
    newStatus: string;
  } | null>(null);

  // View mode state
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  // Hooks
  const { updateInstructorDiscipline } = useManageInstructors();
  const router = useRouter();
  const { data: currentUser } = useAuth().me;
  const { data: currentUserPrivileges } = usePrivilegesByUser(
    currentUser?.id.toString() || ''
  );

  // Build filters
  const filters = useMemo(() => {
    return {
      search: searchTerm || undefined,
      status:
        filterStatus !== 'todos'
          ? (filterStatus as InstructorStatus)
          : undefined,
      disciplineId:
        filterDiscipline !== 'todos' ? Number(filterDiscipline) : undefined,
    };
  }, [searchTerm, filterStatus, filterDiscipline]);

  // Use the instructors query
  const { useInstructorDisciplines } = useManageInstructors();
  const { data: instructorsResponse, isLoading } = useInstructorDisciplines(
    currentPage,
    pageSize,
    filters
  );

  // Computed values
  const isAdmin = currentUserPrivileges
    ? hasAccess('admin', currentUserPrivileges)
    : false;

  // Extract pagination data from API response
  const instructors = useMemo(
    () => instructorsResponse?.data?.items || [],
    [instructorsResponse]
  );
  const totalItems = instructorsResponse?.data?.count || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'secondary';
      case 'on_leave':
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
      case 'on_leave':
        return 'Licença';
      default:
        return 'Inativo';
    }
  };

  // Event handlers
  const handleStatusChangeRequest = (
    instructor: InstructorDiscipline,
    newStatus: string
  ) => {
    if (!isAdmin) {
      toast.error(
        'Você não tem permissão para alterar o status dos instrutores'
      );
      return;
    }

    if (instructor.status === newStatus) {
      return;
    }

    setPendingStatusChange({ instructor, newStatus });
    setIsStatusChangeModalOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!pendingStatusChange) return;

    const { instructor, newStatus } = pendingStatusChange;

    try {
      await updateInstructorDiscipline.mutateAsync({
        id: instructor.id,
        status: newStatus as 'active' | 'inactive',
      });

      const statusMessages = {
        active: 'ativado',
        inactive: 'desativado',
        on_leave: 'colocado em licença',
      };

      toast.success(
        `Instrutor ${statusMessages[newStatus as keyof typeof statusMessages]} com sucesso!`
      );
    } catch (error) {
      console.error('Error updating instructor status:', error);
      toast.error('Erro ao alterar status do instrutor');
    } finally {
      setIsStatusChangeModalOpen(false);
      setPendingStatusChange(null);
    }
  };

  const cancelStatusChange = () => {
    setIsStatusChangeModalOpen(false);
    setPendingStatusChange(null);
  };

  const handleViewInstructor = (instructorId: number) => {
    router.push(`/dashboard/instructors/${instructorId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handleViewModeChange = (mode: 'table' | 'cards') => {
    setViewMode(mode);
    // Adjust page size based on view mode
    setPageSize(mode === 'cards' ? 12 : 10);
    setCurrentPage(1);
  };

  if (isLoading) {
    return <InstructorsSkeleton />;
  }

  return (
    <div className='min-h-screen'>
      <div className='mx-auto space-y-8'>
        {/* Enhanced Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='flex flex-col gap-6 pt-8 md:flex-row md:items-center md:justify-between'
        >
          <div className='space-y-3'>
            <div className='flex items-center gap-4'>
              <div className='relative'>
                <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl'>
                  <Users className='h-8 w-8' />
                </div>
                <div className='absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-orange-500'>
                  <Sparkles className='h-3 w-3 text-white' />
                </div>
              </div>
              <div>
                <h1 className='bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-4xl font-bold tracking-tight text-transparent'>
                  Gerenciamento de Instrutores
                </h1>
                <p className='mt-1 text-lg text-gray-600'>
                  Gerencie os instrutores e professores do Budokan com estilo e
                  eficiência
                </p>
              </div>
            </div>
          </div>

          <div className='flex items-center gap-4'>
            {/* Enhanced View Toggle */}
            <div className='flex items-center rounded-xl border border-gray-200 bg-white/80 p-1 shadow-sm backdrop-blur-sm'>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size='sm'
                onClick={() => handleViewModeChange('table')}
                className={`flex items-center gap-2 transition-all duration-200 ${
                  viewMode === 'table'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <List className='h-4 w-4' />
                <span className='hidden sm:inline'>Tabela</span>
              </Button>
              <Button
                variant={viewMode === 'cards' ? 'default' : 'ghost'}
                size='sm'
                onClick={() => handleViewModeChange('cards')}
                className={`flex items-center gap-2 transition-all duration-200 ${
                  viewMode === 'cards'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Grid3X3 className='h-4 w-4' />
                <span className='hidden sm:inline'>Cards</span>
              </Button>
            </div>

            {/* Action Buttons */}
            {isAdmin && (
              <div className='flex items-center gap-3'>
                <AddInstructorDisciplineModal
                  open={isAddDisciplineModalOpen}
                  onOpenChange={setIsAddDisciplineModalOpen}
                />
              </div>
            )}
          </div>
        </motion.div>

        {/* Enhanced Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <InstructorStatsCards instructors={instructors} />
        </motion.div>

        {/* Enhanced Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <InstructorFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterDiscipline={filterDiscipline}
            setFilterDiscipline={setFilterDiscipline}
          />
        </motion.div>

        {/* Content with smooth transitions */}
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          {viewMode === 'table' ? (
            <InstructorsTable
              instructors={instructors}
              isAdmin={isAdmin}
              onStatusChange={handleStatusChangeRequest}
              onViewInstructor={handleViewInstructor}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={totalItems}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          ) : (
            <InstructorsCards
              instructors={instructors}
              isAdmin={isAdmin}
              onStatusChange={handleStatusChangeRequest}
              onViewInstructor={handleViewInstructor}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={totalItems}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </motion.div>

        {/* Status Change Modal */}
        <StatusChangeModal
          open={isStatusChangeModalOpen}
          onOpenChange={setIsStatusChangeModalOpen}
          instructor={pendingStatusChange?.instructor}
          newStatus={pendingStatusChange?.newStatus}
          onConfirm={confirmStatusChange}
          onCancel={cancelStatusChange}
          getStatusText={getStatusText}
        />
      </div>
    </div>
  );
}
