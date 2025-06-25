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
import { AlertTriangle, Key } from 'lucide-react';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  isPending: boolean;
  onConfirm: () => void;
}

export function ResetPasswordModal({
  isOpen,
  onOpenChange,
  user,
  isPending,
  onConfirm,
}: ResetPasswordModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-lg border-0 shadow-2xl'>
        <DialogHeader className='space-y-4'>
          <DialogTitle className='flex items-center gap-3 text-xl'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-amber-100'>
              <AlertTriangle className='h-5 w-5 text-amber-600' />
            </div>
            Redefinir Senha
          </DialogTitle>
          <DialogDescription className='text-base text-gray-600'>
            Você tem certeza que deseja redefinir a senha deste usuário?
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

            <div className='rounded-lg border border-amber-200 bg-amber-50 p-4'>
              <div className='flex items-start gap-3'>
                <Key className='mt-0.5 h-5 w-5 text-amber-600' />
                <div>
                  <p className='text-sm font-medium text-amber-800'>
                    <strong>Ação:</strong> Uma nova senha temporária será gerada
                  </p>
                  <p className='mt-2 text-sm text-amber-700'>
                    O usuário receberá um email com as instruções para criar uma
                    nova senha. A senha atual será invalidada imediatamente.
                  </p>
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
            className='bg-gradient-to-r from-amber-600 to-orange-600 px-6 hover:from-amber-700 hover:to-orange-700'
          >
            {isPending ? 'Redefinindo...' : 'Redefinir Senha'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
