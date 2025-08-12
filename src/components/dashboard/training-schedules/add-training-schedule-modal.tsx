'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Discipline } from '@/types/discipline';
import { AddTrainingScheduleForm } from './add-training-schedule-form';

interface AddTrainingScheduleModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isAdmin: boolean;
  userDisciplines: Discipline[];
  disciplineId?: string; // optional preselected discipline id for detail page usage
}

export function AddTrainingScheduleModal({
  isOpen,
  onOpenChange,
  isAdmin,
  userDisciplines,
  disciplineId,
}: AddTrainingScheduleModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>Adicionar Horário de Treino</DialogTitle>
        </DialogHeader>
        <AddTrainingScheduleForm
          onSuccess={() => onOpenChange(false)}
          isAdmin={isAdmin}
          userDisciplines={userDisciplines}
          disciplineId={disciplineId}
        />
      </DialogContent>
    </Dialog>
  );
}
