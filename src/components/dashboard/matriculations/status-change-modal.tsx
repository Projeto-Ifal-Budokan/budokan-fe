'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface ModalEnrollment {
  userName: string;
  status: 'active' | 'inactive' | 'graduated';
  disciplineName: string;
}

interface StatusChangeModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  pendingChange: {
    matriculation: ModalEnrollment;
    newStatus: 'active' | 'inactive' | 'graduated';
  } | null;
  isPending: boolean;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  getStatusColor: (status: string) => 'default' | 'secondary' | 'destructive';
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
  getStatusChangeMessage,
  getStatusChangeDescription,
}: StatusChangeModalProps) {
  if (!pendingChange) return null;

  const { matriculation, newStatus } = pendingChange;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <AlertTriangle className='h-5 w-5 text-amber-500' />
            Confirmar Alteração de Status
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='rounded-lg bg-amber-50 p-4'>
            <p className='text-sm text-amber-800'>
              Você está prestes a{' '}
              <strong>
                {getStatusChangeMessage(matriculation.status, newStatus)}
              </strong>{' '}
              a matrícula de <strong>{matriculation.userName}</strong>.
            </p>
          </div>

          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium text-gray-700'>
                Usuário:
              </span>
              <span className='text-sm text-gray-900'>
                {matriculation.userName}
              </span>
            </div>

            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium text-gray-700'>
                Disciplina:
              </span>
              <span className='text-sm text-gray-900'>
                {matriculation.disciplineName}
              </span>
            </div>

            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium text-gray-700'>
                Status atual:
              </span>
              <Badge variant={getStatusColor(matriculation.status)}>
                {matriculation.status === 'active'
                  ? 'Ativo'
                  : matriculation.status === 'inactive'
                    ? 'Inativo'
                    : 'Graduado'}
              </Badge>
            </div>

            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium text-gray-700'>
                Novo status:
              </span>
              <Badge variant={getStatusColor(newStatus)}>
                {newStatus === 'active'
                  ? 'Ativo'
                  : newStatus === 'inactive'
                    ? 'Inativo'
                    : 'Graduado'}
              </Badge>
            </div>
          </div>

          <div className='rounded-lg bg-blue-50 p-4'>
            <p className='text-sm text-blue-800'>
              {getStatusChangeDescription(newStatus)}
            </p>
          </div>

          <div className='flex justify-end gap-3'>
            <Button variant='outline' onClick={onCancel} disabled={isPending}>
              Cancelar
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isPending}
              className='bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
            >
              {isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              Confirmar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
