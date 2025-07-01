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
import { TrainingSchedule } from '@/lib/api/services/training-schedules-service';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface DeleteTrainingScheduleModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  trainingSchedule: TrainingSchedule;
  onDelete: () => void;
  isPending: boolean;
}

export function DeleteTrainingScheduleModal({
  isOpen,
  onOpenChange,
  trainingSchedule,
  onDelete,
  isPending,
}: DeleteTrainingScheduleModalProps) {
  const getWeekdayText = (weekday: string) => {
    const weekdays = {
      monday: 'Segunda-feira',
      tuesday: 'Terça-feira',
      wednesday: 'Quarta-feira',
      thursday: 'Quinta-feira',
      friday: 'Sexta-feira',
      saturday: 'Sábado',
      sunday: 'Domingo',
    };
    return weekdays[weekday as keyof typeof weekdays] || weekday;
  };

  const formatTime = (time: string) => {
    return time.substring(0, 5);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <div className='flex items-center gap-3'>
            <AlertTriangle className='h-8 w-8 text-red-500' />
            <div>
              <DialogTitle>Excluir Horário de Treino</DialogTitle>
              <DialogDescription>
                Esta ação não pode ser desfeita.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className='py-4'>
          <p className='text-sm text-gray-600'>
            Você está prestes a excluir o horário de treino da{' '}
            <strong>Disciplina {trainingSchedule.idDiscipline}</strong> nas{' '}
            <strong>{getWeekdayText(trainingSchedule.weekday)}</strong> das{' '}
            <strong>{formatTime(trainingSchedule.startTime)}</strong> às{' '}
            <strong>{formatTime(trainingSchedule.endTime)}</strong>.
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
            Excluir Horário
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
