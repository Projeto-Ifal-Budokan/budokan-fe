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
  Bell,
  Calendar,
  Camera,
  Edit3,
  Mail,
  Phone,
  Save,
  User as UserIcon,
  Users,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { AvatarUploadModal } from '@/components/dashboard/profile/avatar-upload-modal';
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

  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);

  const handleSave = async () => {
    try {
      if (editedProfile) {
        await updateUser.mutateAsync(editedProfile as UserProfile);
      }

      setIsEditing(false);
      setEditedProfile(null);

      toast.success('Perfil atualizado', {
        description: 'Suas informações foram salvas com sucesso.',
      });
    } catch (error) {
      toast.error('Erro ao atualizar perfil', {
        description: 'Tente novamente mais tarde.',
      });
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

  if (!user) {
    return <ProfileSkeleton />;
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Meu Perfil</h1>
          <p className='text-muted-foreground'>
            Gerencie suas informações pessoais e configurações da conta
          </p>
        </div>
        <div className='flex items-center gap-2'>
          {isEditing ? (
            <>
              <Button variant='outline' onClick={handleCancel}>
                <X className='mr-2 h-4 w-4' />
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={updateUser.isPending}>
                <Save className='mr-2 h-4 w-4' />
                Salvar
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
      <Card>
        <CardContent className='pt-6'>
          <div className='flex items-center space-x-6'>
            <div className='relative'>
              <Avatar className='h-24 w-24'>
                <AvatarImage
                  src={user?.profileImageUrl || ''}
                  alt={`${user?.firstName} ${user?.surname}`}
                />
                <AvatarFallback className={`bg-blue-900 text-lg text-white`}>
                  {getInitials(
                    user?.firstName as string,
                    user?.surname as string
                  )}
                </AvatarFallback>
              </Avatar>
              <Button
                size='sm'
                variant='secondary'
                className='absolute -right-2 -bottom-2 h-8 w-8 rounded-full p-0'
                onClick={() => setIsAvatarModalOpen(true)}
              >
                <Camera className='h-4 w-4' />
              </Button>
            </div>
            <div className='flex-1'>
              <div className='mb-2 flex items-center gap-3'>
                <h2 className='text-2xl font-bold'>
                  {user?.firstName} {user?.surname}
                </h2>
                <Badge
                  variant={user?.status === 'active' ? 'default' : 'secondary'}
                >
                  {user?.status === 'active' ? 'Ativo' : 'Inativo'}
                </Badge>
                {hasAccess('admin', userPrivileges || []) ? (
                  <Badge variant={'secondary'}>Administrador</Badge>
                ) : null}
              </div>
              <p className='text-muted-foreground mb-2'>{user?.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className='space-y-6'
      >
        <TabsList className='grid w-full grid-cols-4'>
          <TabsTrigger value='personal'>Informações Pessoais</TabsTrigger>
          <TabsTrigger value='contact'>Contato</TabsTrigger>
          {/* <TabsTrigger value='security'>Segurança</TabsTrigger> */}
          <TabsTrigger value='preferences'>Preferências</TabsTrigger>
        </TabsList>

        {/* Personal Information Tab */}
        <TabsContent value='personal' className='space-y-6'>
          <div className='grid gap-6 md:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <UserIcon className='h-5 w-5' />
                  Dados Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid gap-4 md:grid-cols-2'>
                  <div className='space-y-2'>
                    <Label htmlFor='firstName'>Nome</Label>
                    {isEditing ? (
                      <Input
                        id='firstName'
                        value={editedProfile?.firstName}
                        onChange={(e) =>
                          setEditedProfile({
                            ...editedProfile!,
                            firstName: e.target.value,
                          } as User)
                        }
                      />
                    ) : (
                      <p className='text-sm font-medium'>{user?.firstName}</p>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='surname'>Sobrenome</Label>
                    {isEditing ? (
                      <Input
                        id='surname'
                        value={editedProfile?.surname}
                        onChange={(e) =>
                          setEditedProfile({
                            ...editedProfile!,
                            surname: e.target.value,
                          } as User)
                        }
                      />
                    ) : (
                      <p className='text-sm font-medium'>{user?.surname}</p>
                    )}
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='birthDate'>Data de Nascimento</Label>
                  {isEditing ? (
                    <Input
                      id='birthDate'
                      type='date'
                      value={editedProfile?.birthDate}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile!,
                          birthDate: e.target.value,
                        } as UserProfile)
                      }
                    />
                  ) : (
                    <p className='flex items-center gap-2 text-sm font-medium'>
                      <Calendar className='h-4 w-4' />
                      {user?.birthDate}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value='contact' className='space-y-6'>
          <div className='grid gap-6 md:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Mail className='h-5 w-5' />
                  Informações de Contato
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='email'>E-mail</Label>
                  {isEditing ? (
                    <Input
                      id='email'
                      type='email'
                      value={editedProfile?.email}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile!,
                          email: e.target.value,
                        } as User)
                      }
                    />
                  ) : (
                    <p className='text-sm font-medium'>{user?.email}</p>
                  )}
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='phone'>Telefone</Label>
                  {isEditing ? (
                    <Input
                      id='phone'
                      value={editedProfile?.phone}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile!,
                          phone: e.target.value,
                        } as User)
                      }
                    />
                  ) : (
                    <p className='flex items-center gap-2 text-sm font-medium'>
                      <Phone className='h-4 w-4' />
                      {user?.phone}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Users className='h-5 w-5' />
                  Contato de Emergência
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {/* Emergency contact fields */}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Tab */}
        {/* <TabsContent value='security' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Lock className='h-5 w-5' />
                Segurança da Conta
              </CardTitle>
              <CardDescription>
                Gerencie suas configurações de segurança e privacidade
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='space-y-4'>
                <div>
                  <h4 className='mb-2 text-sm font-medium'>Alterar Senha</h4>
                  <div className='space-y-2'>
                    <Input type='password' placeholder='Senha atual' />
                    <Input type='password' placeholder='Nova senha' />
                    <Input type='password' placeholder='Confirmar nova senha' />
                  </div>
                  <Button className='mt-2' size='sm'>
                    Atualizar Senha
                  </Button>
                </div>

                <Separator />

                <div>
                  <h4 className='mb-2 text-sm font-medium'>
                    Autenticação de Dois Fatores
                  </h4>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-muted-foreground text-sm'>
                        Adicione uma camada extra de segurança à sua conta
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}

        {/* Preferences Tab */}
        <TabsContent value='preferences' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Bell className='h-5 w-5' />
                Preferências de Notificação
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium'>
                      Notificações por E-mail
                    </p>
                    <p className='text-muted-foreground text-sm'>
                      Receber atualizações importantes por e-mail
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium'>Lembretes de Aula</p>
                    <p className='text-muted-foreground text-sm'>
                      Receber lembretes antes das aulas
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium'>
                      Notificações de Pagamento
                    </p>
                    <p className='text-muted-foreground text-sm'>
                      Alertas sobre vencimentos e pagamentos
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
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
          // Optionally refresh user data
          me.refetch();
        }}
      />
    </div>
  );
}
