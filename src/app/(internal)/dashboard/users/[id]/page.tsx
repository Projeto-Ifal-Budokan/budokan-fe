'use client';

import { EditUserModal } from '@/components/dashboard/users/edit-user-modal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useManageMatriculations } from '@/lib/api/queries/use-manage-matriculations';
import { useManageUsers } from '@/lib/api/queries/use-manage-users';
import { usePrivilegesByUser } from '@/lib/api/queries/use-privileges';
import { User } from '@/types/user';
import { hasAccess } from '@/utils/access-control';
import { calculatePlatformTime } from '@/utils/date-utils';
import { useQuery } from '@tanstack/react-query';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Award,
  Calendar,
  Clock,
  Edit3,
  Mail,
  Phone,
  Shield,
  User as UserIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use, useState } from 'react';
import { toast } from 'sonner';
import { UserDetailSkeleton } from './user-detail-skeleton';

interface UserDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { fetchUser, updateUser } = useManageUsers();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['users', id],
    enabled: !!id,
    queryFn: () => fetchUser(id),
  });

  const { data: userPrivileges } = usePrivilegesByUser(
    user?.id?.toString() || ''
  );

  const { useMatriculations } = useManageMatriculations();
  const { data: userMatriculations } = useMatriculations(1, 100, {
    idStudent: user?.id?.toString() || '',
  });

  const handleEditUser = async (userData: Partial<User>) => {
    try {
      await updateUser.mutateAsync(userData as User);
      setIsEditModalOpen(false);
      toast.success('Usuário atualizado com sucesso!');
      refetch(); // Refresh user data
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Erro ao atualizar usuário. Tente novamente.');
    }
  };

  const getInitials = (firstName: string, surname: string) => {
    if (!firstName) return '';
    if (!surname) return firstName.charAt(0).toUpperCase();
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

  if (isLoading) {
    return <UserDetailSkeleton />;
  }

  if (!user) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='text-center'>
          <AlertTriangle className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
          <h3 className='text-lg font-semibold'>Usuário não encontrado</h3>
          <p className='text-muted-foreground'>
            O usuário solicitado não existe ou foi removido.
          </p>
          <Button onClick={() => router.back()} className='mt-4'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Voltar
          </Button>
        </div>
      </div>
    );
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
                  Perfil do Usuário
                </h1>
                <p className='text-gray-600'>
                  Informações detalhadas do usuário
                </p>
              </div>
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <Button variant='outline' onClick={() => router.back()}>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Voltar
            </Button>
            <Button onClick={() => setIsEditModalOpen(true)}>
              <Edit3 className='mr-2 h-4 w-4' />
              Editar Usuário
            </Button>
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

          <Card className='relative overflow-hidden border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl'>
            <div className='absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10'></div>
            <CardHeader className='relative flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium opacity-90'>
                Permissões
              </CardTitle>
              <Shield className='h-5 w-5 opacity-80' />
            </CardHeader>
            <CardContent className='relative'>
              <div className='text-3xl font-bold'>
                {userPrivileges?.length || 0}
              </div>
              <p className='mt-1 text-xs opacity-80'>concedidas</p>
            </CardContent>
          </Card>

          <Card className='relative overflow-hidden border-0 bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-xl'>
            <div className='absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10'></div>
            <CardHeader className='relative flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium opacity-90'>
                Status
              </CardTitle>
              <Activity className='h-5 w-5 opacity-80' />
            </CardHeader>
            <CardContent className='relative'>
              <div className='text-3xl font-bold'>
                {user?.status === 'active' ? 'Ativo' : 'Inativo'}
              </div>
              <p className='mt-1 text-xs opacity-80'>status atual</p>
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
            <TabsTrigger value='permissions'>
              <Shield className='mr-2 h-4 w-4' />
              Permissões
            </TabsTrigger>
            <TabsTrigger value='activity'>
              <Activity className='mr-2 h-4 w-4' />
              Atividades
            </TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value='personal' className='space-y-6'>
            <div className='grid gap-6 md:grid-cols-2'>
              <Card className='shadow-xl'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <UserIcon className='h-5 w-5' />
                    Informações Pessoais
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='grid gap-6 md:grid-cols-2'>
                    <div>
                      <label className='text-sm font-medium text-gray-700'>
                        Nome
                      </label>
                      <div className='rounded-md border border-gray-200 bg-gray-50 p-3 text-gray-900'>
                        {user?.firstName || 'Não informado'}
                      </div>
                    </div>

                    <div>
                      <label className='text-sm font-medium text-gray-700'>
                        Sobrenome
                      </label>
                      <div className='rounded-md border border-gray-200 bg-gray-50 p-3 text-gray-900'>
                        {user?.surname || 'Não informado'}
                      </div>
                    </div>

                    <div>
                      <label className='text-sm font-medium text-gray-700'>
                        E-mail
                      </label>
                      <div className='rounded-md border border-gray-200 bg-gray-50 p-3 text-gray-900'>
                        {user?.email || 'Não informado'}
                      </div>
                    </div>

                    <div>
                      <label className='text-sm font-medium text-gray-700'>
                        Telefone
                      </label>
                      <div className='rounded-md border border-gray-200 bg-gray-50 p-3 text-gray-900'>
                        {formatPhone(user?.phone || '')}
                      </div>
                    </div>

                    <div className='md:col-span-2'>
                      <label className='text-sm font-medium text-gray-700'>
                        Data de Nascimento
                      </label>
                      <div className='flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 p-3 text-gray-900'>
                        <Calendar className='h-4 w-4 text-gray-500' />
                        {formatBirthDate(user?.birthDate || '')}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className='shadow-xl'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Phone className='h-5 w-5' />
                    Informações Adicionais
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div>
                    <label className='text-sm font-medium text-gray-700'>
                      Data de Cadastro
                    </label>
                    <div className='flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 p-3 text-gray-900'>
                      <Calendar className='h-4 w-4 text-gray-500' />
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString('pt-BR')
                        : 'Não informado'}
                    </div>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-700'>
                      Última Atualização
                    </label>
                    <div className='flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 p-3 text-gray-900'>
                      <Clock className='h-4 w-4 text-gray-500' />
                      {user?.updatedAt
                        ? new Date(user.updatedAt).toLocaleDateString('pt-BR')
                        : 'Não informado'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Permissions Tab */}
          <TabsContent value='permissions' className='space-y-6'>
            <Card className='shadow-xl'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Shield className='h-5 w-5' />
                  Permissões do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid gap-3'>
                  {userPrivileges && userPrivileges.length > 0 ? (
                    userPrivileges.map((privilege, index) => (
                      <div
                        key={index}
                        className='flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4'
                      >
                        <Shield className='h-5 w-5 text-green-500' />
                        <div className='flex-1'>
                          <p className='font-medium text-gray-900'>
                            {privilege.name}
                          </p>
                          <p className='text-sm text-gray-500'>
                            {privilege.description || 'Permissão do sistema'}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className='py-8 text-center text-gray-500'>
                      Nenhuma permissão específica atribuída
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value='activity' className='space-y-6'>
            <Card className='shadow-xl'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Activity className='h-5 w-5' />
                  Atividades do Usuário
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='flex items-center gap-4 rounded-lg border border-gray-100 bg-gray-50 p-4'>
                    <div className='mt-2 h-2 w-2 rounded-full bg-blue-500'></div>
                    <div className='flex-1'>
                      <div className='flex items-center justify-between'>
                        <p className='font-medium'>Usuário cadastrado</p>
                        <span className='text-sm text-gray-500'>
                          {user?.createdAt
                            ? new Date(user.createdAt).toLocaleDateString(
                                'pt-BR'
                              )
                            : 'Data não disponível'}
                        </span>
                      </div>
                      <p className='mt-1 text-sm text-gray-500'>
                        Conta criada no sistema
                      </p>
                    </div>
                  </div>

                  {user?.updatedAt && user.updatedAt !== user.createdAt && (
                    <div className='flex items-center gap-4 rounded-lg border border-gray-100 bg-gray-50 p-4'>
                      <div className='mt-2 h-2 w-2 rounded-full bg-green-500'></div>
                      <div className='flex-1'>
                        <div className='flex items-center justify-between'>
                          <p className='font-medium'>Perfil atualizado</p>
                          <span className='text-sm text-gray-500'>
                            {new Date(user.updatedAt).toLocaleDateString(
                              'pt-BR'
                            )}
                          </span>
                        </div>
                        <p className='mt-1 text-sm text-gray-500'>
                          Informações do perfil foram modificadas
                        </p>
                      </div>
                    </div>
                  )}

                  <div className='py-8 text-center'>
                    <p className='text-gray-500'>
                      Histórico detalhado de atividades em desenvolvimento
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit User Modal */}
        <EditUserModal
          isOpen={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          user={user}
          isPending={updateUser.isPending}
          onSave={handleEditUser}
        />
      </div>
    </div>
  );
}
