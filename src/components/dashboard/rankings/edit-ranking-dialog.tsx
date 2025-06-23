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
import { rankingsService } from '@/lib/api/services/rankings-service';
import { Ranking, UpdateRankData, updateRankSchema } from '@/types/ranking';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);
    try {
      const response = await rankingsService.updateRanking(
        ranking.id.toString(),
        data
      );

      if (response.ok) {
        toast.success('Ranking atualizado com sucesso!');
        onOpenChange(false);
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error('Erro ao atualizar ranking. Tente novamente.');
        console.error('Failed to update ranking:', response.status);
      }
    } catch (error) {
      console.error('Error updating ranking:', error);
      toast.error('Erro ao atualizar ranking. Tente novamente.');
    } finally {
      setIsSubmitting(false);
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
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type='submit'
              disabled={isSubmitting}
              className='bg-gradient-to-r from-blue-800 to-blue-900 text-white hover:from-blue-900 hover:to-blue-950'
            >
              {isSubmitting ? (
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
