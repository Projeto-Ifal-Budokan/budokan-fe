import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Discipline } from '@/types/discipline';
import { AddSessionForm } from './add-session-form';

interface AddSessionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isAdmin: boolean;
  userDisciplines: Discipline[];
}

export function AddSessionModal({
  open,
  onOpenChange,
  isAdmin,
  userDisciplines,
}: AddSessionModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Adicionar Aula</DialogTitle>
          <DialogDescription>
            Preencha os dados para criar uma nova aula.
          </DialogDescription>
        </DialogHeader>
        <AddSessionForm
          onSuccess={() => onOpenChange(false)}
          isAdmin={isAdmin}
          userDisciplines={userDisciplines}
        />
      </DialogContent>
    </Dialog>
  );
}
