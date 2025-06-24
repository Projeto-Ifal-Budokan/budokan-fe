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
import { Role } from '@/types/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const roleFormSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  description: z.string().min(5, 'Descrição deve ter pelo menos 5 caracteres'),
});

type RoleFormValues = z.infer<typeof roleFormSchema>;

interface EditRoleFormProps {
  role: Role;
  onSuccess: () => void;
}

export function EditRoleForm({ role, onSuccess }: EditRoleFormProps) {
  const { updateRole } = useManageRoles();

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: role.name,
      description: role.description,
    },
  });

  const onSubmit = async (data: RoleFormValues) => {
    try {
      await updateRole.mutateAsync({
        id: String(role.id),
        data,
      });
      onSuccess();
    } catch (error) {
      console.error('Error updating role:', error);
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
          <Button type='button' variant='outline' onClick={onSuccess}>
            Cancelar
          </Button>
          <Button type='submit' disabled={updateRole.isPending}>
            {updateRole.isPending ? 'Atualizando...' : 'Atualizar Papel'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
