'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useManageDisciplines } from '@/lib/api/queries/use-manage-disciplines';
import { useManageInstructors } from '@/lib/api/queries/use-manage-instructors';
import { useManageMatriculations } from '@/lib/api/queries/use-manage-matriculations';
import { useManageRankings } from '@/lib/api/queries/use-manage-rankings';
import { useManageUsers } from '@/lib/api/queries/use-manage-users';
import {
  CreateMatriculationData,
  createMatriculationSchema,
} from '@/types/matriculation';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  GraduationCap,
  Loader2,
  Star,
  User,
  UserCheck,
} from 'lucide-react';
import { MouseEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface AddMatriculationFormProps {
  onSuccess: () => void;
}

const steps = [
  {
    id: 1,
    title: 'Usuário & Tipo',
    description: 'Selecione o usuário e tipo de matrícula',
    icon: User,
    fields: ['idStudent', 'idInstructor', 'type'] as const,
  },
  {
    id: 2,
    title: 'Disciplina',
    description: 'Escolha a disciplina para a matrícula',
    icon: BookOpen,
    fields: ['idDiscipline'] as const,
  },
  {
    id: 3,
    title: 'Graduação',
    description: 'Defina a graduação do usuário',
    icon: Star,
    fields: ['idRank'] as const,
  },
  {
    id: 4,
    title: 'Pagamento & Resumo',
    description: 'Configure opções e confirme a matrícula',
    icon: CreditCard,
    fields: ['isPaymentExempt'] as const,
  },
] as const;

export function AddMatriculationForm({ onSuccess }: AddMatriculationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('');

  const { createMatriculation } = useManageMatriculations();
  const { createInstructorDiscipline } = useManageInstructors();
  const { useDisciplines } = useManageDisciplines();
  const { useUsers } = useManageUsers();
  const { useRankings } = useManageRankings();

  const { data: disciplinesResponse } = useDisciplines();
  const { data: usersResponse } = useUsers();

  const disciplines = disciplinesResponse?.data?.items || [];
  const users = usersResponse?.data?.items || [];

  const form = useForm<CreateMatriculationData>({
    resolver: zodResolver(createMatriculationSchema),
    defaultValues: {
      type: 'student',
      isPaymentExempt: false,
    },
  });

  // Watch form values
  const watchedType = form.watch('type');
  const selectedUser = form.watch(
    watchedType === 'instructor' ? 'idInstructor' : 'idStudent'
  );
  const selectedDisciplineId = form.watch('idDiscipline');
  const selectedRank = form.watch('idRank');

  // Fetch rankings only for selected discipline
  const { data: rankingsResponse } = useRankings(
    selectedDisciplineId?.toString() || ''
  );
  const filteredRankings = rankingsResponse?.data?.items || [];

  // Get data objects
  const selectedUserData = users.find((user) => user.id === selectedUser);
  const selectedDisciplineData = disciplines.find(
    (discipline) => discipline.id === selectedDisciplineId
  );
  const selectedRankData = filteredRankings.find(
    (rank) => rank.id === selectedRank
  );

  const isSubmitting =
    createMatriculation.isPending || createInstructorDiscipline.isPending;

  // Reset dependent fields when type changes
  useEffect(() => {
    if (watchedType !== selectedType) {
      setSelectedType(watchedType);
      form.setValue('idStudent', 0);
      form.setValue('idInstructor', 0);
    }
  }, [watchedType, selectedType, form]);

  // Reset rank when discipline changes
  useEffect(() => {
    if (
      selectedDisciplineId &&
      selectedDisciplineId.toString() !== selectedDiscipline
    ) {
      setSelectedDiscipline(selectedDisciplineId.toString());
      form.setValue('idRank', 0);
    }
  }, [selectedDisciplineId, selectedDiscipline, form]);

  const isStepValid = async (step: number) => {
    const currentStepFields = steps[step - 1].fields;

    // Custom validation for step 1 (user and type)
    if (step === 1) {
      const type = form.getValues('type');
      const userId =
        type === 'instructor'
          ? form.getValues('idInstructor')
          : form.getValues('idStudent');
      return !!(type && userId);
    }

    const result = await form.trigger(currentStepFields);
    return result;
  };

  const nextStep = async (e?: MouseEvent<HTMLButtonElement>) => {
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

  const onSubmit = async (data: CreateMatriculationData) => {
    try {
      if (data.type === 'student') {
        await createMatriculation.mutateAsync({
          idStudent: data.idStudent,
          idDiscipline: data.idDiscipline,
          idRank: data.idRank,
        });
        toast.success('Matrícula de aluno criada com sucesso!');
      } else if (data.type === 'instructor') {
        await createInstructorDiscipline.mutateAsync({
          idInstructor: data.idInstructor!,
          idDiscipline: data.idDiscipline,
          idRank: data.idRank,
        });
        toast.success('Instrutor associado à disciplina com sucesso!');
      }
      form.reset();
      setCurrentStep(1);
      setSelectedType('');
      setSelectedDiscipline('');
      onSuccess();
    } catch (error) {
      console.error(
        'Error creating matriculation/instructor discipline:',
        error
      );
      toast.error('Erro ao criar matrícula. Tente novamente.');
    }
  };

  const getInitials = (firstName?: string, surname?: string) => {
    return `${firstName?.[0] || ''}${surname?.[0] || ''}`.toUpperCase();
  };

  const getDisciplineColor = (disciplineName: string) => {
    const colors = [
      'bg-blue-50 text-blue-700 border-blue-200',
      'bg-purple-50 text-purple-700 border-purple-200',
      'bg-green-50 text-green-700 border-green-200',
      'bg-orange-50 text-orange-700 border-orange-200',
    ];
    const index = disciplineName.length % colors.length;
    return colors[index];
  };

  const getRankColor = (rankName: string) => {
    if (rankName.includes('Dan')) {
      return 'bg-gray-900 text-white border-gray-700';
    }
    if (rankName.includes('Kyu')) {
      return 'bg-amber-50 text-amber-700 border-amber-200';
    }
    return 'bg-gray-50 text-gray-700 border-gray-200';
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
          {/* Step 1: User & Type */}
          {currentStep === 1 && (
            <div className='space-y-6'>
              <div className='rounded-lg border border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6'>
                <div className='mb-6 flex items-center gap-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-100'>
                    <User className='h-5 w-5 text-blue-600' />
                  </div>
                  <div>
                    <h3 className='text-xl font-semibold text-gray-900'>
                      Usuário e Tipo de Matrícula
                    </h3>
                    <p className='text-gray-600'>
                      Primeiro, escolha o tipo de matrícula e selecione o
                      usuário
                    </p>
                  </div>
                </div>

                <div className='grid gap-6 md:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='type'
                    render={({ field }) => (
                      <FormItem className='space-y-3'>
                        <FormLabel className='text-sm font-medium text-gray-700'>
                          Tipo de Matrícula *
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className='h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20'>
                              <SelectValue placeholder='Selecione o tipo' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='student' className='py-3'>
                              <div className='flex items-center gap-3'>
                                <GraduationCap className='h-5 w-5 text-blue-600' />
                                <div>
                                  <p className='font-medium'>Aluno</p>
                                  <p className='text-muted-foreground text-sm'>
                                    Participante regular das aulas
                                  </p>
                                </div>
                              </div>
                            </SelectItem>
                            <SelectItem value='instructor' className='py-3'>
                              <div className='flex items-center gap-3'>
                                <UserCheck className='h-5 w-5 text-green-600' />
                                <div>
                                  <p className='font-medium'>Instrutor</p>
                                  <p className='text-muted-foreground text-sm'>
                                    Responsável pelo ensino da disciplina
                                  </p>
                                </div>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={
                      watchedType === 'instructor'
                        ? 'idInstructor'
                        : 'idStudent'
                    }
                    render={({ field }) => (
                      <FormItem className='space-y-3'>
                        <FormLabel className='text-sm font-medium text-gray-700'>
                          Usuário *
                        </FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          value={field.value?.toString()}
                          disabled={!watchedType}
                        >
                          <FormControl>
                            <SelectTrigger className='h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 disabled:bg-gray-50'>
                              <SelectValue
                                placeholder={
                                  !watchedType
                                    ? 'Primeiro selecione o tipo'
                                    : 'Escolha um usuário'
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <ScrollArea className='h-60'>
                              {users.map((user) => (
                                <SelectItem
                                  key={user.id}
                                  value={user.id.toString()}
                                  className='py-3'
                                >
                                  <div className='flex items-center gap-3'>
                                    <Avatar className='h-8 w-8'>
                                      <AvatarFallback className='bg-gradient-to-br from-blue-500 to-indigo-600 text-xs text-white'>
                                        {getInitials(
                                          user.firstName,
                                          user.surname
                                        )}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className='font-medium'>
                                        {user.firstName} {user.surname}
                                      </p>
                                      <p className='text-muted-foreground text-sm'>
                                        {user.email}
                                      </p>
                                    </div>
                                  </div>
                                </SelectItem>
                              ))}
                            </ScrollArea>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* User Preview */}
                {selectedUserData && (
                  <div className='mt-6 rounded-lg border border-blue-200 bg-white p-4'>
                    <h4 className='mb-3 text-sm font-medium text-gray-700'>
                      Usuário Selecionado:
                    </h4>
                    <div className='flex items-center gap-3'>
                      <Avatar className='h-12 w-12'>
                        <AvatarFallback className='bg-gradient-to-br from-blue-500 to-indigo-600 text-white'>
                          {getInitials(
                            selectedUserData.firstName,
                            selectedUserData.surname
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div className='flex-1'>
                        <p className='font-semibold text-gray-900'>
                          {selectedUserData.firstName}{' '}
                          {selectedUserData.surname}
                        </p>
                        <p className='text-sm text-gray-600'>
                          {selectedUserData.email}
                        </p>
                        <Badge
                          variant={
                            watchedType === 'instructor'
                              ? 'default'
                              : 'secondary'
                          }
                          className='mt-1'
                        >
                          {watchedType === 'student' ? 'Aluno' : 'Instrutor'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Discipline */}
          {currentStep === 2 && (
            <div className='space-y-6'>
              <div className='rounded-lg border border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50 p-6'>
                <div className='mb-6 flex items-center gap-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-purple-100'>
                    <BookOpen className='h-5 w-5 text-purple-600' />
                  </div>
                  <div>
                    <h3 className='text-xl font-semibold text-gray-900'>
                      Seleção da Disciplina
                    </h3>
                    <p className='text-gray-600'>
                      Escolha a disciplina para esta matrícula
                    </p>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name='idDiscipline'
                  render={({ field }) => (
                    <FormItem className='space-y-3'>
                      <FormLabel className='text-sm font-medium text-gray-700'>
                        Disciplina *
                      </FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger className='h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20'>
                            <SelectValue placeholder='Selecione uma disciplina' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <ScrollArea className='h-60'>
                            {disciplines.map((discipline) => (
                              <SelectItem
                                key={discipline.id}
                                value={discipline.id.toString()}
                                className='py-3'
                              >
                                <div className='flex items-center gap-3'>
                                  <div className='h-3 w-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500'></div>
                                  <span className='font-medium'>
                                    {discipline.name}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </ScrollArea>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Discipline Preview */}
                {selectedDisciplineData && (
                  <div className='mt-6 rounded-lg border border-purple-200 bg-white p-4'>
                    <h4 className='mb-3 text-sm font-medium text-gray-700'>
                      Disciplina Selecionada:
                    </h4>
                    <div className='flex items-center gap-3'>
                      <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500'>
                        <BookOpen className='h-6 w-6 text-white' />
                      </div>
                      <div className='flex-1'>
                        <p className='font-semibold text-gray-900'>
                          {selectedDisciplineData.name}
                        </p>
                        <Badge
                          className={`mt-1 ${getDisciplineColor(selectedDisciplineData.name)} border`}
                        >
                          <BookOpen className='mr-1 h-3 w-3' />
                          {selectedDisciplineData.name}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Rank */}
          {currentStep === 3 && (
            <div className='space-y-6'>
              <div className='rounded-lg border border-gray-200 bg-gradient-to-r from-amber-50 to-yellow-50 p-6'>
                <div className='mb-6 flex items-center gap-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-amber-100'>
                    <Star className='h-5 w-5 text-amber-600' />
                  </div>
                  <div>
                    <h3 className='text-xl font-semibold text-gray-900'>
                      Seleção da Graduação
                    </h3>
                    <p className='text-gray-600'>
                      Defina a graduação do usuário na disciplina selecionada
                    </p>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name='idRank'
                  render={({ field }) => (
                    <FormItem className='space-y-3'>
                      <FormLabel className='text-sm font-medium text-gray-700'>
                        Graduação *
                      </FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value?.toString()}
                        disabled={!selectedDisciplineId}
                      >
                        <FormControl>
                          <SelectTrigger className='h-12 border-gray-200 focus:border-amber-500 focus:ring-amber-500/20 disabled:bg-gray-50'>
                            <SelectValue
                              placeholder={
                                !selectedDisciplineId
                                  ? 'Primeiro selecione uma disciplina'
                                  : filteredRankings.length === 0
                                    ? 'Nenhuma graduação disponível'
                                    : 'Selecione uma graduação'
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <ScrollArea className='h-60'>
                            {filteredRankings.map((rank) => (
                              <SelectItem
                                key={rank.id}
                                value={rank.id.toString()}
                                className='py-3'
                              >
                                <div className='flex items-center gap-3'>
                                  <Award className='h-4 w-4 text-yellow-600' />
                                  <span className='font-medium'>
                                    {rank.name}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </ScrollArea>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                      {!selectedDisciplineId && (
                        <FormDescription className='flex items-center gap-2 text-amber-600'>
                          <Star className='h-4 w-4' />
                          Selecione uma disciplina primeiro
                        </FormDescription>
                      )}
                    </FormItem>
                  )}
                />

                {/* Rank Preview */}
                {selectedRankData && (
                  <div className='mt-6 rounded-lg border border-amber-200 bg-white p-4'>
                    <h4 className='mb-3 text-sm font-medium text-gray-700'>
                      Graduação Selecionada:
                    </h4>
                    <div className='flex items-center gap-3'>
                      <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-yellow-500'>
                        <Star className='h-6 w-6 text-white' />
                      </div>
                      <div className='flex-1'>
                        <p className='font-semibold text-gray-900'>
                          {selectedRankData.name}
                        </p>
                        <Badge
                          className={`mt-1 ${getRankColor(selectedRankData.name)} border`}
                        >
                          <Award className='mr-1 h-3 w-3' />
                          {selectedRankData.name}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Payment & Summary */}
          {currentStep === 4 && (
            <div className='space-y-6'>
              <div className='rounded-lg border border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50 p-6'>
                <div className='mb-6 flex items-center gap-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-green-100'>
                    <CreditCard className='h-5 w-5 text-green-600' />
                  </div>
                  <div>
                    <h3 className='text-xl font-semibold text-gray-900'>
                      Pagamento e Confirmação
                    </h3>
                    <p className='text-gray-600'>
                      Configure as opções de pagamento e confirme os dados
                    </p>
                  </div>
                </div>

                {/* Payment Options */}
                <FormField
                  control={form.control}
                  name='isPaymentExempt'
                  render={({ field }) => (
                    <FormItem className='mb-6'>
                      <div className='flex items-start space-x-3 rounded-lg border-2 border-dashed border-green-200 bg-white p-6'>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className='mt-1'
                          />
                        </FormControl>
                        <div className='space-y-2'>
                          <FormLabel className='cursor-pointer text-base font-medium text-gray-900'>
                            Isento de pagamento
                          </FormLabel>
                          <FormDescription className='text-sm text-gray-600'>
                            Marque esta opção se o aluno está isento das taxas
                            de matrícula
                          </FormDescription>
                        </div>
                      </div>
                    </FormItem>
                  )}
                />

                {/* Summary */}
                <div className='rounded-lg border border-gray-200 bg-white p-6'>
                  <h4 className='mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900'>
                    <CheckCircle2 className='h-5 w-5 text-green-600' />
                    Resumo da Matrícula
                  </h4>
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <div className='flex items-center gap-3 rounded-lg bg-gray-50 p-3'>
                      <User className='h-5 w-5 text-blue-600' />
                      <div>
                        <p className='text-sm text-gray-600'>Usuário</p>
                        <p className='font-medium text-gray-900'>
                          {selectedUserData
                            ? `${selectedUserData.firstName} ${selectedUserData.surname}`
                            : 'Não selecionado'}
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center gap-3 rounded-lg bg-gray-50 p-3'>
                      <UserCheck className='h-5 w-5 text-green-600' />
                      <div>
                        <p className='text-sm text-gray-600'>Tipo</p>
                        <p className='font-medium text-gray-900'>
                          {watchedType === 'student' ? 'Aluno' : 'Instrutor'}
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center gap-3 rounded-lg bg-gray-50 p-3'>
                      <BookOpen className='h-5 w-5 text-purple-600' />
                      <div>
                        <p className='text-sm text-gray-600'>Disciplina</p>
                        <p className='font-medium text-gray-900'>
                          {selectedDisciplineData?.name || 'Não selecionada'}
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center gap-3 rounded-lg bg-gray-50 p-3'>
                      <Star className='h-5 w-5 text-amber-600' />
                      <div>
                        <p className='text-sm text-gray-600'>Graduação</p>
                        <p className='font-medium text-gray-900'>
                          {selectedRankData?.name || 'Não selecionada'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
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
                  disabled={isSubmitting}
                  className='flex items-center gap-2 bg-green-600 hover:bg-green-700'
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className='h-4 w-4 animate-spin' />
                      {watchedType === 'student'
                        ? 'Criando Matrícula...'
                        : 'Associando Disciplina...'}
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className='h-4 w-4' />
                      {watchedType === 'student'
                        ? 'Criar Matrícula'
                        : 'Associar Disciplina'}
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
