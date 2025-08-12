'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MatriculationTableRow } from './matriculation-table-row';

// Update the interface to match our unified enrollment
interface UnifiedEnrollment {
  id: number;
  idStudent?: number;
  idInstructor?: number;
  idDiscipline: number;
  idRank: number;
  type: 'student' | 'instructor';
  status: 'active' | 'inactive' | 'graduated';
  paymentExempt?: boolean;
  isPaymentExempt?: boolean;
  activatedBy?: number | null;
  inactivatedBy?: number | null;
  createdAt: string;
  updatedAt: string;
  userName: string;
  userEmail?: string;
  disciplineName: string;
  rankName: string;
  source: 'matriculation' | 'instructor-discipline';
}

interface MatriculationsTableProps {
  matriculations: UnifiedEnrollment[];
  isAdmin: boolean;
  isPending: boolean;
  onStatusChange: (matriculation: UnifiedEnrollment, newStatus: string) => void;
  onViewMatriculation: (matriculationId: number) => void;
  getStatusColor: (status: string) => 'default' | 'secondary' | 'destructive';
  getStatusText: (status: string) => string;
  getTypeText: (type: string) => string;
  getTypeColor: (type: string) => string;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function MatriculationsTable({
  matriculations,
  isAdmin,
  isPending,
  onStatusChange,
  onViewMatriculation,
  getStatusColor,
  getStatusText,
  getTypeText,
  getTypeColor,
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: MatriculationsTableProps) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <Card className='shadow-sm'>
      <CardHeader>
        <CardTitle className='text-xl font-semibold text-gray-900'>
          Matrículas Cadastradas
        </CardTitle>
      </CardHeader>
      <CardContent className='p-1'>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow className='bg-gray-50/50'>
                <TableHead className='font-semibold text-gray-700'>
                  Usuário
                </TableHead>
                <TableHead className='font-semibold text-gray-700'>
                  Tipo
                </TableHead>
                <TableHead className='font-semibold text-gray-700'>
                  Disciplina
                </TableHead>
                <TableHead className='font-semibold text-gray-700'>
                  Rank
                </TableHead>
                <TableHead className='font-semibold text-gray-700'>
                  Status
                </TableHead>
                {/* <TableHead className='font-semibold text-gray-700'>
                  Pagamento
                </TableHead> */}
                <TableHead className='font-semibold text-gray-700'>
                  Criado em
                </TableHead>
                <TableHead className='text-right font-semibold text-gray-700'>
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matriculations.length === 0 ? (
                <TableRow>
                  <td colSpan={8} className='py-12 text-center'>
                    <div className='text-gray-500'>
                      <p className='text-lg font-medium'>
                        Nenhuma matrícula encontrada
                      </p>
                      <p className='text-sm'>
                        Tente ajustar os filtros ou adicione uma nova matrícula
                      </p>
                    </div>
                  </td>
                </TableRow>
              ) : (
                matriculations.map((matriculation) => (
                  <MatriculationTableRow
                    key={`${matriculation.source}-${matriculation.id}`}
                    matriculation={matriculation}
                    isAdmin={isAdmin}
                    isPending={isPending}
                    onStatusChange={onStatusChange}
                    onViewMatriculation={onViewMatriculation}
                    getStatusColor={getStatusColor}
                    getStatusText={getStatusText}
                    getTypeText={getTypeText}
                    getTypeColor={getTypeColor}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className='flex items-center justify-between border-t bg-gray-50/50 px-6 py-4'>
          <div className='flex items-center gap-2 text-sm text-gray-600'>
            <span>Mostrando</span>
            <span className='font-medium'>{startItem}</span>
            <span>a</span>
            <span className='font-medium'>{endItem}</span>
            <span>de</span>
            <span className='font-medium'>{totalItems}</span>
            <span>registros</span>
          </div>

          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2'>
              <span className='text-sm text-gray-600'>Itens por página:</span>
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => onPageSizeChange(Number(value))}
              >
                <SelectTrigger className='w-20'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='5'>5</SelectItem>
                  <SelectItem value='10'>10</SelectItem>
                  <SelectItem value='20'>20</SelectItem>
                  <SelectItem value='50'>50</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className='h-4 w-4' />
                Anterior
              </Button>

              <div className='flex items-center gap-1'>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                  if (page > totalPages) return null;

                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      size='sm'
                      onClick={() => onPageChange(page)}
                      className='w-8'
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>

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
        </div>
      </CardContent>
    </Card>
  );
}
