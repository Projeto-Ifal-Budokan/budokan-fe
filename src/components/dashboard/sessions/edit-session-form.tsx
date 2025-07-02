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
import { useManageTrainingSchedules } from '@/lib/api/queries/use-manage-training-schedules';
import { TrainingSchedule } from '@/lib/api/services/training-schedules-service';
import { Discipline } from '@/types/discipline';
import { Session } from '@/types/session';
import { zodResolver } from '@hookform/resolvers/zod';
import { Clock, Edit3, Loader2, UserCheck } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const sessionFormSchema = z.object({
  idDiscipline: z.string().min(1, 'Disciplina é obrigatória'),
  idInstructor: z.string().min(1, 'Instrutor é obrigatório'),
  date: z.string().min(1, 'Data é obrigatória'),
  idTrainingSchedule: z.string().min(1, 'Horário é obrigatório'),
  isLastSessionOfDay: z.boolean(),
});

type SessionFormValues = z.infer<typeof sessionFormSchema>;

interface EditSessionFormProps {
  session: Session;
  onSuccess: () => void;
  isAdmin: boolean;
  userDisciplines: Discipline[];
}

export function EditSessionForm({
  session,
  onSuccess,
  isAdmin,
  userDisciplines,
}: EditSessionFormProps) {
  // Safe string conversion with fallback
  const safeToString = (value: string | number | null | undefined) => {
    return value !== null && value !== undefined ? value.toString() : '';
  };

  // Safe time formatting with fallback
  const formatTime = (time: string | undefined | null) => {
    if (!time) return '';
    return time.length === 8 ? time.slice(0, 5) : time;
  };

  // Safe date extraction
  const extractDate = (dateString: string | undefined | null) => {
    if (!dateString) return '';
    return dateString.split('T')[0];
  };

  const [selectedDiscipline, setSelectedDiscipline] = useState<string>(
    safeToString(session?.idDiscipline)
  );
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSchedule, setSelectedSchedule] =
    useState<TrainingSchedule | null>(null);

  const { updateSession } = useManageSessions();
  const { useDisciplines } = useManageDisciplines();
  const { data: allDisciplines } = useDisciplines(1, 100);
  const { useInstructorDisciplinesList } = useInstructorDisciplines();
  const { useTrainingSchedules } = useManageTrainingSchedules();

  // Get instructors filtered by selected discipline
  const { data: instructorsResponse } = useInstructorDisciplinesList(
    1,
    100,
    selectedDiscipline ? { idDiscipline: selectedDiscipline } : undefined
  );

  // Get training schedules for time suggestions
  const { data: trainingSchedulesResponse } = useTrainingSchedules(1, 100);

  const form = useForm<SessionFormValues>({
    resolver: zodResolver(sessionFormSchema),
    defaultValues: {
      idDiscipline: safeToString(session?.idDiscipline),
      idInstructor: safeToString(session?.idInstructor),
      date: extractDate(session?.date),
      idTrainingSchedule: '',
      isLastSessionOfDay: session?.isLastSessionOfDay || false,
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
    return instructorsResponse.data.items.filter(
      (instructor) => instructor.idDiscipline === Number(selectedDiscipline)
    );
  }, [instructorsResponse, selectedDiscipline]);

  // Get weekday from selected date
  const selectedWeekday = useMemo(() => {
    if (!selectedDate) return '';
    const date = new Date(selectedDate);
    const weekdays = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];
    return weekdays[date.getDay()];
  }, [selectedDate]);

  // Filter training schedules based on selected discipline and weekday
  const availableTrainingSchedules = useMemo(() => {
    if (
      !trainingSchedulesResponse?.data?.items ||
      !selectedDiscipline ||
      !selectedWeekday
    ) {
      return [];
    }
    return trainingSchedulesResponse.data.items.filter(
      (schedule) =>
        schedule.idDiscipline === Number(selectedDiscipline) &&
        schedule.weekday === selectedWeekday
    );
  }, [trainingSchedulesResponse, selectedDiscipline, selectedWeekday]);

  // Watch the training schedule field
  const watchedScheduleId = form.watch('idTrainingSchedule');

  // Set initial selected date
  useEffect(() => {
    if (session?.date) {
      const initialDate = extractDate(session.date);
      setSelectedDate(initialDate);
    }
  }, [session?.date]);

  // Reset dependent fields when discipline changes
  useEffect(() => {
    if (
      selectedDiscipline &&
      selectedDiscipline !== safeToString(session?.idDiscipline)
    ) {
      form.setValue('idInstructor', '');
      form.setValue('idTrainingSchedule', '');
      setSelectedSchedule(null);
    }
  }, [selectedDiscipline, form, session?.idDiscipline]);

  // Reset schedule fields when date changes
  useEffect(() => {
    if (selectedDate) {
      form.setValue('idTrainingSchedule', '');
      setSelectedSchedule(null);
    }
  }, [selectedDate, form]);

  // Update selected schedule when training schedule is selected
  useEffect(() => {
    if (watchedScheduleId && availableTrainingSchedules.length > 0) {
      const schedule = availableTrainingSchedules.find(
        (s) => s.id.toString() === watchedScheduleId
      );
      setSelectedSchedule(schedule || null);
    }
  }, [watchedScheduleId, availableTrainingSchedules]);

  // Try to find and select the current schedule on initial load
  useEffect(() => {
    if (
      session &&
      availableTrainingSchedules.length > 0 &&
      !watchedScheduleId &&
      session.startingTime &&
      session.endingTime
    ) {
      const currentSchedule = availableTrainingSchedules.find(
        (schedule) =>
          formatTime(schedule.startTime) === formatTime(session.startingTime) &&
          formatTime(schedule.endTime) === formatTime(session.endingTime)
      );

      if (currentSchedule) {
        form.setValue('idTrainingSchedule', currentSchedule.id.toString());
        setSelectedSchedule(currentSchedule);
      }
    }
  }, [availableTrainingSchedules, session, watchedScheduleId, form]);

  const getWeekdayText = (weekday: string) => {
    const weekdayMap: Record<string, string> = {
      monday: 'Segunda-feira',
      tuesday: 'Terça-feira',
      wednesday: 'Quarta-feira',
      thursday: 'Quinta-feira',
      friday: 'Sexta-feira',
      saturday: 'Sábado',
      sunday: 'Domingo',
    };
    return weekdayMap[weekday] || weekday;
  };

  const onSubmit = async (data: SessionFormValues) => {
    try {
      if (!session?.id) {
        toast.error('Erro: ID da sessão não encontrado');
        return;
      }

      if (!selectedSchedule) {
        toast.error('Erro: horário não encontrado');
        return;
      }

      const payload = {
        id: session.id,
        idDiscipline: Number(data.idDiscipline),
        idInstructor: Number(data.idInstructor),
        date: data.date,
        startingTime: formatTime(selectedSchedule.startTime),
        endingTime: formatTime(selectedSchedule.endTime),
        isLastSessionOfDay: data.isLastSessionOfDay,
      };

      await updateSession.mutateAsync(payload);
      toast.success('Aula atualizada com sucesso!');
      onSuccess();
    } catch (error) {
      toast.error('Erro ao atualizar aula');
    }
  };

  // Guard clause for invalid session
  if (!session || !session.id) {
    return (
      <div className='rounded-md border border-red-200 bg-red-50 p-4 text-center'>
        <p className='text-sm text-red-700'>
          Erro: Dados da sessão não encontrados ou inválidos.
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='rounded-lg border border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4'>
        <div className='mb-4 flex items-center gap-3'>
          <div className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-100'>
            <Edit3 className='h-4 w-4 text-blue-600' />
          </div>
          <div>
            <h3 className='text-lg font-semibold text-gray-900'>Editar Aula</h3>
            <p className='text-sm text-gray-600'>
              Atualize os dados da aula selecionada
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='grid gap-4 md:grid-cols-2'>
            <FormField
              control={form.control}
              name='idDiscipline'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-medium text-gray-700'>
                    Disciplina *
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedDiscipline(value);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className='h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20'>
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
                  <FormLabel className='text-sm font-medium text-gray-700'>
                    Instrutor *
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!selectedDiscipline}
                  >
                    <FormControl>
                      <SelectTrigger className='h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 disabled:bg-gray-50'>
                        <SelectValue
                          placeholder={
                            !selectedDiscipline
                              ? 'Selecione uma disciplina primeiro'
                              : availableInstructors.length === 0
                                ? 'Nenhum instrutor disponível'
                                : 'Escolha um instrutor'
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableInstructors.map((instructor) => (
                        <SelectItem
                          key={instructor.idInstructor}
                          value={instructor.idInstructor.toString()}
                        >
                          <div className='flex items-center gap-2'>
                            <UserCheck className='h-4 w-4 text-gray-400' />
                            {instructor.instructorName}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                  {selectedDiscipline && availableInstructors.length === 0 && (
                    <div className='rounded-md border border-amber-200 bg-amber-50 p-2'>
                      <p className='text-xs text-amber-700'>
                        Nenhum instrutor encontrado para esta disciplina.
                      </p>
                    </div>
                  )}
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name='date'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-sm font-medium text-gray-700'>
                  Data da Aula *
                </FormLabel>
                <FormControl>
                  <Input
                    type='date'
                    className='h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20'
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setSelectedDate(e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
                {selectedDate && selectedWeekday && (
                  <div className='rounded-md border border-emerald-200 bg-emerald-50 p-2'>
                    <p className='text-xs text-emerald-700'>
                      📅 Dia da semana: {getWeekdayText(selectedWeekday)}
                    </p>
                  </div>
                )}
              </FormItem>
            )}
          />

          {selectedDate && (
            <FormField
              control={form.control}
              name='idTrainingSchedule'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-medium text-gray-700'>
                    Horário Disponível *
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={availableTrainingSchedules.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger className='h-10 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 disabled:bg-gray-50'>
                        <SelectValue
                          placeholder={
                            availableTrainingSchedules.length === 0
                              ? `Nenhum horário disponível para ${getWeekdayText(selectedWeekday)}`
                              : 'Escolha um horário'
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableTrainingSchedules.map((schedule) => (
                        <SelectItem
                          key={schedule.id}
                          value={schedule.id.toString()}
                        >
                          <div className='flex items-center gap-2'>
                            <Clock className='h-4 w-4 text-gray-400' />
                            <span>
                              {formatTime(schedule.startTime)} -{' '}
                              {formatTime(schedule.endTime)}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                  {availableTrainingSchedules.length === 0 &&
                    selectedWeekday && (
                      <div className='rounded-md border border-amber-200 bg-amber-50 p-2'>
                        <p className='text-xs text-amber-700'>
                          Nenhum horário de treino encontrado para{' '}
                          {getWeekdayText(selectedWeekday)} nesta disciplina.
                        </p>
                      </div>
                    )}
                  {selectedSchedule && (
                    <div className='rounded-md border border-blue-200 bg-blue-50 p-2'>
                      <p className='text-xs text-blue-700'>
                        ⏰ Horário selecionado:{' '}
                        {formatTime(selectedSchedule.startTime)} -{' '}
                        {formatTime(selectedSchedule.endTime)}
                      </p>
                    </div>
                  )}
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name='isLastSessionOfDay'
            render={({ field }) => (
              <FormItem>
                <div className='flex items-start space-x-3 rounded-lg border-2 border-dashed border-orange-200 bg-white p-4'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className='mt-1'
                    />
                  </FormControl>
                  <div className='space-y-1'>
                    <FormLabel className='cursor-pointer text-sm font-medium text-gray-900'>
                      Última aula do dia
                    </FormLabel>
                    <p className='text-xs text-gray-600'>
                      Marque esta opção se esta for a última aula programada
                      para o dia selecionado.
                    </p>
                  </div>
                </div>
              </FormItem>
            )}
          />

          {/* Summary */}
          {selectedSchedule && (
            <div className='rounded-lg border border-gray-200 bg-white p-4'>
              <h4 className='mb-2 text-sm font-semibold text-gray-900'>
                Resumo da Aula
              </h4>
              <div className='space-y-1 text-xs text-gray-600'>
                <p>
                  <strong>Data:</strong>{' '}
                  {selectedDate &&
                    new Date(selectedDate).toLocaleDateString('pt-BR')}{' '}
                  ({getWeekdayText(selectedWeekday)})
                </p>
                <p>
                  <strong>Horário:</strong>{' '}
                  {formatTime(selectedSchedule.startTime)} -{' '}
                  {formatTime(selectedSchedule.endTime)}
                </p>
              </div>
            </div>
          )}

          <div className='flex justify-end space-x-3 border-t border-gray-100 pt-4'>
            <Button
              type='submit'
              disabled={updateSession.isPending}
              className='flex items-center gap-2 bg-green-600 hover:bg-green-700'
            >
              {updateSession.isPending ? (
                <>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  Atualizando...
                </>
              ) : (
                <>
                  <Edit3 className='h-4 w-4' />
                  Atualizar Aula
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
