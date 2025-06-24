'use client';

import { UsersSkeleton } from '@/app/(internal)/dashboard/users/users-skeleton';
import { AddUserModal } from '@/components/dashboard/users/add-user-modal';
import { StatusChangeModal } from '@/components/dashboard/users/status-change-modal';
import { UserFilters } from '@/components/dashboard/users/user-filters';
import { UserStatsCards } from '@/components/dashboard/users/user-stats-cards';
import { UsersTable } from '@/components/dashboard/users/users-table';
import { useAuth } from '@/lib/api/queries/use-auth';
import { useManageUsers, userKeys } from '@/lib/api/queries/use-manage-users';
import { usePrivilegesByUser } from '@/lib/api/queries/use-privileges';
import { User, UserStatus } from '@/types/user';
import { hasAccess } from '@/utils/access-control';
import { useQuery } from '@tanstack/react-query';
import { Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function UsersManagement() {
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('todos');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isStatusChangeModalOpen, setIsStatusChangeModalOpen] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    user: User;
    newStatus: string;
  } | null>(null);

  // Hooks
  const { fetchUsers, updateUserStatus } = useManageUsers();
  const router = useRouter();
  const { data: currentUser } = useAuth().me;
  const { data: currentUserPrivileges } = usePrivilegesByUser(
    currentUser?.id.toString() || ''
  );

  // Computed values
  const isAdmin = currentUserPrivileges
    ? hasAccess('admin', currentUserPrivileges)
    : false;

  const { data: users, isLoading } = useQuery({
    queryKey: userKeys.all,
    queryFn: fetchUsers,
  });

  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'secondary';
      case 'suspended':
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
      case 'suspended':
        return 'Suspenso';
      default:
        return 'Inativo';
    }
  };

  const getStatusChangeMessage = (currentStatus: string, newStatus: string) => {
    const statusMessages = {
      active: 'ativar',
      inactive: 'desativar',
      suspended: 'suspender',
    };
    return statusMessages[newStatus as keyof typeof statusMessages];
  };

  const getStatusChangeDescription = (newStatus: string) => {
    const descriptions = {
      active: 'O usuário poderá acessar o sistema normalmente.',
      inactive: 'O usuário não poderá acessar o sistema.',
      suspended:
        'O usuário ficará temporariamente impedido de acessar o sistema.',
    };
    return descriptions[newStatus as keyof typeof descriptions];
  };

  // Event handlers
  const handleStatusChangeRequest = (user: User, newStatus: string) => {
    if (!isAdmin) {
      toast.error('Você não tem permissão para alterar o status dos usuários');
      return;
    }

    if (user.status === newStatus) {
      return;
    }

    setPendingStatusChange({ user, newStatus });
    setIsStatusChangeModalOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!pendingStatusChange) return;

    const { user, newStatus } = pendingStatusChange;

    try {
      await updateUserStatus.mutateAsync({
        id: String(user.id),
        status: newStatus as UserStatus,
      });

      const statusMessages = {
        active: 'ativado',
        inactive: 'desativado',
        suspended: 'suspenso',
      };

      toast.success(
        `Usuário ${statusMessages[newStatus as keyof typeof statusMessages]} com sucesso!`
      );
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Erro ao alterar status do usuário');
    } finally {
      setIsStatusChangeModalOpen(false);
      setPendingStatusChange(null);
    }
  };

  const cancelStatusChange = () => {
    setIsStatusChangeModalOpen(false);
    setPendingStatusChange(null);
  };

  const handleViewUser = (userId: number) => {
    router.push(`/dashboard/users/${userId}`);
  };

  // Filter users
  const filteredUsuarios =
    (Array.isArray(users?.data?.items)
      ? users?.data?.items.filter((usuario) => {
          const matchesSearch =
            usuario.firstName
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            usuario.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            usuario.email.toLowerCase().includes(searchTerm.toLowerCase());

          const matchesStatus =
            filterStatus === 'todos' || usuario.status === filterStatus;

          return matchesSearch && matchesStatus;
        })
      : []) || [];

  if (isLoading) {
    return <UsersSkeleton />;
  }

  return (
    <div className='min-h-screen'>
      <div className='mx-auto space-y-8'>
        {/* Header Section */}
        <div className='flex flex-col gap-6 md:flex-row md:items-center md:justify-between'>
          <div className='space-y-2'>
            <div className='flex items-center gap-3'>
              <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'>
                <Users className='h-6 w-6' />
              </div>
              <div>
                <h1 className='text-4xl font-bold tracking-tight text-gray-900'>
                  Gerenciamento de Usuários
                </h1>
                <p className='text-lg text-gray-600'>
                  Controle total sobre os usuários do sistema
                </p>
              </div>
            </div>
          </div>

          <AddUserModal
            isOpen={isAddModalOpen}
            onOpenChange={setIsAddModalOpen}
          />
        </div>

        {/* Stats Cards */}
        <UserStatsCards users={users?.data?.items || []} />

        {/* Filters */}
        <UserFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterTipo={filterTipo}
          setFilterTipo={setFilterTipo}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />

        {/* Users Table */}
        <UsersTable
          users={filteredUsuarios}
          isAdmin={isAdmin}
          isPending={updateUserStatus.isPending}
          onStatusChange={handleStatusChangeRequest}
          onViewUser={handleViewUser}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
        />

        {/* Status Change Modal */}
        <StatusChangeModal
          isOpen={isStatusChangeModalOpen}
          onOpenChange={setIsStatusChangeModalOpen}
          pendingChange={pendingStatusChange}
          isPending={updateUserStatus.isPending}
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
