import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { User } from '@/types/user';
import { AlertTriangle } from 'lucide-react';

interface StatusChangeModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  pendingChange: {
    user: User;
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
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-lg border-0 shadow-2xl'>
        <DialogHeader className='space-y-4'>
          <DialogTitle className='flex items-center gap-3 text-xl'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-amber-100'>
              <AlertTriangle className='h-5 w-5 text-amber-600' />
            </div>
            Confirmar Alteração de Status
          </DialogTitle>
          <DialogDescription className='text-base text-gray-600'>
            Você tem certeza que deseja alterar o status deste usuário?
          </DialogDescription>
        </DialogHeader>

        {pendingChange && (
          <div className='space-y-6 py-4'>
            <div className='flex items-center gap-4 rounded-xl bg-gray-50 p-4'>
              <Avatar className='h-12 w-12 ring-2 ring-gray-200'>
                <AvatarImage alt={pendingChange.user.firstName} />
                <AvatarFallback className='bg-gradient-to-br from-blue-100 to-indigo-100 font-semibold text-blue-700'>
                  {pendingChange.user.firstName[0]}
                  {pendingChange.user.surname[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className='font-semibold text-gray-900'>
                  {pendingChange.user.firstName} {pendingChange.user.surname}
                </div>
                <div className='text-sm text-gray-500'>
                  {pendingChange.user.email}
                </div>
              </div>
            </div>

            <div className='space-y-3'>
              <div className='flex items-center justify-between rounded-lg border bg-white p-3 shadow-sm'>
                <span className='text-sm font-medium text-gray-700'>
                  Status atual:
                </span>
                <Badge
                  variant={getStatusColor(pendingChange.user.status)}
                  className='px-3 py-1'
                >
                  {getStatusText(pendingChange.user.status)}
                </Badge>
              </div>
              <div className='flex items-center justify-between rounded-lg border bg-white p-3 shadow-sm'>
                <span className='text-sm font-medium text-gray-700'>
                  Novo status:
                </span>
                <Badge
                  variant={getStatusColor(pendingChange.newStatus)}
                  className='px-3 py-1'
                >
                  {getStatusText(pendingChange.newStatus)}
                </Badge>
              </div>
            </div>

            <div className='rounded-xl border border-blue-200 bg-blue-50 p-4'>
              <p className='text-sm font-medium text-blue-800'>
                <strong>Ação:</strong>{' '}
                {getStatusChangeMessage(
                  pendingChange.user.status,
                  pendingChange.newStatus
                )}{' '}
                usuário
              </p>
              <p className='mt-2 text-sm text-blue-700'>
                {getStatusChangeDescription(pendingChange.newStatus)}
              </p>
            </div>
          </div>
        )}

        <DialogFooter className='flex gap-3 pt-4'>
          <Button
            variant='outline'
            onClick={onCancel}
            disabled={isPending}
            className='px-6'
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isPending}
            className={`px-6 ${
              pendingChange?.newStatus === 'suspended'
                ? 'bg-destructive hover:bg-destructive/90'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600'
            }`}
          >
            {isPending ? 'Alterando...' : 'Confirmar Alteração'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
