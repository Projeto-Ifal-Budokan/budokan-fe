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
import { CreateRankData, createRankSchema } from '@/types/ranking';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Trophy } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface Discipline {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'inactive';
}

interface CreateRankingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disciplines: Discipline[];
  onSuccess?: () => void;
}

export function CreateRankingDialog({
  open,
  onOpenChange,
  disciplines,
  onSuccess,
}: CreateRankingDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      idDiscipline: 0,
      name: '',
      description: '',
    },
  });

  const selectedDisciplineId = watch('idDiscipline');

  const onSubmit = async (data: CreateRankData) => {
    setIsSubmitting(true);
    try {
      const response = await rankingsService.createRanking(data);

      if (response.ok) {
        toast.success('Ranking criado com sucesso!');
        reset();
        onOpenChange(false);
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error('Erro ao criar ranking. Tente novamente.');
        console.error('Failed to create ranking:', response.status);
      }
    } catch (error) {
      console.error('Error creating ranking:', error);
      toast.error('Erro ao criar ranking. Tente novamente.');
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
            <Trophy className='h-5 w-5 text-blue-600' />
            Criar Novo Ranking
          </DialogTitle>
          <DialogDescription>
            Adicione um novo nível de graduação para uma modalidade.
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
                  Criando...
                </>
              ) : (
                'Criar Ranking'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
