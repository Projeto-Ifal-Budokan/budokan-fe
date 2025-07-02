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
      <DialogContent className='max-h-[95vh] max-w-6xl overflow-y-auto p-0 md:min-w-3xl'>
        <div className='sticky top-0 z-10 border-b border-gray-100 bg-white px-8 py-6'>
          <DialogHeader className='space-y-2'>
            <DialogTitle className='text-2xl font-semibold text-gray-900'>
              Criar Nova Aula
            </DialogTitle>
            <DialogDescription className='text-base text-gray-600'>
              Configure os detalhes da aula selecionando a disciplina, instrutor
              e horários
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className='px-8 pb-8'>
          <AddSessionForm
            onSuccess={() => onOpenChange(false)}
            isAdmin={isAdmin}
            userDisciplines={userDisciplines}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
