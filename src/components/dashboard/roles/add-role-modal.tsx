import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { AddRoleForm } from './add-role-form';

interface AddRoleModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddRoleModal({ isOpen, onOpenChange }: AddRoleModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button onClick={() => onOpenChange(true)} className='gap-2'>
          <Plus className='h-4 w-4' />
          Adicionar Papel
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Adicionar Novo Papel</DialogTitle>
          <DialogDescription>
            Crie um novo papel para o sistema
          </DialogDescription>
        </DialogHeader>
        <AddRoleForm onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
