import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { User } from '@/types/user';
import { UserTableRow } from './user-table-row';

interface UsersTableProps {
  users: User[];
  isAdmin: boolean;
  isPending: boolean;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onStatusChange: (user: User, newStatus: string) => void;
  onViewUser: (userId: number) => void;
  getStatusColor: (status: string) => 'default' | 'secondary' | 'destructive';
  getStatusText: (status: string) => string;
}

export function UsersTable({
  users,
  isAdmin,
  isPending,
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onStatusChange,
  onViewUser,
  getStatusColor,
  getStatusText,
  onPageChange,
  onPageSizeChange,
}: UsersTableProps) {
  return (
    <Card className='border-0 bg-white/90 shadow-xl backdrop-blur-sm'>
      <CardHeader className='border-b'>
        <CardTitle className='text-xl font-semibold'>
          Lista de Usuários
        </CardTitle>
        <CardDescription className='text-base'>
          Gerencie todos os usuários do sistema com facilidade
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='max-h-96 overflow-y-auto'>
          <Table>
            <TableHeader className='sticky top-0 bg-gray-50/50'>
              <TableRow className='border-b border-gray-200'>
                <TableHead className='py-4 font-semibold text-gray-700'>
                  Usuário
                </TableHead>
                <TableHead className='py-4 font-semibold text-gray-700'>
                  Contato
                </TableHead>
                <TableHead className='py-4 font-semibold text-gray-700'>
                  Status
                </TableHead>
                <TableHead className='py-4 font-semibold text-gray-700'>
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, index) => (
                <UserTableRow
                  key={user.id}
                  user={user}
                  index={index}
                  isAdmin={isAdmin}
                  isPending={isPending}
                  onStatusChange={onStatusChange}
                  onView={onViewUser}
                  getStatusColor={getStatusColor}
                  getStatusText={getStatusText}
                />
              ))}
            </TableBody>
          </Table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </CardContent>
    </Card>
  );
}
