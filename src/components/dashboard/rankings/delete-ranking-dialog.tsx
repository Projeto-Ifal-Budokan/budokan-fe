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
import { useManageRankings } from '@/lib/api/queries/use-manage-rankings';
import { Ranking } from '@/types/ranking';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface DeleteRankingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ranking: Ranking;
}

export function DeleteRankingDialog({
  open,
  onOpenChange,
  ranking,
}: DeleteRankingDialogProps) {
  const { deleteRanking } = useManageRankings();

  const handleDelete = async () => {
    try {
      await deleteRanking.mutateAsync(ranking.id.toString());
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting ranking:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <AlertTriangle className='h-5 w-5 text-red-600' />
            Confirmar Exclusão
          </DialogTitle>
          <DialogDescription>
            Esta ação não pode ser desfeita. O ranking será permanentemente
            removido do sistema.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
            <h4 className='font-medium text-red-900'>
              Ranking que será excluído:
            </h4>
            <div className='mt-2 space-y-1'>
              <p className='text-sm text-red-700'>
                <span className='font-medium'>Nome:</span> {ranking.name}
              </p>
              <p className='text-sm text-red-700'>
                <span className='font-medium'>Descrição:</span>{' '}
                {ranking.description}
              </p>
              <p className='text-sm text-red-700'>
                <span className='font-medium'>Modalidade:</span>{' '}
                {ranking.disciplineName}
              </p>
            </div>
          </div>

          <div className='rounded-lg border border-yellow-200 bg-yellow-50 p-4'>
            <p className='text-sm text-yellow-800'>
              <span className='font-medium'>Atenção:</span> Todos os dados
              relacionados a este ranking, incluindo graduações de alunos, serão
              afetados.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={deleteRanking.isPending}
          >
            Cancelar
          </Button>
          <Button
            type='button'
            variant='destructive'
            onClick={handleDelete}
            disabled={deleteRanking.isPending}
          >
            {deleteRanking.isPending ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Excluindo...
              </>
            ) : (
              'Excluir Ranking'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
