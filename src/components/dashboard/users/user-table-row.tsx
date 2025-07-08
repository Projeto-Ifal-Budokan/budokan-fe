import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TableCell, TableRow } from '@/components/ui/table';
import { useAuth } from '@/lib/api/queries/use-auth';
import { useManageUsers } from '@/lib/api/queries/use-manage-users';
import { User } from '@/types/user';
import {
  Edit,
  Eye,
  Key,
  Mail,
  MoreHorizontal,
  Phone,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { DeleteUserModal } from './delete-user-modal';
import { EditUserModal } from './edit-user-modal';
import { ResetPasswordModal } from './reset-password-modal';

interface UserTableRowProps {
  user: User;
  index: number;
  isAdmin: boolean;
  isPending: boolean;
  onStatusChange: (user: User, newStatus: string) => void;
  onView: (userId: number) => void;

  getStatusColor: (status: string) => 'default' | 'secondary' | 'destructive';
  getStatusText: (status: string) => string;
}

export function UserTableRow({
  user,
  index,
  isAdmin,
  isPending,
  onStatusChange,
  onView,

  getStatusColor,
  getStatusText,
}: UserTableRowProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Use the hooks from use-manage-users that already have query invalidation
  const { updateUser, deleteUser } = useManageUsers();
  const { forgotPassword } = useAuth();

  const handleEdit = async (userData: Partial<User>) => {
    await updateUser.mutateAsync(userData as User);
    setShowEditModal(false);
  };

  const handleResetPassword = async () => {
    await forgotPassword.mutateAsync({ email: user.email });
    setShowResetPasswordModal(false);
  };

  const handleDelete = async () => {
    await deleteUser.mutateAsync(String(user.id));
    setShowDeleteModal(false);
  };

  return (
    <>
      <TableRow
        key={user.id}
        className={`border-b border-gray-100 transition-colors hover:bg-gray-50/50 ${
          index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
        }`}
      >
        <TableCell className='py-4'>
          <div className='flex items-center gap-4'>
            <Avatar className='h-10 w-10 ring-2 ring-gray-100'>
              <AvatarImage
                src={user.profileImageUrl}
                alt={user.firstName}
                className='object-cover'
              />
              <AvatarFallback className='bg-gradient-to-br from-blue-100 to-indigo-100 text-sm font-medium text-blue-700'>
                {user.firstName[0]}
                {user.surname[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className='font-semibold text-gray-900'>
                {user.firstName + ' ' + user.surname}
              </div>
              <div className='text-sm text-gray-500'>{user.email}</div>
            </div>
          </div>
        </TableCell>

        <TableCell className='py-4'>
          <div className='space-y-2'>
            <div className='flex items-center gap-2 text-sm'>
              <Mail className='h-4 w-4 text-gray-400' />
              <span className='text-gray-600'>{user.email}</span>
            </div>
            <div className='flex items-center gap-2 text-sm'>
              <Phone className='h-4 w-4 text-gray-400' />
              <span className='text-gray-600'>{user.phone}</span>
            </div>
          </div>
        </TableCell>

        <TableCell className='py-4'>
          <div className='flex items-center gap-2'>
            {isAdmin ? (
              <Select
                value={user.status}
                onValueChange={(newStatus) => onStatusChange(user, newStatus)}
                disabled={isPending}
              >
                <SelectTrigger className='h-9 w-32 border-gray-200'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='active'>Ativo</SelectItem>
                  <SelectItem value='inactive'>Inativo</SelectItem>
                  <SelectItem value='suspended'>Suspenso</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge
                variant={getStatusColor(user.status)}
                className='px-3 py-1'
              >
                {getStatusText(user.status)}
              </Badge>
            )}
          </div>
        </TableCell>

        <TableCell className='py-4'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                size='sm'
                className='h-9 w-9 hover:bg-gray-100'
              >
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-48'>
              <DropdownMenuItem
                onClick={() => onView(user.id)}
                className='cursor-pointer'
              >
                <Eye className='mr-2 h-4 w-4' />
                Visualizar
              </DropdownMenuItem>
              {isAdmin && (
                <>
                  <DropdownMenuItem
                    onClick={() => setShowEditModal(true)}
                    className='cursor-pointer'
                  >
                    <Edit className='mr-2 h-4 w-4' />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setShowResetPasswordModal(true)}
                    className='cursor-pointer'
                  >
                    <Key className='mr-2 h-4 w-4' />
                    Redefinir Senha
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setShowDeleteModal(true)}
                    className='text-destructive cursor-pointer'
                  >
                    <Trash2 className='mr-2 h-4 w-4' />
                    Excluir
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      {/* Modals */}
      <EditUserModal
        isOpen={showEditModal}
        onOpenChange={setShowEditModal}
        user={user}
        isPending={updateUser.isPending}
        onSave={handleEdit}
      />

      <ResetPasswordModal
        isOpen={showResetPasswordModal}
        onOpenChange={setShowResetPasswordModal}
        user={user}
        isPending={isPending}
        onConfirm={handleResetPassword}
      />

      <DeleteUserModal
        isOpen={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        user={user}
        isPending={deleteUser.isPending}
        onConfirm={handleDelete}
      />
    </>
  );
}
