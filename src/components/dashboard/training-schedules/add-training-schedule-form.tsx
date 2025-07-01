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
import { useManageTrainingSchedules } from '@/lib/api/queries/use-manage-training-schedules';
import { Discipline } from '@/types/discipline';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const trainingScheduleFormSchema = z
  .object({
    idDiscipline: z.string().min(1, 'Disciplina é obrigatória'),
    weekday: z.string().min(1, 'Dia da semana é obrigatório'),
    startTime: z
      .string()
      .regex(/^\d{2}:\d{2}:\d{2}$/, 'Formato de hora inválido (HH:MM:SS)'),
    endTime: z
      .string()
      .regex(/^\d{2}:\d{2}:\d{2}$/, 'Formato de hora inválido (HH:MM:SS)'),
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

type TrainingScheduleFormValues = z.infer<typeof trainingScheduleFormSchema>;

interface AddTrainingScheduleFormProps {
  onSuccess: () => void;
  isAdmin: boolean;
  userDisciplines: Discipline[];
}

export function AddTrainingScheduleForm({
  onSuccess,
  isAdmin,
  userDisciplines,
}: AddTrainingScheduleFormProps) {
  const { createTrainingSchedule } = useManageTrainingSchedules();
  const { useDisciplines } = useManageDisciplines();
  const { data: allDisciplines } = useDisciplines(1, 100); // Get all disciplines for admin

  const form = useForm<TrainingScheduleFormValues>({
    resolver: zodResolver(trainingScheduleFormSchema),
    defaultValues: {
      idDiscipline: '',
      weekday: '',
      startTime: '',
      endTime: '',
    },
  });

  const onSubmit = async (data: TrainingScheduleFormValues) => {
    try {
      // Convert startTime/endTime to HH:MM:SS if needed
      const formatTime = (t: string) => (t.length === 5 ? `${t}:00` : t);
      const payload = {
        ...data,
        idDiscipline: Number(data.idDiscipline),
        startTime: formatTime(data.startTime),
        endTime: formatTime(data.endTime),
      };
      await createTrainingSchedule.mutateAsync(payload);
      toast.success('Horário de treino criado com sucesso!');
      form.reset();
      onSuccess();
    } catch (error) {
      toast.error('Erro ao criar horário de treino');
    }
  };

  const availableDisciplines = isAdmin
    ? allDisciplines?.data?.items || []
    : userDisciplines;

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
                    {availableDisciplines.map((discipline: Discipline) => (
                      <SelectItem
                        key={discipline.id}
                        value={discipline.id.toString()}
                      >
                        {discipline.name}
                      </SelectItem>
                    ))}
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
                    <Input
                      type='time'
                      step='1'
                      value={
                        field.value.length === 8
                          ? field.value.slice(0, 5)
                          : field.value
                      }
                      onChange={(e) =>
                        field.onChange(
                          e.target.value.length === 5
                            ? `${e.target.value}:00`
                            : e.target.value
                        )
                      }
                    />
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
                    <Input
                      type='time'
                      step='1'
                      value={
                        field.value.length === 8
                          ? field.value.slice(0, 5)
                          : field.value
                      }
                      onChange={(e) =>
                        field.onChange(
                          e.target.value.length === 5
                            ? `${e.target.value}:00`
                            : e.target.value
                        )
                      }
                    />
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
            onClick={() => {
              form.reset();
              onSuccess();
            }}
          >
            Cancelar
          </Button>
          <Button
            type='submit'
            disabled={createTrainingSchedule.isPending}
            className='bg-gradient-to-r from-blue-600 to-purple-600'
          >
            {createTrainingSchedule.isPending && (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            )}
            Criar Horário
          </Button>
        </div>
      </form>
    </Form>
  );
}
