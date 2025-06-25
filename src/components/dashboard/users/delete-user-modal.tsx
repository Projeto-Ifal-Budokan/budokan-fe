import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { AlertTriangle, Trash2 } from 'lucide-react';

interface DeleteUserModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  isPending: boolean;
  onConfirm: () => void;
}

export function DeleteUserModal({
  isOpen,
  onOpenChange,
  user,
  isPending,
  onConfirm,
}: DeleteUserModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-lg border-0 shadow-2xl'>
        <DialogHeader className='space-y-4'>
          <DialogTitle className='flex items-center gap-3 text-xl'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-red-100'>
              <AlertTriangle className='h-5 w-5 text-red-600' />
            </div>
            Excluir Usuário
          </DialogTitle>
          <DialogDescription className='text-base text-gray-600'>
            Esta ação não pode ser desfeita. Todos os dados do usuário serão
            permanentemente removidos.
          </DialogDescription>
        </DialogHeader>

        {user && (
          <div className='space-y-6 py-4'>
            <div className='flex items-center gap-4 rounded-xl bg-gray-50 p-4'>
              <Avatar className='h-12 w-12 ring-2 ring-gray-200'>
                <AvatarImage alt={user.firstName} />
                <AvatarFallback className='bg-gradient-to-br from-blue-100 to-indigo-100 font-semibold text-blue-700'>
                  {user.firstName[0]}
                  {user.surname[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className='font-semibold text-gray-900'>
                  {user.firstName} {user.surname}
                </div>
                <div className='text-sm text-gray-500'>{user.email}</div>
              </div>
            </div>

            <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
              <div className='flex items-start gap-3'>
                <Trash2 className='mt-0.5 h-5 w-5 text-red-600' />
                <div>
                  <p className='text-sm font-medium text-red-800'>
                    <strong>Atenção:</strong> Esta ação é irreversível
                  </p>
                  <ul className='mt-2 space-y-1 text-sm text-red-700'>
                    <li>• Todos os dados pessoais serão removidos</li>
                    <li>• Histórico de atividades será excluído</li>
                    <li>• Acesso ao sistema será revogado</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className='flex gap-3 pt-4'>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className='px-6'
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isPending}
            variant='destructive'
            className='px-6'
          >
            {isPending ? 'Excluindo...' : 'Excluir Usuário'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
