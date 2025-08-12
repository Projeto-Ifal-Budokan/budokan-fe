import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreateUserData } from '@/types/user';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Calendar,
  Contact,
  Lock,
  LucideIcon,
  Mail,
  Phone,
  Plus,
  User,
  UserPlus,
  X,
} from 'lucide-react';
import { UseFormRegister, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

interface AddUserFormProps {
  onCancel: () => void;
  onSubmit: (data: CreateUserData) => void;
}

// Zod schema for form validation
const formSchema = z.object({
  firstName: z.string().min(1, 'Nome é obrigatório'),
  surname: z.string().min(1, 'Sobrenome é obrigatório'),
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
  phone: z.string().min(1, 'Telefone é obrigatório'),
  birthDate: z.string().min(1, 'Data de nascimento é obrigatória'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  profileImageUrl: z.string().optional(),
  isPractitioner: z.boolean(),
  healthObservations: z.string(),
  emergencyContacts: z
    .array(
      z.object({
        phone: z.string().min(1, 'Telefone é obrigatório'),
        relationship: z.string().min(1, 'Relacionamento é obrigatório'),
      })
    )
    .min(1, 'Pelo menos um contato de emergência é obrigatório'),
});

type FormData = z.infer<typeof formSchema>;

// Reusable FormField component with React Hook Form integration
const FormField = ({
  icon: Icon,
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  register,
  error,
}: {
  icon: LucideIcon;
  label: string;
  name: keyof FormData;
  type?: string;
  placeholder: string;
  required?: boolean;
  register: UseFormRegister<FormData>;
  error?: string;
}) => (
  <div className='space-y-2'>
    <Label
      htmlFor={name}
      className='flex items-center gap-2 text-sm font-medium text-gray-700'
    >
      <Icon className='h-4 w-4 text-blue-600' />
      {label}
      {required && (
        <Badge variant='secondary' className='text-xs'>
          Obrigatório
        </Badge>
      )}
    </Label>
    <Input
      id={name}
      type={type}
      placeholder={placeholder}
      {...register(name)}
      className={`h-11 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${
        error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
      }`}
    />
    {error && <p className='text-xs text-red-600'>{error}</p>}
  </div>
);

export function AddUserForm({ onCancel, onSubmit }: AddUserFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      surname: '',
      email: '',
      phone: '',
      birthDate: '',
      password: '',
      profileImageUrl: '',
      isPractitioner: true,
      healthObservations: '',
      emergencyContacts: [{ phone: '', relationship: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'emergencyContacts',
  });

  const onFormSubmit = (data: FormData) => {
    onSubmit(data);
  };

  const addEmergencyContact = () => {
    append({ phone: '', relationship: '' });
  };

  const removeEmergencyContact = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4'>
      <div className='mx-auto max-w-4xl'>
        {/* Header */}
        <div className='mb-8 text-center'>
          <div className='mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-600'>
            <UserPlus className='h-8 w-8 text-white' />
          </div>
          <h1 className='mb-2 text-3xl font-bold text-gray-900'>
            Adicionar Novo Usuário
          </h1>
          <p className='mx-auto max-w-md text-gray-600'>
            Crie uma nova conta preenchendo as informações abaixo
          </p>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className='space-y-6'>
          {/* Personal Information Card */}
          <Card className='border-0 bg-white/80 shadow-lg backdrop-blur-sm'>
            <CardHeader className='pb-4'>
              <CardTitle className='flex items-center gap-3 text-xl'>
                <div className='rounded-lg bg-blue-100 p-2'>
                  <User className='h-5 w-5 text-blue-600' />
                </div>
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <FormField
                  icon={User}
                  label='Nome'
                  name='firstName'
                  placeholder='Digite seu nome'
                  required
                  register={register}
                  error={errors.firstName?.message}
                />
                <FormField
                  icon={User}
                  label='Sobrenome'
                  name='surname'
                  placeholder='Digite seu sobrenome'
                  required
                  register={register}
                  error={errors.surname?.message}
                />
                <FormField
                  icon={Mail}
                  label='Email'
                  name='email'
                  type='email'
                  placeholder='seu.email@ifal.edu.br'
                  required
                  register={register}
                  error={errors.email?.message}
                />
                <FormField
                  icon={Phone}
                  label='Telefone'
                  name='phone'
                  placeholder='(82) 9 9999-9999'
                  required
                  register={register}
                  error={errors.phone?.message}
                />
                <FormField
                  icon={Calendar}
                  label='Data de Nascimento'
                  name='birthDate'
                  type='date'
                  placeholder=''
                  required
                  register={register}
                  error={errors.birthDate?.message}
                />
                <FormField
                  icon={Lock}
                  label='Senha'
                  name='password'
                  type='password'
                  placeholder='Crie uma senha segura'
                  required
                  register={register}
                  error={errors.password?.message}
                />
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contacts Card */}
          <Card className='border-0 bg-white/80 shadow-lg backdrop-blur-sm'>
            <CardHeader className='pb-4'>
              <div className='flex items-center justify-between'>
                <CardTitle className='flex items-center gap-3 text-xl'>
                  <div className='rounded-lg bg-orange-100 p-2'>
                    <Contact className='h-5 w-5 text-orange-600' />
                  </div>
                  Contatos de Emergência
                </CardTitle>
                <Button
                  type='button'
                  onClick={addEmergencyContact}
                  size='sm'
                  className='bg-green-600 text-white shadow-md transition-all duration-200 hover:bg-green-700 hover:shadow-lg'
                >
                  <Plus className='mr-1 h-4 w-4' />
                  Adicionar
                </Button>
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className='relative rounded-xl border border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 p-4 transition-all duration-200 hover:shadow-md'
                >
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <div className='space-y-2'>
                      <Label
                        htmlFor={`emergencyContacts.${index}.phone`}
                        className='flex items-center gap-2 text-sm font-medium text-gray-700'
                      >
                        <Phone className='h-4 w-4 text-orange-600' />
                        Telefone
                      </Label>
                      <Input
                        id={`emergencyContacts.${index}.phone`}
                        placeholder='(82) 9 9999-9999'
                        {...register(`emergencyContacts.${index}.phone`)}
                        className={`h-10 transition-all duration-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 ${
                          errors.emergencyContacts?.[index]?.phone
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : ''
                        }`}
                      />
                      {errors.emergencyContacts?.[index]?.phone && (
                        <p className='text-xs text-red-600'>
                          {errors.emergencyContacts[index]?.phone?.message}
                        </p>
                      )}
                    </div>
                    <div className='space-y-2'>
                      <Label
                        htmlFor={`emergencyContacts.${index}.relationship`}
                        className='flex items-center gap-2 text-sm font-medium text-gray-700'
                      >
                        <Contact className='h-4 w-4 text-orange-600' />
                        Relacionamento
                      </Label>
                      <div className='flex gap-2'>
                        <Input
                          id={`emergencyContacts.${index}.relationship`}
                          placeholder='Ex: Mãe, Pai, Irmão(ã)'
                          {...register(
                            `emergencyContacts.${index}.relationship`
                          )}
                          className={`h-10 transition-all duration-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 ${
                            errors.emergencyContacts?.[index]?.relationship
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                              : ''
                          }`}
                        />
                        {fields.length > 1 && (
                          <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            onClick={() => removeEmergencyContact(index)}
                            className='h-10 border-red-200 px-3 text-red-600 transition-all duration-200 hover:bg-red-50'
                          >
                            <X className='h-4 w-4' />
                          </Button>
                        )}
                      </div>
                      {errors.emergencyContacts?.[index]?.relationship && (
                        <p className='text-xs text-red-600'>
                          {
                            errors.emergencyContacts[index]?.relationship
                              ?.message
                          }
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {errors.emergencyContacts && (
                <p className='text-xs text-red-600'>
                  {errors.emergencyContacts.message}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className='flex flex-col gap-4 pt-6 sm:flex-row'>
            <Button
              type='button'
              variant='outline'
              onClick={onCancel}
              disabled={isSubmitting}
              className='h-12 flex-1 border-gray-300 transition-all duration-200 hover:bg-gray-50 sm:flex-none sm:px-8'
            >
              Cancelar
            </Button>
            <Button
              type='submit'
              disabled={isSubmitting}
              className='h-12 flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl disabled:opacity-50 sm:flex-none sm:px-8'
            >
              <UserPlus className='mr-2 h-5 w-5' />
              {isSubmitting ? 'Criando...' : 'Criar Usuário'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
