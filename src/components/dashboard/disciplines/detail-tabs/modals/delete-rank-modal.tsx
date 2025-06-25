'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useManageDisciplines } from '@/lib/api/queries/use-manage-disciplines';
import { useManageRankings } from '@/lib/api/queries/use-manage-rankings';
import { Rank } from '@/types/discipline';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface DeleteRankModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  rank: Rank;
}

export function DeleteRankModal({
  isOpen,
  onOpenChange,
  rank,
}: DeleteRankModalProps) {
  const { deleteRanking } = useManageRankings();
  const { useDiscipline } = useManageDisciplines();

  const handleDelete = async () => {
    try {
      await deleteRanking.mutateAsync(rank.id.toString());
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting rank:', error);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-red-600'>
            <AlertTriangle className='h-5 w-5' />
            Excluir Rank
          </DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir a rank <strong>{rank.name}</strong>?
            Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>

        <div className='py-4'>
          <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
            <div className='flex items-start gap-3'>
              <AlertTriangle className='mt-0.5 h-5 w-5 text-red-600' />
              <div className='text-sm text-red-800'>
                <p className='mb-1 font-medium'>Atenção!</p>
                <p>
                  Ao excluir esta rank, todos os instrutores e estudantes
                  associados a ela poderão ser afetados. Verifique se não há
                  dependências antes de continuar.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={handleCancel}>
            Cancelar
          </Button>
          <Button
            variant='destructive'
            onClick={handleDelete}
            disabled={deleteRanking.isPending}
          >
            {deleteRanking.isPending && (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            )}
            Excluir Rank
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
