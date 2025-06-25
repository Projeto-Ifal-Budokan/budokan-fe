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
import { useManageRankings } from '@/lib/api/queries/use-manage-rankings';
import { CreateRankData, createRankSchema } from '@/types/ranking';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface Discipline {
  id: number;
  name: string;
}

interface AddRankingModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  disciplines: Discipline[];
}

export function AddRankingModal({
  isOpen,
  onOpenChange,
  disciplines,
}: AddRankingModalProps) {
  const { createRanking } = useManageRankings();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateRankData>({
    resolver: zodResolver(createRankSchema),
  });

  const selectedDisciplineId = watch('idDiscipline');

  const onSubmit = async (data: CreateRankData) => {
    try {
      await createRanking.mutateAsync(data);
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating ranking:', error);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>Adicionar Novo Ranking</DialogTitle>
          <DialogDescription>
            Crie um novo nível de graduação para uma modalidade
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Nome do Ranking</Label>
            <Input
              id='name'
              {...register('name')}
              placeholder='Ex: 1º Kyuu, 2º Dan, etc.'
            />
            {errors.name && (
              <p className='text-sm text-red-600'>{errors.name.message}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='description'>Descrição/Faixa</Label>
            <Input
              id='description'
              {...register('description')}
              placeholder='Ex: Faixa Branca, Faixa Preta, etc.'
            />
            {errors.description && (
              <p className='text-sm text-red-600'>
                {errors.description.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='disciplineId'>Modalidade</Label>
            <Select
              value={selectedDisciplineId?.toString()}
              onValueChange={(value) =>
                setValue('idDiscipline', parseInt(value))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Selecione uma modalidade' />
              </SelectTrigger>
              <SelectContent>
                {disciplines.map((discipline) => (
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

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => handleOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type='submit' disabled={createRanking.isPending}>
              {createRanking.isPending && (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              )}
              Criar Ranking
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
