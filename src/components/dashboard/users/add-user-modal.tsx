import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/lib/api/queries/use-auth';
import { userKeys } from '@/lib/api/queries/use-manage-users';
import { CreateUserData } from '@/types/user';
import { useQueryClient } from '@tanstack/react-query';
import { UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { AddUserForm } from './add-user-form';

interface AddUserModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddUserModal({ isOpen, onOpenChange }: AddUserModalProps) {
  const { register } = useAuth();
  const queryClient = useQueryClient();

  const handleSubmit = async (data: CreateUserData) => {
    const response = await register.mutateAsync({
      ...data,
      healthObservations: '',
    });

    if (!response.ok) {
      toast.error('Erro ao criar usuário!');
      return;
    }

    queryClient.invalidateQueries({ queryKey: userKeys.all });
    toast.success('Usuário criado com sucesso!');
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          size='lg'
          className='bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg transition-all hover:scale-105 hover:shadow-xl'
        >
          <UserPlus className='mr-2 h-5 w-5' />
          Novo Usuário
        </Button>
      </DialogTrigger>
      <DialogContent className='max-h-[80vh] max-w-3xl overflow-y-auto p-0'>
        <AddUserForm
          onCancel={() => onOpenChange(false)}
          onSubmit={(data) => handleSubmit(data)}
        />
      </DialogContent>
    </Dialog>
  );
}
