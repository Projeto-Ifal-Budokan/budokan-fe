import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Discipline } from '@/types/discipline';
import { Session } from '@/types/session';
import { EditSessionForm } from './edit-session-form';

interface EditSessionModalProps {
  session: Session;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isAdmin: boolean;
  userDisciplines: Discipline[];
}

export function EditSessionModal({
  session,
  open,
  onOpenChange,
  isAdmin,
  userDisciplines,
}: EditSessionModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Editar Aula</DialogTitle>
          <DialogDescription>
            Atualize os dados da aula selecionada.
          </DialogDescription>
        </DialogHeader>
        <EditSessionForm
          session={session}
          onSuccess={() => onOpenChange(false)}
          isAdmin={isAdmin}
          userDisciplines={userDisciplines}
        />
      </DialogContent>
    </Dialog>
  );
}
