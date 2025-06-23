import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { UserPlus } from 'lucide-react';
import { AddUserForm } from './add-user-form';

interface AddUserModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddUserModal({ isOpen, onOpenChange }: AddUserModalProps) {
  const handleSubmit = () => {
    // Handle form submission here
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
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
