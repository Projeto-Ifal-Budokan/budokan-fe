'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAuth } from '@/lib/api/queries/use-auth';
import { useManageRoles } from '@/lib/api/queries/use-manage-roles';
import {
  usePrivileges,
  usePrivilegesByUser,
} from '@/lib/api/queries/use-privileges';
import { useRolePrivileges } from '@/lib/api/queries/use-role-privileges';

import { Privilege } from '@/types/user';
import { hasAccess } from '@/utils/access-control';
import {
  ArrowLeft,
  Check,
  CheckSquare,
  Download,
  Filter,
  Info,
  Lock,
  Search,
  Settings,
  Shield,
  Square,
  Undo2,
  X,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

interface PendingChange {
  privilegeId: number;
  action: 'assign' | 'remove';
  timestamp: number;
}

type SortOption = 'name' | 'category' | 'status';

export default function RolePrivilegesPage() {
  const router = useRouter();
  const params = useParams();
  const roleId = params.id as string;

  // Enhanced state
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [showOnlyAssigned, setShowOnlyAssigned] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('category');
  const [pendingChanges, setPendingChanges] = useState<Set<number>>(new Set());
  const [changeHistory, setChangeHistory] = useState<PendingChange[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    privilege?: Privilege;
    action?: 'assign' | 'remove';
  }>({ isOpen: false });

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Authentication
  const { data: currentUser } = useAuth().me;
  const { data: currentUserPrivileges } = usePrivilegesByUser(
    String(currentUser?.id) || ''
  );

  // Data fetching
  const { useRole } = useManageRoles();
  const { data: role, isLoading: roleLoading } = useRole(roleId);
  const { privileges } = usePrivileges();
  const { data: allPrivileges, isLoading: privilegesLoading } = privileges;
  const { privilegesByRole, assignPrivilege, removePrivilege } =
    useRolePrivileges(roleId);
  const { data: rolePrivileges, isLoading: rolePrivilegesLoading } =
    privilegesByRole;

  // Computed values
  const isAdmin = currentUserPrivileges
    ? hasAccess('admin', currentUserPrivileges)
    : false;

  const rolePrivilegeIds = useMemo(() => {
    return new Set(rolePrivileges?.map((p: Privilege) => p.id) || []);
  }, [rolePrivileges]);

  const availableCategories = useMemo(() => {
    if (!allPrivileges) return [];
    const categories = new Set(allPrivileges.map((p) => p.name.split('_')[0]));
    return Array.from(categories).sort();
  }, [allPrivileges]);

  const filteredPrivileges = useMemo(() => {
    if (!allPrivileges) return [];

    let filtered = allPrivileges;

    // Search filter
    if (debouncedSearchTerm) {
      filtered = filtered.filter(
        (privilege) =>
          privilege.name
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          privilege.description
            ?.toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((privilege) =>
        privilege.name.startsWith(selectedCategory)
      );
    }

    // Show only assigned filter
    if (showOnlyAssigned) {
      filtered = filtered.filter((privilege) =>
        rolePrivilegeIds.has(privilege.id)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'status':
          const aAssigned = rolePrivilegeIds.has(a.id);
          const bAssigned = rolePrivilegeIds.has(b.id);
          return Number(bAssigned) - Number(aAssigned);
        case 'category':
        default:
          const aCat = a.name.split('_')[0];
          const bCat = b.name.split('_')[0];
          return aCat.localeCompare(bCat) || a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [
    allPrivileges,
    debouncedSearchTerm,
    selectedCategory,
    showOnlyAssigned,
    rolePrivilegeIds,
    sortBy,
  ]);

  const privilegeStats = useMemo(() => {
    const total = allPrivileges?.length || 0;
    const assigned = rolePrivileges?.length || 0;
    const percentage = total > 0 ? (assigned / total) * 100 : 0;
    const pending = pendingChanges.size;

    return { total, assigned, percentage, pending };
  }, [allPrivileges, rolePrivileges, pendingChanges]);

  // Enhanced privilege categories
  const privilegeCategories = useMemo(() => {
    const categories: Record<string, Privilege[]> = {};

    filteredPrivileges.forEach((privilege) => {
      const category = privilege.name.split('_')[0];
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(privilege);
    });

    return categories;
  }, [filteredPrivileges]);

  // Enhanced handlers
  const handlePrivilegeToggle = useCallback(
    async (privilege: Privilege, isChecked: boolean) => {
      if (!isAdmin) {
        toast.error('Você não tem permissão para modificar privilégios');
        return;
      }

      setConfirmDialog({
        isOpen: true,
        privilege,
        action: isChecked ? 'assign' : 'remove',
      });
    },
    [isAdmin]
  );

  const confirmPrivilegeToggle = useCallback(async () => {
    const { privilege, action } = confirmDialog;
    if (!privilege || !action) return;

    setPendingChanges((prev) => new Set([...prev, privilege.id]));

    try {
      if (action === 'assign') {
        await assignPrivilege.mutateAsync({
          idRole: Number(roleId),
          idPrivilege: privilege.id,
        });
        toast.success(`Privilégio "${privilege.name}" atribuído com sucesso`);
      } else {
        await removePrivilege.mutateAsync({
          idRole: Number(roleId),
          idPrivilege: privilege.id,
        });
        toast.success(`Privilégio "${privilege.name}" removido com sucesso`);
      }

      // Add to history
      setChangeHistory((prev) => [
        ...prev,
        {
          privilegeId: privilege.id,
          action,
          timestamp: Date.now(),
        },
      ]);
    } catch (error) {
      console.error('Error toggling privilege:', error);
      toast.error(
        `Erro ao ${action === 'assign' ? 'atribuir' : 'remover'} privilégio`
      );
    } finally {
      setPendingChanges((prev) => {
        const newSet = new Set(prev);
        newSet.delete(privilege.id);
        return newSet;
      });
      setConfirmDialog({ isOpen: false });
    }
  }, [confirmDialog, roleId, assignPrivilege, removePrivilege]);

  const handleBulkToggle = useCallback(
    (category: string, assign: boolean) => {
      if (!isAdmin) {
        toast.error('Você não tem permissão para modificar privilégios');
        return;
      }

      const categoryPrivileges = privilegeCategories[category] || [];
      const promises = categoryPrivileges.map((privilege) => {
        const isCurrentlyAssigned = rolePrivilegeIds.has(privilege.id);
        if (assign && !isCurrentlyAssigned) {
          return assignPrivilege.mutateAsync({
            idRole: Number(roleId),
            idPrivilege: privilege.id,
          });
        } else if (!assign && isCurrentlyAssigned) {
          return removePrivilege.mutateAsync({
            idRole: Number(roleId),
            idPrivilege: privilege.id,
          });
        }
        return Promise.resolve();
      });

      Promise.allSettled(promises).then(() => {
        toast.success(
          `Privilégios da categoria "${category}" ${assign ? 'atribuídos' : 'removidos'} com sucesso`
        );
      });
    },
    [
      isAdmin,
      privilegeCategories,
      rolePrivilegeIds,
      roleId,
      assignPrivilege,
      removePrivilege,
    ]
  );

  const handleExportPrivileges = useCallback(() => {
    if (!role || !rolePrivileges) return;

    const data = {
      role: {
        id: role.id,
        name: role.name,
        description: role.description,
      },
      privileges: rolePrivileges.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
      })),
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `role-${role.name}-privileges.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Privilégios exportados com sucesso');
  }, [role, rolePrivileges]);

  const handleGoBack = () => {
    router.push('/dashboard/roles');
  };

  // Loading states
  if (roleLoading || privilegesLoading || rolePrivilegesLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='space-y-4 text-center'>
          <div className='mx-auto h-16 w-16 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600'></div>
          <div className='space-y-2'>
            <h3 className='text-lg font-semibold text-gray-900'>
              Carregando informações...
            </h3>
            <p className='text-sm text-gray-600'>
              Buscando dados do papel e privilégios
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!role) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='space-y-6 text-center'>
          <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100'>
            <X className='h-10 w-10 text-red-600' />
          </div>
          <div className='space-y-2'>
            <h2 className='text-2xl font-bold text-gray-900'>
              Papel não encontrado
            </h2>
            <p className='max-w-md text-gray-600'>
              O papel solicitado não existe ou foi removido do sistema.
            </p>
          </div>
          <Button onClick={handleGoBack} variant='outline' size='lg'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Voltar para Papéis
          </Button>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className='min-h-screen bg-gray-50/30'>
        <div className='mx-auto max-w-7xl space-y-8 p-6'>
          {/* Enhanced Header */}
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <Button
                variant='outline'
                size='sm'
                onClick={handleGoBack}
                className='flex items-center gap-2 hover:bg-gray-100'
              >
                <ArrowLeft className='h-4 w-4' />
                Voltar
              </Button>
              <div className='flex items-center gap-4'>
                <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 text-white shadow-lg'>
                  <Shield className='h-7 w-7' />
                </div>
                <div>
                  <h1 className='text-3xl font-bold tracking-tight text-gray-900'>
                    {role.name}
                  </h1>
                  <p className='text-lg text-gray-600'>{role.description}</p>
                </div>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              {isAdmin && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={handleExportPrivileges}
                      className='flex items-center gap-2'
                    >
                      <Download className='h-4 w-4' />
                      Exportar
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Exportar privilégios do papel</TooltipContent>
                </Tooltip>
              )}
              <Badge variant='secondary' className='px-3 py-1 text-sm'>
                ID: #{role.id}
              </Badge>
            </div>
          </div>

          {/* Enhanced Stats Cards */}
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
            <Card className='border-0 bg-white shadow-sm'>
              <CardContent className='p-6'>
                <div className='flex items-center gap-4'>
                  <div className='rounded-lg bg-green-100 p-3'>
                    <Check className='h-6 w-6 text-green-600' />
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>
                      Privilégios Atribuídos
                    </p>
                    <p className='text-2xl font-bold text-gray-900'>
                      {privilegeStats.assigned}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='border-0 bg-white shadow-sm'>
              <CardContent className='p-6'>
                <div className='flex items-center gap-4'>
                  <div className='rounded-lg bg-blue-100 p-3'>
                    <Settings className='h-6 w-6 text-blue-600' />
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>
                      Total de Privilégios
                    </p>
                    <p className='text-2xl font-bold text-gray-900'>
                      {privilegeStats.total}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='border-0 bg-white shadow-sm'>
              <CardContent className='p-6'>
                <div className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <p className='text-sm font-medium text-gray-600'>
                      Percentual Completo
                    </p>
                    <span className='text-sm font-bold text-gray-900'>
                      {privilegeStats.percentage.toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={privilegeStats.percentage} className='h-2' />
                </div>
              </CardContent>
            </Card>

            {privilegeStats.pending > 0 && (
              <Card className='border-0 bg-amber-50 shadow-sm'>
                <CardContent className='p-6'>
                  <div className='flex items-center gap-4'>
                    <div className='rounded-lg bg-amber-100 p-3'>
                      <Undo2 className='h-6 w-6 text-amber-600' />
                    </div>
                    <div>
                      <p className='text-sm font-medium text-amber-700'>
                        Alterações Pendentes
                      </p>
                      <p className='text-2xl font-bold text-amber-900'>
                        {privilegeStats.pending}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Enhanced Filters and Search */}
          <Card className='border-0 bg-white shadow-sm'>
            <CardContent className='p-6'>
              <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
                <div className='flex flex-col gap-4 lg:flex-row lg:items-center'>
                  <div className='max-w-md flex-1'>
                    <div className='relative'>
                      <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400' />
                      <Input
                        placeholder='Buscar privilégios...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className='border-gray-200 pl-10 focus:border-purple-500 focus:ring-purple-500'
                      />
                    </div>
                  </div>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className='w-[180px]'>
                      <Filter className='mr-2 h-4 w-4' />
                      <SelectValue placeholder='Categoria' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>Todas categorias</SelectItem>
                      {availableCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.replace('_', ' ').toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={sortBy}
                    onValueChange={(value: SortOption) => setSortBy(value)}
                  >
                    <SelectTrigger className='w-[140px]'>
                      <SelectValue placeholder='Ordenar' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='category'>Categoria</SelectItem>
                      <SelectItem value='name'>Nome</SelectItem>
                      <SelectItem value='status'>Status</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='flex items-center gap-3'>
                  <div className='flex items-center space-x-2'>
                    <Switch
                      id='show-assigned'
                      checked={showOnlyAssigned}
                      onCheckedChange={setShowOnlyAssigned}
                    />
                    <label
                      htmlFor='show-assigned'
                      className='text-sm font-medium text-gray-700'
                    >
                      Apenas atribuídos
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Privileges Management */}
          <Card className='border-0 bg-white shadow-sm'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Lock className='h-5 w-5' />
                Gerenciar Privilégios
              </CardTitle>
              <CardDescription>
                Gerencie os privilégios atribuídos a este papel no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isAdmin ? (
                <div className='py-12 text-center'>
                  <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100'>
                    <Lock className='h-8 w-8 text-red-600' />
                  </div>
                  <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                    Acesso Restrito
                  </h3>
                  <p className='text-gray-600'>
                    Você não tem permissão para visualizar ou modificar
                    privilégios
                  </p>
                </div>
              ) : (
                <div className='space-y-8'>
                  {Object.entries(privilegeCategories).map(
                    ([category, privileges]) => {
                      const categoryAssigned = privileges.filter((p) =>
                        rolePrivilegeIds.has(p.id)
                      ).length;
                      const allAssigned =
                        categoryAssigned === privileges.length;
                      const noneAssigned = categoryAssigned === 0;

                      return (
                        <div key={category} className='space-y-4'>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-3'>
                              <h3 className='text-lg font-semibold text-gray-900 capitalize'>
                                {category.replace('_', ' ')}
                              </h3>
                              <Badge variant='outline' className='text-xs'>
                                {categoryAssigned}/{privileges.length} atribuído
                                {privileges.length !== 1 ? 's' : ''}
                              </Badge>
                            </div>
                            <div className='flex items-center gap-2'>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant='outline'
                                    size='sm'
                                    onClick={() =>
                                      handleBulkToggle(category, true)
                                    }
                                    disabled={allAssigned}
                                    className='h-8 px-2'
                                  >
                                    <CheckSquare className='h-4 w-4' />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Atribuir todos</TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant='outline'
                                    size='sm'
                                    onClick={() =>
                                      handleBulkToggle(category, false)
                                    }
                                    disabled={noneAssigned}
                                    className='h-8 px-2'
                                  >
                                    <Square className='h-4 w-4' />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Remover todos</TooltipContent>
                              </Tooltip>
                            </div>
                          </div>

                          <div className='grid gap-3'>
                            {privileges.map((privilege) => {
                              const isAssigned = rolePrivilegeIds.has(
                                privilege.id
                              );
                              const isPending = pendingChanges.has(
                                privilege.id
                              );

                              return (
                                <div
                                  key={privilege.id}
                                  className={`flex items-center space-x-4 rounded-xl border-2 p-4 transition-all duration-200 ${
                                    isAssigned
                                      ? 'border-green-200 bg-green-50/50 hover:bg-green-50'
                                      : 'border-gray-200 bg-white hover:bg-gray-50'
                                  } ${isPending ? 'opacity-60' : ''} `}
                                >
                                  <Checkbox
                                    id={`privilege-${privilege.id}`}
                                    checked={isAssigned}
                                    disabled={isPending}
                                    onCheckedChange={(checked) =>
                                      handlePrivilegeToggle(
                                        privilege,
                                        checked as boolean
                                      )
                                    }
                                    className='h-5 w-5'
                                  />
                                  <div className='min-w-0 flex-1'>
                                    <label
                                      htmlFor={`privilege-${privilege.id}`}
                                      className='block cursor-pointer'
                                    >
                                      <div className='mb-1 flex items-center gap-2'>
                                        <span className='font-medium text-gray-900'>
                                          {privilege.name
                                            .replace(/_/g, ' ')
                                            .replace(/\b\w/g, (l) =>
                                              l.toUpperCase()
                                            )}
                                        </span>
                                        {isAssigned && (
                                          <Badge
                                            variant='secondary'
                                            className='px-2 py-0.5 text-xs'
                                          >
                                            Ativo
                                          </Badge>
                                        )}
                                        {privilege.description && (
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Info className='h-4 w-4 cursor-help text-gray-400' />
                                            </TooltipTrigger>
                                            <TooltipContent
                                              side='top'
                                              className='max-w-sm'
                                            >
                                              {privilege.description}
                                            </TooltipContent>
                                          </Tooltip>
                                        )}
                                      </div>
                                    </label>
                                  </div>
                                  {isPending && (
                                    <div className='flex items-center rounded-full border bg-white px-3 py-1 text-xs text-gray-500'>
                                      <div className='mr-2 h-3 w-3 animate-spin rounded-full border-2 border-purple-200 border-t-purple-600'></div>
                                      Processando...
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    }
                  )}

                  {filteredPrivileges.length === 0 && (
                    <div className='py-12 text-center'>
                      <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100'>
                        <Search className='h-8 w-8 text-gray-400' />
                      </div>
                      <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                        Nenhum privilégio encontrado
                      </h3>
                      <p className='text-gray-600'>
                        Tente ajustar os filtros de pesquisa
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Confirmation Dialog */}
        <AlertDialog
          open={confirmDialog.isOpen}
          onOpenChange={(open) => setConfirmDialog({ isOpen: open })}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Confirmar{' '}
                {confirmDialog.action === 'assign' ? 'Atribuição' : 'Remoção'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja{' '}
                {confirmDialog.action === 'assign' ? 'atribuir' : 'remover'} o
                privilégio{' '}
                <strong>&quot;{confirmDialog.privilege?.name}&quot;</strong>{' '}
                {confirmDialog.action === 'assign' ? 'ao' : 'do'} papel{' '}
                <strong>&quot;{role.name}&quot;</strong>?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmPrivilegeToggle}>
                Confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
}
