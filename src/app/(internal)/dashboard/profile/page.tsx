'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/lib/api/queries/use-auth';
import { useManageUsers } from '@/lib/api/queries/use-manage-users';
import { usePrivilegesByUser } from '@/lib/api/queries/use-privileges';
import { User } from '@/types/user';
import { hasAccess } from '@/utils/access-control';
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
import { useState } from 'react';
import { toast } from 'sonner';

import { AvatarUploadModal } from '@/components/dashboard/profile/avatar-upload-modal';
import { EmergencyContactsList } from '@/components/dashboard/profile/emergency-contacts-list';
// import { useUserDisciplines } from '@/lib/api/queries/use-user-disciplines';
import { useManageMatriculations } from '@/lib/api/queries/use-manage-matriculations';
import { calculatePlatformTime } from '@/utils/date-utils';
import { ProfileSkeleton } from './profile-skeleton';

type UserProfile = User;

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

  // const { data: userDisciplines } = useUserDisciplines(
  //   user?.id?.toString() || ''
  // );

  const { useMatriculations } = useManageMatriculations();
  const { data: userMatriculations } = useMatriculations(1, 100, {
    idStudent: user?.id?.toString() || '',
  });

  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);

  const handleSave = async () => {
    try {
      if (editedProfile) {
        await updateUser.mutateAsync(editedProfile as UserProfile);
      }

      setIsEditing(false);
      setEditedProfile(null);

      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar perfil. Tente novamente.');
    }
  };

  const handleCancel = () => {
    setEditedProfile(null);
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
                <Button onClick={handleSave} disabled={updateUser.isPending}>
                  <Save className='mr-2 h-4 w-4' />
                  Salvar Alterações
                </Button>
              </>
            ) : (
              <Button
                onClick={() => {
                  setEditedProfile(user);
                  setIsEditing(true);
                }}
              >
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
                <div className='grid gap-6 md:grid-cols-2'>
                  <div className='space-y-2'>
                    <Label
                      htmlFor='firstName'
                      className='text-sm font-medium text-gray-700'
                    >
                      Nome
                    </Label>
                    {isEditing ? (
                      <Input
                        id='firstName'
                        value={editedProfile?.firstName || ''}
                        onChange={(e) =>
                          setEditedProfile({
                            ...editedProfile!,
                            firstName: e.target.value,
                          } as User)
                        }
                      />
                    ) : (
                      <div className='rounded-md border border-gray-200 bg-gray-50 p-3 text-gray-900'>
                        {user?.firstName}
                      </div>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label
                      htmlFor='surname'
                      className='text-sm font-medium text-gray-700'
                    >
                      Sobrenome
                    </Label>
                    {isEditing ? (
                      <Input
                        id='surname'
                        value={editedProfile?.surname || ''}
                        onChange={(e) =>
                          setEditedProfile({
                            ...editedProfile!,
                            surname: e.target.value,
                          } as User)
                        }
                      />
                    ) : (
                      <div className='rounded-md border border-gray-200 bg-gray-50 p-3 text-gray-900'>
                        {user?.surname}
                      </div>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label
                      htmlFor='email'
                      className='text-sm font-medium text-gray-700'
                    >
                      E-mail
                    </Label>
                    {isEditing ? (
                      <Input
                        id='email'
                        type='email'
                        value={editedProfile?.email || ''}
                        onChange={(e) =>
                          setEditedProfile({
                            ...editedProfile!,
                            email: e.target.value,
                          } as User)
                        }
                      />
                    ) : (
                      <div className='rounded-md border border-gray-200 bg-gray-50 p-3 text-gray-900'>
                        {user?.email}
                      </div>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label
                      htmlFor='phone'
                      className='text-sm font-medium text-gray-700'
                    >
                      Telefone
                    </Label>
                    {isEditing ? (
                      <Input
                        id='phone'
                        value={editedProfile?.phone || ''}
                        onChange={(e) =>
                          setEditedProfile({
                            ...editedProfile!,
                            phone: e.target.value,
                          } as User)
                        }
                      />
                    ) : (
                      <div className='rounded-md border border-gray-200 bg-gray-50 p-3 text-gray-900'>
                        {formatPhone(user?.phone || '')}
                      </div>
                    )}
                  </div>

                  <div className='space-y-2 md:col-span-2'>
                    <Label
                      htmlFor='birthDate'
                      className='text-sm font-medium text-gray-700'
                    >
                      Data de Nascimento
                    </Label>
                    {isEditing ? (
                      <Input
                        id='birthDate'
                        type='date'
                        value={editedProfile?.birthDate || ''}
                        onChange={(e) =>
                          setEditedProfile({
                            ...editedProfile!,
                            birthDate: e.target.value,
                          } as UserProfile)
                        }
                        className='md:w-auto'
                      />
                    ) : (
                      <div className='flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 p-3 text-gray-900'>
                        <Calendar className='h-4 w-4 text-gray-500' />
                        {formatBirthDate(user?.birthDate || '')}
                      </div>
                    )}
                  </div>
                </div>
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
                <div className='space-y-4'>
                  {[
                    {
                      title: 'Notificações por E-mail',
                      description:
                        'Receber atualizações importantes por e-mail',
                      defaultChecked: true,
                    },
                    {
                      title: 'Lembretes de Aula',
                      description:
                        'Receber lembretes antes das aulas começarem',
                      defaultChecked: true,
                    },
                    {
                      title: 'Notificações de Pagamento',
                      description: 'Alertas sobre vencimentos e confirmações',
                      defaultChecked: true,
                    },
                    {
                      title: 'Atualizações de Ranking',
                      description: 'Ser notificado sobre mudanças no ranking',
                      defaultChecked: false,
                    },
                  ].map((setting, index) => (
                    <div
                      key={index}
                      className='flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4'
                    >
                      <div>
                        <p className='font-medium text-gray-900'>
                          {setting.title}
                        </p>
                        <p className='text-sm text-gray-500'>
                          {setting.description}
                        </p>
                      </div>
                      <Switch defaultChecked={setting.defaultChecked} />
                    </div>
                  ))}
                </div>
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
