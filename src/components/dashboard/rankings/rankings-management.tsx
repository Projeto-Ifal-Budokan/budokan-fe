'use client';

import { useAuth } from '@/lib/api/queries/use-auth';
import { useManageDisciplines } from '@/lib/api/queries/use-manage-disciplines';
import { useManageRankings } from '@/lib/api/queries/use-manage-rankings';
import { usePrivilegesByUser } from '@/lib/api/queries/use-privileges';
import { Ranking } from '@/types/ranking';
import { hasAccess } from '@/utils/access-control';
import { Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { AddRankingModal } from './add-ranking-modal';
import { DeleteRankingDialog } from './delete-ranking-dialog';
import { EditRankingDialog } from './edit-ranking-dialog';
import { RankingFilters } from './ranking-filters';
import { RankingStatsCards } from './ranking-stats-cards';
import { RankingsSkeleton } from './rankings-skeleton';
import { RankingsTable } from './rankings-table';

export default function RankingsManagement() {
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDiscipline, setFilterDiscipline] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isStatusChangeModalOpen, setIsStatusChangeModalOpen] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    ranking: Ranking;
    newStatus: 'active' | 'inactive';
  } | null>(null);
  const [editingRanking, setEditingRanking] = useState<Ranking | null>(null);
  const [deletingRanking, setDeletingRanking] = useState<Ranking | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Hooks
  const { updateRanking, useRankings } = useManageRankings();
  const { useDisciplines } = useManageDisciplines();
  const router = useRouter();
  const { data: currentUser } = useAuth().me;
  const { data: currentUserPrivileges } = usePrivilegesByUser(
    currentUser?.id.toString() || ''
  );

  // Get disciplines data for filters
  const { data: disciplinesResponse, isLoading: disciplinesLoading } =
    useDisciplines(1, 50);

  // Get rankings data with server-side pagination
  const disciplineId =
    filterDiscipline === 'all' ? undefined : filterDiscipline;
  const { data: rankingsResponse, isLoading: rankingsLoading } = useRankings(
    disciplineId,
    currentPage,
    pageSize
  );

  // Extract data from responses
  const disciplines = useMemo(
    () => disciplinesResponse?.data?.items || [],
    [disciplinesResponse]
  );

  const rankings = useMemo(
    () => rankingsResponse?.data?.items || [],
    [rankingsResponse?.data]
  );

  // Computed values
  const isAdmin = currentUserPrivileges
    ? hasAccess('admin', currentUserPrivileges)
    : false;

  // Filter rankings client-side for search only (no pagination)
  const filteredRankings = useMemo(() => {
    return rankings.filter((ranking) => {
      const matchesSearch =
        ranking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ranking.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ranking.disciplineName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [rankings, searchTerm]);

  // Use server pagination info
  const totalPages = Math.ceil((rankingsResponse?.data?.count || 0) / pageSize);
  const totalItems = rankingsResponse?.data?.count || 0;

  // Event handlers
  const handleStatusChangeRequest = (ranking: Ranking, newStatus: string) => {
    if (!isAdmin) {
      toast.error('Você não tem permissão para alterar o status dos rankings');
      return;
    }

    setPendingStatusChange({
      ranking,
      newStatus: newStatus as 'active' | 'inactive',
    });
    setIsStatusChangeModalOpen(true);
  };

  const handleViewRanking = (rankingId: number) => {
    router.push(`/dashboard/rankings/${rankingId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handleEditRanking = (ranking: Ranking) => {
    setEditingRanking(ranking);
  };

  const handleDeleteRanking = (ranking: Ranking) => {
    setDeletingRanking(ranking);
  };

  // Loading state
  const isLoading = rankingsLoading || disciplinesLoading;

  if (isLoading) {
    return <RankingsSkeleton />;
  }

  return (
    <div className='min-h-screen'>
      <div className='mx-auto space-y-8'>
        {/* Header Section */}
        <div className='flex flex-col gap-6 md:flex-row md:items-center md:justify-between'>
          <div className='space-y-2'>
            <div className='flex items-center gap-3'>
              <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'>
                <Trophy className='h-6 w-6' />
              </div>
              <div>
                <h1 className='text-4xl font-bold tracking-tight text-gray-900'>
                  Gerenciamento de Rankings
                </h1>
                <p className='text-lg text-gray-600'>
                  Gerencie os níveis de graduação das modalidades
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <RankingStatsCards
          totalRankings={rankingsResponse?.data?.count || 0}
          totalDisciplines={
            disciplines.filter((d) => d.status === 'active').length
          }
          rankings={rankings}
        />

        {/* Filters */}
        <RankingFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterDiscipline={filterDiscipline}
          setFilterDiscipline={setFilterDiscipline}
          disciplines={disciplines.filter((d) => d.status === 'active')}
          isAdmin={isAdmin}
          onAddClick={() => setIsAddModalOpen(true)}
        />

        {/* Rankings Table */}
        <RankingsTable
          rankings={filteredRankings}
          isAdmin={isAdmin}
          isPending={updateRanking.isPending}
          onStatusChange={handleStatusChangeRequest}
          onViewRanking={handleViewRanking}
          onEditRanking={handleEditRanking}
          onDeleteRanking={handleDeleteRanking}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />

        {/* Modals */}
        <AddRankingModal
          isOpen={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
          disciplines={disciplines.filter((d) => d.status === 'active')}
        />

        {/* Edit Ranking Dialog */}
        {editingRanking && (
          <EditRankingDialog
            open={!!editingRanking}
            onOpenChange={(open) => !open && setEditingRanking(null)}
            ranking={editingRanking}
            disciplines={disciplines.filter((d) => d.status === 'active')}
          />
        )}

        {/* Delete Ranking Dialog */}
        {deletingRanking && (
          <DeleteRankingDialog
            open={!!deletingRanking}
            onOpenChange={(open) => !open && setDeletingRanking(null)}
            ranking={deletingRanking}
          />
        )}
      </div>
    </div>
  );
}
