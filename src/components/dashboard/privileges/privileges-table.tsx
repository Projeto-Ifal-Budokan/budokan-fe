'use client';

import { Badge } from '@/components/ui/badge';
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
import { Privilege } from '@/types/user';
import {
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  Info,
  Key,
  Lock,
  Shield,
  Trophy,
  UserPlus,
  Users,
} from 'lucide-react';
import { Fragment } from 'react';

interface PrivilegesTableProps {
  privileges: Privilege[];
  privilegesByCategory: Record<string, Privilege[]>;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function PrivilegesTable({
  privileges,
  privilegesByCategory,
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PrivilegesTableProps) {
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'list':
      case 'view':
        return <Eye className='h-4 w-4' />;
      case 'create':
      case 'update':
      case 'delete':
        return <Key className='h-4 w-4' />;
      case 'user':
      case 'users':
        return <Users className='h-4 w-4' />;
      case 'role':
      case 'roles':
        return <Shield className='h-4 w-4' />;
      case 'privilege':
      case 'privileges':
        return <Lock className='h-4 w-4' />;
      case 'discipline':
      case 'disciplines':
        return <BookOpen className='h-4 w-4' />;
      case 'rank':
      case 'ranks':
        return <Trophy className='h-4 w-4' />;
      case 'matriculation':
      case 'matriculations':
        return <UserPlus className='h-4 w-4' />;
      case 'instructor':
      case 'instructors':
        return <Users className='h-4 w-4' />;
      case 'attendance':
        return <Calendar className='h-4 w-4' />;
      default:
        return <Key className='h-4 w-4' />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'list':
        return 'bg-blue-100 text-blue-800';
      case 'view':
        return 'bg-green-100 text-green-800';
      case 'create':
        return 'bg-purple-100 text-purple-800';
      case 'update':
        return 'bg-yellow-100 text-yellow-800';
      case 'delete':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrivilegeName = (name: string) => {
    return name
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const getPrivilegeDescription = (name: string) => {
    const parts = name.split('_');
    const action = parts[0];
    const resource = parts.slice(1).join(' ');

    const actionDescriptions: Record<string, string> = {
      list: 'Permite listar',
      view: 'Permite visualizar',
      create: 'Permite criar',
      update: 'Permite atualizar',
      delete: 'Permite excluir',
    };

    const resourceDescriptions: Record<string, string> = {
      users: 'usuários',
      user: 'usuário',
      roles: 'papéis',
      role: 'papel',
      privileges: 'privilégios',
      privilege: 'privilégio',
      disciplines: 'modalidades',
      discipline: 'modalidade',
      ranks: 'graduações',
      rank: 'graduação',
      matriculations: 'matrículas',
      matriculation: 'matrícula',
      'instructor disciplines': 'disciplinas do instrutor',
      'instructor discipline': 'disciplina do instrutor',
      'user roles': 'papéis do usuário',
      'role privileges': 'privilégios do papel',
    };

    const actionDesc = actionDescriptions[action] || action;
    const resourceDesc = resourceDescriptions[resource] || resource;

    return `${actionDesc} ${resourceDesc}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Key className='h-5 w-5' />
          Lista de Privilégios
        </CardTitle>
        <CardDescription>
          Todos os privilégios do sistema organizados por categoria. Os
          privilégios são definidos pelo sistema e não podem ser modificados.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          {/* Info Alert */}
          <div className='flex items-start space-x-3 rounded-lg border border-blue-200 bg-blue-50/50 p-4'>
            <Info className='mt-0.5 h-5 w-5 text-blue-600' />
            <div className='space-y-1'>
              <p className='text-sm font-medium text-blue-900'>
                Informação sobre Privilégios
              </p>
              <p className='text-sm text-blue-700'>
                Os privilégios são definidos automaticamente pelo sistema e
                controlam o acesso às diferentes funcionalidades. Eles não podem
                ser criados, editados ou excluídos pelos usuários.
              </p>
            </div>
          </div>

          {/* Privileges organized by category with single table */}
          <div className='rounded-lg border'>
            <div className='max-h-[600px] overflow-y-auto'>
              <Table>
                <TableHeader className='sticky top-0 z-20 bg-white'>
                  <TableRow>
                    <TableHead className='w-[30%]'>
                      Nome do Privilégio
                    </TableHead>
                    <TableHead className='w-[25%]'>Identificador</TableHead>
                    <TableHead className='w-[35%]'>Descrição</TableHead>
                    <TableHead className='w-[10%]'>Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(privilegesByCategory).map(
                    ([category, categoryPrivileges]) => (
                      <Fragment key={category}>
                        {/* Category Separator Row */}
                        <TableRow className='bg-gray-50/50'>
                          <TableCell colSpan={4} className='py-4'>
                            <div className='flex items-center gap-2'>
                              {getCategoryIcon(category)}
                              <h3 className='text-lg font-semibold capitalize'>
                                {category.replace('_', ' ')}
                              </h3>
                              <Badge variant='secondary'>
                                {categoryPrivileges.length} privilégios
                              </Badge>
                            </div>
                          </TableCell>
                        </TableRow>

                        {/* Category Privileges */}
                        {categoryPrivileges.map((privilege) => {
                          const action = privilege.name.split('_')[0];
                          return (
                            <TableRow key={privilege.id}>
                              <TableCell className='font-medium'>
                                <div className='flex items-center gap-2'>
                                  {getCategoryIcon(action)}
                                  {formatPrivilegeName(privilege.name)}
                                </div>
                              </TableCell>
                              <TableCell>
                                <code className='rounded bg-gray-100 px-2 py-1 text-sm'>
                                  {privilege.name}
                                </code>
                              </TableCell>
                              <TableCell>
                                <span className='text-sm text-gray-600'>
                                  {privilege.description ||
                                    getPrivilegeDescription(privilege.name)}
                                </span>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={getCategoryColor(action)}
                                  variant='secondary'
                                >
                                  {action.toUpperCase()}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </Fragment>
                    )
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className='sticky bottom-0 flex items-center justify-between border-t bg-white/95 py-3 backdrop-blur-sm'>
              <div className='flex items-center space-x-2'>
                <span className='text-sm text-gray-700'>
                  Mostrando{' '}
                  {Math.min((currentPage - 1) * pageSize + 1, totalItems)} a{' '}
                  {Math.min(currentPage * pageSize, totalItems)} de {totalItems}{' '}
                  privilégios
                </span>
              </div>

              <div className='flex items-center space-x-2'>
                <Select
                  value={pageSize.toString()}
                  onValueChange={(value) => onPageSizeChange(Number(value))}
                >
                  <SelectTrigger className='w-[70px]'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='5'>5</SelectItem>
                    <SelectItem value='10'>10</SelectItem>
                    <SelectItem value='20'>20</SelectItem>
                    <SelectItem value='50'>50</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className='h-4 w-4' />
                  Anterior
                </Button>

                <span className='text-sm text-gray-700'>
                  Página {currentPage} de {totalPages}
                </span>

                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Próxima
                  <ChevronRight className='h-4 w-4' />
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
