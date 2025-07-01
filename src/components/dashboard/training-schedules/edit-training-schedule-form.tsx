'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useManageDisciplines } from '@/lib/api/queries/use-manage-disciplines';
import { TrainingSchedule } from '@/lib/api/services/training-schedules-service';
import { Discipline } from '@/types/discipline';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const editTrainingScheduleFormSchema = z
  .object({
    idDiscipline: z.string().min(1, 'Disciplina é obrigatória'),
    weekday: z.string().min(1, 'Dia da semana é obrigatório'),
    startTime: z.string().min(1, 'Horário de início é obrigatório'),
    endTime: z.string().min(1, 'Horário de fim é obrigatório'),
  })
  .refine(
    (data) => {
      if (data.startTime && data.endTime) {
        return data.startTime < data.endTime;
      }
      return true;
    },
    {
      message: 'Horário de início deve ser anterior ao horário de fim',
      path: ['endTime'],
    }
  );

type EditTrainingScheduleFormValues = z.infer<
  typeof editTrainingScheduleFormSchema
>;

interface EditTrainingScheduleFormProps {
  trainingSchedule: TrainingSchedule;
  onEdit: (data: Partial<TrainingSchedule>) => void;
  onCancel: () => void;
  isPending: boolean;
  isAdmin: boolean;
}

export function EditTrainingScheduleForm({
  trainingSchedule,
  onEdit,
  onCancel,
  isPending,
  isAdmin,
}: EditTrainingScheduleFormProps) {
  const { useDisciplines } = useManageDisciplines();
  const { data: allDisciplines } = useDisciplines(1, 100);

  const form = useForm<EditTrainingScheduleFormValues>({
    resolver: zodResolver(editTrainingScheduleFormSchema),
    defaultValues: {
      idDiscipline: trainingSchedule.idDiscipline.toString(),
      weekday: trainingSchedule.weekday,
      startTime: trainingSchedule.startTime.substring(0, 5), // Remove seconds
      endTime: trainingSchedule.endTime.substring(0, 5), // Remove seconds
    },
  });

  const onSubmit = async (data: EditTrainingScheduleFormValues) => {
    try {
      await onEdit({
        id: trainingSchedule.id,
        ...data,
        startTime: data.startTime + ':00', // Add seconds back
        endTime: data.endTime + ':00', // Add seconds back
      });
      toast.success('Horário de treino atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar horário de treino');
    }
  };

  const weekdays = [
    { value: 'monday', label: 'Segunda-feira' },
    { value: 'tuesday', label: 'Terça-feira' },
    { value: 'wednesday', label: 'Quarta-feira' },
    { value: 'thursday', label: 'Quinta-feira' },
    { value: 'friday', label: 'Sexta-feira' },
    { value: 'saturday', label: 'Sábado' },
    { value: 'sunday', label: 'Domingo' },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='grid gap-4'>
          <FormField
            control={form.control}
            name='idDiscipline'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Disciplina</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Selecione uma disciplina' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {allDisciplines?.data?.items?.map(
                      (discipline: Discipline) => (
                        <SelectItem
                          key={discipline.id}
                          value={discipline.id.toString()}
                        >
                          {discipline.name}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='weekday'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dia da Semana</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Selecione o dia da semana' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {weekdays.map((weekday) => (
                      <SelectItem key={weekday.value} value={weekday.value}>
                        {weekday.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='grid grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='startTime'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Horário de Início</FormLabel>
                  <FormControl>
                    <Input type='time' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='endTime'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Horário de Fim</FormLabel>
                  <FormControl>
                    <Input type='time' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className='flex justify-end gap-3'>
          <Button
            type='button'
            variant='outline'
            onClick={onCancel}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button
            type='submit'
            disabled={isPending}
            className='bg-gradient-to-r from-blue-600 to-purple-600'
          >
            {isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Atualizar Horário
          </Button>
        </div>
      </form>
    </Form>
  );
}
