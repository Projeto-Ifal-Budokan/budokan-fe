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
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  GraduationCap,
  Loader2,
  Settings,
  UserCheck,
} from 'lucide-react';
import { MouseEvent, useEffect, useMemo, useState } from 'react';
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

interface AddSessionFormProps {
  onSuccess: () => void;
  isAdmin: boolean;
  userDisciplines: Discipline[];
}

const steps = [
  {
    id: 1,
    title: 'Disciplina & Instrutor',
    description: 'Selecione a disciplina e instrutor',
    icon: GraduationCap,
    fields: ['idDiscipline', 'idInstructor'] as const,
  },
  {
    id: 2,
    title: 'Data & Horário',
    description: 'Defina quando a aula acontecerá',
    icon: CalendarDays,
    fields: ['date', 'idTrainingSchedule'] as const,
  },
  {
    id: 3,
    title: 'Configurações',
    description: 'Ajustes finais da aula',
    icon: Settings,
    fields: ['isLastSessionOfDay'] as const,
  },
] as const;

export function AddSessionForm({
  onSuccess,
  isAdmin,
  userDisciplines,
}: AddSessionFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSchedule, setSelectedSchedule] =
    useState<TrainingSchedule | null>(null);

  const { createSession } = useManageSessions();
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
      idDiscipline: '',
      idInstructor: '',
      date: '',
      idTrainingSchedule: '',
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
    return weekdays[date.getDay() + 1];
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

  // Reset dependent fields when discipline changes
  useEffect(() => {
    if (selectedDiscipline) {
      form.setValue('idInstructor', '');
      form.setValue('date', '');
      form.setValue('idTrainingSchedule', '');
      setSelectedDate('');
      setSelectedSchedule(null);
    }
  }, [selectedDiscipline, form]);

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

  const isStepValid = async (step: number) => {
    const currentStepFields = steps[step - 1].fields;
    const result = await form.trigger(currentStepFields);
    return result;
  };

  const nextStep = async (e?: MouseEvent<HTMLButtonElement>) => {
    // Prevent any default form submission behavior
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const isValid = await isStepValid(currentStep);
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: SessionFormValues) => {
    try {
      if (!selectedSchedule) {
        toast.error('Erro: horário não encontrado');
        return;
      }

      const payload = {
        idDiscipline: Number(data.idDiscipline),
        idInstructor: Number(data.idInstructor),
        date: data.date,
        startingTime: selectedSchedule.startTime,
        endingTime: selectedSchedule.endTime,
        isLastSessionOfDay: data.isLastSessionOfDay,
      };

      await createSession.mutateAsync(payload);
      toast.success('Aula criada com sucesso!');
      form.reset();
      setSelectedDiscipline('');
      setSelectedDate('');
      setSelectedSchedule(null);
      setCurrentStep(1);
      onSuccess();
    } catch (error) {
      toast.error('Erro ao criar aula');
    }
  };

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

  const formatTime = (time: string) => {
    return time.length === 8 ? time.slice(0, 5) : time;
  };

  const getStepStatus = (stepNumber: number) => {
    if (stepNumber < currentStep) return 'completed';
    if (stepNumber === currentStep) return 'current';
    return 'upcoming';
  };

  return (
    <div className='space-y-8'>
      {/* Progress Indicator */}
      <div className='flex items-center justify-between'>
        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          const Icon = step.icon;

          return (
            <div key={step.id} className='flex items-center'>
              <div className='flex flex-col items-center'>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                    status === 'completed'
                      ? 'border-green-500 bg-green-500 text-white'
                      : status === 'current'
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-gray-300 bg-white text-gray-400'
                  }`}
                >
                  {status === 'completed' ? (
                    <Check className='h-5 w-5' />
                  ) : (
                    <Icon className='h-5 w-5' />
                  )}
                </div>
                <div className='mt-2 text-center'>
                  <p
                    className={`text-sm font-medium ${
                      status === 'current'
                        ? 'text-blue-600'
                        : status === 'completed'
                          ? 'text-green-600'
                          : 'text-gray-500'
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className='text-xs text-gray-400'>{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`mx-4 h-0.5 w-16 transition-all duration-200 ${
                    status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          {/* Step 1: Discipline & Instructor */}
          {currentStep === 1 && (
            <div className='space-y-6'>
              <div className='rounded-lg border border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6'>
                <div className='mb-6 flex items-center gap-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-100'>
                    <GraduationCap className='h-5 w-5 text-blue-600' />
                  </div>
                  <div>
                    <h3 className='text-xl font-semibold text-gray-900'>
                      Disciplina e Instrutor
                    </h3>
                    <p className='text-gray-600'>
                      Primeiro, vamos selecionar a disciplina e o instrutor
                      responsável pela aula
                    </p>
                  </div>
                </div>

                <div className='grid gap-6 md:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='idDiscipline'
                    render={({ field }) => (
                      <FormItem className='space-y-3'>
                        <FormLabel className='text-sm font-medium text-gray-700'>
                          Disciplina *
                        </FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedDiscipline(value);
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className='h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20'>
                              <SelectValue placeholder='Escolha uma disciplina' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableDisciplines.map(
                              (discipline: Discipline) => (
                                <SelectItem
                                  key={discipline.id}
                                  value={discipline.id.toString()}
                                  className='py-3'
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
                    name='idInstructor'
                    render={({ field }) => (
                      <FormItem className='space-y-3'>
                        <FormLabel className='text-sm font-medium text-gray-700'>
                          Instrutor *
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={!selectedDiscipline}
                        >
                          <FormControl>
                            <SelectTrigger className='h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 disabled:bg-gray-50'>
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
                                key={instructor.id}
                                value={instructor.id.toString()}
                                className='py-3'
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
                        {selectedDiscipline &&
                          availableInstructors.length === 0 && (
                            <div className='rounded-md border border-amber-200 bg-amber-50 p-3'>
                              <p className='text-sm text-amber-700'>
                                Nenhum instrutor encontrado para esta
                                disciplina.
                              </p>
                            </div>
                          )}
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Date & Schedule */}
          {currentStep === 2 && (
            <div className='space-y-6'>
              <div className='rounded-lg border border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-6'>
                <div className='mb-6 flex items-center gap-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100'>
                    <CalendarDays className='h-5 w-5 text-emerald-600' />
                  </div>
                  <div>
                    <h3 className='text-xl font-semibold text-gray-900'>
                      Data e Horário
                    </h3>
                    <p className='text-gray-600'>
                      Escolha a data da aula e selecione um horário disponível
                    </p>
                  </div>
                </div>

                <div className='space-y-6'>
                  <FormField
                    control={form.control}
                    name='date'
                    render={({ field }) => (
                      <FormItem className='space-y-3'>
                        <FormLabel className='text-sm font-medium text-gray-700'>
                          Data da Aula *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type='date'
                            className='h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20'
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              setSelectedDate(e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                        {selectedDate && selectedWeekday && (
                          <div className='rounded-md border border-emerald-200 bg-emerald-50 p-3'>
                            <p className='text-sm text-emerald-700'>
                              📅 Dia da semana:{' '}
                              {getWeekdayText(selectedWeekday)}
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
                        <FormItem className='space-y-3'>
                          <FormLabel className='text-sm font-medium text-gray-700'>
                            Horário Disponível *
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={availableTrainingSchedules.length === 0}
                          >
                            <FormControl>
                              <SelectTrigger className='h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 disabled:bg-gray-50'>
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
                                  className='py-3'
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
                              <div className='rounded-md border border-amber-200 bg-amber-50 p-3'>
                                <p className='text-sm text-amber-700'>
                                  Nenhum horário de treino encontrado para{' '}
                                  {getWeekdayText(selectedWeekday)} nesta
                                  disciplina.
                                </p>
                              </div>
                            )}
                          {selectedSchedule && (
                            <div className='rounded-md border border-blue-200 bg-blue-50 p-3'>
                              <p className='text-sm text-blue-700'>
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
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Additional Settings */}
          {currentStep === 3 && (
            <div className='space-y-6'>
              <div className='rounded-lg border border-gray-200 bg-gradient-to-r from-orange-50 to-amber-50 p-6'>
                <div className='mb-6 flex items-center gap-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-orange-100'>
                    <Settings className='h-5 w-5 text-orange-600' />
                  </div>
                  <div>
                    <h3 className='text-xl font-semibold text-gray-900'>
                      Configurações Finais
                    </h3>
                    <p className='text-gray-600'>
                      Por último, vamos ajustar as configurações extras da aula
                    </p>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name='isLastSessionOfDay'
                  render={({ field }) => (
                    <FormItem>
                      <div className='flex items-start space-x-3 rounded-lg border-2 border-dashed border-orange-200 bg-white p-6'>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className='mt-1'
                          />
                        </FormControl>
                        <div className='space-y-2'>
                          <FormLabel className='cursor-pointer text-base font-medium text-gray-900'>
                            Última aula do dia
                          </FormLabel>
                          <p className='text-sm text-gray-600'>
                            Marque esta opção se esta for a última aula
                            programada para o dia selecionado. Isso pode afetar
                            alguns processos automatizados do sistema.
                          </p>
                        </div>
                      </div>
                    </FormItem>
                  )}
                />

                {/* Summary */}
                {selectedSchedule && (
                  <div className='mt-6 rounded-lg border border-gray-200 bg-white p-6'>
                    <h4 className='mb-4 text-lg font-semibold text-gray-900'>
                      Resumo da Aula
                    </h4>
                    <div className='space-y-2 text-sm text-gray-600'>
                      <p>
                        <strong>Data:</strong>{' '}
                        {selectedDate &&
                          new Date(selectedDate).toLocaleDateString(
                            'pt-BR'
                          )}{' '}
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
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className='flex justify-between border-t border-gray-100 pt-6'>
            <Button
              type='button'
              variant='outline'
              onClick={(e) => {
                e.preventDefault();
                prevStep();
              }}
              disabled={currentStep === 1}
              className='flex items-center gap-2'
            >
              <ChevronLeft className='h-4 w-4' />
              Anterior
            </Button>

            <div className='flex gap-3'>
              {currentStep < steps.length ? (
                <Button
                  type='button'
                  onClick={(e) => {
                    e.preventDefault();
                    nextStep(e);
                  }}
                  className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700'
                >
                  Próximo
                  <ChevronRight className='h-4 w-4' />
                </Button>
              ) : (
                <Button
                  type='submit'
                  disabled={createSession.isPending}
                  className='flex items-center gap-2 bg-green-600 hover:bg-green-700'
                >
                  {createSession.isPending ? (
                    <>
                      <Loader2 className='h-4 w-4 animate-spin' />
                      Criando...
                    </>
                  ) : (
                    <>
                      <Check className='h-4 w-4' />
                      Criar Aula
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
