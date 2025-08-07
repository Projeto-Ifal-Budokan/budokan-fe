import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TableCell, TableRow } from '@/components/ui/table';
import { useManageDisciplines } from '@/lib/api/queries/use-manage-disciplines';
import { useManageRankings } from '@/lib/api/queries/use-manage-rankings';
import { Discipline, UpdateDisciplineData } from '@/types/discipline';
import { Award, Edit, Eye, MoreHorizontal, Users } from 'lucide-react';
import { useState } from 'react';
import { DeleteDisciplineModal } from './delete-discipline-modal';
import { EditDisciplineModal } from './edit-discipline-modal';

interface DisciplineTableRowProps {
  discipline: Discipline;
  isAdmin: boolean;
  isPending: boolean;
  onStatusChange: (discipline: Discipline, newStatus: string) => void;
  onViewDiscipline: (disciplineId: number) => void;
  getStatusColor: (status: string) => 'default' | 'secondary' | 'destructive';
  getStatusText: (status: string) => string;
}

export function DisciplineTableRow({
  discipline,
  isAdmin,
  isPending,
  onStatusChange,
  onViewDiscipline,
  getStatusColor,
  getStatusText,
}: DisciplineTableRowProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { updateDiscipline, deleteDiscipline } = useManageDisciplines();
  const { useRankings } = useManageRankings();
  const { data: ranks } = useRankings(1, 1000, {
    disciplineId: discipline.id,
  });

  const handleEdit = async (disciplineData: Partial<Discipline>) => {
    await updateDiscipline.mutateAsync(disciplineData as UpdateDisciplineData);
    setShowEditModal(false);
  };

  const handleDelete = async () => {
    await deleteDiscipline.mutateAsync(String(discipline.id));
    setShowDeleteModal(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <>
      <TableRow className='border-b border-gray-100 transition-colors hover:bg-gray-50/50'>
        <TableCell className='py-4'>
          <div className='flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100'>
              <Award className='h-5 w-5 text-emerald-600' />
            </div>
            <div>
              <div className='font-semibold text-gray-900'>
                {discipline.name}
              </div>
            </div>
          </div>
        </TableCell>

        <TableCell className='py-4'>
          <div className='max-w-xs'>
            <p className='line-clamp-2 text-sm text-gray-600'>
              {discipline.description}
            </p>
          </div>
        </TableCell>

        <TableCell className='py-4'>
          <div className='flex items-center gap-2'>
            {isAdmin ? (
              <Select
                value={discipline.status}
                onValueChange={(newStatus) =>
                  onStatusChange(discipline, newStatus)
                }
                disabled={isPending}
              >
                <SelectTrigger className='h-9 w-32 border-gray-200'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='active'>Ativo</SelectItem>
                  <SelectItem value='inactive'>Inativo</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge
                variant={getStatusColor(discipline.status)}
                className='px-3 py-1'
              >
                {getStatusText(discipline.status)}
              </Badge>
            )}
          </div>
        </TableCell>

        <TableCell className='py-4'>
          <div className='flex items-center gap-2 text-sm text-gray-600'>
            <Award className='h-4 w-4' />
            <span>{ranks?.data.count || 0}</span>
          </div>
        </TableCell>

        <TableCell className='py-4'>
          <div className='flex items-center gap-2 text-sm text-gray-600'>
            <Users className='h-4 w-4' />
            {/* <span>{ranks?.data.count || 0}</span> */}
          </div>
        </TableCell>

        <TableCell className='py-4'>
          <span className='text-sm text-gray-600'>
            {formatDate(discipline.createdAt)}
          </span>
        </TableCell>

        <TableCell className='py-4 text-right'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                size='sm'
                className='h-9 w-9 hover:bg-gray-100'
              >
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-48'>
              <DropdownMenuItem
                onClick={() => onViewDiscipline(discipline.id)}
                className='cursor-pointer'
              >
                <Eye className='mr-2 h-4 w-4' />
                Visualizar
              </DropdownMenuItem>
              {isAdmin && (
                <>
                  <DropdownMenuItem
                    onClick={() => setShowEditModal(true)}
                    className='cursor-pointer'
                  >
                    <Edit className='mr-2 h-4 w-4' />
                    Editar
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem
                    onClick={() => setShowDeleteModal(true)}
                    className='text-destructive cursor-pointer'
                  >
                    <Trash2 className='mr-2 h-4 w-4' />
                    Excluir
                  </DropdownMenuItem> */}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      {/* Modals */}
      <EditDisciplineModal
        isOpen={showEditModal}
        onOpenChange={setShowEditModal}
        discipline={discipline}
        onEdit={handleEdit}
        isPending={updateDiscipline.isPending}
      />

      <DeleteDisciplineModal
        isOpen={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        discipline={discipline}
        onDelete={handleDelete}
        isPending={deleteDiscipline.isPending}
      />
    </>
  );
}
