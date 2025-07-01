'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { useInstructorDisciplines } from '@/lib/api/queries/use-instructor-disciplines';
import { useManageDisciplines } from '@/lib/api/queries/use-manage-disciplines';
import { useManageSessions } from '@/lib/api/queries/use-manage-sessions';
import { Discipline } from '@/types/discipline';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const sessionFormSchema = z
  .object({
    idDiscipline: z.string().min(1, 'Disciplina é obrigatória'),
    idInstructor: z.string().min(1, 'Instrutor é obrigatório'),
    date: z.string().min(1, 'Data é obrigatória'),
    startingTime: z
      .string()
      .regex(/^\d{2}:\d{2}:\d{2}$/, 'Formato de hora inválido (HH:MM:SS)'),
    endingTime: z
      .string()
      .regex(/^\d{2}:\d{2}:\d{2}$/, 'Formato de hora inválido (HH:MM:SS)'),
    isLastSessionOfDay: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.startingTime && data.endingTime) {
        return data.startingTime < data.endingTime;
      }
      return true;
    },
    {
      message: 'Horário de início deve ser anterior ao horário de fim',
      path: ['endingTime'],
    }
  );

type SessionFormValues = z.infer<typeof sessionFormSchema>;

interface AddSessionFormProps {
  onSuccess: () => void;
  isAdmin: boolean;
  userDisciplines: Discipline[];
}

export function AddSessionForm({
  onSuccess,
  isAdmin,
  userDisciplines,
}: AddSessionFormProps) {
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('');

  const { createSession } = useManageSessions();
  const { useDisciplines } = useManageDisciplines();
  const { data: allDisciplines } = useDisciplines(1, 100);
  const { useInstructorDisciplinesList } = useInstructorDisciplines();
  const { data: instructorsResponse } = useInstructorDisciplinesList(0);

  const form = useForm<SessionFormValues>({
    resolver: zodResolver(sessionFormSchema),
    defaultValues: {
      idDiscipline: '',
      idInstructor: '',
      date: '',
      startingTime: '',
      endingTime: '',
      isLastSessionOfDay: false,
    },
  });

  const availableDisciplines = isAdmin
    ? allDisciplines?.data?.items || []
    : userDisciplines;

  // Filter instructors based on selected discipline
  const availableInstructors = useMemo(() => {
    if (!instructorsResponse?.data?.items || !selectedDiscipline) {
      return [];
    }

    // For now, return all instructors. You might want to filter by discipline
    // based on your instructor-discipline relationship
    return instructorsResponse.data.items;
  }, [instructorsResponse, selectedDiscipline]);

  // Reset instructor when discipline changes
  useEffect(() => {
    if (selectedDiscipline) {
      form.setValue('idInstructor', '');
    }
  }, [selectedDiscipline, form]);

  const onSubmit = async (data: SessionFormValues) => {
    try {
      // Convert startingTime/endingTime to HH:MM:SS if needed
      const formatTime = (t: string) => (t.length === 5 ? `${t}:00` : t);
      const payload = {
        ...data,
        idDiscipline: Number(data.idDiscipline),
        idInstructor: Number(data.idInstructor),
        startingTime: formatTime(data.startingTime),
        endingTime: formatTime(data.endingTime),
      };
      await createSession.mutateAsync(payload);
      toast.success('Aula criada com sucesso!');
      form.reset();
      onSuccess();
    } catch (error) {
      toast.error('Erro ao criar aula');
    }
  };

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
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedDiscipline(value);
                  }}
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
            name='idInstructor'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instrutor</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!selectedDiscipline}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Selecione um instrutor' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableInstructors.map((instructor) => (
                      <SelectItem
                        key={instructor.id}
                        value={instructor.id.toString()}
                      >
                        {instructor.instructorName}
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
            name='date'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data</FormLabel>
                <FormControl>
                  <Input type='date' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='grid grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='startingTime'
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
              name='endingTime'
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

          <FormField
            control={form.control}
            name='isLastSessionOfDay'
            render={({ field }) => (
              <FormItem className='flex flex-row items-start space-y-0 space-x-3'>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className='space-y-1 leading-none'>
                  <FormLabel>Última aula do dia</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className='flex justify-end space-x-2'>
          <Button
            type='submit'
            disabled={createSession.isPending}
            className='w-full'
          >
            {createSession.isPending ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Criando...
              </>
            ) : (
              'Criar Aula'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
