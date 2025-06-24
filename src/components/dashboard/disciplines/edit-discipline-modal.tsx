'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Discipline } from '@/types/discipline';
import { EditDisciplineForm } from './edit-discipline-form';

interface EditDisciplineModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  discipline: Discipline;
  onEdit: (data: Partial<Discipline>) => void;
  isPending: boolean;
}

export function EditDisciplineModal({
  isOpen,
  onOpenChange,
  discipline,
  onEdit,
  isPending,
}: EditDisciplineModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Editar Disciplina</DialogTitle>
        </DialogHeader>
        <EditDisciplineForm
          discipline={discipline}
          onEdit={onEdit}
          isPending={isPending}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
