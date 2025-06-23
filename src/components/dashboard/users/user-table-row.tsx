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
  return (
    <TableRow
      key={user.id}
      className={`border-b border-gray-100 transition-colors hover:bg-gray-50/50 ${
        index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
      }`}
    >
      <TableCell className='py-4'>
        <div className='flex items-center gap-4'>
          <Avatar className='h-10 w-10 ring-2 ring-gray-100'>
            <AvatarImage alt={user.firstName} />
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
            <Badge variant={getStatusColor(user.status)} className='px-3 py-1'>
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
                <DropdownMenuItem className='cursor-pointer'>
                  <Edit className='mr-2 h-4 w-4' />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem className='cursor-pointer'>
                  <Key className='mr-2 h-4 w-4' />
                  Redefinir Senha
                </DropdownMenuItem>
                <DropdownMenuItem className='text-destructive cursor-pointer'>
                  <Trash2 className='mr-2 h-4 w-4' />
                  Excluir
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
