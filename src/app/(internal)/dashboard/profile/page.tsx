'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/lib/api/queries/use-auth';
import { useManageUsers } from '@/lib/api/queries/use-manage-users';
import { usePrivilegesByUser } from '@/lib/api/queries/use-privileges';
import { User } from '@/types/user';
import { hasAccess } from '@/utils/access-control';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Award,
  Bell,
  Calendar,
  Camera,
  Clock,
  Edit3,
  Mail,
  Phone,
  Save,
  Settings,
  Shield,
  User as UserIcon,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { AvatarUploadModal } from '@/components/dashboard/profile/avatar-upload-modal';
import { EmergencyContactsList } from '@/components/dashboard/profile/emergency-contacts-list';
import { useManageMatriculations } from '@/lib/api/queries/use-manage-matriculations';
import { calculatePlatformTime } from '@/utils/date-utils';
import { ProfileSkeleton } from './profile-skeleton';

// Form validation schema
const profileFormSchema = z.object({
  firstName: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(50, 'Nome deve ter no máximo 50 caracteres'),
  surname: z
    .string()
    .min(2, 'Sobrenome deve ter pelo menos 2 caracteres')
    .max(50, 'Sobrenome deve ter no máximo 50 caracteres'),
  email: z.string().email('E-mail inválido').min(1, 'E-mail é obrigatório'),
  phone: z
    .string()
    .regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$|^\d{10,11}$/, 'Telefone inválido')
    .optional()
    .or(z.literal('')),
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida')
    .optional()
    .or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Notification preferences schema
const notificationFormSchema = z.object({
  emailNotifications: z.boolean().default(true),
  classReminders: z.boolean().default(true),
  paymentNotifications: z.boolean().default(true),
  rankingUpdates: z.boolean().default(false),
});

type NotificationFormValues = z.infer<typeof notificationFormSchema>;

export default function ProfilePage() {
  const { me } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const { data: user } = me;
  const { updateUser } = useManageUsers();

  const { data: userPrivileges } = usePrivilegesByUser(
    user?.id?.toString() || ''
  );

  const { useMatriculations } = useManageMatriculations();
  const { data: userMatriculations } = useMatriculations(1, 100, {
    idStudent: user?.id?.toString() || '',
  });

  // Profile form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: '',
      surname: '',
      email: '',
      phone: '',
      birthDate: '',
    },
  });

  // Notification preferences form
  // const notificationForm = useForm<NotificationFormValues>({
  //   resolver: zodResolver(notificationFormSchema),
  //   defaultValues: {
  //     emailNotifications: true,
  //     classReminders: true,
  //     paymentNotifications: true,
  //     rankingUpdates: false,
  //   },
  // });

  // Update form values when user data is loaded
  useEffect(() => {
    if (user) {
      profileForm.reset({
        firstName: user.firstName || '',
        surname: user.surname || '',
        email: user.email || '',
        phone: user.phone || '',
        birthDate: user.birthDate || '',
      });
    }
  }, [user, profileForm]);

  const onSubmitProfile = async (data: ProfileFormValues) => {
    try {
      if (!user) return;

      const { profileImageUrl, ...rest } = user;

      const updatedUser: User = {
        ...rest,
        ...data,
      };

      await updateUser.mutateAsync(updatedUser);
      setIsEditing(false);
      toast.success('Perfil atualizado com sucesso!');

      // Refetch user data
      me.refetch();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Erro ao atualizar perfil. Tente novamente.');
    }
  };

  // const onSubmitNotifications = async (data: NotificationFormValues) => {
  //   try {
  //     // Here you would typically save notification preferences to your backend
  //     console.log('Notification preferences:', data);
  //     toast.success('Preferências de notificação atualizadas!');
  //   } catch (error) {
  //     console.error('Error updating notifications:', error);
  //     toast.error('Erro ao atualizar preferências. Tente novamente.');
  //   }
  // };

  const handleCancel = () => {
    if (user) {
      profileForm.reset({
        firstName: user.firstName || '',
        surname: user.surname || '',
        email: user.email || '',
        phone: user.phone || '',
        birthDate: user.birthDate || '',
      });
    }
    setIsEditing(false);
  };

  const getInitials = (firstName: string, surname: string) => {
    if (!firstName || !surname) return '';
    return `${firstName.charAt(0)}${surname.charAt(0)}`.toUpperCase();
  };

  const formatPhone = (phone: string) => {
    if (!phone) return 'Não informado';
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '');

    // Format as (XX) XXXXX-XXXX for Brazilian format
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    }
    // Format as (XX) XXXX-XXXX for older format
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }

    return phone; // Return original if doesn't match expected patterns
  };

  const formatBirthDate = (birthDate: string) => {
    if (!birthDate) return 'Não informado';

    try {
      const date = new Date(birthDate);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch (error) {
      return birthDate; // Return original if formatting fails
    }
  };

  if (!user) {
    return <ProfileSkeleton />;
  }

  return (
    <div className='min-h-screen'>
      <div className='mx-auto space-y-8'>
        {/* Header Section */}
        <div className='flex flex-col gap-6 md:flex-row md:items-center md:justify-between'>
          <div className='space-y-2'>
            <div className='flex items-center gap-3'>
              <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-900 to-blue-600 text-white shadow-lg'>
                <UserIcon className='h-6 w-6' />
              </div>
              <div>
                <h1 className='text-4xl font-bold tracking-tight text-gray-900'>
                  Meu Perfil
                </h1>
                <p className='text-gray-600'>
                  Gerencie suas informações pessoais e configurações
                </p>
              </div>
            </div>
          </div>
          <div className='flex items-center gap-3'>
            {isEditing ? (
              <>
                <Button variant='outline' onClick={handleCancel}>
                  <X className='mr-2 h-4 w-4' />
                  Cancelar
                </Button>
                <Button
                  onClick={profileForm.handleSubmit(onSubmitProfile)}
                  disabled={!profileForm.formState.isDirty}
                >
                  <Save className='mr-2 h-4 w-4' />
                  Salvar Alterações
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit3 className='mr-2 h-4 w-4' />
                Editar Perfil
              </Button>
            )}
          </div>
        </div>

        {/* Profile Header Card */}
        <Card className='overflow-hidden border-0 shadow-xl'>
          <CardContent className='p-8'>
            <div className='flex flex-col items-center space-y-6 md:flex-row md:space-y-0 md:space-x-8'>
              <div className='relative'>
                <Avatar className='h-24 w-24 border-4 border-white shadow-lg'>
                  <AvatarImage
                    src={user?.profileImageUrl || ''}
                    alt={`${user?.firstName} ${user?.surname}`}
                  />
                  <AvatarFallback className='bg-gradient-to-br from-blue-900 to-blue-600 text-xl font-bold text-white'>
                    {getInitials(
                      user?.firstName as string,
                      user?.surname as string
                    )}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size='sm'
                  variant='secondary'
                  className='absolute -right-2 -bottom-2 h-8 w-8 rounded-full p-0 shadow-lg'
                  onClick={() => setIsAvatarModalOpen(true)}
                >
                  <Camera className='h-4 w-4' />
                </Button>
              </div>

              <div className='flex-1 text-center md:text-left'>
                <div className='mb-3 flex flex-col items-center gap-3 md:flex-row'>
                  <h2 className='text-3xl font-bold text-gray-900'>
                    {user?.firstName} {user?.surname}
                  </h2>
                  <div className='flex gap-2'>
                    <Badge
                      variant={
                        user?.status === 'active' ? 'default' : 'secondary'
                      }
                    >
                      {user?.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                    {hasAccess('admin', userPrivileges || []) && (
                      <Badge className='bg-gradient-to-r from-blue-900 to-blue-600 text-white'>
                        <Shield className='mr-1 h-3 w-3' />
                        Admin
                      </Badge>
                    )}
                  </div>
                </div>
                <div className='flex flex-col gap-2 text-gray-600 md:flex-row md:gap-6'>
                  <p className='flex items-center gap-2'>
                    <Mail className='h-4 w-4' />
                    {user?.email}
                  </p>
                  {user?.phone && (
                    <p className='flex items-center gap-2'>
                      <Phone className='h-4 w-4' />
                      {formatPhone(user?.phone)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          <Card className='relative overflow-hidden border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl'>
            <div className='absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10'></div>
            <CardHeader className='relative flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium opacity-90'>
                Tempo na Plataforma
              </CardTitle>
              <Clock className='h-5 w-5 opacity-80' />
            </CardHeader>
            <CardContent className='relative'>
              <div className='text-3xl font-bold'>
                {calculatePlatformTime(user?.createdAt || '')}
              </div>
              <p className='mt-1 text-xs opacity-80'>desde o cadastro</p>
            </CardContent>
          </Card>

          <Card className='relative overflow-hidden border-0 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-xl'>
            <div className='absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10'></div>
            <CardHeader className='relative flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium opacity-90'>
                Disciplinas
              </CardTitle>
              <Award className='h-5 w-5 opacity-80' />
            </CardHeader>
            <CardContent className='relative'>
              <div className='text-3xl font-bold'>
                {userMatriculations?.data?.count || 0}
              </div>
              <p className='mt-1 text-xs opacity-80'>ativas atualmente</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className='space-y-6'
        >
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='personal'>
              <UserIcon className='mr-2 h-4 w-4' />
              Informações Pessoais
            </TabsTrigger>
            <TabsTrigger value='contact'>
              <Mail className='mr-2 h-4 w-4' />
              Contatos de Emergência
            </TabsTrigger>
            <TabsTrigger value='preferences'>
              <Settings className='mr-2 h-4 w-4' />
              Preferências
            </TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value='personal' className='space-y-6'>
            <Card className='shadow-xl'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <UserIcon className='h-5 w-5' />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-6'>
                <Form {...profileForm}>
                  <form
                    onSubmit={profileForm.handleSubmit(onSubmitProfile)}
                    className='space-y-6'
                  >
                    <div className='grid gap-6 md:grid-cols-2'>
                      <FormField
                        control={profileForm.control}
                        name='firstName'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-sm font-medium text-gray-700'>
                              Nome
                            </FormLabel>
                            <FormControl>
                              {isEditing ? (
                                <Input
                                  {...field}
                                  placeholder='Digite seu nome'
                                />
                              ) : (
                                <div className='rounded-md border border-gray-200 bg-gray-50 p-3 text-gray-900'>
                                  {user?.firstName || 'Não informado'}
                                </div>
                              )}
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name='surname'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-sm font-medium text-gray-700'>
                              Sobrenome
                            </FormLabel>
                            <FormControl>
                              {isEditing ? (
                                <Input
                                  {...field}
                                  placeholder='Digite seu sobrenome'
                                />
                              ) : (
                                <div className='rounded-md border border-gray-200 bg-gray-50 p-3 text-gray-900'>
                                  {user?.surname || 'Não informado'}
                                </div>
                              )}
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name='email'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-sm font-medium text-gray-700'>
                              E-mail
                            </FormLabel>
                            <FormControl>
                              {isEditing ? (
                                <Input
                                  {...field}
                                  type='email'
                                  placeholder='Digite seu e-mail'
                                />
                              ) : (
                                <div className='rounded-md border border-gray-200 bg-gray-50 p-3 text-gray-900'>
                                  {user?.email || 'Não informado'}
                                </div>
                              )}
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name='phone'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-sm font-medium text-gray-700'>
                              Telefone
                            </FormLabel>
                            <FormControl>
                              {isEditing ? (
                                <Input
                                  {...field}
                                  placeholder='(XX) XXXXX-XXXX'
                                />
                              ) : (
                                <div className='rounded-md border border-gray-200 bg-gray-50 p-3 text-gray-900'>
                                  {formatPhone(user?.phone || '')}
                                </div>
                              )}
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name='birthDate'
                        render={({ field }) => (
                          <FormItem className='md:col-span-2'>
                            <FormLabel className='text-sm font-medium text-gray-700'>
                              Data de Nascimento
                            </FormLabel>
                            <FormControl>
                              {isEditing ? (
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant='outline'
                                      className='w-full justify-start text-left font-normal md:w-auto'
                                    >
                                      <Calendar className='mr-2 h-4 w-4' />
                                      {field.value ? (
                                        format(
                                          new Date(field.value),
                                          'dd/MM/yyyy',
                                          {
                                            locale: ptBR,
                                          }
                                        )
                                      ) : (
                                        <span className='text-muted-foreground'>
                                          Selecione uma data
                                        </span>
                                      )}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    // className='w-auto p-0'
                                    align='start'
                                  >
                                    <CalendarComponent
                                      mode='single'
                                      captionLayout='dropdown'
                                      selected={
                                        field.value
                                          ? new Date(field.value)
                                          : undefined
                                      }
                                      onSelect={(date) => {
                                        field.onChange(
                                          date ? format(date, 'yyyy-MM-dd') : ''
                                        );
                                      }}
                                      disabled={(date) =>
                                        date > new Date() ||
                                        date < new Date('1900-01-01')
                                      }
                                      locale={ptBR}
                                    />
                                  </PopoverContent>
                                </Popover>
                              ) : (
                                <div className='flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 p-3 text-gray-900'>
                                  <Calendar className='h-4 w-4 text-gray-500' />
                                  {formatBirthDate(user?.birthDate || '')}
                                </div>
                              )}
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='contact' className='space-y-6'>
            <EmergencyContactsList userId={user?.id} />
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value='preferences' className='space-y-6'>
            <Card className='shadow-xl'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Bell className='h-5 w-5' />
                  Configurações de Notificação
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-6'>
                {/* <Form {...notificationForm}>
                  <form
                    onSubmit={notificationForm.handleSubmit(
                      onSubmitNotifications
                    )}
                    className='space-y-6'
                  >
                    <div className='space-y-4'>
                      {[
                        {
                          name: 'emailNotifications' as const,
                          title: 'Notificações por E-mail',
                          description:
                            'Receber atualizações importantes por e-mail',
                        },
                        {
                          name: 'classReminders' as const,
                          title: 'Lembretes de Aula',
                          description:
                            'Receber lembretes antes das aulas começarem',
                        },
                        {
                          name: 'paymentNotifications' as const,
                          title: 'Notificações de Pagamento',
                          description:
                            'Alertas sobre vencimentos e confirmações',
                        },
                        {
                          name: 'rankingUpdates' as const,
                          title: 'Atualizações de Ranking',
                          description:
                            'Ser notificado sobre mudanças no ranking',
                        },
                      ].map((setting) => (
                        <FormField
                          key={setting.name}
                          control={notificationForm.control}
                          name={setting.name}
                          render={({ field }) => (
                            <FormItem className='flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4'>
                              <div className='space-y-0.5'>
                                <FormLabel className='font-medium text-gray-900'>
                                  {setting.title}
                                </FormLabel>
                                <p className='text-sm text-gray-500'>
                                  {setting.description}
                                </p>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>

                    <div className='flex justify-end'>
                      <Button type='submit'>
                        <Save className='mr-2 h-4 w-4' />
                        Salvar Preferências
                      </Button>
                    </div>
                  </form>
                </Form> */}
                Indisponível
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Avatar Upload Modal */}
        <AvatarUploadModal
          isOpen={isAvatarModalOpen}
          onOpenChange={setIsAvatarModalOpen}
          user={user}
          onSuccess={() => {
            me.refetch();
          }}
        />
      </div>
    </div>
  );
}
