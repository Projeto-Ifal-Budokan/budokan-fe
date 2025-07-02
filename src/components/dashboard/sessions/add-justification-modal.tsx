'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Textarea } from '@/components/ui/textarea';
import { useManageDailyAbsences } from '@/lib/api/queries/use-manage-daily-absences';
import { CreateDailyAbsenceData } from '@/types/daily-absence';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, FileText } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
  date: z.string().min(1, 'Data é obrigatória'),
  justification: z.enum(['medical', 'personal', 'family', 'work', 'other'], {
    required_error: 'Selecione um tipo de justificativa',
  }),
  justificationDescription: z
    .string()
    .min(10, 'Descrição deve ter pelo menos 10 caracteres')
    .max(500, 'Descrição deve ter no máximo 500 caracteres'),
});

interface AddJustificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  idMatriculation: number;
  studentName: string;
  sessionDate?: string;
}

export function AddJustificationModal({
  isOpen,
  onClose,
  idMatriculation,
  studentName,
  sessionDate,
}: AddJustificationModalProps) {
  const { createDailyAbsence } = useManageDailyAbsences();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: sessionDate || new Date().toISOString().split('T')[0],
      justification: undefined,
      justificationDescription: '',
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const data: CreateDailyAbsenceData = {
        date: values.date,
        idMatriculation,
        justification: values.justification,
        justificationDescription: values.justificationDescription,
      };

      await createDailyAbsence.mutateAsync(data);
      toast.success('Justificativa adicionada com sucesso!');
      form.reset();
      onClose();
    } catch (error) {
      toast.error('Erro ao adicionar justificativa');
    }
  };

  const justificationTypes = [
    { value: 'medical', label: 'Médica', icon: '🏥' },
    { value: 'personal', label: 'Pessoal', icon: '👤' },
    { value: 'family', label: 'Familiar', icon: '👨‍👩‍👧‍👦' },
    { value: 'work', label: 'Trabalho', icon: '💼' },
    { value: 'other', label: 'Outros', icon: '📋' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <FileText className='h-5 w-5 text-blue-600' />
            Adicionar Justificativa de Ausência
          </DialogTitle>
          <DialogDescription>
            Adicione uma justificativa para a ausência de{' '}
            <span className='font-semibold text-gray-900'>{studentName}</span>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-6'
          >
            <FormField
              control={form.control}
              name='date'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='flex items-center gap-2'>
                    <CalendarIcon className='h-4 w-4' />
                    Data da Ausência
                  </FormLabel>
                  <FormControl>
                    <Input type='date' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='justification'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Justificativa</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Selecione o tipo de justificativa' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {justificationTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className='flex items-center gap-2'>
                            <span>{type.icon}</span>
                            <span>{type.label}</span>
                          </div>
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
              name='justificationDescription'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição da Justificativa</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Descreva o motivo da ausência...'
                      className='min-h-[100px] resize-none'
                      {...field}
                    />
                  </FormControl>
                  <div className='flex items-center justify-between text-sm text-gray-500'>
                    <FormMessage />
                    <span>{field.value?.length || 0}/500</span>
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={onClose}
                disabled={createDailyAbsence.isPending}
              >
                Cancelar
              </Button>
              <Button
                type='submit'
                disabled={createDailyAbsence.isPending}
                className='bg-blue-600 hover:bg-blue-700'
              >
                {createDailyAbsence.isPending
                  ? 'Salvando...'
                  : 'Salvar Justificativa'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
