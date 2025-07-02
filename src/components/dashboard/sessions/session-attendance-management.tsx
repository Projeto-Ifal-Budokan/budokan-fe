'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useManageAttendance } from '@/lib/api/queries/use-manage-attendance';
import { AttendanceFilters, UpdateAttendanceData } from '@/types/attendance';
import {
  FileText,
  Save,
  Search,
  TrendingUp,
  UserCheck,
  Users,
  UserX,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AddJustificationModal } from './add-justification-modal';

interface SessionAttendanceManagementProps {
  sessionId: string;
  canManage: boolean;
}

export function SessionAttendanceManagement({
  sessionId,
  canManage,
}: SessionAttendanceManagementProps) {
  // State
  const [filters, setFilters] = useState<AttendanceFilters>({
    status: 'all',
    studentName: '',
    page: 1,
    page_size: 50,
    idSession: Number(sessionId),
  });
  const [pendingChanges, setPendingChanges] = useState<Map<number, boolean>>(
    new Map()
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [justificationModal, setJustificationModal] = useState<{
    isOpen: boolean;
    idMatriculation: number;
    studentName: string;
  }>({
    isOpen: false,
    idMatriculation: 0,
    studentName: '',
  });

  // API hooks
  const { useSessionAttendances, updateAttendance, batchUpdateAttendances } =
    useManageAttendance();

  const { data: attendancesResponse, isLoading } =
    useSessionAttendances(filters);

  const attendances = attendancesResponse?.data?.items || [];

  // Update filters when search term changes (with debounce effect)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters((prev) => ({ ...prev, studentName: searchTerm, page: 1 }));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Handle individual attendance change
  const handleAttendanceToggle = (
    idMatriculation: number,
    isPresent: boolean
  ) => {
    if (!canManage) return;

    setPendingChanges((prev) => {
      const newChanges = new Map(prev);
      newChanges.set(idMatriculation, isPresent);
      return newChanges;
    });
  };

  // Handle batch update (all present/absent) - now only updates pending changes
  const handleBatchUpdate = (status: 'present' | 'absent') => {
    if (!canManage) return;

    // Add all attendances to pending changes without sending to API
    const newPendingChanges = new Map(pendingChanges);

    attendances.forEach((attendance) => {
      newPendingChanges.set(attendance.idMatriculation, status === 'present');
    });

    setPendingChanges(newPendingChanges);

    toast.info(
      `${attendances.length} aluno(s) marcado(s) como ${
        status === 'present' ? 'presentes' : 'ausentes'
      }. Clique em "Salvar Alterações" para confirmar.`
    );
  };

  // Save pending changes
  const savePendingChanges = async () => {
    if (!canManage || pendingChanges.size === 0) return;

    try {
      // Convert pendingChanges Map to UpdateAttendanceData array
      const updateData: UpdateAttendanceData[] = Array.from(
        pendingChanges.entries()
      ).map(([idMatriculation, isPresent]) => {
        // Find the attendance to get the matriculation ID
        const attendance = attendances.find(
          (att) => att.idMatriculation === idMatriculation
        );
        return {
          idMatriculation: attendance?.idMatriculation as number,
          status: isPresent ? 'present' : 'absent',
        };
      });

      // Single batch request instead of multiple individual requests
      await updateAttendance.mutateAsync({
        idSession: Number(sessionId),
        data: updateData,
      });

      setPendingChanges(new Map());
      toast.success('Frequências atualizadas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar alterações');
    }
  };

  // Calculate statistics
  const stats = {
    total: attendances.length,
    present: attendances.filter((att) => {
      const hasPendingChange = pendingChanges.has(att.id);
      if (hasPendingChange) {
        return pendingChanges.get(att.id);
      }
      return att.status === 'present';
    }).length,
    absent:
      attendances.length -
      attendances.filter((att) => {
        const hasPendingChange = pendingChanges.has(att.id);
        if (hasPendingChange) {
          return pendingChanges.get(att.id);
        }
        return att.status === 'present';
      }).length,
  };

  const attendancePercentage =
    stats.total > 0 ? (stats.present / stats.total) * 100 : 0;

  const handleAddJustification = (
    idMatriculation: number,
    studentName: string
  ) => {
    setJustificationModal({
      isOpen: true,
      idMatriculation,
      studentName,
    });
  };

  const closeJustificationModal = () => {
    setJustificationModal({
      isOpen: false,
      idMatriculation: 0,
      studentName: '',
    });
  };

  if (isLoading) {
    return (
      <div className='space-y-4'>
        <div className='h-8 w-full animate-pulse rounded bg-gray-200' />
        <div className='space-y-3'>
          {[1, 2, 3].map((i) => (
            <div key={i} className='h-16 animate-pulse rounded bg-gray-200' />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Enhanced Statistics Cards */}
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
        {/* Total Students Card */}
        <div className='group relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50'>
          <div className='absolute top-0 right-0 h-24 w-24 translate-x-6 -translate-y-6 transform rounded-full bg-gradient-to-br from-slate-400/20 to-slate-600/20 transition-transform group-hover:scale-110' />
          <div className='relative'>
            <div className='mb-4 flex items-center justify-between'>
              <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-slate-500 to-slate-700 shadow-lg'>
                <Users className='h-6 w-6 text-white' />
              </div>
              <div className='rounded-full bg-slate-100 px-3 py-1'>
                <span className='text-xs font-medium text-slate-600'>
                  Total
                </span>
              </div>
            </div>
            <div className='space-y-1'>
              <p className='text-3xl font-bold text-slate-900 transition-all group-hover:text-slate-700'>
                {stats.total}
              </p>
              <p className='text-sm font-medium text-slate-600'>
                Total de Alunos
              </p>
            </div>
          </div>
        </div>

        {/* Present Students Card */}
        <div className='group relative overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-emerald-200/50'>
          <div className='absolute top-0 right-0 h-24 w-24 translate-x-6 -translate-y-6 transform rounded-full bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 transition-transform group-hover:scale-110' />
          <div className='relative'>
            <div className='mb-4 flex items-center justify-between'>
              <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg'>
                <UserCheck className='h-6 w-6 text-white' />
              </div>
              <div className='rounded-full bg-emerald-100 px-3 py-1'>
                <span className='text-xs font-medium text-emerald-700'>
                  Ativo
                </span>
              </div>
            </div>
            <div className='space-y-1'>
              <p className='text-3xl font-bold text-emerald-900 transition-all group-hover:text-emerald-700'>
                {stats.present}
              </p>
              <p className='text-sm font-medium text-emerald-700'>Presentes</p>
            </div>
            {/* Enhanced Progress Bar */}
            <div className='mt-4 space-y-2'>
              <div className='flex items-center justify-between text-xs'>
                <span className='font-medium text-emerald-600'>Progresso</span>
                <span className='font-bold text-emerald-800'>
                  {stats.total > 0
                    ? Math.round((stats.present / stats.total) * 100)
                    : 0}
                  %
                </span>
              </div>
              <div className='h-2 w-full overflow-hidden rounded-full bg-emerald-100'>
                <div
                  className='h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-sm transition-all duration-700 ease-out'
                  style={{
                    width: `${stats.total > 0 ? (stats.present / stats.total) * 100 : 0}%`,
                    transition: 'width 0.7s ease-out',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Absent Students Card */}
        <div className='group relative overflow-hidden rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50 to-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-rose-200/50'>
          <div className='absolute top-0 right-0 h-24 w-24 translate-x-6 -translate-y-6 transform rounded-full bg-gradient-to-br from-rose-400/20 to-rose-600/20 transition-transform group-hover:scale-110' />
          <div className='relative'>
            <div className='mb-4 flex items-center justify-between'>
              <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 shadow-lg'>
                <UserX className='h-6 w-6 text-white' />
              </div>
              <div className='rounded-full bg-rose-100 px-3 py-1'>
                <span className='text-xs font-medium text-rose-700'>
                  Ausente
                </span>
              </div>
            </div>
            <div className='space-y-1'>
              <p className='text-3xl font-bold text-rose-900 transition-all group-hover:text-rose-700'>
                {stats.absent}
              </p>
              <p className='text-sm font-medium text-rose-700'>Ausentes</p>
            </div>
            {/* Absence Indicator */}
            {stats.absent > 0 && (
              <div className='mt-4'>
                <div className='flex items-center gap-2'>
                  <div className='h-2 w-2 animate-pulse rounded-full bg-rose-500' />
                  <span className='text-xs font-medium text-rose-600'>
                    {Math.round((stats.absent / stats.total) * 100)}% ausências
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Attendance Rate Card */}
        <div className='group relative overflow-hidden rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-violet-200/50'>
          <div className='absolute top-0 right-0 h-24 w-24 translate-x-6 -translate-y-6 transform rounded-full bg-gradient-to-br from-violet-400/20 to-violet-600/20 transition-transform group-hover:scale-110' />
          <div className='relative'>
            <div className='mb-4 flex items-center justify-between'>
              <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 shadow-lg'>
                <TrendingUp className='h-6 w-6 text-white' />
              </div>
              <div
                className={`rounded-full px-3 py-1 ${
                  attendancePercentage >= 80
                    ? 'bg-green-100 text-green-700'
                    : attendancePercentage >= 60
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                }`}
              >
                <span className='text-xs font-medium'>
                  {attendancePercentage >= 80
                    ? 'Ótimo'
                    : attendancePercentage >= 60
                      ? 'Bom'
                      : 'Baixo'}
                </span>
              </div>
            </div>
            <div className='space-y-1'>
              <p
                className={`text-3xl font-bold transition-all group-hover:scale-105 ${
                  attendancePercentage >= 80
                    ? 'text-green-900'
                    : attendancePercentage >= 60
                      ? 'text-yellow-900'
                      : 'text-red-900'
                }`}
              >
                {attendancePercentage.toFixed(1)}%
              </p>
              <p className='text-sm font-medium text-violet-700'>
                Taxa de Presença
              </p>
            </div>
            {/* Circular Progress Indicator */}
            <div className='mt-4 flex items-center justify-center'>
              <div className='relative h-12 w-12'>
                <svg
                  className='h-12 w-12 -rotate-90 transform'
                  viewBox='0 0 48 48'
                >
                  <circle
                    cx='24'
                    cy='24'
                    r='20'
                    stroke='currentColor'
                    strokeWidth='4'
                    fill='none'
                    className='text-violet-200'
                  />
                  <circle
                    cx='24'
                    cy='24'
                    r='20'
                    stroke='currentColor'
                    strokeWidth='4'
                    fill='none'
                    strokeDasharray={`${2 * Math.PI * 20}`}
                    strokeDashoffset={`${2 * Math.PI * 20 * (1 - attendancePercentage / 100)}`}
                    className={`transition-all duration-700 ${
                      attendancePercentage >= 80
                        ? 'text-green-500'
                        : attendancePercentage >= 60
                          ? 'text-yellow-500'
                          : 'text-red-500'
                    }`}
                    strokeLinecap='round'
                  />
                </svg>
                <div className='absolute inset-0 flex items-center justify-center'>
                  <span
                    className={`text-xs font-bold ${
                      attendancePercentage >= 80
                        ? 'text-green-600'
                        : attendancePercentage >= 60
                          ? 'text-yellow-600'
                          : 'text-red-600'
                    }`}
                  >
                    {Math.round(attendancePercentage)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Quick Actions Bar */}
      <div className='rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-4 shadow-sm'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex items-center gap-3'>
            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600'>
              <span className='text-sm text-white'>⚡</span>
            </div>
            <span className='text-sm font-semibold text-slate-700'>
              Ações Rápidas
            </span>
          </div>

          <div className='flex gap-2'>
            <Button
              size='sm'
              variant='outline'
              onClick={() => handleBatchUpdate('present')}
              disabled={!canManage}
              className='border-green-200 bg-green-50 text-green-700 transition-all duration-200 hover:border-green-300 hover:bg-green-100'
            >
              <UserCheck className='mr-2 h-4 w-4' />
              Todos Presentes
            </Button>
            <Button
              size='sm'
              variant='outline'
              onClick={() => handleBatchUpdate('absent')}
              disabled={!canManage}
              className='border-red-200 bg-red-50 text-red-700 transition-all duration-200 hover:border-red-300 hover:bg-red-100'
            >
              <UserX className='mr-2 h-4 w-4' />
              Todos Ausentes
            </Button>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex flex-1 gap-2'>
          <div className='relative flex-1'>
            <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400' />
            <Input
              placeholder='Buscar por nome do aluno...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10'
            />
          </div>
          <Select
            value={filters.status}
            onValueChange={(value: 'all' | 'present' | 'absent') =>
              setFilters((prev) => ({ ...prev, status: value, page: 1 }))
            }
          >
            <SelectTrigger className='w-40'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Todos</SelectItem>
              <SelectItem value='present'>Presentes</SelectItem>
              <SelectItem value='absent'>Ausentes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {canManage && (
          <div className='flex gap-2'>
            {pendingChanges.size > 0 && (
              <Button
                onClick={savePendingChanges}
                disabled={updateAttendance.isPending}
                className='bg-blue-600 hover:bg-blue-700'
              >
                <Save className='mr-2 h-4 w-4' />
                Salvar Alterações ({pendingChanges.size})
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Student List */}
      <div className='space-y-4'>
        {attendances.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-16 text-center'>
            <div className='mb-4 rounded-full bg-gray-100 p-6'>
              <Search className='h-8 w-8 text-gray-400' />
            </div>
            <h3 className='mb-2 text-lg font-medium text-gray-900'>
              {filters.studentName
                ? 'Nenhum aluno encontrado'
                : 'Nenhum aluno matriculado'}
            </h3>
            <p className='max-w-sm text-gray-500'>
              {filters.studentName
                ? 'Tente ajustar os filtros de busca para encontrar o aluno desejado'
                : 'Esta sessão ainda não possui alunos matriculados na disciplina'}
            </p>
          </div>
        ) : (
          attendances.map((attendance) => {
            const hasPendingChange = pendingChanges.has(attendance.id);
            const currentStatus = hasPendingChange
              ? pendingChanges.get(attendance.id)
                ? 'present'
                : 'absent'
              : attendance.status;

            return (
              <div
                key={attendance.id}
                className={`group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-gray-300 hover:shadow-lg ${
                  hasPendingChange
                    ? 'border-blue-300 bg-blue-50/30 ring-2 ring-blue-500/20'
                    : ''
                }`}
              >
                {/* Status indicator bar */}
                <div
                  className={`absolute top-0 left-0 h-full w-1 transition-all duration-300 ${
                    currentStatus === 'present'
                      ? 'bg-gradient-to-b from-green-400 to-green-600'
                      : 'bg-gradient-to-b from-red-400 to-red-600'
                  }`}
                />

                {/* Pending change indicator */}
                {hasPendingChange && (
                  <div className='absolute top-4 right-4'>
                    <div className='flex h-2 w-2 items-center justify-center'>
                      <div className='h-2 w-2 animate-pulse rounded-full bg-blue-500' />
                      <div className='absolute h-4 w-4 animate-ping rounded-full border-2 border-blue-500 opacity-75' />
                    </div>
                  </div>
                )}

                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-4'>
                    {/* Enhanced Avatar */}
                    <div className='relative'>
                      <Avatar className='h-14 w-14 shadow-md ring-2 ring-white'>
                        <AvatarImage
                          src={attendance.studentAvatar}
                          alt={attendance.studentName}
                          className='object-cover'
                        />
                        <AvatarFallback className='bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 text-lg font-semibold text-white'>
                          {attendance.studentName
                            ?.split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      {/* Status indicator on avatar */}
                      <div
                        className={`absolute -right-1 -bottom-1 h-5 w-5 rounded-full border-2 border-white shadow-sm ${
                          currentStatus === 'present'
                            ? 'bg-green-500'
                            : 'bg-red-500'
                        }`}
                      >
                        <div
                          className={`h-full w-full rounded-full ${
                            currentStatus === 'present'
                              ? 'animate-pulse bg-green-500'
                              : 'bg-red-500'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Student Info */}
                    <div className='min-w-0 flex-1'>
                      <div className='mb-1 flex items-center gap-2'>
                        <h3 className='truncate text-lg font-semibold text-gray-900'>
                          {attendance.studentName}
                        </h3>
                        {hasPendingChange && (
                          <Badge
                            variant='outline'
                            className='border-blue-200 bg-blue-50 px-2 py-0.5 text-xs text-blue-700'
                          >
                            Alterado
                          </Badge>
                        )}
                      </div>

                      <p className='mb-2 flex items-center gap-1 text-sm text-gray-600'>
                        <span className='inline-block h-1 w-1 rounded-full bg-gray-400' />
                        {attendance.studentEmail}
                      </p>

                      {attendance.notes && (
                        <div className='mt-2 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3'>
                          <span className='text-sm text-amber-600'>📝</span>
                          <p className='text-xs leading-relaxed font-medium text-amber-800'>
                            {attendance.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status and Controls */}
                  <div className='ml-4 flex items-center gap-4'>
                    {/* Enhanced Status Badge */}
                    <div className='text-center'>
                      <Badge
                        className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                          currentStatus === 'present'
                            ? 'border-green-300 bg-gradient-to-r from-green-100 to-green-50 text-green-800 shadow-sm shadow-green-100'
                            : 'border-red-300 bg-gradient-to-r from-red-100 to-red-50 text-red-800 shadow-sm shadow-red-100'
                        }`}
                      >
                        <span className='mr-2'>
                          {currentStatus === 'present' ? '✅' : '❌'}
                        </span>
                        {currentStatus === 'present' ? 'Presente' : 'Ausente'}
                      </Badge>

                      {hasPendingChange && (
                        <p className='mt-1 text-xs font-medium text-blue-600'>
                          Aguardando confirmação
                        </p>
                      )}
                    </div>

                    {/* Justification Button - Only show for confirmed absent students */}
                    {attendance.status === 'absent' &&
                      canManage &&
                      !hasPendingChange && (
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() =>
                            handleAddJustification(
                              attendance.idMatriculation,
                              attendance.studentName || ''
                            )
                          }
                          className='border-amber-200 bg-amber-50 text-amber-700 transition-all duration-200 hover:border-amber-300 hover:bg-amber-100'
                        >
                          <FileText className='mr-2 h-4 w-4' />
                          Justificar
                        </Button>
                      )}

                    {/* Enhanced Switch */}
                    {canManage && (
                      <div className='flex flex-col items-center gap-2'>
                        <Switch
                          checked={currentStatus === 'present'}
                          onCheckedChange={(checked) =>
                            handleAttendanceToggle(
                              attendance.idMatriculation,
                              checked
                            )
                          }
                          className='scale-110 shadow-sm data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-red-500'
                        />
                        <span className='text-xs font-medium text-gray-500'>
                          {currentStatus === 'present' ? 'Presente' : 'Ausente'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Hover effect overlay */}
                <div className='pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
              </div>
            );
          })
        )}
      </div>

      {pendingChanges.size > 0 && (
        <div className='rounded-lg border border-blue-200 bg-blue-50 p-4'>
          <p className='text-sm text-blue-800'>
            Você tem {pendingChanges.size} alteração(ões) pendente(s). Clique em
            &quot;Salvar Alterações&quot; para confirmar.
          </p>
        </div>
      )}

      {/* Add Justification Modal */}
      <AddJustificationModal
        isOpen={justificationModal.isOpen}
        onClose={closeJustificationModal}
        idMatriculation={justificationModal.idMatriculation}
        studentName={justificationModal.studentName}
        sessionDate={new Date().toISOString().split('T')[0]} // You can get this from session data
      />
    </div>
  );
}
