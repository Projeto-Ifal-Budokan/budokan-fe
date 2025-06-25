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
import { Discipline } from '@/types/discipline';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const disciplineFormSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  description: z.string().min(5, 'Descrição deve ter pelo menos 5 caracteres'),
});

type DisciplineFormValues = z.infer<typeof disciplineFormSchema>;

interface EditDisciplineFormProps {
  discipline: Discipline;
  onEdit: (data: Partial<Discipline>) => void;
  isPending: boolean;
  onCancel: () => void;
}

export function EditDisciplineForm({
  discipline,
  onEdit,
  isPending,
  onCancel,
}: EditDisciplineFormProps) {
  const form = useForm<DisciplineFormValues>({
    resolver: zodResolver(disciplineFormSchema),
    defaultValues: {
      name: discipline.name,
      description: discipline.description,
    },
  });

  const onSubmit = (data: DisciplineFormValues) => {
    onEdit({
      id: discipline.id,
      ...data,
    });
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
            onClick={onCancel}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button
            type='submit'
            disabled={isPending}
            className='bg-gradient-to-r from-emerald-600 to-teal-600'
          >
            {isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Salvar Alterações
          </Button>
        </div>
      </form>
    </Form>
  );
}
