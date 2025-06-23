'use client';

import { UsersSkeleton } from '@/app/(internal)/dashboard/users/users-skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuth } from '@/lib/api/queries/use-auth';
import { useManageUsers, userKeys } from '@/lib/api/queries/use-manage-users';
import { usePrivilegesByUser } from '@/lib/api/queries/use-privileges';
import { User, UserStatus } from '@/types/user';
import { hasAccess } from '@/utils/access-control';
import { useQuery } from '@tanstack/react-query';
import {
  AlertTriangle,
  Edit,
  Eye,
  Filter,
  Key,
  Mail,
  MoreHorizontal,
  Phone,
  Search,
  Shield,
  Trash2,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export function UsersManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('todos');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Status change confirmation modal state
  const [isStatusChangeModalOpen, setIsStatusChangeModalOpen] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    user: User;
    newStatus: string;
  } | null>(null);

  // Get the manageUsers instance first
  const { fetchUsers, updateUserStatus } = useManageUsers();
  const router = useRouter();

  // Get current user and their privileges to check if they're admin
  const { data: currentUser } = useAuth().me;
  const { data: currentUserPrivileges } = usePrivilegesByUser(
    currentUser?.id.toString() || ''
  );

  // Check if current user is admin
  const isAdmin = currentUserPrivileges
    ? hasAccess('admin', currentUserPrivileges)
    : false;

  // Then use it in the query
  const {
    data: users,
    isLoading,
    // error,
  } = useQuery({
    queryKey: userKeys.all,
    queryFn: fetchUsers,
  });

  // Function to initiate status change (opens confirmation modal)
  const handleStatusChangeRequest = (user: User, newStatus: string) => {
    if (!isAdmin) {
      toast.error('Você não tem permissão para alterar o status dos usuários');
      return;
    }

    if (user.status === newStatus) {
      return; // No change needed
    }

    setPendingStatusChange({ user, newStatus });
    setIsStatusChangeModalOpen(true);
  };

  // Function to confirm and execute status change
  const confirmStatusChange = async () => {
    if (!pendingStatusChange) return;

    const { user, newStatus } = pendingStatusChange;

    try {
      await updateUserStatus.mutateAsync({
        id: String(user.id),
        status: newStatus as UserStatus,
      });

      const statusMessages = {
        active: 'ativado',
        inactive: 'desativado',
        suspended: 'suspenso',
      };

      toast.success(
        `Usuário ${statusMessages[newStatus as keyof typeof statusMessages]} com sucesso!`
      );
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Erro ao alterar status do usuário');
    } finally {
      setIsStatusChangeModalOpen(false);
      setPendingStatusChange(null);
    }
  };

  // Function to cancel status change
  const cancelStatusChange = () => {
    setIsStatusChangeModalOpen(false);
    setPendingStatusChange(null);
  };

  if (isLoading) {
    return <UsersSkeleton />;
  }

  const filteredUsuarios =
    (Array.isArray(users)
      ? users.filter((usuario) => {
          const matchesSearch =
            usuario.firstName
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            usuario.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            usuario.email.toLowerCase().includes(searchTerm.toLowerCase());

          const matchesStatus =
            filterStatus === 'todos' || usuario.status === filterStatus;

          return matchesSearch && matchesStatus;
        })
      : []) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'secondary';
      case 'suspended':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'inactive':
        return 'Inativo';
      case 'suspended':
        return 'Suspenso';
      default:
        return 'Inativo';
    }
  };

  const getStatusChangeMessage = (currentStatus: string, newStatus: string) => {
    const statusMessages = {
      active: 'ativar',
      inactive: 'desativar',
      suspended: 'suspender',
    };

    return statusMessages[newStatus as keyof typeof statusMessages];
  };

  const getStatusChangeDescription = (newStatus: string) => {
    const descriptions = {
      active: 'O usuário poderá acessar o sistema normalmente.',
      inactive: 'O usuário não poderá acessar o sistema.',
      suspended:
        'O usuário ficará temporariamente impedido de acessar o sistema.',
    };

    return descriptions[newStatus as keyof typeof descriptions];
  };

  return (
    <div className='min-h-screen'>
      <div className='mx-auto space-y-8'>
        {/* Header Section */}
        <div className='flex flex-col gap-6 md:flex-row md:items-center md:justify-between'>
          <div className='space-y-2'>
            <div className='flex items-center gap-3'>
              <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'>
                <Users className='h-6 w-6' />
              </div>
              <div>
                <h1 className='text-4xl font-bold tracking-tight text-gray-900'>
                  Gerenciamento de Usuários
                </h1>
                <p className='text-lg text-gray-600'>
                  Controle total sobre os usuários do sistema
                </p>
              </div>
            </div>
          </div>

          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button
                size='lg'
                className='bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg transition-all hover:scale-105 hover:shadow-xl'
              >
                <UserPlus className='mr-2 h-5 w-5' />
                Novo Usuário
              </Button>
            </DialogTrigger>
            <DialogContent className='max-w-3xl'>
              <DialogHeader className='space-y-4 pb-6'>
                <DialogTitle className='text-2xl font-semibold'>
                  Adicionar Novo Usuário
                </DialogTitle>
                <DialogDescription className='text-base'>
                  Preencha as informações do novo usuário do sistema
                </DialogDescription>
              </DialogHeader>

              <div className='space-y-8 py-4'>
                {/* Personal Information */}
                <div className='space-y-4'>
                  <h3 className='border-b pb-2 text-lg font-semibold text-gray-900'>
                    Informações Pessoais
                  </h3>
                  <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                    <div className='space-y-2'>
                      <Label htmlFor='nome' className='text-sm font-medium'>
                        Nome Completo
                      </Label>
                      <Input
                        id='nome'
                        placeholder='Nome do usuário'
                        className='h-11'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='email' className='text-sm font-medium'>
                        Email
                      </Label>
                      <Input
                        id='email'
                        type='email'
                        placeholder='email@budokan.com'
                        className='h-11'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='telefone' className='text-sm font-medium'>
                        Telefone
                      </Label>
                      <Input
                        id='telefone'
                        placeholder='(11) 99999-9999'
                        className='h-11'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='tipo' className='text-sm font-medium'>
                        Tipo de Usuário
                      </Label>
                      <Select>
                        <SelectTrigger className='h-11'>
                          <SelectValue placeholder='Selecione o tipo' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='administrador'>
                            Administrador
                          </SelectItem>
                          <SelectItem value='instrutor'>Instrutor</SelectItem>
                          <SelectItem value='funcionario'>
                            Funcionário
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Account Configuration */}
                <div className='space-y-4'>
                  <h3 className='border-b pb-2 text-lg font-semibold text-gray-900'>
                    Configuração da Conta
                  </h3>
                  <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                    <div className='space-y-2'>
                      <Label htmlFor='senha' className='text-sm font-medium'>
                        Senha Temporária
                      </Label>
                      <Input
                        id='senha'
                        type='password'
                        placeholder='Senha inicial'
                        className='h-11'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='status' className='text-sm font-medium'>
                        Status
                      </Label>
                      <Select defaultValue='ativo'>
                        <SelectTrigger className='h-11'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='ativo'>Ativo</SelectItem>
                          <SelectItem value='inativo'>Inativo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Permissions */}
                <div className='space-y-4'>
                  <h3 className='border-b pb-2 text-lg font-semibold text-gray-900'>
                    Permissões do Sistema
                  </h3>
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    {[
                      {
                        id: 'perm-usuarios',
                        label: 'Gerenciar Usuários',
                        icon: Users,
                      },
                      {
                        id: 'perm-alunos',
                        label: 'Gerenciar Alunos',
                        icon: UserCheck,
                        defaultChecked: true,
                      },
                      {
                        id: 'perm-modalidades',
                        label: 'Gerenciar Modalidades',
                        icon: Shield,
                      },
                      {
                        id: 'perm-frequencia',
                        label: 'Controle de Frequência',
                        icon: TrendingUp,
                        defaultChecked: true,
                      },
                      {
                        id: 'perm-pagamentos',
                        label: 'Gerenciar Pagamentos',
                        icon: TrendingUp,
                      },
                      {
                        id: 'perm-relatorios',
                        label: 'Relatórios Avançados',
                        icon: TrendingUp,
                      },
                    ].map(({ id, label, icon: Icon, defaultChecked }) => (
                      <div
                        key={id}
                        className='flex items-center space-x-3 rounded-lg border bg-gray-50 p-3 transition-colors hover:bg-gray-100'
                      >
                        <Switch id={id} defaultChecked={defaultChecked} />
                        <Icon className='h-4 w-4 text-gray-600' />
                        <Label
                          htmlFor={id}
                          className='cursor-pointer text-sm font-medium'
                        >
                          {label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter className='flex gap-3 pt-6'>
                <Button
                  variant='outline'
                  onClick={() => setIsAddModalOpen(false)}
                  className='px-6'
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => setIsAddModalOpen(false)}
                  className='bg-gradient-to-r from-blue-600 to-indigo-600 px-6'
                >
                  Criar Usuário
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Enhanced Stats Cards */}
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          <Card className='relative overflow-hidden border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl'>
            <div className='absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10'></div>
            <CardHeader className='relative flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium opacity-90'>
                Total Usuários
              </CardTitle>
              <Users className='h-5 w-5 opacity-80' />
            </CardHeader>
            <CardContent className='relative'>
              <div className='text-3xl font-bold'>{users?.length || 0}</div>
              <p className='mt-1 text-xs opacity-80'>
                {users?.filter((u) => u.status === 'active').length || 0} ativos
              </p>
            </CardContent>
          </Card>

          <Card className='relative overflow-hidden border-0 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-xl'>
            <div className='absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10'></div>
            <CardHeader className='relative flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium opacity-90'>
                Administradores
              </CardTitle>
              <Shield className='h-5 w-5 opacity-80' />
            </CardHeader>
            <CardContent className='relative'>
              <div className='text-3xl font-bold'>
                {/* {usuarios.filter((u) => u.tipo === 'Administrador').length} */}
                3
              </div>
              <p className='mt-1 text-xs opacity-80'>usuários admin</p>
            </CardContent>
          </Card>

          <Card className='relative overflow-hidden border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl'>
            <div className='absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10'></div>
            <CardHeader className='relative flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium opacity-90'>
                Instrutores
              </CardTitle>
              <UserCheck className='h-5 w-5 opacity-80' />
            </CardHeader>
            <CardContent className='relative'>
              <div className='text-3xl font-bold'>
                {/* {usuarios.filter((u) => u.tipo === 'Instrutor').length} */}
                12
              </div>
              <p className='mt-1 text-xs opacity-80'>instrutores cadastrados</p>
            </CardContent>
          </Card>

          <Card className='relative overflow-hidden border-0 bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-xl'>
            <div className='absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10'></div>
            <CardHeader className='relative flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium opacity-90'>
                Funcionários
              </CardTitle>
              <Users className='h-5 w-5 opacity-80' />
            </CardHeader>
            <CardContent className='relative'>
              <div className='text-3xl font-bold'>
                {/* {usuarios.filter((u) => u.tipo === 'Funcionário').length} */}
                8
              </div>
              <p className='mt-1 text-xs opacity-80'>funcionários ativos</p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Filters Section */}
        <Card className='border-0 bg-white/80 shadow-lg backdrop-blur-sm'>
          <CardHeader className='pb-4'>
            <div className='flex items-center gap-2'>
              <Filter className='h-5 w-5 text-gray-600' />
              <CardTitle className='text-lg'>Filtros e Busca</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col gap-4 md:flex-row md:items-center'>
              <div className='relative max-w-md flex-1'>
                <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400' />
                <Input
                  placeholder='Buscar por nome ou email...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='h-11 border-gray-200 bg-white pl-10 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                />
              </div>

              <div className='flex gap-3'>
                <Select value={filterTipo} onValueChange={setFilterTipo}>
                  <SelectTrigger className='h-11 w-48 border-gray-200 bg-white shadow-sm'>
                    <SelectValue placeholder='Filtrar por tipo' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='todos'>Todos os tipos</SelectItem>
                    <SelectItem value='administrador'>Administrador</SelectItem>
                    <SelectItem value='instrutor'>Instrutor</SelectItem>
                    <SelectItem value='funcionario'>Funcionário</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className='h-11 w-40 border-gray-200 bg-white shadow-sm'>
                    <SelectValue placeholder='Status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='todos'>Todos</SelectItem>
                    <SelectItem value='active'>Ativo</SelectItem>
                    <SelectItem value='inactive'>Inativo</SelectItem>
                    <SelectItem value='suspended'>Suspenso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Users Table */}
        <Card className='border-0 bg-white/90 shadow-xl backdrop-blur-sm'>
          <CardHeader className='border-b bg-gradient-to-r from-gray-50 to-gray-100'>
            <CardTitle className='text-xl font-semibold'>
              Lista de Usuários
            </CardTitle>
            <CardDescription className='text-base'>
              Gerencie todos os usuários do sistema com facilidade
            </CardDescription>
          </CardHeader>
          <CardContent className='p-0'>
            <Table>
              <TableHeader className='bg-gray-50/50'>
                <TableRow className='border-b border-gray-200'>
                  <TableHead className='py-4 font-semibold text-gray-700'>
                    Usuário
                  </TableHead>
                  <TableHead className='py-4 font-semibold text-gray-700'>
                    Contato
                  </TableHead>
                  <TableHead className='py-4 font-semibold text-gray-700'>
                    Status
                  </TableHead>
                  <TableHead className='py-4 font-semibold text-gray-700'>
                    Ações
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsuarios.map((usuario, index) => (
                  <TableRow
                    key={usuario.id}
                    className={`border-b border-gray-100 transition-colors hover:bg-gray-50/50 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                    }`}
                  >
                    <TableCell className='py-4'>
                      <div className='flex items-center gap-4'>
                        <Avatar className='h-10 w-10 ring-2 ring-gray-100'>
                          <AvatarImage alt={usuario.firstName} />
                          <AvatarFallback className='bg-gradient-to-br from-blue-100 to-indigo-100 text-sm font-medium text-blue-700'>
                            {usuario.firstName[0]}
                            {usuario.surname[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className='font-semibold text-gray-900'>
                            {usuario.firstName + ' ' + usuario.surname}
                          </div>
                          <div className='text-sm text-gray-500'>
                            {usuario.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className='py-4'>
                      <div className='space-y-2'>
                        <div className='flex items-center gap-2 text-sm'>
                          <Mail className='h-4 w-4 text-gray-400' />
                          <span className='text-gray-600'>{usuario.email}</span>
                        </div>
                        <div className='flex items-center gap-2 text-sm'>
                          <Phone className='h-4 w-4 text-gray-400' />
                          <span className='text-gray-600'>{usuario.phone}</span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className='py-4'>
                      <div className='flex items-center gap-2'>
                        {isAdmin ? (
                          <Select
                            value={usuario.status}
                            onValueChange={(newStatus) =>
                              handleStatusChangeRequest(usuario, newStatus)
                            }
                            disabled={updateUserStatus.isPending}
                          >
                            <SelectTrigger className='h-9 w-32 border-gray-200'>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='active'>Ativo</SelectItem>
                              <SelectItem value='inactive'>Inativo</SelectItem>
                              <SelectItem value='suspended'>
                                Suspenso
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge
                            variant={getStatusColor(usuario.status)}
                            className='px-3 py-1'
                          >
                            {getStatusText(usuario.status)}
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className='py-4'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='h-9 w-9 hover:bg-gray-100'
                          >
                            <MoreHorizontal className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end' className='w-48'>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/dashboard/users/${usuario.id}`)
                            }
                            className='cursor-pointer'
                          >
                            <Eye className='mr-2 h-4 w-4' />
                            Visualizar
                          </DropdownMenuItem>
                          {isAdmin && (
                            <>
                              <DropdownMenuItem className='cursor-pointer'>
                                <Edit className='mr-2 h-4 w-4' />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem className='cursor-pointer'>
                                <Key className='mr-2 h-4 w-4' />
                                Redefinir Senha
                              </DropdownMenuItem>
                              <DropdownMenuItem className='text-destructive cursor-pointer'>
                                <Trash2 className='mr-2 h-4 w-4' />
                                Excluir
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Status Change Confirmation Modal - Enhanced */}
        <Dialog
          open={isStatusChangeModalOpen}
          onOpenChange={setIsStatusChangeModalOpen}
        >
          <DialogContent className='max-w-lg border-0 shadow-2xl'>
            <DialogHeader className='space-y-4'>
              <DialogTitle className='flex items-center gap-3 text-xl'>
                <div className='flex h-10 w-10 items-center justify-center rounded-full bg-amber-100'>
                  <AlertTriangle className='h-5 w-5 text-amber-600' />
                </div>
                Confirmar Alteração de Status
              </DialogTitle>
              <DialogDescription className='text-base text-gray-600'>
                Você tem certeza que deseja alterar o status deste usuário?
              </DialogDescription>
            </DialogHeader>

            {pendingStatusChange && (
              <div className='space-y-6 py-4'>
                <div className='flex items-center gap-4 rounded-xl bg-gray-50 p-4'>
                  <Avatar className='h-12 w-12 ring-2 ring-gray-200'>
                    <AvatarImage alt={pendingStatusChange.user.firstName} />
                    <AvatarFallback className='bg-gradient-to-br from-blue-100 to-indigo-100 font-semibold text-blue-700'>
                      {pendingStatusChange.user.firstName[0]}
                      {pendingStatusChange.user.surname[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className='font-semibold text-gray-900'>
                      {pendingStatusChange.user.firstName}{' '}
                      {pendingStatusChange.user.surname}
                    </div>
                    <div className='text-sm text-gray-500'>
                      {pendingStatusChange.user.email}
                    </div>
                  </div>
                </div>

                <div className='space-y-3'>
                  <div className='flex items-center justify-between rounded-lg border bg-white p-3 shadow-sm'>
                    <span className='text-sm font-medium text-gray-700'>
                      Status atual:
                    </span>
                    <Badge
                      variant={getStatusColor(pendingStatusChange.user.status)}
                      className='px-3 py-1'
                    >
                      {getStatusText(pendingStatusChange.user.status)}
                    </Badge>
                  </div>
                  <div className='flex items-center justify-between rounded-lg border bg-white p-3 shadow-sm'>
                    <span className='text-sm font-medium text-gray-700'>
                      Novo status:
                    </span>
                    <Badge
                      variant={getStatusColor(pendingStatusChange.newStatus)}
                      className='px-3 py-1'
                    >
                      {getStatusText(pendingStatusChange.newStatus)}
                    </Badge>
                  </div>
                </div>

                <div className='rounded-xl border border-blue-200 bg-blue-50 p-4'>
                  <p className='text-sm font-medium text-blue-800'>
                    <strong>Ação:</strong>{' '}
                    {getStatusChangeMessage(
                      pendingStatusChange.user.status,
                      pendingStatusChange.newStatus
                    )}{' '}
                    usuário
                  </p>
                  <p className='mt-2 text-sm text-blue-700'>
                    {getStatusChangeDescription(pendingStatusChange.newStatus)}
                  </p>
                </div>
              </div>
            )}

            <DialogFooter className='flex gap-3 pt-4'>
              <Button
                variant='outline'
                onClick={cancelStatusChange}
                disabled={updateUserStatus.isPending}
                className='px-6'
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmStatusChange}
                disabled={updateUserStatus.isPending}
                className={`px-6 ${
                  pendingStatusChange?.newStatus === 'suspended'
                    ? 'bg-destructive hover:bg-destructive/90'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600'
                }`}
              >
                {updateUserStatus.isPending
                  ? 'Alterando...'
                  : 'Confirmar Alteração'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
