import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TableCell, TableRow } from '@/components/ui/table';
import { Role } from '@/types/user';
import { Edit3, Eye, MoreHorizontal, Trash2 } from 'lucide-react';

interface RoleTableRowProps {
  role: Role;
  isAdmin: boolean;
  isPending: boolean;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
  onView: (roleId: number) => void;
}

export function RoleTableRow({
  role,
  isAdmin,
  isPending,
  onEdit,
  onDelete,
  onView,
}: RoleTableRowProps) {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return 'Data inválida';
    }
  };

  return (
    <TableRow>
      <TableCell className='font-medium'>{role.name}</TableCell>
      <TableCell className='max-w-xs truncate'>{role.description}</TableCell>
      <TableCell>
        {/* Assuming there's a createdAt field, fallback to current date */}
        {formatDate(new Date().toISOString())}
      </TableCell>
      <TableCell className='text-right'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              className='h-8 w-8 p-0'
              disabled={isPending}
            >
              <span className='sr-only'>Abrir menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onView(role.id)}>
              <Eye className='mr-2 h-4 w-4' />
              Visualizar
            </DropdownMenuItem>
            {isAdmin && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onEdit(role)}>
                  <Edit3 className='mr-2 h-4 w-4' />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(role)}
                  className='text-destructive'
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
  );
}
