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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useManageDisciplines } from '@/lib/api/queries/use-manage-disciplines';
import { useManageMatriculations } from '@/lib/api/queries/use-manage-matriculations';
import { useManageRankings } from '@/lib/api/queries/use-manage-rankings';
import { useManageUsers } from '@/lib/api/queries/use-manage-users';
import {
  CreateMatriculationData,
  createMatriculationSchema,
} from '@/types/matriculation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface AddMatriculationFormProps {
  onSuccess: () => void;
}

export function AddMatriculationForm({ onSuccess }: AddMatriculationFormProps) {
  const { createMatriculation } = useManageMatriculations();
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
      idUser: 0,
      idDiscipline: 0,
      idRank: 0,
      type: 'student',
      isPaymentExempt: false,
    },
  });

  const selectedDiscipline = form.watch('idDiscipline');
  const filteredRankings = rankings.filter(
    (rank) => rank.idDiscipline === selectedDiscipline
  );

  const onSubmit = async (data: CreateMatriculationData) => {
    try {
      await createMatriculation.mutateAsync({
        idUser: data.idUser,
        idDiscipline: data.idDiscipline,
        idRank: data.idRank,
        type: data.type,
        isPaymentExempt: data.isPaymentExempt ?? false,
      });
      onSuccess();
    } catch (error) {
      console.error('Error creating matriculation:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='idUser'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Usuário</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Selecione um usuário' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.firstName} {user.surname} ({user.email})
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
          name='type'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Selecione o tipo' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='student'>Aluno</SelectItem>
                  <SelectItem value='instructor'>Instrutor</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='idDiscipline'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Disciplina</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(Number(value));
                  form.setValue('idRank', 0); // Reset rank when discipline changes
                }}
                value={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Selecione uma disciplina' />
                  </SelectTrigger>
                </FormControl>
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
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='idRank'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rank</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value?.toString()}
                disabled={!selectedDiscipline}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Selecione um rank' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {filteredRankings.map((rank) => (
                    <SelectItem key={rank.id} value={rank.id.toString()}>
                      {rank.name}
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
          name='isPaymentExempt'
          render={({ field }) => (
            <FormItem className='flex flex-row items-start space-y-0 space-x-3'>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className='space-y-1 leading-none'>
                <FormLabel>Isento de pagamento</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <div className='flex justify-end gap-3'>
          <Button
            type='submit'
            disabled={createMatriculation.isPending}
            className='bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
          >
            {createMatriculation.isPending && (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            )}
            Criar Matrícula
          </Button>
        </div>
      </form>
    </Form>
  );
}
