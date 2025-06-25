import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TablePagination } from '@/components/ui/table-pagination';

import { InstructorDiscipline } from '@/types/instructor';
import {
  Edit,
  Eye,
  MoreHorizontal,
  Trash2,
  UserCheck,
  UserMinus,
} from 'lucide-react';

interface InstructorsTableProps {
  instructors: InstructorDiscipline[];
  isAdmin: boolean;
  onStatusChange: (instructor: InstructorDiscipline, newStatus: string) => void;
  onViewInstructor: (instructorId: number) => void;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function InstructorsTable({
  instructors,
  isAdmin,
  onStatusChange,
  onViewInstructor,
  getStatusColor,
  getStatusText,
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: InstructorsTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getInitials = (fullName: string) => {
    const names = fullName.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
  };

  const getStatusVariant = (status: string) => {
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

  if (instructors.length === 0) {
    return (
      <Card>
        <CardContent className='py-16 text-center'>
          <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100'>
            <Eye className='h-6 w-6 text-gray-400' />
          </div>
          <h3 className='mb-2 text-lg font-semibold text-gray-900'>
            Nenhum instrutor encontrado
          </h3>
          <p className='mb-6 text-gray-600'>
            Não há instrutores que correspondam aos filtros aplicados.
          </p>
          <Button variant='outline'>Limpar Filtros</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle className='text-xl font-semibold text-gray-900'>
              Lista de Instrutores
            </CardTitle>
            <p className='mt-1 text-sm text-gray-600'>
              {totalItems} instructor{totalItems !== 1 ? 'es' : ''} encontrado
              {totalItems !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Instrutor</TableHead>
                <TableHead>Disciplina</TableHead>
                <TableHead>Graduação</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Cadastrado em</TableHead>
                <TableHead className='text-right'>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {instructors.map((instructor) => (
                <TableRow key={instructor.id} className='hover:bg-gray-50'>
                  <TableCell>
                    <div className='flex items-center gap-4'>
                      <Avatar className='h-10 w-10'>
                        <AvatarFallback className='bg-blue-100 font-medium text-blue-700'>
                          {getInitials(instructor.instructorName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className='font-semibold text-gray-900'>
                          {instructor.instructorName}
                        </div>
                        <div className='text-sm text-gray-600'>
                          ID: {instructor.id}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>{instructor.disciplineName}</TableCell>

                  <TableCell>{instructor.rankName}</TableCell>

                  <TableCell>
                    <Badge variant={getStatusVariant(instructor.status)}>
                      {getStatusText(instructor.status)}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <span className='text-sm text-gray-600'>
                      {formatDate(instructor.createdAt)}
                    </span>
                  </TableCell>

                  <TableCell className='text-right'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-8 w-8 p-0'
                        >
                          <MoreHorizontal className='h-4 w-4' />
                          <span className='sr-only'>Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end' className='w-56'>
                        <DropdownMenuItem
                          onClick={() => onViewInstructor(instructor.id)}
                        >
                          <Eye className='mr-2 h-4 w-4' />
                          Visualizar Detalhes
                        </DropdownMenuItem>

                        {isAdmin && (
                          <>
                            <DropdownMenuItem>
                              <Edit className='mr-2 h-4 w-4' />
                              Editar Informações
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            {instructor.status !== 'active' && (
                              <DropdownMenuItem
                                onClick={() =>
                                  onStatusChange(instructor, 'active')
                                }
                                className='text-green-600 focus:text-green-600'
                              >
                                <UserCheck className='mr-2 h-4 w-4' />
                                Ativar Instrutor
                              </DropdownMenuItem>
                            )}

                            {instructor.status !== 'inactive' && (
                              <DropdownMenuItem
                                onClick={() =>
                                  onStatusChange(instructor, 'inactive')
                                }
                                className='text-orange-600 focus:text-orange-600'
                              >
                                <UserMinus className='mr-2 h-4 w-4' />
                                Desativar Instrutor
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuSeparator />

                            <DropdownMenuItem className='text-red-600 focus:text-red-600'>
                              <Trash2 className='mr-2 h-4 w-4' />
                              Excluir Instrutor
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}
