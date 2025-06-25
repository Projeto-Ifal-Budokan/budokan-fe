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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useManageRankings } from '@/lib/api/queries/use-manage-rankings';
import { Ranking, UpdateRankData, updateRankSchema } from '@/types/ranking';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

// Schema para edição de ranking
const editRankSchema = updateRankSchema;

type EditRankData = UpdateRankData;

interface Discipline {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'inactive';
}

interface EditRankingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ranking: Ranking;
  disciplines: Discipline[];
  onSuccess?: () => void;
}

export function EditRankingDialog({
  open,
  onOpenChange,
  ranking,
  disciplines,
  onSuccess,
}: EditRankingDialogProps) {
  const { updateRanking } = useManageRankings();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<EditRankData>({
    resolver: zodResolver(editRankSchema),
    defaultValues: {
      idDiscipline: ranking.idDiscipline,
      name: ranking.name,
      description: ranking.description,
    },
  });

  const selectedDisciplineId = watch('idDiscipline');

  // Reset form when ranking changes
  useEffect(() => {
    if (ranking) {
      reset({
        idDiscipline: ranking.idDiscipline,
        name: ranking.name,
        description: ranking.description,
      });
    }
  }, [ranking, reset]);

  const onSubmit = async (data: EditRankData) => {
    try {
      await updateRanking.mutateAsync({
        id: ranking.id.toString(),
        data: { ...ranking, ...data },
      });
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error updating ranking:', error);
    }
  };

  const handleCancel = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Edit className='h-5 w-5 text-blue-600' />
            Editar Ranking
          </DialogTitle>
          <DialogDescription>
            Atualize as informações do ranking selecionado.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='idDiscipline'>Modalidade *</Label>
            <Select
              value={selectedDisciplineId.toString()}
              onValueChange={(value) =>
                setValue('idDiscipline', parseInt(value))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Selecione uma modalidade' />
              </SelectTrigger>
              <SelectContent>
                {disciplines
                  .filter((discipline) => discipline.status === 'active')
                  .map((discipline) => (
                    <SelectItem
                      key={discipline.id}
                      value={discipline.id.toString()}
                    >
                      {discipline.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {errors.idDiscipline && (
              <p className='text-sm text-red-600'>
                {errors.idDiscipline.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='name'>Nome do Ranking *</Label>
            <Input
              id='name'
              placeholder='Ex: 7º Kyu, 1º Dan, etc.'
              {...register('name')}
            />
            {errors.name && (
              <p className='text-sm text-red-600'>{errors.name.message}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='description'>Descrição *</Label>
            <Textarea
              id='description'
              placeholder='Ex: Faixa Branca, Faixa Preta, etc.'
              className='resize-none'
              {...register('description')}
            />
            {errors.description && (
              <p className='text-sm text-red-600'>
                {errors.description.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={handleCancel}
              disabled={updateRanking.isPending}
            >
              Cancelar
            </Button>
            <Button
              type='submit'
              disabled={updateRanking.isPending}
              className='bg-gradient-to-r from-blue-800 to-blue-900 text-white hover:from-blue-900 hover:to-blue-950'
            >
              {updateRanking.isPending ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Atualizando...
                </>
              ) : (
                'Atualizar Ranking'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
