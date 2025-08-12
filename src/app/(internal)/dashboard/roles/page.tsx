'use client';

import { RolesSkeleton } from '@/app/(internal)/dashboard/roles/roles-skeleton';
import { AddRoleModal } from '@/components/dashboard/roles/add-role-modal';
import { DeleteRoleModal } from '@/components/dashboard/roles/delete-role-modal';
import { EditRoleModal } from '@/components/dashboard/roles/edit-role-modal';
import { RoleFilters } from '@/components/dashboard/roles/role-filters';

import { RoleStatsCards } from '@/components/dashboard/roles/role-stats-cards';
import { RolesTable } from '@/components/dashboard/roles/roles-table';
import { AssignUserRoleModal } from '@/components/dashboard/users/assign-user-role-modal';

import { useAuth } from '@/lib/api/queries/use-auth';
import { useManageRoles } from '@/lib/api/queries/use-manage-roles';

import { usePrivilegesByUser } from '@/lib/api/queries/use-privileges';
import { Role } from '@/types/user';
import { hasAccess } from '@/utils/access-control';
import { Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

export default function RolesManagement() {
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAssignUserRoleModalOpen, setIsAssignUserRoleModalOpen] =
    useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Hooks
  const { deleteRole, updateRole } = useManageRoles();
  const router = useRouter();
  const { data: currentUser } = useAuth().me;
  const { data: currentUserPrivileges } = usePrivilegesByUser(
    currentUser?.id.toString() || ''
  );

  // Use the new paginated query
  const { useRoles } = useManageRoles();
  const { data: rolesResponse, isLoading } = useRoles(currentPage, pageSize);

  // Computed values
  const isAdmin = currentUserPrivileges
    ? hasAccess('admin', currentUserPrivileges)
    : false;

  // Extract pagination data from API response
  const roles = useMemo(
    () => rolesResponse?.data?.items || [],
    [rolesResponse]
  );
  const totalItems = rolesResponse?.data?.count || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Event handlers
  const handleEditRole = (role: Role) => {
    if (!isAdmin) {
      toast.error('Você não tem permissão para editar papéis');
      return;
    }
    setSelectedRole(role);
    setIsEditModalOpen(true);
  };

  const handleDeleteRole = (role: Role) => {
    if (!isAdmin) {
      toast.error('Você não tem permissão para excluir papéis');
      return;
    }
    setSelectedRole(role);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteRole = async () => {
    if (!selectedRole) return;

    try {
      await deleteRole.mutateAsync(String(selectedRole.id));
      toast.success('Papel excluído com sucesso!');
    } catch (error) {
      console.error('Error deleting role:', error);
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedRole(null);
    }
  };

  const cancelDeleteRole = () => {
    setIsDeleteModalOpen(false);
    setSelectedRole(null);
  };

  const handleViewRole = (roleId: number) => {
    router.push(`/dashboard/roles/${roleId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Filter roles client-side
  const filteredRoles = useMemo(() => {
    return roles.filter((role) => {
      const matchesSearch =
        role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.description.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [roles, searchTerm]);

  if (isLoading) {
    return <RolesSkeleton />;
  }

  return (
    <div className='min-h-screen'>
      <div className='mx-auto space-y-8'>
        {/* Header Section */}
        <div className='flex flex-col gap-6 md:flex-row md:items-center md:justify-between'>
          <div className='space-y-2'>
            <div className='flex items-center gap-3'>
              <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'>
                <Shield className='h-6 w-6' />
              </div>
              <div>
                <h1 className='text-4xl font-bold tracking-tight text-gray-900'>
                  Gerenciamento de Papéis
                </h1>
                <p className='text-lg text-gray-600'>
                  Controle total sobre os papéis do sistema
                </p>
              </div>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <AddRoleModal
              isOpen={isAddModalOpen}
              onOpenChange={setIsAddModalOpen}
            />
            <AssignUserRoleModal
              open={isAssignUserRoleModalOpen}
              onOpenChange={setIsAssignUserRoleModalOpen}
            />
          </div>
        </div>

        {/* Stats Cards */}
        <RoleStatsCards roles={roles} />

        {/* Filters */}
        <RoleFilters searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {/* Roles Table */}
        <RolesTable
          roles={filteredRoles}
          isAdmin={isAdmin}
          isPending={deleteRole.isPending || updateRole.isPending}
          onEditRole={handleEditRole}
          onDeleteRole={handleDeleteRole}
          onViewRole={handleViewRole}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />

        {/* Edit Role Modal */}
        <EditRoleModal
          isOpen={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          role={selectedRole}
        />

        {/* Delete Role Modal */}
        <DeleteRoleModal
          isOpen={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          role={selectedRole}
          isPending={deleteRole.isPending}
          onConfirm={confirmDeleteRole}
          onCancel={cancelDeleteRole}
        />
      </div>
    </div>
  );
}
