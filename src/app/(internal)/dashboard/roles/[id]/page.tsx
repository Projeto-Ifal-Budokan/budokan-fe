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
  CheckCircle2,
  Circle,
  Download,
  Filter,
  Info,
  Lock,
  Search,
  Shield,
  ShieldCheck,
  Zap,
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
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'>
        <div className='space-y-6 text-center'>
          <div className='relative'>
            <div className='mx-auto h-24 w-24 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600'></div>
            <div className='absolute inset-0 flex items-center justify-center'>
              <Shield className='h-8 w-8 text-blue-600' />
            </div>
          </div>
          <div className='space-y-3'>
            <h3 className='text-xl font-semibold text-slate-800'>
              Carregando informações do papel
            </h3>
            <p className='max-w-md text-slate-600'>
              Aguarde enquanto buscamos os dados dos privilégios e permissões...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!role) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'>
        <div className='max-w-md space-y-8 text-center'>
          <div className='mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-100'>
            <Shield className='h-12 w-12 text-red-600' />
          </div>
          <div className='space-y-4'>
            <h2 className='text-3xl font-bold text-slate-800'>
              Papel não encontrado
            </h2>
            <p className='leading-relaxed text-slate-600'>
              O papel solicitado não existe ou foi removido do sistema.
              Verifique se o ID está correto ou entre em contato com o
              administrador.
            </p>
          </div>
          <Button
            onClick={handleGoBack}
            size='lg'
            className='bg-blue-600 px-8 py-3 text-white hover:bg-blue-700'
          >
            <ArrowLeft className='mr-2 h-5 w-5' />
            Voltar para Papéis
          </Button>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'>
        <div className='mx-auto max-w-7xl space-y-8 p-8'>
          {/* Modern Header */}
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-6'>
              <Button
                variant='ghost'
                size='sm'
                onClick={handleGoBack}
                className='px-3 py-2 text-slate-600 hover:bg-white/60 hover:text-slate-800'
              >
                <ArrowLeft className='mr-2 h-4 w-4' />
                Voltar
              </Button>

              <div className='flex items-center space-x-4'>
                <div className='relative'>
                  <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg'>
                    <Shield className='h-8 w-8 text-white' />
                  </div>
                  <div className='absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-green-500'>
                    <Check className='h-3 w-3 text-white' />
                  </div>
                </div>

                <div>
                  <div className='flex items-center space-x-3'>
                    <h1 className='text-3xl font-bold text-slate-800'>
                      {role.name}
                    </h1>
                    <Badge
                      variant='outline'
                      className='border-blue-200 px-3 py-1 text-sm font-medium text-blue-700'
                    >
                      #{role.id}
                    </Badge>
                  </div>
                  <p className='mt-1 text-lg text-slate-600'>
                    {role.description}
                  </p>
                </div>
              </div>
            </div>

            {isAdmin && (
              <Button
                onClick={handleExportPrivileges}
                variant='outline'
                className='border-slate-200 bg-white px-6 text-slate-700 hover:bg-slate-50'
              >
                <Download className='mr-2 h-4 w-4' />
                Exportar
              </Button>
            )}
          </div>

          {/* Enhanced Stats */}
          <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
            <Card className='border-0 bg-white/70 shadow-lg backdrop-blur-sm'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='mb-1 text-sm font-medium text-slate-600'>
                      Privilégios Ativos
                    </p>
                    <p className='text-3xl font-bold text-slate-800'>
                      {privilegeStats.assigned}
                    </p>
                    <p className='text-sm text-slate-500'>
                      de {privilegeStats.total} total
                    </p>
                  </div>
                  <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-green-100'>
                    <ShieldCheck className='h-6 w-6 text-green-600' />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='border-0 bg-white/70 shadow-lg backdrop-blur-sm'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='mb-1 text-sm font-medium text-slate-600'>
                      Progresso
                    </p>
                    <p className='text-3xl font-bold text-slate-800'>
                      {privilegeStats.percentage.toFixed(0)}%
                    </p>
                    <div className='mt-2 w-24'>
                      <Progress
                        value={privilegeStats.percentage}
                        className='h-2'
                      />
                    </div>
                  </div>
                  <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100'>
                    <Zap className='h-6 w-6 text-blue-600' />
                  </div>
                </div>
              </CardContent>
            </Card>

            {privilegeStats.pending > 0 && (
              <Card className='border-0 border-amber-200 bg-amber-50/70 shadow-lg backdrop-blur-sm'>
                <CardContent className='p-6'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='mb-1 text-sm font-medium text-amber-700'>
                        Processando
                      </p>
                      <p className='text-3xl font-bold text-amber-800'>
                        {privilegeStats.pending}
                      </p>
                      <p className='text-sm text-amber-600'>
                        alterações pendentes
                      </p>
                    </div>
                    <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100'>
                      <div className='h-5 w-5 animate-spin rounded-full border-2 border-amber-600 border-t-transparent' />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Modern Filters */}
          <Card className='border-0 bg-white/70 shadow-lg backdrop-blur-sm'>
            <CardContent className='p-6'>
              <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
                <div className='flex flex-1 flex-col gap-4 sm:flex-row'>
                  <div className='relative max-w-md flex-1'>
                    <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-slate-400' />
                    <Input
                      placeholder='Buscar privilégios...'
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className='border-slate-200 bg-white pl-10 focus:border-blue-400 focus:ring-blue-400'
                    />
                  </div>

                  <div className='flex gap-3'>
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger className='w-[180px] border-slate-200 bg-white'>
                        <Filter className='mr-2 h-4 w-4' />
                        <SelectValue placeholder='Categoria' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>Todas as categorias</SelectItem>
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
                      <SelectTrigger className='w-[140px] border-slate-200 bg-white'>
                        <SelectValue placeholder='Ordenar' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='category'>Categoria</SelectItem>
                        <SelectItem value='name'>Nome</SelectItem>
                        <SelectItem value='status'>Status</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className='flex items-center space-x-3'>
                  <Switch
                    id='show-assigned'
                    checked={showOnlyAssigned}
                    onCheckedChange={setShowOnlyAssigned}
                  />
                  <label
                    htmlFor='show-assigned'
                    className='text-sm font-medium text-slate-700'
                  >
                    Apenas ativos
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Modern Privileges Management */}
          <Card className='border-0 bg-white/70 shadow-lg backdrop-blur-sm'>
            <CardHeader className='pb-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='flex items-center gap-3 text-xl'>
                    <Lock className='h-5 w-5 text-blue-600' />
                    Gerenciar Privilégios
                  </CardTitle>
                  <CardDescription className='mt-1'>
                    Configure as permissões e acessos para este papel
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {!isAdmin ? (
                <div className='py-16 text-center'>
                  <div className='mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100'>
                    <Lock className='h-10 w-10 text-red-600' />
                  </div>
                  <h3 className='mb-2 text-xl font-semibold text-slate-800'>
                    Acesso Restrito
                  </h3>
                  <p className='mx-auto max-w-md text-slate-600'>
                    Você não possui as permissões necessárias para visualizar ou
                    modificar os privilégios deste papel.
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
                          <div className='flex items-center justify-between border-b border-slate-200 py-3'>
                            <div className='flex items-center space-x-4'>
                              <h3 className='text-lg font-semibold text-slate-800 capitalize'>
                                {category.replace('_', ' ')}
                              </h3>
                              <Badge
                                variant={allAssigned ? 'default' : 'secondary'}
                                className={`text-xs ${allAssigned ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}
                              >
                                {categoryAssigned}/{privileges.length} ativo
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
                                    className='h-8 px-3 text-xs'
                                  >
                                    Ativar todos
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  Ativar todos os privilégios desta categoria
                                </TooltipContent>
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
                                    className='h-8 px-3 text-xs'
                                  >
                                    Desativar todos
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  Desativar todos os privilégios desta categoria
                                </TooltipContent>
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
                                  className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                                    isAssigned
                                      ? 'border-green-200 bg-green-50/50 hover:bg-green-50'
                                      : 'border-slate-200 bg-white hover:bg-slate-50'
                                  } ${isPending ? 'opacity-60' : ''}`}
                                >
                                  <div className='flex items-center space-x-4 p-4'>
                                    <div className='relative'>
                                      {isAssigned ? (
                                        <CheckCircle2
                                          className={`h-6 w-6 text-green-600 ${isPending ? 'animate-pulse' : ''}`}
                                          onClick={() =>
                                            !isPending &&
                                            handlePrivilegeToggle(
                                              privilege,
                                              false
                                            )
                                          }
                                        />
                                      ) : (
                                        <Circle
                                          className={`h-6 w-6 cursor-pointer text-slate-400 hover:text-slate-600 ${isPending ? 'animate-pulse' : ''}`}
                                          onClick={() =>
                                            !isPending &&
                                            handlePrivilegeToggle(
                                              privilege,
                                              true
                                            )
                                          }
                                        />
                                      )}
                                    </div>

                                    <div className='min-w-0 flex-1'>
                                      <div className='mb-1 flex items-center space-x-3'>
                                        <h4 className='truncate font-medium text-slate-800'>
                                          {privilege.name
                                            .replace(/_/g, ' ')
                                            .replace(/\b\w/g, (l) =>
                                              l.toUpperCase()
                                            )}
                                        </h4>

                                        {isAssigned && (
                                          <Badge
                                            variant='secondary'
                                            className='bg-green-100 px-2 py-0.5 text-xs text-green-700'
                                          >
                                            Ativo
                                          </Badge>
                                        )}

                                        {privilege.description && (
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Info className='h-4 w-4 cursor-help text-slate-400 hover:text-slate-600' />
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

                                      {privilege.description && (
                                        <p className='truncate text-sm text-slate-500'>
                                          {privilege.description}
                                        </p>
                                      )}
                                    </div>

                                    {isPending && (
                                      <div className='flex items-center space-x-2 rounded-full bg-blue-50 px-3 py-1'>
                                        <div className='h-3 w-3 animate-spin rounded-full border-2 border-blue-600 border-t-transparent'></div>
                                        <span className='text-xs font-medium text-blue-700'>
                                          Processando
                                        </span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Hover Effect */}
                                  <div
                                    className={`absolute inset-y-0 left-0 w-1 transition-all duration-200 ${
                                      isAssigned
                                        ? 'bg-green-500'
                                        : 'bg-transparent group-hover:bg-blue-400'
                                    }`}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    }
                  )}

                  {filteredPrivileges.length === 0 && (
                    <div className='py-16 text-center'>
                      <div className='mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100'>
                        <Search className='h-10 w-10 text-slate-400' />
                      </div>
                      <h3 className='mb-2 text-xl font-semibold text-slate-800'>
                        Nenhum privilégio encontrado
                      </h3>
                      <p className='mx-auto max-w-md text-slate-600'>
                        Ajuste os filtros de pesquisa ou categoria para
                        encontrar os privilégios desejados.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Modern Confirmation Dialog */}
        <AlertDialog
          open={confirmDialog.isOpen}
          onOpenChange={(open) => setConfirmDialog({ isOpen: open })}
        >
          <AlertDialogContent className='max-w-md'>
            <AlertDialogHeader>
              <AlertDialogTitle className='text-xl'>
                {confirmDialog.action === 'assign'
                  ? 'Ativar Privilégio'
                  : 'Desativar Privilégio'}
              </AlertDialogTitle>
              <AlertDialogDescription className='text-base leading-relaxed'>
                Confirma a{' '}
                {confirmDialog.action === 'assign' ? 'ativação' : 'desativação'}{' '}
                do privilégio{' '}
                <span className='font-semibold text-slate-800'>
                  &quot;{confirmDialog.privilege?.name}&quot;
                </span>{' '}
                para o papel{' '}
                <span className='font-semibold text-slate-800'>
                  &quot;{role.name}&quot;
                </span>
                ?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmPrivilegeToggle}
                className={
                  confirmDialog.action === 'assign'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }
              >
                {confirmDialog.action === 'assign' ? 'Ativar' : 'Desativar'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
}
