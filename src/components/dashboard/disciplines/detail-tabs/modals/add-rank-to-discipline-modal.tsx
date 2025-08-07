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
import { Separator } from '@/components/ui/separator';
import { useManageRankings } from '@/lib/api/queries/use-manage-rankings';
import { CreateRankData, createRankSchema } from '@/types/ranking';
import { zodResolver } from '@hookform/resolvers/zod';
import { Award, Loader2, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

interface AddRankToDisciplineModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  disciplineId: string;
  disciplineName: string;
}

export function AddRankToDisciplineModal({
  isOpen,
  onOpenChange,
  disciplineId,
  disciplineName,
}: AddRankToDisciplineModalProps) {
  const [mode, setMode] = useState<'select' | 'create'>('select');
  const { useRankings, createRanking } = useManageRankings();

  // Get all ranks without filtering by discipline
  const { data: allRanksResponse } = useRankings();

  // Get ranks for current discipline
  const { data: disciplineRanksResponse } = useRankings(1, 1000, {
    disciplineId,
  });

  // Filter ranks that don't belong to this discipline
  const availableRanks = useMemo(() => {
    if (
      !allRanksResponse?.data?.items ||
      !disciplineRanksResponse?.data?.items
    ) {
      return [];
    }

    const disciplineRankIds = new Set(
      disciplineRanksResponse.data.items.map((rank) => rank.id)
    );

    return allRanksResponse.data.items.filter(
      (rank) => !disciplineRankIds.has(rank.id)
    );
  }, [allRanksResponse, disciplineRanksResponse]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateRankData>({
    resolver: zodResolver(createRankSchema),
    defaultValues: {
      idDiscipline: parseInt(disciplineId),
      name: '',
      description: '',
    },
  });

  const handleSelectExistingRank = async (rankId: string) => {
    const selectedRank = availableRanks.find(
      (rank) => rank.id === parseInt(rankId)
    );

    if (selectedRank) {
      try {
        // Create a new rank entry for this discipline
        await createRanking.mutateAsync({
          idDiscipline: parseInt(disciplineId),
          name: selectedRank.name,
          description: selectedRank.description,
        });
        onOpenChange(false);
        reset();
        setMode('select');
      } catch (error) {
        console.error('Error adding rank to discipline:', error);
      }
    }
  };

  const onSubmit = async (data: CreateRankData) => {
    try {
      await createRanking.mutateAsync(data);
      onOpenChange(false);
      reset();
      setMode('select');
    } catch (error) {
      console.error('Error creating rank:', error);
    }
  };

  const handleCancel = () => {
    reset();
    setMode('select');
    onOpenChange(false);
  };

  const getBeltColor = (description: string) => {
    const colors: { [key: string]: string } = {
      'Faixa Branca': 'bg-gray-100 text-gray-800 border-gray-300',
      'Faixa Amarela': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Faixa Laranja': 'bg-orange-100 text-orange-800 border-orange-300',
      'Faixa Verde': 'bg-green-100 text-green-800 border-green-300',
      'Faixa Roxa': 'bg-purple-100 text-purple-800 border-purple-300',
      'Faixa Marrom': 'bg-amber-100 text-amber-800 border-amber-300',
      'Faixa Preta': 'bg-gray-900 text-white border-gray-700',
    };
    return colors[description] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Award className='h-5 w-5 text-emerald-600' />
            Adicionar Rank à {disciplineName}
          </DialogTitle>
          <DialogDescription>
            Escolha uma rank existente ou crie uma nova para esta disciplina.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='flex gap-2'>
            <Button
              variant={mode === 'select' ? 'default' : 'outline'}
              size='sm'
              onClick={() => setMode('select')}
              className='flex-1'
            >
              Selecionar Existente
            </Button>
            <Button
              variant={mode === 'create' ? 'default' : 'outline'}
              size='sm'
              onClick={() => setMode('create')}
              className='flex-1'
            >
              <Plus className='mr-1 h-3 w-3' />
              Criar Nova
            </Button>
          </div>

          <Separator />

          {mode === 'select' ? (
            <div className='space-y-4'>
              {availableRanks.length === 0 ? (
                <div className='py-6 text-center text-gray-500'>
                  <Award className='mx-auto mb-2 h-8 w-8 text-gray-400' />
                  <p>Não há ranks disponíveis para adicionar.</p>
                  <p className='text-sm'>
                    Todas as ranks já estão associadas a esta disciplina.
                  </p>
                </div>
              ) : (
                <div className='space-y-2'>
                  <Label>Ranks Disponíveis</Label>
                  <Select onValueChange={handleSelectExistingRank}>
                    <SelectTrigger>
                      <SelectValue placeholder='Selecione uma rank' />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRanks.map((rank) => (
                        <SelectItem key={rank.id} value={rank.id.toString()}>
                          <div className='flex items-center gap-2'>
                            <span className='font-medium'>{rank.name}</span>
                            <div
                              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${getBeltColor(rank.description)}`}
                            >
                              {rank.description}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='name'>Nome da Rank</Label>
                <Input
                  id='name'
                  placeholder='Ex: 1º Kyu, 5º Dan, etc.'
                  {...register('name')}
                />
                {errors.name && (
                  <p className='text-sm text-red-600'>{errors.name.message}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='description'>Descrição/Faixa</Label>
                <Input
                  id='description'
                  placeholder='Ex: Faixa Branca, Faixa Preta, etc.'
                  {...register('description')}
                />
                {errors.description && (
                  <p className='text-sm text-red-600'>
                    {errors.description.message}
                  </p>
                )}
              </div>

              <DialogFooter>
                <Button type='button' variant='outline' onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button
                  type='submit'
                  disabled={createRanking.isPending}
                  className='bg-gradient-to-r from-emerald-600 to-teal-600'
                >
                  {createRanking.isPending && (
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  )}
                  Criar Rank
                </Button>
              </DialogFooter>
            </form>
          )}
        </div>

        {mode === 'select' && (
          <DialogFooter>
            <Button variant='outline' onClick={handleCancel}>
              Cancelar
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
