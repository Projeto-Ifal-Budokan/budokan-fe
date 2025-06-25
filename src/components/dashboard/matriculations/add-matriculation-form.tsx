'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Separator } from '@/components/ui/separator';
import { useManageDisciplines } from '@/lib/api/queries/use-manage-disciplines';
import { useManageInstructors } from '@/lib/api/queries/use-manage-instructors';
import { useManageMatriculations } from '@/lib/api/queries/use-manage-matriculations';
import { useManageRankings } from '@/lib/api/queries/use-manage-rankings';
import { useManageUsers } from '@/lib/api/queries/use-manage-users';
import { cn } from '@/lib/utils';
import {
  CreateMatriculationData,
  createMatriculationSchema,
} from '@/types/matriculation';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  CreditCard,
  GraduationCap,
  Loader2,
  Star,
  User,
  UserCheck,
} from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface AddMatriculationFormProps {
  onSuccess: () => void;
}

export function AddMatriculationForm({ onSuccess }: AddMatriculationFormProps) {
  const { createMatriculation } = useManageMatriculations();
  const { createInstructorDiscipline } = useManageInstructors();
  const { useDisciplines } = useManageDisciplines();
  const { useUsers } = useManageUsers();
  const { useRankings } = useManageRankings();

  const { data: disciplinesResponse } = useDisciplines();
  const { data: usersResponse } = useUsers();
  const { data: rankingsResponse } = useRankings();

  const disciplines = disciplinesResponse?.data?.items || [];
  const users = usersResponse?.data?.items || [];
  const rankings = rankingsResponse?.data?.items || [];

  const form = useForm<CreateMatriculationData>({
    resolver: zodResolver(createMatriculationSchema),
    defaultValues: {
      type: 'student',
      isPaymentExempt: false,
    },
  });

  useEffect(() => {
    console.log(form.formState.errors);
  }, [form.formState.errors]);

  const selectedDiscipline = form.watch('idDiscipline');
  const selectedUser = form.watch(
    form.watch('type') === 'instructor' ? 'idInstructor' : 'idStudent'
  );
  const selectedType = form.watch('type');
  const selectedRank = form.watch('idRank');

  const filteredRankings = rankings.filter(
    (rank) => rank.idDiscipline === selectedDiscipline
  );

  const selectedUserData = users.find((user) => user.id === selectedUser);
  const selectedDisciplineData = disciplines.find(
    (discipline) => discipline.id === selectedDiscipline
  );
  const selectedRankData = rankings.find((rank) => rank.id === selectedRank);

  const onSubmit = async (data: CreateMatriculationData) => {
    try {
      if (data.type === 'student') {
        await createMatriculation.mutateAsync({
          idStudent: data.idStudent,
          idDiscipline: data.idDiscipline,
          idRank: data.idRank,
        });
      } else if (data.type === 'instructor') {
        await createInstructorDiscipline.mutateAsync({
          idInstructor: data.idInstructor!,
          idDiscipline: data.idDiscipline,
          idRank: data.idRank,
        });
      }
      onSuccess();
    } catch (error) {
      console.error(
        'Error creating matriculation/instructor discipline:',
        error
      );
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

  // Progress tracking
  const steps = [
    { number: 1, title: 'Usuário', icon: User, completed: !!selectedUser },
    { number: 2, title: 'Tipo', icon: UserCheck, completed: !!selectedType },
    {
      number: 3,
      title: 'Disciplina',
      icon: BookOpen,
      completed: !!selectedDiscipline,
    },
    { number: 4, title: 'Graduação', icon: Star, completed: !!selectedRank },
  ];

  const isSubmitting =
    createMatriculation.isPending || createInstructorDiscipline.isPending;

  return (
    <div className='space-y-6 overflow-hidden'>
      {/* Progress Steps */}
      <div className='flex items-center justify-center gap-4'>
        {steps.map((step, index) => (
          <div key={step.number} className='flex items-center'>
            <motion.div
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300',
                step.completed
                  ? 'border-green-500 bg-green-500 text-white'
                  : 'border-gray-300 bg-gray-100 text-gray-500'
              )}
              animate={{ scale: step.completed ? 1.1 : 1 }}
            >
              {step.completed ? (
                <CheckCircle2 className='h-5 w-5' />
              ) : (
                <step.icon className='h-5 w-5' />
              )}
            </motion.div>
            <div className='ml-2'>
              <p
                className={cn(
                  'text-sm font-medium',
                  step.completed ? 'text-green-600' : 'text-gray-500'
                )}
              >
                {step.title}
              </p>
            </div>
            {index < steps.length - 1 && (
              <ArrowRight className='mx-4 h-4 w-4 text-gray-400' />
            )}
          </div>
        ))}
      </div>

      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          {/* Grid Layout for Form Sections */}
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
            {/* User Selection */}
            <Card className='border-2 transition-all duration-300 hover:border-blue-200'>
              <CardHeader className='pb-3'>
                <CardTitle className='flex items-center gap-2 text-lg'>
                  <User className='h-5 w-5 text-blue-600' />
                  Seleção do Usuário
                </CardTitle>
                <CardDescription>
                  Escolha o usuário que será matriculado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name={
                    selectedType === 'instructor' ? 'idInstructor' : 'idStudent'
                  }
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-base font-medium'>
                        Usuário
                      </FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger className='h-12'>
                            <SelectValue placeholder='Selecione um usuário' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <ScrollArea className='h-60'>
                            {users.map((user) => (
                              <SelectItem
                                key={user.id}
                                value={user.id.toString()}
                              >
                                <div className='flex items-center gap-3 py-2'>
                                  <Avatar className='h-8 w-8'>
                                    {/* <AvatarImage src={user.avatar} /> */}
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
                      {selectedUserData && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className='mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3'
                        >
                          <div className='flex items-center gap-3'>
                            <Avatar className='h-10 w-10'>
                              {/* <AvatarImage src={selectedUserData.avatar} /> */}
                              <AvatarFallback className='bg-gradient-to-br from-blue-500 to-indigo-600 text-white'>
                                {getInitials(
                                  selectedUserData.firstName,
                                  selectedUserData.surname
                                )}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className='font-medium text-blue-900'>
                                {selectedUserData.firstName}{' '}
                                {selectedUserData.surname}
                              </p>
                              <p className='text-sm text-blue-600'>
                                {selectedUserData.email}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Type Selection */}
            <Card className='border-2 transition-all duration-300 hover:border-blue-200'>
              <CardHeader className='pb-3'>
                <CardTitle className='flex items-center gap-2 text-lg'>
                  <UserCheck className='h-5 w-5 text-blue-600' />
                  Tipo de Matrícula
                </CardTitle>
                <CardDescription>
                  Defina o tipo de participação do usuário
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name='type'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-base font-medium'>
                        Tipo
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className='h-12'>
                            <SelectValue placeholder='Selecione o tipo' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='student'>
                            <div className='flex items-center gap-3 py-2'>
                              <GraduationCap className='h-5 w-5 text-blue-600' />
                              <div>
                                <p className='font-medium'>Aluno</p>
                                <p className='text-muted-foreground text-sm'>
                                  Participante regular das aulas
                                </p>
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem value='instructor'>
                            <div className='flex items-center gap-3 py-2'>
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
                      {selectedType && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className='mt-3'
                        >
                          <Badge
                            variant={
                              selectedType === 'instructor'
                                ? 'default'
                                : 'secondary'
                            }
                            className='text-sm'
                          >
                            {selectedType === 'student' ? 'Aluno' : 'Instrutor'}
                          </Badge>
                        </motion.div>
                      )}
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Discipline and Rank Selection */}
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
            {/* Discipline */}
            <Card className='border-2 transition-all duration-300 hover:border-blue-200'>
              <CardHeader className='pb-3'>
                <CardTitle className='flex items-center gap-2 text-lg'>
                  <BookOpen className='h-5 w-5 text-purple-600' />
                  Disciplina
                </CardTitle>
                <CardDescription>
                  Selecione a disciplina para a matrícula
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name='idDiscipline'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-base font-medium'>
                        Disciplina
                      </FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(Number(value));
                          form.setValue('idRank', 0);
                        }}
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger className='h-12'>
                            <SelectValue placeholder='Selecione uma disciplina' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <ScrollArea className='h-60'>
                            {disciplines.map((discipline) => (
                              <SelectItem
                                key={discipline.id}
                                value={discipline.id.toString()}
                              >
                                <div className='flex items-center gap-3 py-2'>
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
                      {selectedDisciplineData && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className='mt-3 rounded-lg border border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 p-3'
                        >
                          <div
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${getDisciplineColor(selectedDisciplineData.name)}`}
                          >
                            <BookOpen className='h-3 w-3' />
                            {selectedDisciplineData.name}
                          </div>
                        </motion.div>
                      )}
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Rank */}
            <Card
              className={cn(
                'border-2 transition-all duration-300',
                selectedDiscipline
                  ? 'opacity-100 hover:border-blue-200'
                  : 'bg-gray-50 opacity-60'
              )}
            >
              <CardHeader className='pb-3'>
                <CardTitle className='flex items-center gap-2 text-lg'>
                  <Star className='h-5 w-5 text-amber-600' />
                  Graduação
                </CardTitle>
                <CardDescription>
                  {selectedDiscipline
                    ? 'Escolha a graduação do usuário'
                    : 'Primeiro selecione uma disciplina'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name='idRank'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-base font-medium'>
                        Graduação
                      </FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value?.toString()}
                        disabled={!selectedDiscipline}
                      >
                        <FormControl>
                          <SelectTrigger className='h-12'>
                            <SelectValue
                              placeholder={
                                selectedDiscipline
                                  ? 'Selecione uma graduação'
                                  : 'Primeiro selecione uma disciplina'
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
                              >
                                <div className='flex items-center gap-3 py-2'>
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
                      {!selectedDiscipline && (
                        <FormDescription className='flex items-center gap-2 text-amber-600'>
                          <AlertCircle className='h-4 w-4' />
                          Selecione uma disciplina primeiro
                        </FormDescription>
                      )}
                      {selectedRankData && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className='mt-3'
                        >
                          <Badge
                            className={`${getRankColor(selectedRankData.name)} border`}
                          >
                            {selectedRankData.name}
                          </Badge>
                        </motion.div>
                      )}
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Payment Options */}
          <Card className='border-2 transition-all duration-300 hover:border-blue-200'>
            <CardHeader className='pb-3'>
              <CardTitle className='flex items-center gap-2 text-lg'>
                <CreditCard className='h-5 w-5 text-blue-600' />
                Opções de Pagamento
              </CardTitle>
              <CardDescription>
                Configure as condições de pagamento da matrícula
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name='isPaymentExempt'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-start space-y-0 space-x-3 rounded-lg border p-4 transition-colors hover:bg-gray-50'>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className='mt-1'
                      />
                    </FormControl>
                    <div className='flex-1 space-y-1 leading-none'>
                      <FormLabel className='cursor-pointer text-base font-medium'>
                        Isento de pagamento
                      </FormLabel>
                      <FormDescription className='text-muted-foreground text-sm'>
                        Marque esta opção se o aluno está isento das taxas de
                        matrícula
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Summary Section */}
          {(selectedUserData || selectedDisciplineData || selectedRankData) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className='rounded-lg border border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50 p-4'
            >
              <h4 className='mb-3 flex items-center gap-2 font-medium text-gray-900'>
                <CheckCircle2 className='h-5 w-5 text-green-600' />
                Resumo da Matrícula:
              </h4>
              <div className='grid grid-cols-1 gap-4 text-sm md:grid-cols-4'>
                <div>
                  <span className='text-gray-600'>Usuário:</span>
                  <p className='font-medium text-gray-900'>
                    {selectedUserData
                      ? `${selectedUserData.firstName} ${selectedUserData.surname}`
                      : 'Não selecionado'}
                  </p>
                </div>
                <div>
                  <span className='text-gray-600'>Tipo:</span>
                  <p className='font-medium text-gray-900'>
                    {selectedType === 'student'
                      ? 'Aluno'
                      : selectedType === 'instructor'
                        ? 'Instrutor'
                        : 'Não selecionado'}
                  </p>
                </div>
                <div>
                  <span className='text-gray-600'>Disciplina:</span>
                  <p className='font-medium text-gray-900'>
                    {selectedDisciplineData
                      ? selectedDisciplineData.name
                      : 'Não selecionada'}
                  </p>
                </div>
                <div>
                  <span className='text-gray-600'>Graduação:</span>
                  <p className='font-medium text-gray-900'>
                    {selectedRankData
                      ? selectedRankData.name
                      : 'Não selecionada'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <Separator />

          {/* Submit Button */}
          <div className='flex justify-end pt-4'>
            <Button
              type='submit'
              disabled={isSubmitting}
              size='lg'
              className='transform rounded-lg bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-8 py-3 font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 hover:shadow-xl'
            >
              {isSubmitting ? (
                <>
                  <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                  {selectedType === 'student'
                    ? 'Criando Matrícula...'
                    : 'Associando Disciplina...'}
                </>
              ) : (
                <>
                  <CheckCircle2 className='mr-2 h-5 w-5' />
                  {selectedType === 'student'
                    ? 'Criar Matrícula'
                    : 'Associar Disciplina'}
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
