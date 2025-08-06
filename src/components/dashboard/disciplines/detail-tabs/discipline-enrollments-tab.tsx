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
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/lib/api/queries/use-auth';
import { useManageInstructors } from '@/lib/api/queries/use-manage-instructors';
import { useManageMatriculations } from '@/lib/api/queries/use-manage-matriculations';
import { useManageRankings } from '@/lib/api/queries/use-manage-rankings';
import { useManageUsers } from '@/lib/api/queries/use-manage-users';
import { usePrivilegesByUser } from '@/lib/api/queries/use-privileges';
import { Discipline } from '@/types/discipline';
import { InstructorDiscipline } from '@/types/instructor';
import { Matriculation } from '@/types/matriculation';
import { User } from '@/types/user';
import { hasAccess } from '@/utils/access-control';
import {
  Eye,
  GraduationCap,
  Loader2,
  MoreVertical,
  Plus,
  Search,
  Trash,
  UserCheck,
  UserMinus,
  Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { StatusChangeModal as InstructorStatusModal } from '../../instructors/status-change-modal';
import { StatusChangeModal as MatriculationStatusModal } from '../../matriculations/status-change-modal';

interface DisciplineEnrollmentsTabProps {
  disciplineId: string;
  discipline: Discipline;
}

// Add the ModalEnrollment interface at the top
interface ModalEnrollment {
  id: number;
  userName: string;
  status: 'active' | 'inactive' | 'graduated';
  disciplineName: string;
}

// Simple Student Matriculation Form
function SimpleStudentMatriculationForm({
  disciplineId,
  onSuccess,
}: {
  disciplineId: string;
  onSuccess: () => void;
}) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRank, setSelectedRank] = useState<string>('');
  const [userSearch, setUserSearch] = useState('');

  const { useUsers } = useManageUsers();
  const { useRankings } = useManageRankings();
  const { createMatriculation } = useManageMatriculations();

  const { data: usersResponse, isLoading: isLoadingUsers } = useUsers(1, 50);
  const { data: ranksResponse, isLoading: isLoadingRanks } =
    useRankings(disciplineId);

  const users = useMemo(
    () => usersResponse?.data?.items || [],
    [usersResponse?.data?.items]
  );
  const ranks = useMemo(
    () => ranksResponse?.data?.items || [],
    [ranksResponse?.data?.items]
  );

  const filteredUsers = useMemo(() => {
    if (!userSearch) return users;
    return users.filter((user) =>
      `${user.firstName} ${user.surname} ${user.email}`
        .toLowerCase()
        .includes(userSearch.toLowerCase())
    );
  }, [users, userSearch]);

  const handleSubmit = async () => {
    if (!selectedUser || !selectedRank) {
      toast.error('Selecione um usuário e uma graduação');
      return;
    }

    try {
      await createMatriculation.mutateAsync({
        idStudent: selectedUser.id,
        idDiscipline: Number(disciplineId),
        idRank: Number(selectedRank),
      });

      onSuccess();
    } catch (error) {
      console.error('Error creating matriculation:', error);
    }
  };

  const getInitials = (firstName: string, surname: string) => {
    return `${firstName.charAt(0)}${surname.charAt(0)}`.toUpperCase();
  };

  return (
    <div className='space-y-6'>
      {/* User Selection */}
      <div className='space-y-4'>
        <Label className='text-lg font-semibold text-gray-900'>
          Selecionar Estudante
        </Label>

        <div className='relative'>
          <Search className='absolute top-3 left-3 h-4 w-4 text-gray-400' />
          <Input
            placeholder='Buscar por nome ou email...'
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            className='pl-10'
          />
        </div>

        <ScrollArea className='h-60 rounded-md border'>
          <div className='space-y-2 p-2'>
            {isLoadingUsers ? (
              <div className='flex items-center justify-center py-8'>
                <Loader2 className='h-6 w-6 animate-spin text-blue-600' />
              </div>
            ) : (
              filteredUsers.map((user) => (
                <Card
                  key={user.id}
                  className={`cursor-pointer transition-all ${
                    selectedUser?.id === user.id
                      ? 'border-blue-200 bg-blue-50 ring-2 ring-blue-500'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedUser(user)}
                >
                  <CardContent className='p-3'>
                    <div className='flex items-center gap-3'>
                      <Avatar className='h-8 w-8'>
                        <AvatarFallback className='bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-medium text-white'>
                          {getInitials(user.firstName, user.surname)}
                        </AvatarFallback>
                      </Avatar>
                      <div className='min-w-0 flex-1'>
                        <p className='truncate text-sm font-medium text-gray-900'>
                          {user.firstName} {user.surname}
                        </p>
                        <p className='truncate text-xs text-gray-500'>
                          {user.email}
                        </p>
                      </div>
                      {selectedUser?.id === user.id && (
                        <UserCheck className='h-4 w-4 text-blue-600' />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Rank Selection */}
      <div className='space-y-4'>
        <Label className='text-lg font-semibold text-gray-900'>
          Selecionar Graduação
        </Label>

        <Select value={selectedRank} onValueChange={setSelectedRank}>
          <SelectTrigger>
            <SelectValue placeholder='Escolha uma graduação' />
          </SelectTrigger>
          <SelectContent>
            {isLoadingRanks ? (
              <div className='flex items-center justify-center py-4'>
                <Loader2 className='h-4 w-4 animate-spin' />
              </div>
            ) : (
              ranks.map((rank) => (
                <SelectItem key={rank.id} value={rank.id.toString()}>
                  <div className='flex items-center gap-2'>
                    <GraduationCap className='h-4 w-4 text-emerald-600' />
                    <span>{rank.name}</span>
                  </div>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Submit Button */}
      <div className='flex justify-end space-x-3 border-t pt-4'>
        <Button
          onClick={handleSubmit}
          disabled={
            !selectedUser || !selectedRank || createMatriculation.isPending
          }
          className='bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
        >
          {createMatriculation.isPending ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Matriculando...
            </>
          ) : (
            <>
              <Plus className='mr-2 h-4 w-4' />
              Matricular Estudante
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// Simple Instructor Assignment Form
function SimpleInstructorAssignmentForm({
  disciplineId,
  onSuccess,
}: {
  disciplineId: string;
  onSuccess: () => void;
}) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRank, setSelectedRank] = useState<string>('');
  const [userSearch, setUserSearch] = useState('');

  const { useUsers } = useManageUsers();
  const { useRankings } = useManageRankings();
  const { createInstructorDiscipline } = useManageInstructors();

  const { data: usersResponse, isLoading: isLoadingUsers } = useUsers(1, 50);
  const { data: ranksResponse, isLoading: isLoadingRanks } =
    useRankings(disciplineId);

  const users = useMemo(
    () => usersResponse?.data?.items || [],
    [usersResponse?.data?.items]
  );
  const ranks = useMemo(
    () => ranksResponse?.data?.items || [],
    [ranksResponse?.data?.items]
  );

  const filteredUsers = useMemo(() => {
    if (!userSearch) return users;
    return users.filter((user) =>
      `${user.firstName} ${user.surname} ${user.email}`
        .toLowerCase()
        .includes(userSearch.toLowerCase())
    );
  }, [users, userSearch]);

  const handleSubmit = async () => {
    if (!selectedUser || !selectedRank) {
      toast.error('Selecione um usuário e uma graduação');
      return;
    }

    try {
      await createInstructorDiscipline.mutateAsync({
        idInstructor: selectedUser.id,
        idDiscipline: Number(disciplineId),
        idRank: Number(selectedRank),
      });

      onSuccess();
    } catch (error) {
      console.error('Error creating instructor discipline:', error);
    }
  };

  const getInitials = (firstName: string, surname: string) => {
    return `${firstName.charAt(0)}${surname.charAt(0)}`.toUpperCase();
  };

  return (
    <div className='space-y-6'>
      {/* User Selection */}
      <div className='space-y-4'>
        <Label className='text-lg font-semibold text-gray-900'>
          Selecionar Instrutor
        </Label>

        <div className='relative'>
          <Search className='absolute top-3 left-3 h-4 w-4 text-gray-400' />
          <Input
            placeholder='Buscar por nome ou email...'
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            className='pl-10'
          />
        </div>

        <ScrollArea className='h-60 rounded-md border'>
          <div className='space-y-2 p-2'>
            {isLoadingUsers ? (
              <div className='flex items-center justify-center py-8'>
                <Loader2 className='h-6 w-6 animate-spin text-purple-600' />
              </div>
            ) : (
              filteredUsers.map((user) => (
                <Card
                  key={user.id}
                  className={`cursor-pointer transition-all ${
                    selectedUser?.id === user.id
                      ? 'border-purple-200 bg-purple-50 ring-2 ring-purple-500'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedUser(user)}
                >
                  <CardContent className='p-3'>
                    <div className='flex items-center gap-3'>
                      <Avatar className='h-8 w-8'>
                        <AvatarFallback className='bg-gradient-to-br from-purple-500 to-pink-600 text-xs font-medium text-white'>
                          {getInitials(user.firstName, user.surname)}
                        </AvatarFallback>
                      </Avatar>
                      <div className='min-w-0 flex-1'>
                        <p className='truncate text-sm font-medium text-gray-900'>
                          {user.firstName} {user.surname}
                        </p>
                        <p className='truncate text-xs text-gray-500'>
                          {user.email}
                        </p>
                      </div>
                      {selectedUser?.id === user.id && (
                        <UserCheck className='h-4 w-4 text-purple-600' />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Rank Selection */}
      <div className='space-y-4'>
        <Label className='text-lg font-semibold text-gray-900'>
          Selecionar Graduação do Instrutor
        </Label>

        <Select value={selectedRank} onValueChange={setSelectedRank}>
          <SelectTrigger>
            <SelectValue placeholder='Escolha uma graduação' />
          </SelectTrigger>
          <SelectContent>
            {isLoadingRanks ? (
              <div className='flex items-center justify-center py-4'>
                <Loader2 className='h-4 w-4 animate-spin' />
              </div>
            ) : (
              ranks.map((rank) => (
                <SelectItem key={rank.id} value={rank.id.toString()}>
                  <div className='flex items-center gap-2'>
                    <GraduationCap className='h-4 w-4 text-emerald-600' />
                    <span>{rank.name}</span>
                  </div>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Submit Button */}
      <div className='flex justify-end space-x-3 border-t pt-4'>
        <Button
          onClick={handleSubmit}
          disabled={
            !selectedUser ||
            !selectedRank ||
            createInstructorDiscipline.isPending
          }
          className='bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
        >
          {createInstructorDiscipline.isPending ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Atribuindo...
            </>
          ) : (
            <>
              <Plus className='mr-2 h-4 w-4' />
              Atribuir Instrutor
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export function DisciplineEnrollmentsTab({
  disciplineId,
  discipline,
}: DisciplineEnrollmentsTabProps) {
  const [activeTab, setActiveTab] = useState('students');

  // Modal states - simplified to avoid trigger conflicts
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isAddInstructorModalOpen, setIsAddInstructorModalOpen] =
    useState(false);
  const [isInstructorStatusModalOpen, setIsInstructorStatusModalOpen] =
    useState(false);
  const [isMatriculationStatusModalOpen, setIsMatriculationStatusModalOpen] =
    useState(false);

  // Pending changes
  const [pendingInstructorStatusChange, setPendingInstructorStatusChange] =
    useState<{
      instructor: InstructorDiscipline;
      newStatus: string;
    } | null>(null);

  // Update the state type
  const [
    pendingMatriculationStatusChange,
    setPendingMatriculationStatusChange,
  ] = useState<{
    matriculation: ModalEnrollment;
    newStatus: 'active' | 'inactive' | 'graduated';
  } | null>(null);

  // Auth and permissions
  const { data: currentUser } = useAuth().me;
  const { data: currentUserPrivileges } = usePrivilegesByUser(
    currentUser?.id.toString() || ''
  );
  const isAdmin = currentUserPrivileges
    ? hasAccess('admin', currentUserPrivileges)
    : false;

  // Hooks for data management
  const {
    useInstructorDisciplines,
    updateInstructorDiscipline,
    deleteInstructorDiscipline,
  } = useManageInstructors();

  const { useMatriculations, updateMatriculation, deleteMatriculation } =
    useManageMatriculations();

  // Fetch instructors for this discipline
  const { data: instructorsResponse, isLoading: isLoadingInstructors } =
    useInstructorDisciplines(1, 50, {
      disciplineId: Number(disciplineId),
    });

  // Fetch student matriculations for this discipline
  const { data: matriculationsResponse, isLoading: isLoadingMatriculations } =
    useMatriculations(1, 50, {
      discipline: disciplineId,
    });

  const instructorEnrollments = instructorsResponse?.data?.items || [];
  const studentEnrollments = matriculationsResponse?.data?.items || [];

  // Status utility functions for instructors
  const getInstructorStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getInstructorStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'inactive':
        return 'Inativo';
      default:
        return 'Inativo';
    }
  };

  // Status utility functions for matriculations
  const getMatriculationStatusColor = (
    status: string
  ): 'default' | 'secondary' | 'destructive' => {
    switch (status) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'secondary';
      case 'graduated':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getMatriculationStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'inactive':
        return 'Inativo';
      case 'graduated':
        return 'Graduado';
      default:
        return 'Inativo';
    }
  };

  // Event handlers for instructors
  const handleInstructorStatusChange = (
    instructor: InstructorDiscipline,
    newStatus: string
  ) => {
    if (!isAdmin) {
      toast.error(
        'Você não tem permissão para alterar o status dos instrutores'
      );
      return;
    }

    setPendingInstructorStatusChange({ instructor, newStatus });
    setIsInstructorStatusModalOpen(true);
  };

  const confirmInstructorStatusChange = async () => {
    if (!pendingInstructorStatusChange) return;

    const { instructor, newStatus } = pendingInstructorStatusChange;

    try {
      await updateInstructorDiscipline.mutateAsync({
        id: instructor.id,
        status: newStatus as 'active' | 'inactive',
      });

      toast.success(
        `Instrutor ${newStatus === 'active' ? 'ativado' : 'inativado'} com sucesso!`
      );
    } catch (error) {
      console.error('Error updating instructor status:', error);
      toast.error('Erro ao alterar status do instrutor');
    } finally {
      setIsInstructorStatusModalOpen(false);
      setPendingInstructorStatusChange(null);
    }
  };

  const handleRemoveInstructor = async (instructorId: number) => {
    if (!isAdmin) {
      toast.error('Você não tem permissão para remover instrutores');
      return;
    }

    try {
      await deleteInstructorDiscipline.mutateAsync(instructorId.toString());
      toast.success('Instrutor removido da disciplina com sucesso!');
    } catch (error) {
      console.error('Error removing instructor:', error);
      toast.error('Erro ao remover instrutor da disciplina');
    }
  };

  // Event handlers for matriculations
  const handleMatriculationStatusChange = (
    matriculation: Matriculation,
    newStatus: string
  ) => {
    if (!isAdmin) {
      toast.error(
        'Você não tem permissão para alterar o status das matrículas'
      );
      return;
    }

    setPendingMatriculationStatusChange({
      matriculation: {
        ...matriculation,
        userName:
          `${matriculation.studentName} ${matriculation.studentSurname}`.trim(),
      },
      newStatus: newStatus as 'active' | 'inactive' | 'graduated',
    });
    setIsMatriculationStatusModalOpen(true);
  };

  const confirmMatriculationStatusChange = async () => {
    if (!pendingMatriculationStatusChange) return;

    const { matriculation, newStatus } = pendingMatriculationStatusChange;

    try {
      await updateMatriculation.mutateAsync({
        id: matriculation.id,
        status: newStatus,
      });

      const statusMessages = {
        active: 'ativada',
        inactive: 'desativada',
        graduated: 'graduada',
      };

      toast.success(`Matrícula ${statusMessages[newStatus]} com sucesso!`);
    } catch (error) {
      console.error('Error updating matriculation status:', error);
      toast.error('Erro ao alterar status da matrícula');
    } finally {
      setIsMatriculationStatusModalOpen(false);
      setPendingMatriculationStatusChange(null);
    }
  };

  const handleRemoveStudent = async (matriculationId: number) => {
    if (!isAdmin) {
      toast.error('Você não tem permissão para remover estudantes');
      return;
    }

    try {
      await deleteMatriculation.mutateAsync(matriculationId.toString());
      toast.success('Estudante removido da disciplina com sucesso!');
    } catch (error) {
      console.error('Error removing student:', error);
      toast.error('Erro ao remover estudante da disciplina');
    }
  };

  return (
    <>
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-semibold text-gray-900'>
            Matrículas da Disciplina
          </h3>
          <p className='text-sm text-gray-600'>
            Gerencie estudantes e instrutores matriculados em {discipline.name}
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='students' className='flex items-center gap-2'>
            <GraduationCap className='h-4 w-4' />
            Estudantes ({studentEnrollments.length})
          </TabsTrigger>
          <TabsTrigger value='instructors' className='flex items-center gap-2'>
            <Users className='h-4 w-4' />
            Instrutores ({instructorEnrollments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value='students' className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h4 className='text-md font-medium text-gray-900'>
                Estudantes Matriculados
              </h4>
              <p className='text-sm text-gray-600'>
                Lista de todos os estudantes matriculados nesta disciplina
              </p>
            </div>
            {isAdmin && (
              <Button
                className='bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md hover:from-blue-700 hover:to-indigo-700'
                onClick={() => setIsAddStudentModalOpen(true)}
              >
                <Plus className='mr-2 h-4 w-4' />
                Matricular Estudante
              </Button>
            )}
          </div>

          {isLoadingMatriculations ? (
            <Card>
              <CardContent className='flex items-center justify-center py-12'>
                <Loader2 className='h-8 w-8 animate-spin text-gray-400' />
              </CardContent>
            </Card>
          ) : studentEnrollments.length === 0 ? (
            <Card className='border-2 border-dashed border-gray-200'>
              <CardContent className='flex flex-col items-center justify-center py-12'>
                <GraduationCap className='mb-4 h-12 w-12 text-gray-400' />
                <h4 className='mb-2 text-lg font-medium text-gray-900'>
                  Nenhum estudante matriculado
                </h4>
                <p className='mb-6 text-center text-gray-600'>
                  Esta disciplina ainda não possui estudantes matriculados.
                </p>
                {isAdmin && (
                  <Button
                    className='bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                    onClick={() => setIsAddStudentModalOpen(true)}
                  >
                    <Plus className='mr-2 h-4 w-4' />
                    Matricular Primeiro Estudante
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className='p-0'>
                <Table>
                  <TableHeader>
                    <TableRow className='bg-gray-50/50'>
                      <TableHead>Nome do Estudante</TableHead>
                      <TableHead>Rank Atual</TableHead>
                      <TableHead>Data de Matrícula</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className='text-right'>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentEnrollments.map((enrollment) => (
                      <TableRow key={enrollment.id}>
                        <TableCell className='font-medium'>
                          {enrollment.studentName} {enrollment.studentSurname}
                        </TableCell>
                        <TableCell>
                          <Badge variant='outline'>{enrollment.rankName}</Badge>
                        </TableCell>
                        <TableCell className='text-gray-600'>
                          {new Date(enrollment.createdAt).toLocaleDateString(
                            'pt-BR'
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getMatriculationStatusColor(
                              enrollment.status
                            )}
                          >
                            {getMatriculationStatusText(enrollment.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className='text-right'>
                          {isAdmin ? (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  className='h-8 w-8 p-0'
                                >
                                  <MoreVertical className='h-4 w-4' />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align='end'>
                                <DropdownMenuItem>
                                  <Eye className='mr-2 h-4 w-4' />
                                  Visualizar
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {enrollment.status === 'active' ? (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleMatriculationStatusChange(
                                        enrollment,
                                        'inactive'
                                      )
                                    }
                                    className='text-orange-600'
                                  >
                                    <UserMinus className='mr-2 h-4 w-4' />
                                    Desativar
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleMatriculationStatusChange(
                                        enrollment,
                                        'active'
                                      )
                                    }
                                    className='text-green-600'
                                  >
                                    <UserCheck className='mr-2 h-4 w-4' />
                                    Ativar
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleMatriculationStatusChange(
                                      enrollment,
                                      'graduated'
                                    )
                                  }
                                  className='text-yellow-600'
                                >
                                  <GraduationCap className='mr-2 h-4 w-4' />
                                  Graduar
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleRemoveStudent(enrollment.id)
                                  }
                                  className='text-red-600'
                                >
                                  <Trash className='mr-2 h-4 w-4' />
                                  Remover
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          ) : (
                            <Button variant='ghost' size='sm'>
                              <Eye className='h-4 w-4' />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value='instructors' className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h4 className='text-md font-medium text-gray-900'>
                Instrutores da Disciplina
              </h4>
              <p className='text-sm text-gray-600'>
                Lista de todos os instrutores atribuídos a esta disciplina
              </p>
            </div>
            {isAdmin && (
              <Button
                className='bg-gradient-to-r from-purple-600 to-pink-600 shadow-md hover:from-purple-700 hover:to-pink-700'
                onClick={() => setIsAddInstructorModalOpen(true)}
              >
                <Plus className='mr-2 h-4 w-4' />
                Atribuir Instrutor
              </Button>
            )}
          </div>

          {isLoadingInstructors ? (
            <Card>
              <CardContent className='flex items-center justify-center py-12'>
                <Loader2 className='h-8 w-8 animate-spin text-gray-400' />
              </CardContent>
            </Card>
          ) : instructorEnrollments.length === 0 ? (
            <Card className='border-2 border-dashed border-gray-200'>
              <CardContent className='flex flex-col items-center justify-center py-12'>
                <Users className='mb-4 h-12 w-12 text-gray-400' />
                <h4 className='mb-2 text-lg font-medium text-gray-900'>
                  Nenhum instrutor atribuído
                </h4>
                <p className='mb-6 text-center text-gray-600'>
                  Esta disciplina ainda não possui instrutores atribuídos.
                </p>
                {isAdmin && (
                  <Button
                    className='bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                    onClick={() => setIsAddInstructorModalOpen(true)}
                  >
                    <Plus className='mr-2 h-4 w-4' />
                    Atribuir Primeiro Instrutor
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className='p-0'>
                <Table>
                  <TableHeader>
                    <TableRow className='bg-gray-50/50'>
                      <TableHead>Nome do Instrutor</TableHead>
                      <TableHead>Rank</TableHead>
                      <TableHead>Data de Atribuição</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className='text-right'>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {instructorEnrollments.map((enrollment) => (
                      <TableRow key={enrollment.id}>
                        <TableCell className='font-medium'>
                          {enrollment.instructorName}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant='outline'
                            className='border-purple-200 bg-purple-50 text-purple-700'
                          >
                            {enrollment.rankName}
                          </Badge>
                        </TableCell>
                        <TableCell className='text-gray-600'>
                          {new Date(enrollment.createdAt).toLocaleDateString(
                            'pt-BR'
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getInstructorStatusColor(
                              enrollment.status
                            )}
                          >
                            {getInstructorStatusText(enrollment.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className='text-right'>
                          {isAdmin ? (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  className='h-8 w-8 p-0'
                                >
                                  <MoreVertical className='h-4 w-4' />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align='end'>
                                <DropdownMenuItem>
                                  <Eye className='mr-2 h-4 w-4' />
                                  Visualizar
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {enrollment.status === 'active' ? (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleInstructorStatusChange(
                                        enrollment,
                                        'inactive'
                                      )
                                    }
                                    className='text-orange-600'
                                  >
                                    <UserMinus className='mr-2 h-4 w-4' />
                                    Desativar
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleInstructorStatusChange(
                                        enrollment,
                                        'active'
                                      )
                                    }
                                    className='text-green-600'
                                  >
                                    <UserCheck className='mr-2 h-4 w-4' />
                                    Ativar
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleRemoveInstructor(enrollment.id)
                                  }
                                  className='text-red-600'
                                >
                                  <Trash className='mr-2 h-4 w-4' />
                                  Remover
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          ) : (
                            <Button variant='ghost' size='sm'>
                              <Eye className='h-4 w-4' />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Simple Student Matriculation Modal */}
      <Dialog
        open={isAddStudentModalOpen}
        onOpenChange={setIsAddStudentModalOpen}
      >
        <DialogContent className='max-h-[95vh] max-w-6xl md:min-w-3xl'>
          <DialogHeader>
            <DialogTitle className='text-xl font-semibold text-gray-900'>
              Matricular Estudante em {discipline.name}
            </DialogTitle>
            <DialogDescription className='text-base text-gray-600'>
              Selecione o usuário e graduação para matricular na disciplina
            </DialogDescription>
          </DialogHeader>
          <SimpleStudentMatriculationForm
            disciplineId={disciplineId}
            onSuccess={() => setIsAddStudentModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Simple Instructor Assignment Modal */}
      <Dialog
        open={isAddInstructorModalOpen}
        onOpenChange={setIsAddInstructorModalOpen}
      >
        <DialogContent className='max-h-[95vh] max-w-6xl md:min-w-3xl'>
          <DialogHeader>
            <DialogTitle className='text-xl font-semibold text-gray-900'>
              Atribuir Instrutor a {discipline.name}
            </DialogTitle>
            <DialogDescription className='text-base text-gray-600'>
              Selecione o usuário e graduação para torná-lo instrutor da
              disciplina
            </DialogDescription>
          </DialogHeader>
          <SimpleInstructorAssignmentForm
            disciplineId={disciplineId}
            onSuccess={() => setIsAddInstructorModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Status Change Modals */}
      <InstructorStatusModal
        open={isInstructorStatusModalOpen}
        onOpenChange={setIsInstructorStatusModalOpen}
        instructor={pendingInstructorStatusChange?.instructor}
        newStatus={pendingInstructorStatusChange?.newStatus}
        onConfirm={confirmInstructorStatusChange}
        onCancel={() => {
          setIsInstructorStatusModalOpen(false);
          setPendingInstructorStatusChange(null);
        }}
        getStatusText={getInstructorStatusText}
      />

      <MatriculationStatusModal
        isOpen={isMatriculationStatusModalOpen}
        onOpenChange={setIsMatriculationStatusModalOpen}
        pendingChange={pendingMatriculationStatusChange}
        isPending={updateMatriculation.isPending}
        onConfirm={confirmMatriculationStatusChange}
        onCancel={() => {
          setIsMatriculationStatusModalOpen(false);
          setPendingMatriculationStatusChange(null);
        }}
        getStatusColor={getMatriculationStatusColor}
        getStatusChangeMessage={(currentStatus: string, newStatus: string) => {
          const statusMessages = {
            active: 'ativar',
            inactive: 'desativar',
            graduated: 'graduar',
          };
          return statusMessages[newStatus as keyof typeof statusMessages];
        }}
        getStatusChangeDescription={(newStatus: string) => {
          const descriptions = {
            active: 'A matrícula ficará ativa no sistema.',
            inactive: 'A matrícula ficará inativa no sistema.',
            graduated: 'O aluno será marcado como graduado.',
          };
          return descriptions[newStatus as keyof typeof descriptions];
        }}
      />
    </>
  );
}
