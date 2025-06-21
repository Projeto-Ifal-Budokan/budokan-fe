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
import { User } from '@/types/user';
import { hasAccess } from '@/utils/access-control';
import { useQuery } from '@tanstack/react-query';
import {
  AlertTriangle,
  Edit,
  Eye,
  Key,
  Mail,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Shield,
  Trash2,
  UserCheck,
  Users,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

// const tiposUsuario = [
//   { value: 'administrador', label: 'Administrador', color: 'destructive' },
//   { value: 'instrutor', label: 'Instrutor', color: 'default' },
//   { value: 'funcionario', label: 'Funcionário', color: 'secondary' },
// ];

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
  const { fetchUsers, updateUser } = useManageUsers();
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
      const updatedUser = {
        ...user,
        status: newStatus as 'active' | 'inactive' | 'suspended',
      };

      await updateUser.mutateAsync(updatedUser);

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
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Usuários</h1>
          <p className='text-muted-foreground'>
            Gerencie os usuários do sistema
          </p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className='mr-2 h-4 w-4' />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent className='max-w-2xl'>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Usuário</DialogTitle>
              <DialogDescription>
                Preencha as informações do novo usuário do sistema
              </DialogDescription>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='nome'>Nome Completo</Label>
                  <Input id='nome' placeholder='Nome do usuário' />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                    id='email'
                    type='email'
                    placeholder='email@budokan.com'
                  />
                </div>
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='telefone'>Telefone</Label>
                  <Input id='telefone' placeholder='(11) 99999-9999' />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='tipo'>Tipo de Usuário</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder='Selecione o tipo' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='administrador'>
                        Administrador
                      </SelectItem>
                      <SelectItem value='instrutor'>Instrutor</SelectItem>
                      <SelectItem value='funcionario'>Funcionário</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='senha'>Senha Temporária</Label>
                  <Input
                    id='senha'
                    type='password'
                    placeholder='Senha inicial'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='status'>Status</Label>
                  <Select defaultValue='ativo'>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='ativo'>Ativo</SelectItem>
                      <SelectItem value='inativo'>Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className='space-y-3'>
                <Label>Permissões</Label>
                <div className='grid grid-cols-2 gap-3'>
                  <div className='flex items-center space-x-2'>
                    <Switch id='perm-usuarios' />
                    <Label htmlFor='perm-usuarios' className='text-sm'>
                      Gerenciar Usuários
                    </Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Switch id='perm-alunos' defaultChecked />
                    <Label htmlFor='perm-alunos' className='text-sm'>
                      Gerenciar Alunos
                    </Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Switch id='perm-modalidades' />
                    <Label htmlFor='perm-modalidades' className='text-sm'>
                      Gerenciar Modalidades
                    </Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Switch id='perm-frequencia' defaultChecked />
                    <Label htmlFor='perm-frequencia' className='text-sm'>
                      Controle de Frequência
                    </Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Switch id='perm-pagamentos' />
                    <Label htmlFor='perm-pagamentos' className='text-sm'>
                      Gerenciar Pagamentos
                    </Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Switch id='perm-relatorios' />
                    <Label htmlFor='perm-relatorios' className='text-sm'>
                      Relatórios Avançados
                    </Label>
                  </div>
                </div>
              </div>
            </div>
            <div className='flex justify-end gap-2'>
              <Button
                variant='outline'
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={() => setIsAddModalOpen(false)}>
                Criar Usuário
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className='grid gap-4 md:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Usuários
            </CardTitle>
            <Users className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{users?.length || 0}</div>
            <p className='text-muted-foreground text-xs'>
              {users?.filter((u) => u.status === 'active').length || 0} ativos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Administradores
            </CardTitle>
            <Shield className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {/* {usuarios.filter((u) => u.tipo === 'Administrador').length} */}
            </div>
            <p className='text-muted-foreground text-xs'>usuários admin</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Instrutores</CardTitle>
            <UserCheck className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {/* {usuarios.filter((u) => u.tipo === 'Instrutor').length} */}
            </div>
            <p className='text-muted-foreground text-xs'>
              instrutores cadastrados
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Funcionários</CardTitle>
            <Users className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {/* {usuarios.filter((u) => u.tipo === 'Funcionário').length} */}
            </div>
            <p className='text-muted-foreground text-xs'>funcionários ativos</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className='flex items-center gap-4'>
        <div className='relative max-w-sm flex-1'>
          <Search className='text-muted-foreground absolute top-2.5 left-2 h-4 w-4' />
          <Input
            placeholder='Buscar usuários...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='pl-8'
          />
        </div>
        <Select value={filterTipo} onValueChange={setFilterTipo}>
          <SelectTrigger className='w-40'>
            <SelectValue placeholder='Tipo' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='todos'>Todos os tipos</SelectItem>
            <SelectItem value='administrador'>Administrador</SelectItem>
            <SelectItem value='instrutor'>Instrutor</SelectItem>
            <SelectItem value='funcionario'>Funcionário</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className='w-32'>
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

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
          <CardDescription>
            Gerencie todos os usuários do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsuarios.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell>
                    <div className='flex items-center gap-3'>
                      <Avatar className='h-8 w-8'>
                        <AvatarImage alt={usuario.firstName} />
                        <AvatarFallback className='text-xs'>
                          {usuario.firstName +
                            ' ' +
                            usuario.surname
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className='font-medium'>
                          {usuario.firstName + ' ' + usuario.surname}
                        </div>
                        <div className='text-muted-foreground text-sm'>
                          {usuario.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className='space-y-1'>
                      <div className='flex items-center gap-1 text-sm'>
                        <Mail className='text-muted-foreground h-3 w-3' />
                        <span className='text-xs'>{usuario.email}</span>
                      </div>
                      <div className='flex items-center gap-1 text-sm'>
                        <Phone className='text-muted-foreground h-3 w-3' />
                        <span className='text-xs'>{usuario.phone}</span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className='flex items-center gap-2'>
                      <Badge variant={getStatusColor(usuario.status)}>
                        {getStatusText(usuario.status)}
                      </Badge>
                      {isAdmin && (
                        <Select
                          value={usuario.status}
                          onValueChange={(newStatus) =>
                            handleStatusChangeRequest(usuario, newStatus)
                          }
                          disabled={updateUser.isPending}
                        >
                          <SelectTrigger className='h-8 w-28'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='active'>Ativo</SelectItem>
                            <SelectItem value='inactive'>Inativo</SelectItem>
                            <SelectItem value='suspended'>Suspenso</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='sm'>
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/dashboard/users/${usuario.id}`)
                          }
                        >
                          <Eye className='mr-2 h-4 w-4' />
                          Visualizar
                        </DropdownMenuItem>
                        {isAdmin && (
                          <>
                            <DropdownMenuItem>
                              <Edit className='mr-2 h-4 w-4' />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Key className='mr-2 h-4 w-4' />
                              Redefinir Senha
                            </DropdownMenuItem>
                            <DropdownMenuItem className='text-destructive'>
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

      {/* Status Change Confirmation Modal */}
      <Dialog
        open={isStatusChangeModalOpen}
        onOpenChange={setIsStatusChangeModalOpen}
      >
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <AlertTriangle className='h-5 w-5 text-amber-500' />
              Confirmar Alteração de Status
            </DialogTitle>
            <DialogDescription>
              Você tem certeza que deseja alterar o status deste usuário?
            </DialogDescription>
          </DialogHeader>

          {pendingStatusChange && (
            <div className='space-y-4'>
              <div className='bg-muted flex items-center gap-3 rounded-lg p-3'>
                <Avatar className='h-10 w-10'>
                  <AvatarImage alt={pendingStatusChange.user.firstName} />
                  <AvatarFallback>
                    {pendingStatusChange.user.firstName[0]}
                    {pendingStatusChange.user.surname[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className='font-medium'>
                    {pendingStatusChange.user.firstName}{' '}
                    {pendingStatusChange.user.surname}
                  </div>
                  <div className='text-muted-foreground text-sm'>
                    {pendingStatusChange.user.email}
                  </div>
                </div>
              </div>

              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm'>Status atual:</span>
                  <Badge
                    variant={getStatusColor(pendingStatusChange.user.status)}
                  >
                    {getStatusText(pendingStatusChange.user.status)}
                  </Badge>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm'>Novo status:</span>
                  <Badge
                    variant={getStatusColor(pendingStatusChange.newStatus)}
                  >
                    {getStatusText(pendingStatusChange.newStatus)}
                  </Badge>
                </div>
              </div>

              <div className='rounded-lg border border-blue-200 bg-blue-50 p-3'>
                <p className='text-sm text-blue-800'>
                  <strong>Ação:</strong>{' '}
                  {getStatusChangeMessage(
                    pendingStatusChange.user.status,
                    pendingStatusChange.newStatus
                  )}{' '}
                  usuário
                </p>
                <p className='mt-1 text-sm text-blue-700'>
                  {getStatusChangeDescription(pendingStatusChange.newStatus)}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant='outline'
              onClick={cancelStatusChange}
              disabled={updateUser.isPending}
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmStatusChange}
              disabled={updateUser.isPending}
              className={
                pendingStatusChange?.newStatus === 'suspended'
                  ? 'bg-destructive hover:bg-destructive/90'
                  : ''
              }
            >
              {updateUser.isPending ? 'Alterando...' : 'Confirmar Alteração'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
