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
import { useManageSessions } from '@/lib/api/queries/use-manage-sessions';
import { Session } from '@/types/session';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface DeleteSessionModalProps {
  session: Session;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteSessionModal({
  session,
  open,
  onOpenChange,
}: DeleteSessionModalProps) {
  const { deleteSession } = useManageSessions();

  const handleDelete = async () => {
    try {
      await deleteSession.mutateAsync(session.id.toString());
      toast.success('Aula excluída com sucesso!');
      onOpenChange(false);
    } catch (error) {
      toast.error('Erro ao excluir aula');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5); // Remove seconds from HH:MM:SS
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className='space-y-2'>
              <p>
                Tem certeza que deseja excluir esta aula? Esta ação não pode ser
                desfeita.
              </p>
              <div className='bg-muted/50 rounded-md border p-3 text-sm'>
                <p>
                  <strong>Disciplina:</strong>{' '}
                  {session.disciplineName || `ID ${session.idDiscipline}`}
                </p>
                <p>
                  <strong>Data:</strong> {formatDate(session.date)}
                </p>
                <p>
                  <strong>Horário:</strong> {formatTime(session.startingTime)} -{' '}
                  {formatTime(session.endingTime)}
                </p>
              </div>
              <p className='text-destructive font-medium'>
                ⚠️ As frequências desta aula também serão excluídas
                permanentemente.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteSession.isPending}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteSession.isPending}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
          >
            {deleteSession.isPending ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Excluindo...
              </>
            ) : (
              'Excluir Aula'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
