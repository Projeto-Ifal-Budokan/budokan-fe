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
import { Textarea } from '@/components/ui/textarea';
import { useManageDisciplines } from '@/lib/api/queries/use-manage-disciplines';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const disciplineFormSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  description: z.string().min(5, 'Descrição deve ter pelo menos 5 caracteres'),
});

type DisciplineFormValues = z.infer<typeof disciplineFormSchema>;

interface AddDisciplineFormProps {
  onSuccess: () => void;
}

export function AddDisciplineForm({ onSuccess }: AddDisciplineFormProps) {
  const { createDiscipline } = useManageDisciplines();

  const form = useForm<DisciplineFormValues>({
    resolver: zodResolver(disciplineFormSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onSubmit = async (data: DisciplineFormValues) => {
    try {
      await createDiscipline.mutateAsync({
        ...data,
        status: 'active',
      });
      toast.success('Disciplina criada com sucesso!');
      form.reset();
      onSuccess();
    } catch (error) {
      toast.error('Erro ao criar disciplina');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='grid gap-4'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da Disciplina</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Ex: Karate-Do, Kendo, Arqueria...'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Descreva a disciplina, seus objetivos e características...'
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
            disabled={createDiscipline.isPending}
            className='bg-gradient-to-r from-emerald-600 to-teal-600'
          >
            {createDiscipline.isPending && (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            )}
            Criar Disciplina
          </Button>
        </div>
      </form>
    </Form>
  );
}
