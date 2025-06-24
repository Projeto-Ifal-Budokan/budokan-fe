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
import { useManageRoles } from '@/lib/api/queries/use-manage-roles';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const roleFormSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  description: z.string().min(5, 'Descrição deve ter pelo menos 5 caracteres'),
});

type RoleFormValues = z.infer<typeof roleFormSchema>;

interface AddRoleFormProps {
  onSuccess: () => void;
}

export function AddRoleForm({ onSuccess }: AddRoleFormProps) {
  const { createRole } = useManageRoles();

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onSubmit = async (data: RoleFormValues) => {
    try {
      await createRole.mutateAsync(data);
      form.reset();
      onSuccess();
    } catch (error) {
      console.error('Error creating role:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder='Nome do papel' {...field} />
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
                  placeholder='Descrição do papel'
                  className='resize-none'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex justify-end space-x-2'>
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
          <Button type='submit' disabled={createRole.isPending}>
            {createRole.isPending ? 'Criando...' : 'Criar Papel'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
