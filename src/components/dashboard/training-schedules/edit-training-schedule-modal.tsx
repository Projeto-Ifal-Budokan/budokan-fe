'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TrainingSchedule } from '@/lib/api/services/training-schedules-service';
import { EditTrainingScheduleForm } from './edit-training-schedule-form';

interface EditTrainingScheduleModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  trainingSchedule: TrainingSchedule;
  onEdit: (data: Partial<TrainingSchedule>) => void;
  isPending: boolean;
  isAdmin: boolean;
}

export function EditTrainingScheduleModal({
  isOpen,
  onOpenChange,
  trainingSchedule,
  onEdit,
  isPending,
  isAdmin,
}: EditTrainingScheduleModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>Editar Horário de Treino</DialogTitle>
        </DialogHeader>
        <EditTrainingScheduleForm
          trainingSchedule={trainingSchedule}
          onEdit={onEdit}
          onCancel={() => onOpenChange(false)}
          isPending={isPending}
          isAdmin={isAdmin}
        />
      </DialogContent>
    </Dialog>
  );
}
