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
import { useManageUsers, userKeys } from '@/lib/api/queries/use-manage-users';
import { useQuery } from '@tanstack/react-query';
import {
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

  // Get the manageUsers instance first
  const { fetchUsers } = useManageUsers();
  const router = useRouter();

  // Then use it in the query
  const {
    data: users,
    isLoading,
    // error,
  } = useQuery({
    queryKey: userKeys.all,
    queryFn: fetchUsers,
  });

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
          // const matchesTipo =
          //   filterTipo === 'todos' || usuario.tipo.toLowerCase() === filterTipo;
          // const matchesStatus =
          //   filterStatus === 'todos' || usuario.status.toLowerCase() === filterStatus;

          return matchesSearch;
          // && matchesTipo && matchesStatus;
        })
      : []) || [];

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'default' : 'secondary';
  };

  // const getTipoColor = (tipo: string) => {
  //   const tipoObj = tiposUsuario.find((t) => t.label === tipo);
  //   return tipoObj?.color || 'default';
  // };

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
            <SelectItem value='ativo'>Ativo</SelectItem>
            <SelectItem value='inativo'>Inativo</SelectItem>
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
                <TableHead>Tipo</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Último Acesso</TableHead>
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
                        <AvatarImage
                          // src={usuario.avatar || '/placeholder.svg'}
                          alt={usuario.firstName}
                        />
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
                        <div className='font-medium'>{usuario.firstName}</div>
                        <div className='text-muted-foreground text-sm'>
                          {usuario.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {/* <Badge variant={getTipoColor(usuario.tipo) as any}>
                      {usuario.tipo}
                    </Badge> */}
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
                    {/* <div className='text-sm'>{usuario.ultimoAcesso}</div> */}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(usuario.status)}>
                      {usuario.status}
                    </Badge>
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
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
