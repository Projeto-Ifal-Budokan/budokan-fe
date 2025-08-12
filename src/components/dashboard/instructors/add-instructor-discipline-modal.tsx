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
import { useManageDisciplines } from '@/lib/api/queries/use-manage-disciplines';
import { useManageInstructors } from '@/lib/api/queries/use-manage-instructors';
import { useManageRankings } from '@/lib/api/queries/use-manage-rankings';
import { useManageUsers } from '@/lib/api/queries/use-manage-users';
import { User } from '@/types/user';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Check,
  GraduationCap,
  Loader2,
  Plus,
  Search,
  Star,
  User as UserIcon,
  Users,
} from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

interface AddInstructorDisciplineModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Discipline {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'inactive';
}

interface Rank {
  id: number;
  idDiscipline: number;
  name: string;
  description: string;
  disciplineName: string;
}

export function AddInstructorDisciplineModal({
  open,
  onOpenChange,
}: AddInstructorDisciplineModalProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedDiscipline, setSelectedDiscipline] =
    useState<Discipline | null>(null);
  const [selectedRank, setSelectedRank] = useState<Rank | null>(null);
  const [userSearch, setUserSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Infinite scroll state
  const [currentPage, setCurrentPage] = useState(1);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [hasMoreUsers, setHasMoreUsers] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Hooks
  const { useUsers } = useManageUsers();
  const { useDisciplines } = useManageDisciplines();
  const { useRankings } = useManageRankings();
  const { createInstructorDiscipline } = useManageInstructors();

  const pageSize = 20; // Load 20 users per page
  const { data: usersResponse, isLoading: isLoadingUsers } = useUsers(
    currentPage,
    pageSize
  );

  const { data: disciplinesResponse } = useDisciplines(1, 100);
  const { data: ranksResponse } = useRankings(
    1,
    100,
    selectedDiscipline ? { idDiscipline: selectedDiscipline.id } : undefined
  );

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

  const getDisciplineColor = (disciplineName: string) => {
    const colors = [
      'bg-blue-50 text-blue-700 border-blue-200',
      'bg-purple-50 text-purple-700 border-purple-200',
      'bg-green-50 text-green-700 border-green-200',
      'bg-orange-50 text-orange-700 border-orange-200',
    ];
    const index = disciplineName.length % colors.length;
    return colors[index];
  };

  const getRankColor = (rankName: string) => {
    if (rankName.includes('Dan')) {
      return 'bg-gray-900 text-white border-gray-700';
    }
    if (rankName.includes('Kyu')) {
      return 'bg-amber-50 text-amber-700 border-amber-200';
    }
    return 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const handleSubmit = async () => {
    if (!selectedUser || !selectedDiscipline || !selectedRank) {
      toast.error('Por favor, selecione usuário, disciplina e graduação');
      return;
    }

    setIsSubmitting(true);
    try {
      await createInstructorDiscipline.mutateAsync({
        idInstructor: selectedUser.id,
        idDiscipline: selectedDiscipline.id,
        idRank: selectedRank.id,
      });

      toast.success('Instrutor associado à disciplina com sucesso!');
      onOpenChange(false);

      // Reset form
      setSelectedUser(null);
      setSelectedDiscipline(null);
      setSelectedRank(null);
      setUserSearch('');
    } catch (error) {
      console.error('Error creating instructor discipline:', error);
      toast.error('Erro ao associar instrutor à disciplina');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedUser(null);
    setSelectedDiscipline(null);
    setSelectedRank(null);
    setUserSearch('');
    setCurrentPage(1);
    setAllUsers([]);
    setHasMoreUsers(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className='border-0 bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg hover:from-emerald-700 hover:to-teal-700'>
          <Plus className='mr-2 h-4 w-4' />
          Associar Instrutor
        </Button>
      </DialogTrigger>
      <DialogContent className='max-h-[95vh] max-w-6xl overflow-y-auto sm:max-w-4xl'>
        <DialogHeader className='pb-4'>
          <DialogTitle className='flex items-center gap-3 text-2xl font-bold text-gray-900'>
            <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white'>
              <Users className='h-5 w-5' />
            </div>
            Associar Instrutor à Disciplina
          </DialogTitle>
          <DialogDescription className='text-base text-gray-600'>
            Associe um usuário a uma disciplina e graduação para torná-lo
            instrutor. Complete todas as etapas abaixo.
          </DialogDescription>
        </DialogHeader>

        <div className='flex flex-col gap-6 overflow-hidden'>
          {/* Progress Indicator */}
          <div className='flex items-center justify-center gap-4'>
            <motion.div
              className={`flex items-center gap-2 rounded-full border-2 px-4 py-2 transition-all ${
                selectedUser
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-gray-200 bg-gray-50 text-gray-500'
              }`}
              animate={{ scale: selectedUser ? 1.05 : 1 }}
            >
              <UserIcon className='h-4 w-4' />
              <span className='text-sm font-medium'>1. Usuário</span>
              {selectedUser && <Check className='h-4 w-4' />}
            </motion.div>

            <div
              className={`h-0.5 w-8 transition-colors ${selectedUser ? 'bg-emerald-300' : 'bg-gray-200'}`}
            />

            <motion.div
              className={`flex items-center gap-2 rounded-full border-2 px-4 py-2 transition-all ${
                selectedDiscipline
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-gray-200 bg-gray-50 text-gray-500'
              }`}
              animate={{ scale: selectedDiscipline ? 1.05 : 1 }}
            >
              <BookOpen className='h-4 w-4' />
              <span className='text-sm font-medium'>2. Disciplina</span>
              {selectedDiscipline && <Check className='h-4 w-4' />}
            </motion.div>

            <div
              className={`h-0.5 w-8 transition-colors ${selectedDiscipline ? 'bg-emerald-300' : 'bg-gray-200'}`}
            />

            <motion.div
              className={`flex items-center gap-2 rounded-full border-2 px-4 py-2 transition-all ${
                selectedRank
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-gray-200 bg-gray-50 text-gray-500'
              }`}
              animate={{ scale: selectedRank ? 1.05 : 1 }}
            >
              <GraduationCap className='h-4 w-4' />
              <span className='text-sm font-medium'>3. Graduação</span>
              {selectedRank && <Check className='h-4 w-4' />}
            </motion.div>
          </div>

          <Separator />

          {/* Content Area */}
          <div className='grid min-h-0 flex-1 grid-cols-1 gap-6 lg:grid-cols-3'>
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

              <ScrollArea className='h-80' onScrollCapture={handleScroll}>
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

            {/* Step 2: Select Discipline */}
            <div className='space-y-4'>
              <div className='flex items-center gap-2'>
                <BookOpen className='h-5 w-5 text-purple-600' />
                <Label className='text-lg font-semibold text-gray-900'>
                  Selecionar Disciplina
                </Label>
              </div>

              <ScrollArea className='h-96'>
                <div className='space-y-3'>
                  {disciplinesResponse?.data.items.map((discipline) => (
                    <motion.div
                      key={discipline.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        className={`cursor-pointer transition-all ${
                          selectedDiscipline?.id === discipline.id
                            ? 'border-purple-200 bg-purple-50 ring-2 ring-purple-500'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => {
                          setSelectedDiscipline(discipline);
                          setSelectedRank(null); // Reset rank when discipline changes
                        }}
                      >
                        <CardContent className='p-4'>
                          <div className='flex items-start justify-between'>
                            <div className='flex-1'>
                              <div
                                className={`mb-2 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${getDisciplineColor(discipline.name)}`}
                              >
                                <GraduationCap className='h-3 w-3' />
                                {discipline.name}
                              </div>
                              <p className='text-sm text-gray-600'>
                                {discipline.description}
                              </p>
                            </div>
                            {selectedDiscipline?.id === discipline.id && (
                              <Check className='ml-2 h-5 w-5 text-purple-600' />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Step 3: Select Rank */}
            <div className='space-y-4'>
              <div className='flex items-center gap-2'>
                <Star className='h-5 w-5 text-amber-600' />
                <Label className='text-lg font-semibold text-gray-900'>
                  Selecionar Graduação
                </Label>
              </div>

              {!selectedDiscipline ? (
                <div className='flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 text-gray-500'>
                  <div className='text-center'>
                    <GraduationCap className='mx-auto mb-2 h-8 w-8 text-gray-400' />
                    <p className='text-sm'>Selecione uma disciplina primeiro</p>
                  </div>
                </div>
              ) : (
                <ScrollArea className='h-96'>
                  <div className='space-y-2'>
                    {ranksResponse?.data?.items.map((rank) => (
                      <motion.div
                        key={rank.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card
                          className={`cursor-pointer transition-all ${
                            selectedRank?.id === rank.id
                              ? 'border-amber-200 bg-amber-50 ring-2 ring-amber-500'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedRank(rank)}
                        >
                          <CardContent className='p-4'>
                            <div className='flex items-center justify-between'>
                              <div>
                                <Badge
                                  className={`${getRankColor(rank.name)} mb-2 border`}
                                >
                                  {rank.name}
                                </Badge>
                                <p className='text-sm text-gray-600'>
                                  {rank.description}
                                </p>
                              </div>
                              {selectedRank?.id === rank.id && (
                                <Check className='h-5 w-5 text-amber-600' />
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </div>

          <Separator />

          {/* Summary and Actions */}
          <div className='space-y-4'>
            {(selectedUser || selectedDiscipline || selectedRank) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className='rounded-lg border border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50 p-4'
              >
                <h4 className='mb-3 font-medium text-gray-900'>
                  Resumo da Associação:
                </h4>
                <div className='grid grid-cols-1 gap-4 text-sm md:grid-cols-3'>
                  <div>
                    <span className='text-gray-600'>Usuário:</span>
                    <p className='font-medium text-gray-900'>
                      {selectedUser
                        ? `${selectedUser.firstName} ${selectedUser.surname}`
                        : 'Não selecionado'}
                    </p>
                  </div>
                  <div>
                    <span className='text-gray-600'>Disciplina:</span>
                    <p className='font-medium text-gray-900'>
                      {selectedDiscipline
                        ? selectedDiscipline.name
                        : 'Não selecionada'}
                    </p>
                  </div>
                  <div>
                    <span className='text-gray-600'>Graduação:</span>
                    <p className='font-medium text-gray-900'>
                      {selectedRank
                        ? `${selectedRank.name} - ${selectedRank.description}`
                        : 'Não selecionada'}
                    </p>
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
                  !selectedDiscipline ||
                  !selectedRank ||
                  isSubmitting
                }
                className='bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
              >
                {isSubmitting ? 'Associando...' : 'Associar Instrutor'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
