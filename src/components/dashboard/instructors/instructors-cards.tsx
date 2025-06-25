'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TablePagination } from '@/components/ui/table-pagination';
import { InstructorDiscipline } from '@/types/instructor';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Edit,
  Eye,
  GraduationCap,
  Heart,
  MoreHorizontal,
  Star,
  Trash2,
  UserCheck,
  UserMinus,
  Users as UsersIcon,
} from 'lucide-react';

interface InstructorsCardsProps {
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

export function InstructorsCards({
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
}: InstructorsCardsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getInitials = (fullName: string) => {
    const names = fullName.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return {
          variant: 'default' as const,
          color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          icon: <Heart className='h-3 w-3 fill-current' />,
          text: 'Ativo',
        };
      case 'inactive':
        return {
          variant: 'secondary' as const,
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <UserMinus className='h-3 w-3' />,
          text: 'Inativo',
        };
      case 'on_leave':
        return {
          variant: 'destructive' as const,
          color: 'bg-amber-100 text-amber-800 border-amber-200',
          icon: <Clock className='h-3 w-3' />,
          text: 'Em Licença',
        };
      default:
        return {
          variant: 'secondary' as const,
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <UserMinus className='h-3 w-3' />,
          text: 'Inativo',
        };
    }
  };

  const getDisciplineColor = (disciplineName: string) => {
    const colors = [
      'bg-blue-50 text-blue-700 border-blue-200',
      'bg-purple-50 text-purple-700 border-purple-200',
      'bg-green-50 text-green-700 border-green-200',
      'bg-orange-50 text-orange-700 border-orange-200',
      'bg-pink-50 text-pink-700 border-pink-200',
      'bg-indigo-50 text-indigo-700 border-indigo-200',
    ];
    const index = disciplineName.length % colors.length;
    return colors[index];
  };

  if (instructors.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className='border-2 border-dashed border-gray-200 bg-gray-50/50'>
          <CardContent className='py-24 text-center'>
            <div className='mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200'>
              <UsersIcon className='h-8 w-8 text-gray-400' />
            </div>
            <h3 className='mb-3 text-xl font-semibold text-gray-900'>
              Nenhum instrutor encontrado
            </h3>
            <p className='mx-auto mb-6 max-w-md text-gray-600'>
              Não há instrutores que correspondam aos filtros aplicados. Tente
              ajustar os critérios de busca.
            </p>
            <Button variant='outline' className='shadow-sm'>
              <Eye className='mr-2 h-4 w-4' />
              Limpar Filtros
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className='space-y-8'>
      <motion.div
        className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, staggerChildren: 0.1 }}
      >
        {instructors.map((instructor, index) => {
          const statusConfig = getStatusConfig(instructor.status);
          const disciplineColor = getDisciplineColor(instructor.disciplineName);

          return (
            <motion.div
              key={instructor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <Card className='group relative overflow-hidden border-0 bg-white shadow-md ring-1 ring-gray-100 transition-all duration-300 hover:shadow-xl hover:ring-gray-200'>
                {/* Gradient overlay */}
                <div className='absolute inset-0 bg-gradient-to-br from-white via-white to-gray-50/30 opacity-60' />

                <CardContent className='relative p-6'>
                  {/* Header with avatar and actions */}
                  <div className='mb-4 flex items-start justify-between'>
                    <div className='flex items-center gap-4'>
                      <div className='relative'>
                        <Avatar className='h-14 w-14 shadow-md ring-2 ring-white'>
                          <AvatarFallback className='bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-semibold text-white'>
                            {getInitials(instructor.instructorName)}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute -right-1 -bottom-1 h-5 w-5 rounded-full ${statusConfig.color} flex items-center justify-center border-2 border-white`}
                        >
                          {statusConfig.icon}
                        </div>
                      </div>
                      <div className='min-w-0 flex-1'>
                        <h3 className='mb-1 truncate text-lg leading-tight font-semibold text-gray-900'>
                          {instructor.instructorName}
                        </h3>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-8 w-8 p-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:bg-gray-100'
                        >
                          <MoreHorizontal className='h-4 w-4' />
                          <span className='sr-only'>Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end' className='w-56'>
                        <DropdownMenuItem
                          onClick={() => onViewInstructor(instructor.id)}
                          className='cursor-pointer'
                        >
                          <Eye className='mr-2 h-4 w-4' />
                          Visualizar Detalhes
                        </DropdownMenuItem>

                        {isAdmin && (
                          <>
                            <DropdownMenuItem className='cursor-pointer'>
                              <Edit className='mr-2 h-4 w-4' />
                              Editar Informações
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            {instructor.status !== 'active' && (
                              <DropdownMenuItem
                                onClick={() =>
                                  onStatusChange(instructor, 'active')
                                }
                                className='cursor-pointer text-green-600 focus:text-green-600'
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
                                className='cursor-pointer text-orange-600 focus:text-orange-600'
                              >
                                <UserMinus className='mr-2 h-4 w-4' />
                                Desativar Instrutor
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuSeparator />

                            <DropdownMenuItem className='cursor-pointer text-red-600 focus:text-red-600'>
                              <Trash2 className='mr-2 h-4 w-4' />
                              Excluir Instrutor
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Content */}
                  <div className='space-y-4'>
                    {/* Discipline and Rank */}
                    <div className='flex items-center gap-2'>
                      <div
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${disciplineColor}`}
                      >
                        <GraduationCap className='h-3 w-3' />
                        {instructor.disciplineName}
                      </div>
                    </div>

                    {/* Details */}
                    <div className='space-y-3'>
                      <div className='flex items-center gap-3 text-sm text-gray-600'>
                        <div className='flex min-w-0 flex-1 items-center gap-1.5'>
                          <Star className='h-4 w-4 flex-shrink-0 text-yellow-500' />
                          <span className='truncate'>
                            <span className='font-medium'>Graduação:</span>{' '}
                            {instructor.rankName}
                          </span>
                        </div>
                      </div>

                      <div className='flex items-center gap-3 text-sm text-gray-600'>
                        <div className='flex min-w-0 flex-1 items-center gap-1.5'>
                          <UsersIcon className='h-4 w-4 flex-shrink-0 text-blue-500' />
                          <span className='truncate'>
                            <span className='font-medium'>Instrutor ID:</span>{' '}
                            {instructor.idInstructor}
                          </span>
                        </div>
                      </div>

                      <div className='flex items-center gap-3 text-sm text-gray-600'>
                        <div className='flex min-w-0 flex-1 items-center gap-1.5'>
                          <Calendar className='h-4 w-4 flex-shrink-0 text-green-500' />
                          <span className='truncate'>
                            <span className='font-medium'>Cadastrado:</span>{' '}
                            {formatDate(instructor.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className='flex items-center justify-between border-t border-gray-100 pt-4'>
                      <Badge
                        className={`${statusConfig.color} border px-2.5 py-1 text-xs font-medium`}
                      >
                        <span className='flex items-center gap-1.5'>
                          {statusConfig.icon}
                          {statusConfig.text}
                        </span>
                      </Badge>

                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => onViewInstructor(instructor.id)}
                        className='text-xs shadow-sm transition-shadow duration-200 hover:shadow-md'
                      >
                        <Eye className='mr-1.5 h-3.5 w-3.5' />
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Enhanced Pagination */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </motion.div>
    </div>
  );
}
