import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Role } from '@/types/user';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { RoleTableRow } from './role-table-row';

interface RolesTableProps {
  roles: Role[];
  isAdmin: boolean;
  isPending: boolean;
  onEditRole: (role: Role) => void;
  onDeleteRole: (role: Role) => void;
  onViewRole: (roleId: number) => void;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function RolesTable({
  roles,
  isAdmin,
  isPending,
  onEditRole,
  onDeleteRole,
  onViewRole,
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: RolesTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Papéis</CardTitle>
        <CardDescription>Gerencie todos os papéis do sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead className='text-right'>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className='text-center'>
                    Nenhum papel encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                roles.map((role) => (
                  <RoleTableRow
                    key={role.id}
                    role={role}
                    isAdmin={isAdmin}
                    isPending={isPending}
                    onEdit={onEditRole}
                    onDelete={onDeleteRole}
                    onView={onViewRole}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className='flex items-center justify-between space-x-2 py-4'>
          <div className='flex items-center space-x-2'>
            <p className='text-sm font-medium'>Linhas por página</p>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => onPageSizeChange(Number(value))}
            >
              <SelectTrigger className='h-8 w-[70px]'>
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent side='top'>
                {[10, 20, 30, 40, 50].map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='flex items-center space-x-6 lg:space-x-8'>
            <div className='flex w-[100px] items-center justify-center text-sm font-medium'>
              Página {currentPage} de {totalPages}
            </div>
            <div className='flex items-center space-x-2'>
              <Button
                variant='outline'
                className='h-8 w-8 p-0'
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                <span className='sr-only'>Página anterior</span>
                <ChevronLeft className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                className='h-8 w-8 p-0'
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                <span className='sr-only'>Próxima página</span>
                <ChevronRight className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
