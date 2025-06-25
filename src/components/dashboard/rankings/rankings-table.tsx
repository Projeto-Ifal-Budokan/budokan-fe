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
import { Ranking } from '@/types/ranking';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { RankingTableRow } from './ranking-table-row';

interface RankingsTableProps {
  rankings: Ranking[];
  isAdmin: boolean;
  isPending: boolean;
  onStatusChange: (ranking: Ranking, newStatus: string) => void;
  onViewRanking: (rankingId: number) => void;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function RankingsTable({
  rankings,
  isAdmin,
  isPending,
  onStatusChange,
  onViewRanking,
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: RankingsTableProps) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <Card className='shadow-sm'>
      <CardHeader>
        <CardTitle className='text-xl font-semibold text-gray-900'>
          Rankings Cadastrados
        </CardTitle>
      </CardHeader>
      <CardContent className='p-1'>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow className='bg-gray-50/50'>
                <TableHead className='font-semibold text-gray-700'>
                  Nome
                </TableHead>
                <TableHead className='font-semibold text-gray-700'>
                  Modalidade
                </TableHead>
                <TableHead className='font-semibold text-gray-700'>
                  Graduação
                </TableHead>
                <TableHead className='font-semibold text-gray-700'>
                  Status
                </TableHead>
                <TableHead className='font-semibold text-gray-700'>
                  Alunos
                </TableHead>
                <TableHead className='font-semibold text-gray-700'>
                  Criado em
                </TableHead>
                <TableHead className='text-right font-semibold text-gray-700'>
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rankings.length === 0 ? (
                <TableRow>
                  <td colSpan={7} className='py-12 text-center'>
                    <div className='text-gray-500'>
                      <p className='text-lg font-medium'>
                        Nenhum ranking encontrado
                      </p>
                      <p className='text-sm'>
                        Tente ajustar os filtros ou adicione um novo ranking
                      </p>
                    </div>
                  </td>
                </TableRow>
              ) : (
                rankings.map((ranking) => (
                  <RankingTableRow
                    key={ranking.id}
                    ranking={ranking}
                    isAdmin={isAdmin}
                    isPending={isPending}
                    onStatusChange={onStatusChange}
                    onViewRanking={onViewRanking}
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
