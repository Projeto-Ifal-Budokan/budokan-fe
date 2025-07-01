import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TableCell, TableRow } from '@/components/ui/table';
import { useManageTrainingSchedules } from '@/lib/api/queries/use-manage-training-schedules';
import { TrainingSchedule } from '@/lib/api/services/training-schedules-service';
import { Calendar, Edit, MoreHorizontal, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { DeleteTrainingScheduleModal } from './delete-training-schedule-modal';
import { EditTrainingScheduleModal } from './edit-training-schedule-modal';

interface TrainingScheduleTableRowProps {
  trainingSchedule: TrainingSchedule;
  canManage: boolean;
  isAdmin: boolean;
  getWeekdayText: (weekday: string) => string;
  formatTime: (time: string) => string;
}

export function TrainingScheduleTableRow({
  trainingSchedule,
  canManage,
  isAdmin,
  getWeekdayText,
  formatTime,
}: TrainingScheduleTableRowProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { updateTrainingSchedule, deleteTrainingSchedule } =
    useManageTrainingSchedules();

  const handleEdit = async (scheduleData: Partial<TrainingSchedule>) => {
    await updateTrainingSchedule.mutateAsync(scheduleData);
    setShowEditModal(false);
  };

  const handleDelete = async () => {
    await deleteTrainingSchedule.mutateAsync(String(trainingSchedule.id));
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
            <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-purple-100'>
              <Calendar className='h-5 w-5 text-blue-600' />
            </div>
            <div>
              <div className='font-semibold text-gray-900'>
                {trainingSchedule.disciplineName}
              </div>
            </div>
          </div>
        </TableCell>

        <TableCell className='py-4'>
          <span className='text-sm font-medium text-gray-900'>
            {getWeekdayText(trainingSchedule.weekday)}
          </span>
        </TableCell>

        <TableCell className='py-4'>
          <span className='text-sm text-gray-600'>
            {formatTime(trainingSchedule.startTime)}
          </span>
        </TableCell>

        <TableCell className='py-4'>
          <span className='text-sm text-gray-600'>
            {formatTime(trainingSchedule.endTime)}
          </span>
        </TableCell>

        <TableCell className='py-4'>
          <span className='text-sm text-gray-600'>
            {formatDate(trainingSchedule.createdAt)}
          </span>
        </TableCell>

        <TableCell className='py-4 text-right'>
          {canManage && (
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
                  onClick={() => setShowEditModal(true)}
                  className='cursor-pointer'
                >
                  <Edit className='mr-2 h-4 w-4' />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowDeleteModal(true)}
                  className='text-destructive cursor-pointer'
                >
                  <Trash2 className='mr-2 h-4 w-4' />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </TableCell>
      </TableRow>

      {/* Modals */}
      <EditTrainingScheduleModal
        isOpen={showEditModal}
        onOpenChange={setShowEditModal}
        trainingSchedule={trainingSchedule}
        onEdit={handleEdit}
        isPending={updateTrainingSchedule.isPending}
        isAdmin={isAdmin}
      />

      <DeleteTrainingScheduleModal
        isOpen={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        trainingSchedule={trainingSchedule}
        onDelete={handleDelete}
        isPending={deleteTrainingSchedule.isPending}
      />
    </>
  );
}
