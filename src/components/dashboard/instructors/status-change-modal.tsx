import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { InstructorDiscipline } from '@/types/instructor';

interface StatusChangeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  instructor?: InstructorDiscipline;
  newStatus?: string;
  onConfirm: () => void;
  onCancel: () => void;
  getStatusText: (status: string) => string;
}

export function StatusChangeModal({
  open,
  onOpenChange,
  instructor,
  newStatus,
  onConfirm,
  onCancel,
  getStatusText,
}: StatusChangeModalProps) {
  if (!instructor || !newStatus) {
    return null;
  }

  const getStatusChangeMessage = (currentStatus: string, newStatus: string) => {
    const statusMessages = {
      active: 'ativar',
      inactive: 'desativar',
    };
    return statusMessages[newStatus as keyof typeof statusMessages];
  };

  const getStatusChangeDescription = (newStatus: string) => {
    const descriptions = {
      active: 'O instrutor poderá ministrar aulas normalmente.',
      inactive: 'O instrutor não poderá ministrar aulas.',
      on_leave: 'O instrutor ficará temporariamente afastado das atividades.',
    };
    return descriptions[newStatus as keyof typeof descriptions];
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar alteração de status</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja{' '}
            <strong>
              {getStatusChangeMessage(instructor.status, newStatus)}
            </strong>{' '}
            o instrutor <strong>{instructor.instructorName}</strong>
            ?
            <br />
            <br />
            {getStatusChangeDescription(newStatus)}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className='bg-blue-600 hover:bg-blue-700'
          >
            Confirmar alteração
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
