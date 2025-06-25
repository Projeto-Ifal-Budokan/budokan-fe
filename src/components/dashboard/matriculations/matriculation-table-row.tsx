'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TableCell, TableRow } from '@/components/ui/table';
import { Matriculation } from '@/types/matriculation';
import { formatDate } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { Eye, GraduationCap, MoreVertical, Pause, Play } from 'lucide-react';

interface MatriculationTableRowProps {
  matriculation: Matriculation;
  isAdmin: boolean;
  isPending: boolean;
  onStatusChange: (matriculation: Matriculation, newStatus: string) => void;
  onViewMatriculation: (matriculationId: number) => void;
  getStatusColor: (status: string) => 'default' | 'secondary' | 'destructive';
  getStatusText: (status: string) => string;
  getTypeText: (type: string) => string;
  getTypeColor: (type: string) => string;
}

export function MatriculationTableRow({
  matriculation,
  isAdmin,
  isPending,
  onStatusChange,
  onViewMatriculation,
  getStatusColor,
  getStatusText,
  getTypeText,
  getTypeColor,
}: MatriculationTableRowProps) {
  const canChangeStatus = isAdmin && matriculation.status !== 'graduated';
  const canGraduate =
    isAdmin &&
    matriculation.type === 'student' &&
    matriculation.status === 'active';

  return (
    <TableRow className='hover:bg-gray-50/50'>
      <TableCell>
        <div className='flex flex-col'>
          <span className='font-medium text-gray-900'>
            {matriculation.userName}
          </span>
          <span className='text-sm text-gray-500'>
            {matriculation.userEmail}
          </span>
        </div>
      </TableCell>

      <TableCell>
        <Badge
          variant='outline'
          className={`bg-${getTypeColor(matriculation.type)}-50 text-${getTypeColor(matriculation.type)}-700 border-${getTypeColor(matriculation.type)}-200`}
        >
          {getTypeText(matriculation.type)}
        </Badge>
      </TableCell>

      <TableCell>
        <span className='font-medium text-gray-900'>
          {matriculation.disciplineName}
        </span>
      </TableCell>

      <TableCell>
        <span className='text-gray-900'>{matriculation.rankName}</span>
      </TableCell>

      <TableCell>
        <Badge variant={getStatusColor(matriculation.status)}>
          {getStatusText(matriculation.status)}
        </Badge>
      </TableCell>

      <TableCell>
        <Badge
          variant={matriculation.isPaymentExempt ? 'secondary' : 'outline'}
        >
          {matriculation.isPaymentExempt ? 'Isento' : 'Pago'}
        </Badge>
      </TableCell>

      <TableCell>
        <span className='text-gray-600'>
          {formatDate(new Date(matriculation.createdAt), 'dd/MM/yyyy', {
            locale: ptBR,
          })}
        </span>
      </TableCell>

      <TableCell className='text-right'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              size='sm'
              className='h-8 w-8 p-0'
              disabled={isPending}
            >
              <MoreVertical className='h-4 w-4' />
              <span className='sr-only'>Abrir menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem
              onClick={() => onViewMatriculation(matriculation.id)}
            >
              <Eye className='mr-2 h-4 w-4' />
              Visualizar
            </DropdownMenuItem>

            {canChangeStatus && (
              <>
                <DropdownMenuSeparator />
                {matriculation.status === 'active' ? (
                  <DropdownMenuItem
                    onClick={() => onStatusChange(matriculation, 'inactive')}
                    className='text-red-600'
                  >
                    <Pause className='mr-2 h-4 w-4' />
                    Desativar
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={() => onStatusChange(matriculation, 'active')}
                    className='text-green-600'
                  >
                    <Play className='mr-2 h-4 w-4' />
                    Ativar
                  </DropdownMenuItem>
                )}
              </>
            )}

            {canGraduate && (
              <DropdownMenuItem
                onClick={() => onStatusChange(matriculation, 'graduated')}
                className='text-yellow-600'
              >
                <GraduationCap className='mr-2 h-4 w-4' />
                Graduar
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
