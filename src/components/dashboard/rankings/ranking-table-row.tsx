'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TableCell, TableRow } from '@/components/ui/table';
import { Ranking } from '@/types/ranking';
import { Edit, Eye, MoreHorizontal, Trash2, Users } from 'lucide-react';

interface RankingTableRowProps {
  ranking: Ranking;
  isAdmin: boolean;
  isPending: boolean;
  onStatusChange: (ranking: Ranking, newStatus: string) => void;
  onViewRanking: (rankingId: number) => void;
}

export function RankingTableRow({
  ranking,
  isAdmin,
  isPending,
  onStatusChange,
  onViewRanking,
}: RankingTableRowProps) {
  const getBeltColor = (description: string) => {
    const colorMap: { [key: string]: string } = {
      'Faixa Branca': 'bg-gray-100 text-gray-800',
      'Faixa Amarela': 'bg-yellow-100 text-yellow-800',
      'Faixa Laranja': 'bg-orange-100 text-orange-800',
      'Faixa Verde': 'bg-green-100 text-green-800',
      'Faixa Roxa': 'bg-purple-100 text-purple-800',
      'Faixa Marrom': 'bg-amber-100 text-amber-800',
      'Faixa Preta': 'bg-gray-900 text-white',
      'Faixa Azul': 'bg-blue-100 text-blue-800',
    };
    return colorMap[description] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'inactive':
        return 'Inativo';
      default:
        return 'Inativo';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Mock student count - in real app, this would come from API
  const studentCount = Math.floor(Math.random() * 50) + 1;

  return (
    <TableRow className='hover:bg-gray-50'>
      <TableCell className='py-4'>
        <div className='flex flex-col'>
          <span className='font-medium text-gray-900'>{ranking.name}</span>
          {ranking.description && (
            <span className='line-clamp-1 text-sm text-gray-500'>
              {ranking.description}
            </span>
          )}
        </div>
      </TableCell>

      <TableCell className='py-4'>
        <span className='text-gray-900'>{ranking.disciplineName}</span>
      </TableCell>

      <TableCell className='py-4'>
        <Badge className={`${getBeltColor(ranking.description)} border-0`}>
          {ranking.description}
        </Badge>
      </TableCell>

      {/* <TableCell className='py-4'>
        <Badge variant={getStatusColor(ranking.status || 'inactive')}>
          {getStatusText(ranking.status || 'inactive')}
        </Badge>
      </TableCell> */}

      <TableCell className='py-4'>
        <div className='flex items-center gap-2 text-sm text-gray-600'>
          <Users className='h-4 w-4' />
          <span>{studentCount}</span>
        </div>
      </TableCell>

      <TableCell className='py-4'>
        <span className='text-sm text-gray-600'>
          {formatDate(ranking.createdAt)}
        </span>
      </TableCell>

      <TableCell className='py-4 text-right'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              className='h-8 w-8 p-0'
              disabled={isPending}
            >
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={() => onViewRanking(ranking.id)}>
              <Eye className='mr-2 h-4 w-4' />
              Visualizar
            </DropdownMenuItem>
            {isAdmin && (
              <>
                <DropdownMenuItem
                  onClick={() => {
                    // Handle edit - would open edit modal
                    console.log('Edit ranking:', ranking.id);
                  }}
                >
                  <Edit className='mr-2 h-4 w-4' />
                  Editar
                </DropdownMenuItem>
                {/* <DropdownMenuItem
                  onClick={() =>
                    onStatusChange(
                      ranking,
                      ranking.status === 'active' ? 'inactive' : 'active'
                    )
                  }
                  className='text-orange-600'
                >
                  <Edit className='mr-2 h-4 w-4' />
                  {ranking.status === 'active' ? 'Desativar' : 'Ativar'}
                </DropdownMenuItem> */}
                <DropdownMenuItem
                  onClick={() => {
                    // Handle delete - would open delete confirmation
                    console.log('Delete ranking:', ranking.id);
                  }}
                  className='text-red-600'
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
