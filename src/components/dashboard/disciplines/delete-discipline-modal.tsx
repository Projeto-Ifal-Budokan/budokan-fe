'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Discipline } from '@/types/discipline';

import { AlertTriangle, Loader2 } from 'lucide-react';

interface DeleteDisciplineModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  discipline: Discipline;
  onDelete: () => void;
  isPending: boolean;
}

export function DeleteDisciplineModal({
  isOpen,
  onOpenChange,
  discipline,
  onDelete,
  isPending,
}: DeleteDisciplineModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <div className='flex items-center gap-3'>
            <AlertTriangle className='h-8 w-8 text-red-500' />
            <div>
              <DialogTitle>Excluir Disciplina</DialogTitle>
              <DialogDescription>
                Esta ação não pode ser desfeita.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className='py-4'>
          <p className='text-sm text-gray-600'>
            Você está prestes a excluir a disciplina{' '}
            <strong>{discipline.name}</strong>. Todos os dados relacionados
            serão perdidos permanentemente.
          </p>
        </div>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button variant='destructive' onClick={onDelete} disabled={isPending}>
            {isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Excluir Disciplina
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
