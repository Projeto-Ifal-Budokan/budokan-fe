'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useManageRoles } from '@/lib/api/queries/use-manage-roles';
import { useManageUsers } from '@/lib/api/queries/use-manage-users';
import { useUserRoles } from '@/lib/api/queries/use-user-roles';
import { Role, User } from '@/types/user';
import { motion } from 'framer-motion';
import {
  Check,
  Loader2,
  Plus,
  Search,
  Shield,
  User as UserIcon,
} from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

interface AssignUserRoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssignUserRoleModal({
  open,
  onOpenChange,
}: AssignUserRoleModalProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [userSearch, setUserSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Infinite scroll state for users
  const [currentPage, setCurrentPage] = useState(1);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [hasMoreUsers, setHasMoreUsers] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Hooks
  const { useUsers } = useManageUsers();
  const { useRoles } = useManageRoles();
  const { assignRole } = useUserRoles();

  const pageSize = 20; // Load 20 users per page
  const { data: usersResponse, isLoading: isLoadingUsers } = useUsers(
    currentPage,
    pageSize
  );

  // Fetch all available roles
  const { data: rolesResponse, isLoading: isLoadingRoles } = useRoles(1, 100);

  // Update users list when new data comes in
  useEffect(() => {
    if (usersResponse?.data?.items) {
      const newUsers = usersResponse.data.items;
      const totalItems = usersResponse.data.count || 0;

      if (currentPage === 1) {
        // First page - replace all users
        setAllUsers(newUsers);
      } else {
        // Subsequent pages - append to existing users
        setAllUsers((prev) => {
          const existingIds = new Set(prev.map((user) => user.id));
          const uniqueNewUsers = newUsers.filter(
            (user) => !existingIds.has(user.id)
          );
          return [...prev, ...uniqueNewUsers];
        });
      }

      // Check if there are more users to load
      const totalLoadedUsers =
        currentPage === 1 ? newUsers.length : allUsers.length + newUsers.length;
      setHasMoreUsers(totalLoadedUsers < totalItems);
      setIsLoadingMore(false);
    }
  }, [usersResponse, currentPage, allUsers]);

  // Reset pagination when modal opens/closes
  useEffect(() => {
    if (open) {
      setCurrentPage(1);
      setAllUsers([]);
      setHasMoreUsers(true);
    }
  }, [open]);

  // Filtered users based on search
  const filteredUsers = useMemo(() => {
    return allUsers.filter(
      (user) =>
        `${user.firstName} ${user.surname}`
          .toLowerCase()
          .includes(userSearch.toLowerCase()) ||
        user.email.toLowerCase().includes(userSearch.toLowerCase())
    );
  }, [allUsers, userSearch]);

  // Available roles from API
  const availableRoles = useMemo(() => {
    return rolesResponse?.data?.items || [];
  }, [rolesResponse]);

  // Load more users function
  const loadMoreUsers = useCallback(() => {
    if (!hasMoreUsers || isLoadingMore || isLoadingUsers) return;

    setIsLoadingMore(true);
    setCurrentPage((prev) => prev + 1);
  }, [hasMoreUsers, isLoadingMore, isLoadingUsers]);

  // Scroll handler for infinite scroll
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

      // Load more when scrolled to 80% of the content
      if (scrollPercentage > 0.8) {
        loadMoreUsers();
      }
    },
    [loadMoreUsers]
  );

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getRoleColor = (roleName: string) => {
    const colors = [
      'bg-blue-50 text-blue-700 border-blue-200',
      'bg-purple-50 text-purple-700 border-purple-200',
      'bg-green-50 text-green-700 border-green-200',
      'bg-orange-50 text-orange-700 border-orange-200',
      'bg-red-50 text-red-700 border-red-200',
      'bg-indigo-50 text-indigo-700 border-indigo-200',
    ];
    const index = roleName.length % colors.length;
    return colors[index];
  };

  const userAlreadyHasRole = (user: User, role: Role) => {
    return user.roles?.some((userRole) => userRole.id === role.id) || false;
  };

  const handleSubmit = async () => {
    if (!selectedUser || !selectedRole) {
      toast.error('Por favor, selecione usuário e papel');
      return;
    }

    // Check if user already has this role
    if (userAlreadyHasRole(selectedUser, selectedRole)) {
      toast.error('Usuário já possui este papel');
      return;
    }

    setIsSubmitting(true);
    try {
      await assignRole.mutateAsync({
        idUser: selectedUser.id,
        idRole: selectedRole.id,
      });

      toast.success('Papel atribuído ao usuário com sucesso!');
      onOpenChange(false);

      // Reset form
      setSelectedUser(null);
      setSelectedRole(null);
      setUserSearch('');
    } catch (error) {
      console.error('Error assigning role to user:', error);
      toast.error('Erro ao atribuir papel ao usuário');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedUser(null);
    setSelectedRole(null);
    setUserSearch('');
    setCurrentPage(1);
    setAllUsers([]);
    setHasMoreUsers(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className='border-0 bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg hover:from-blue-700 hover:to-indigo-700'>
          <Plus className='mr-2 h-4 w-4' />
          Atribuir Papel
        </Button>
      </DialogTrigger>
      <DialogContent className='max-h-[95vh] max-w-5xl overflow-y-auto sm:max-w-4xl'>
        <DialogHeader className='pb-4'>
          <DialogTitle className='flex items-center gap-3 text-2xl font-bold text-gray-900'>
            <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white'>
              <Shield className='h-5 w-5' />
            </div>
            Atribuir Papel ao Usuário
          </DialogTitle>
          <DialogDescription className='text-base text-gray-600'>
            Selecione um usuário e um papel para atribuir as permissões
            correspondentes. Complete ambas as etapas abaixo.
          </DialogDescription>
        </DialogHeader>

        <div className='flex flex-col gap-6'>
          {/* Progress Indicator */}
          <div className='flex items-center justify-center gap-4'>
            <motion.div
              className={`flex items-center gap-2 rounded-full border-2 px-4 py-2 transition-all ${
                selectedUser
                  ? 'border-blue-200 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-gray-50 text-gray-500'
              }`}
              animate={{ scale: selectedUser ? 1.05 : 1 }}
            >
              <UserIcon className='h-4 w-4' />
              <span className='text-sm font-medium'>1. Usuário</span>
              {selectedUser && <Check className='h-4 w-4' />}
            </motion.div>

            <div
              className={`h-0.5 w-8 transition-colors ${selectedUser ? 'bg-blue-300' : 'bg-gray-200'}`}
            />

            <motion.div
              className={`flex items-center gap-2 rounded-full border-2 px-4 py-2 transition-all ${
                selectedRole
                  ? 'border-blue-200 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-gray-50 text-gray-500'
              }`}
              animate={{ scale: selectedRole ? 1.05 : 1 }}
            >
              <Shield className='h-4 w-4' />
              <span className='text-sm font-medium'>2. Papel</span>
              {selectedRole && <Check className='h-4 w-4' />}
            </motion.div>
          </div>

          <Separator />

          {/* Content Area */}
          <div className='grid min-h-0 flex-1 grid-cols-1 gap-6 lg:grid-cols-2'>
            {/* Step 1: Select User */}
            <div className='space-y-4'>
              <div className='flex items-center gap-2'>
                <UserIcon className='h-5 w-5 text-blue-600' />
                <Label className='text-lg font-semibold text-gray-900'>
                  Selecionar Usuário
                </Label>
                {(isLoadingUsers || isLoadingMore) && (
                  <Loader2 className='h-4 w-4 animate-spin text-blue-600' />
                )}
              </div>

              <div className='relative'>
                <Search className='absolute top-3 left-3 h-4 w-4 text-gray-400' />
                <Input
                  placeholder='Buscar por nome ou email...'
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className='pl-10'
                />
              </div>

              <ScrollArea className='h-96' onScrollCapture={handleScroll}>
                <div className='space-y-2'>
                  {filteredUsers.map((user) => (
                    <motion.div
                      key={user.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        className={`cursor-pointer transition-all ${
                          selectedUser?.id === user.id
                            ? 'border-blue-200 bg-blue-50 ring-2 ring-blue-500'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedUser(user)}
                      >
                        <CardContent className='p-4'>
                          <div className='flex items-center gap-3'>
                            <Avatar className='h-10 w-10'>
                              <AvatarFallback className='bg-gradient-to-br from-blue-500 to-indigo-600 font-medium text-white'>
                                {getInitials(user.firstName, user.surname)}
                              </AvatarFallback>
                            </Avatar>
                            <div className='min-w-0 flex-1'>
                              <p className='truncate font-medium text-gray-900'>
                                {user.firstName} {user.surname}
                              </p>
                              <p className='truncate text-sm text-gray-500'>
                                {user.email}
                              </p>
                              {user.roles && user.roles.length > 0 && (
                                <div className='mt-1 flex flex-wrap gap-1'>
                                  {user.roles.slice(0, 2).map((role) => (
                                    <Badge
                                      key={role.id}
                                      variant='secondary'
                                      className='text-xs'
                                    >
                                      {role.name}
                                    </Badge>
                                  ))}
                                  {user.roles.length > 2 && (
                                    <Badge
                                      variant='secondary'
                                      className='text-xs'
                                    >
                                      +{user.roles.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                            {selectedUser?.id === user.id && (
                              <Check className='h-5 w-5 text-blue-600' />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}

                  {/* Loading indicator for infinite scroll */}
                  {isLoadingMore && (
                    <div className='flex items-center justify-center py-4'>
                      <Loader2 className='h-6 w-6 animate-spin text-blue-600' />
                      <span className='ml-2 text-sm text-gray-500'>
                        Carregando mais usuários...
                      </span>
                    </div>
                  )}

                  {/* End of list indicator */}
                  {!hasMoreUsers && allUsers.length > 0 && (
                    <div className='flex items-center justify-center py-4'>
                      <span className='text-sm text-gray-400'>
                        Todos os usuários foram carregados
                      </span>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Step 2: Select Role */}
            <div className='space-y-4'>
              <div className='flex items-center gap-2'>
                <Shield className='h-5 w-5 text-purple-600' />
                <Label className='text-lg font-semibold text-gray-900'>
                  Selecionar Papel
                </Label>
                {isLoadingRoles && (
                  <Loader2 className='h-4 w-4 animate-spin text-purple-600' />
                )}
              </div>

              <ScrollArea className='h-[410px]'>
                <div className='space-y-3'>
                  {availableRoles.map((role) => {
                    const userHasRole =
                      selectedUser && userAlreadyHasRole(selectedUser, role);

                    return (
                      <motion.div
                        key={role.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card
                          className={`cursor-pointer transition-all ${
                            selectedRole?.id === role.id
                              ? 'border-purple-200 bg-purple-50 ring-2 ring-purple-500'
                              : userHasRole
                                ? 'border-yellow-200 bg-yellow-50 opacity-75'
                                : 'border-gray-200 hover:bg-gray-50'
                          }`}
                          onClick={() => {
                            if (!userHasRole) {
                              setSelectedRole(role);
                            }
                          }}
                        >
                          <CardContent className='p-4'>
                            <div className='flex items-start justify-between'>
                              <div className='flex-1'>
                                <div className='mb-2 flex items-center gap-2'>
                                  <Badge
                                    className={`${getRoleColor(role.name)} border font-medium`}
                                  >
                                    <Shield className='mr-1 h-3 w-3' />
                                    {role.name}
                                  </Badge>
                                  {userHasRole && (
                                    <Badge
                                      variant='outline'
                                      className='text-xs text-yellow-600'
                                    >
                                      Já possui
                                    </Badge>
                                  )}
                                </div>
                                <p className='text-sm text-gray-600'>
                                  {role.description}
                                </p>
                              </div>
                              {selectedRole?.id === role.id && !userHasRole && (
                                <Check className='ml-2 h-5 w-5 text-purple-600' />
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </div>

          <Separator />

          {/* Summary and Actions */}
          <div className='space-y-4'>
            {(selectedUser || selectedRole) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className='rounded-lg border border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50 p-4'
              >
                <h4 className='mb-3 font-medium text-gray-900'>
                  Resumo da Atribuição:
                </h4>
                <div className='grid grid-cols-1 gap-4 text-sm md:grid-cols-2'>
                  <div>
                    <span className='text-gray-600'>Usuário:</span>
                    <p className='font-medium text-gray-900'>
                      {selectedUser
                        ? `${selectedUser.firstName} ${selectedUser.surname}`
                        : 'Não selecionado'}
                    </p>
                    {selectedUser?.email && (
                      <p className='text-xs text-gray-500'>
                        {selectedUser.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <span className='text-gray-600'>Papel:</span>
                    <p className='font-medium text-gray-900'>
                      {selectedRole ? selectedRole.name : 'Não selecionado'}
                    </p>
                    {selectedRole?.description && (
                      <p className='text-xs text-gray-500'>
                        {selectedRole.description}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            <div className='flex justify-end gap-3'>
              <Button variant='outline' onClick={handleReset}>
                Limpar
              </Button>
              <Button variant='outline' onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={
                  !selectedUser ||
                  !selectedRole ||
                  isSubmitting ||
                  (selectedUser &&
                    selectedRole &&
                    userAlreadyHasRole(selectedUser, selectedRole))
                }
                className='bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
              >
                {isSubmitting ? 'Atribuindo...' : 'Atribuir Papel'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
