'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
import {
  CreateDailyAbsenceData,
  DailyAbsence,
  UpdateDailyAbsenceData,
} from '@/types/daily-absence';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, Edit, FileText, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
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

interface JustificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  idMatriculation: number;
  studentName: string;
  sessionDate?: string;
  existingJustification?: DailyAbsence | null;
  mode: 'create' | 'edit';
}

export function JustificationModal({
  isOpen,
  onClose,
  idMatriculation,
  studentName,
  sessionDate,
  existingJustification,
  mode,
}: JustificationModalProps) {
  const { createDailyAbsence, updateDailyAbsence, deleteDailyAbsence } =
    useManageDailyAbsences();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: sessionDate || new Date().toISOString().split('T')[0],
      justification: undefined,
      justificationDescription: '',
    },
  });

  // Reset form when modal opens/closes or when existingJustification changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && existingJustification) {
        form.reset({
          date: existingJustification.date,
          justification: existingJustification.justification,
          justificationDescription:
            existingJustification.justificationDescription,
        });
      } else if (mode === 'create') {
        form.reset({
          date: sessionDate || new Date().toISOString().split('T')[0],
          justification: undefined,
          justificationDescription: '',
        });
      }
    }
  }, [isOpen, mode, existingJustification, sessionDate, form]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (mode === 'edit' && existingJustification) {
        const updateData: UpdateDailyAbsenceData = {
          justification: values.justification,
          justificationDescription: values.justificationDescription,
        };

        await updateDailyAbsence.mutateAsync({
          id: existingJustification.id,
          data: updateData,
        });
        toast.success('Justificativa atualizada com sucesso!');
      } else {
        const createData: CreateDailyAbsenceData = {
          date: values.date,
          idMatriculation,
          justification: values.justification,
          justificationDescription: values.justificationDescription,
        };

        await createDailyAbsence.mutateAsync(createData);
        toast.success('Justificativa adicionada com sucesso!');
      }

      form.reset();
      onClose();
    } catch (error) {
      toast.error(
        mode === 'edit'
          ? 'Erro ao atualizar justificativa'
          : 'Erro ao adicionar justificativa'
      );
    }
  };

  const handleDelete = async () => {
    if (!existingJustification) {
      console.error('No existing justification to delete');
      return;
    }

    try {
      await deleteDailyAbsence.mutateAsync(existingJustification.id);

      console.log('Delete successful');
      toast.success('Justificativa removida com sucesso!');
      setShowDeleteDialog(false);
      onClose();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Erro ao remover justificativa');
    }
  };

  const justificationTypes = [
    { value: 'medical', label: 'Médica', icon: '🏥' },
    { value: 'personal', label: 'Pessoal', icon: '👤' },
    { value: 'family', label: 'Familiar', icon: '👨‍👩‍👧‍👦' },
    { value: 'work', label: 'Trabalho', icon: '💼' },
    { value: 'other', label: 'Outros', icon: '📋' },
  ];

  const isLoading =
    createDailyAbsence.isPending ||
    updateDailyAbsence.isPending ||
    deleteDailyAbsence.isPending;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='sm:max-w-[500px]'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              {mode === 'edit' ? (
                <Edit className='h-5 w-5 text-amber-600' />
              ) : (
                <FileText className='h-5 w-5 text-blue-600' />
              )}
              {mode === 'edit' ? 'Editar' : 'Adicionar'} Justificativa de
              Ausência
            </DialogTitle>
            <DialogDescription>
              {mode === 'edit' ? 'Edite' : 'Adicione'} uma justificativa para a
              ausência de{' '}
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
                      <Input
                        type='date'
                        {...field}
                        disabled={mode === 'edit'} // Don't allow changing date when editing
                      />
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
                    <Select onValueChange={field.onChange} value={field.value}>
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

              <DialogFooter className='flex justify-between'>
                <div className='flex gap-2'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={onClose}
                    disabled={isLoading}
                  >
                    Cancelar
                  </Button>

                  {/* Delete button - only show in edit mode */}
                  {mode === 'edit' && (
                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => setShowDeleteDialog(true)}
                      disabled={isLoading}
                      className='border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100'
                    >
                      <Trash2 className='mr-2 h-4 w-4' />
                      Remover
                    </Button>
                  )}
                </div>

                <Button
                  type='submit'
                  disabled={isLoading}
                  className={
                    mode === 'edit'
                      ? 'bg-amber-600 hover:bg-amber-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }
                >
                  {isLoading
                    ? mode === 'edit'
                      ? 'Atualizando...'
                      : 'Salvando...'
                    : mode === 'edit'
                      ? 'Atualizar Justificativa'
                      : 'Salvar Justificativa'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className='flex items-center gap-2'>
              <Trash2 className='h-5 w-5 text-red-600' />
              Confirmar Remoção
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja remover a justificativa de ausência para{' '}
              <span className='font-semibold text-gray-900'>{studentName}</span>
              ?
              <br />
              <br />
              <span className='text-sm text-red-600'>
                Esta ação não pode ser desfeita.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteDailyAbsence.isPending}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteDailyAbsence.isPending}
              className='bg-red-600 hover:bg-red-700 focus:ring-red-600'
            >
              {deleteDailyAbsence.isPending
                ? 'Removendo...'
                : 'Remover Justificativa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
