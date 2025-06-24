'use client';

import { Badge } from '@/components/ui/badge';
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

interface StatusChangeModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  pendingChange: {
    discipline: Discipline;
    newStatus: string;
  } | null;
  isPending: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  getStatusColor: (status: string) => 'default' | 'secondary' | 'destructive';
  getStatusText: (status: string) => string;
  getStatusChangeMessage: (currentStatus: string, newStatus: string) => string;
  getStatusChangeDescription: (newStatus: string) => string;
}

export function StatusChangeModal({
  isOpen,
  onOpenChange,
  pendingChange,
  isPending,
  onConfirm,
  onCancel,
  getStatusColor,
  getStatusText,
  getStatusChangeMessage,
  getStatusChangeDescription,
}: StatusChangeModalProps) {
  if (!pendingChange) return null;

  const { discipline, newStatus } = pendingChange;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <div className='flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-amber-100'>
              <AlertTriangle className='h-5 w-5 text-amber-600' />
            </div>
            <div>
              <DialogTitle className='text-lg'>
                Confirmar Alteração de Status
              </DialogTitle>
              <DialogDescription>
                Você está prestes a{' '}
                {getStatusChangeMessage(discipline.status, newStatus)} esta
                disciplina.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='rounded-lg border bg-gray-50 p-4'>
            <div className='space-y-3'>
              <div>
                <span className='text-sm font-medium text-gray-600'>
                  Disciplina:
                </span>
                <p className='font-semibold'>{discipline.name}</p>
              </div>

              <div className='flex items-center gap-4'>
                <div>
                  <span className='text-sm text-gray-600'>Status atual:</span>
                  <div className='mt-1'>
                    <Badge variant={getStatusColor(discipline.status)}>
                      {getStatusText(discipline.status)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <span className='text-sm text-gray-600'>Novo status:</span>
                  <div className='mt-1'>
                    <Badge variant={getStatusColor(newStatus)}>
                      {getStatusText(newStatus)}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4'>
            <p className='text-sm text-blue-800'>
              {getStatusChangeDescription(newStatus)}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={onCancel} disabled={isPending}>
            Cancelar
          </Button>
          <Button onClick={onConfirm} disabled={isPending}>
            {isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Confirmar Alteração
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
