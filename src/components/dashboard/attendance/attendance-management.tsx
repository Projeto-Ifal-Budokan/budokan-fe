'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  AttendanceRecord,
  mockAttendanceRecords,
} from '@/data/mocks/attendances-mocks';
import { Class, mockClasses } from '@/data/mocks/classes-mocks';
import { Discipline, mockDisciplines } from '@/data/mocks/disciplines-mocks';
import { mockStudents, Student } from '@/data/mocks/students-mocks';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Check, PlusCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ClassesCard } from './classes-card';
import { FiltersCard, FilterState } from './filters-card';

export function AttendanceManagement() {
  // States for dialogs
  const [isNewClassDialogOpen, setIsNewClassDialogOpen] = useState(false);
  const [isAttendanceDialogOpen, setIsAttendanceDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);

  // State for classes and attendance records
  const [classes, setClasses] = useState<Class[]>(mockClasses);
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >(mockAttendanceRecords);
  const [disciplines] = useState<Discipline[]>(mockDisciplines);
  const [students] = useState<Student[]>(mockStudents);

  // State for new class form
  const [newClass, setNewClass] = useState({
    disciplineId: '',
    date: new Date(),
    sessionTime: '',
    notes: '',
  });

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    discipline: 'all',
    dateRange: { from: undefined, to: undefined },
  });

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      discipline: 'all',
      dateRange: { from: undefined, to: undefined },
    });
  };

  // Handle creating a new class
  const handleCreateClass = () => {
    // Create a new class
    const newClassId = `class-${Date.now()}`;
    const classToAdd: Class = {
      id: newClassId,
      discipline: disciplines.find((d) => d.id === newClass.disciplineId)!,
      date: newClass.date,
      sessionTime: newClass.sessionTime,
      notes: newClass.notes || null,
      createdAt: new Date(),
    };
    setClasses([...classes, classToAdd]);

    // Create attendance records for all students enrolled in this discipline
    const enrolledStudents = students.filter((student) =>
      student.enrolledDisciplines.includes(newClass.disciplineId)
    );

    const newAttendanceRecords = enrolledStudents.map((student) => ({
      id: `att-${Date.now()}-${student.id}`,
      student,
      classId: newClassId,
      status: 'present' as const, // Default to present
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    setAttendanceRecords([...attendanceRecords, ...newAttendanceRecords]);
    setIsNewClassDialogOpen(false);
    resetNewClassForm();
  };

  // Reset new class form
  const resetNewClassForm = () => {
    setNewClass({
      disciplineId: '',
      date: new Date(),
      sessionTime: '',
      notes: '',
    });
  };

  // Schedule list state
  const [disciplineSchedules, setDisciplineSchedules] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    if (!newClass.disciplineId) {
      setDisciplineSchedules(new Set());
      return;
    }

    const selectedDiscipline = disciplines.find(
      (d) => d.id === newClass.disciplineId
    );

    if (selectedDiscipline) {
      const allTimes = new Set<string>();

      selectedDiscipline.schedules.forEach((schedule) => {
        schedule.time.forEach((period) => {
          allTimes.add(period);
        });
      });

      setDisciplineSchedules(allTimes);
    }
  }, [newClass.disciplineId, disciplines]);

  // Get attendance records for a specific class
  const getClassAttendanceRecords = (classId: string) => {
    return attendanceRecords.filter((record) => record.classId === classId);
  };

  // Handle updating attendance status
  const handleUpdateAttendanceStatus = (
    recordId: string,
    status: 'present' | 'absent'
  ) => {
    setAttendanceRecords(
      attendanceRecords.map((record) =>
        record.id === recordId
          ? { ...record, status, updatedAt: new Date() }
          : record
      )
    );
  };

  // Handle batch update of attendance status
  const handleBatchUpdateStatus = (
    classId: string,
    status: 'present' | 'absent'
  ) => {
    setAttendanceRecords(
      attendanceRecords.map((record) =>
        record.classId === classId
          ? { ...record, status, updatedAt: new Date() }
          : record
      )
    );
  };

  // Handle opening attendance management for a class
  const handleManageAttendance = (cls: Class) => {
    setSelectedClass(cls);
    setIsAttendanceDialogOpen(true);
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold'>Aulas e Frequência</h2>
        <Button
          onClick={() => setIsNewClassDialogOpen(true)}
          className='bg-primary hover:bg-primary/90'
        >
          <PlusCircle className='mr-2 h-4 w-4' />
          Nova Aula
        </Button>
      </div>

      {/* Filters */}
      <FiltersCard
        filters={filters}
        setFilters={setFilters}
        disciplines={disciplines}
      >
        <div className='mt-4 flex justify-end space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={resetFilters}
            className='h-8'
          >
            Limpar Filtros
          </Button>
        </div>
      </FiltersCard>

      <ClassesCard
        filters={filters}
        classes={classes}
        attendanceRecords={attendanceRecords}
        onManageAttendance={(cls) => handleManageAttendance(cls)}
      />

      {/* New Class Dialog */}
      <Dialog
        open={isNewClassDialogOpen}
        onOpenChange={setIsNewClassDialogOpen}
      >
        <DialogContent className='sm:max-w-[500px]'>
          <div className='space-y-6'>
            <div>
              <DialogTitle className='text-xl font-bold'>Nova Aula</DialogTitle>
              <p className='text-muted-foreground mt-1 text-sm'>
                Crie uma nova aula para registrar a frequência dos alunos.
              </p>
            </div>

            <div className='grid gap-4 py-2'>
              <div className='space-y-2'>
                <Label htmlFor='discipline' className='text-sm font-medium'>
                  Modalidade
                </Label>
                <Select
                  value={newClass.disciplineId}
                  onValueChange={(value) =>
                    setNewClass({ ...newClass, disciplineId: value })
                  }
                >
                  <SelectTrigger id='discipline'>
                    <SelectValue placeholder='Selecione a modalidade' />
                  </SelectTrigger>
                  <SelectContent>
                    {disciplines.map((discipline) => (
                      <SelectItem key={discipline.id} value={discipline.id}>
                        {discipline.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label className='text-sm font-medium'>Data da Aula</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      className='w-full justify-start text-left font-normal'
                    >
                      <CalendarIcon className='mr-2 h-4 w-4 opacity-70' />
                      {newClass.date ? (
                        format(newClass.date, 'dd/MM/yyyy', { locale: ptBR })
                      ) : (
                        <span className='text-muted-foreground'>
                          Selecione uma data
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                      mode='single'
                      selected={newClass.date}
                      onSelect={(date) =>
                        setNewClass({ ...newClass, date: date || new Date() })
                      }
                      locale={ptBR}
                      initialFocus
                      className='rounded-md border'
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='sessionTime' className='text-sm font-medium'>
                  Horário da Aula
                </Label>
                <Select>
                  <SelectTrigger id='sessionTime'>
                    <SelectValue placeholder='Selecione um horário' />
                  </SelectTrigger>
                  <SelectContent>
                    {[...disciplineSchedules].map((schedule, index) => (
                      <SelectItem key={index} value={schedule}>
                        {schedule}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='notes' className='text-sm font-medium'>
                  Observações (opcional)
                </Label>
                <Input
                  id='notes'
                  value={newClass.notes}
                  onChange={(e) =>
                    setNewClass({ ...newClass, notes: e.target.value })
                  }
                  placeholder='Adicione observações sobre esta aula'
                />
              </div>
            </div>

            <div className='flex justify-end gap-2 pt-2'>
              <Button
                variant='outline'
                onClick={() => {
                  setIsNewClassDialogOpen(false);
                  resetNewClassForm();
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreateClass}
                disabled={!newClass.disciplineId || !newClass.date}
                className='bg-primary hover:bg-primary/90'
              >
                Criar Aula
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Attendance Management Dialog */}
      <Dialog
        open={isAttendanceDialogOpen}
        onOpenChange={setIsAttendanceDialogOpen}
      >
        <DialogContent className='max-h-[80vh] overflow-y-auto sm:max-w-[700px]'>
          {selectedClass && (
            <div className='space-y-6'>
              <div>
                <DialogTitle className='text-xl font-bold'>Gerenciar Frequência</DialogTitle>
                <div className='text-muted-foreground mt-2 flex items-center text-sm'>
                  <Badge variant='outline' className='mr-2 font-normal'>
                    {selectedClass.discipline.name}
                  </Badge>
                  <span>
                    {format(selectedClass.date, "dd 'de' MMMM 'de' yyyy", {
                      locale: ptBR,
                    })}
                  </span>
                </div>
              </div>

              <div className='flex items-center justify-between'>
                <div className='text-muted-foreground text-sm'>
                  {getClassAttendanceRecords(selectedClass.id).length} alunos
                  matriculados
                </div>
                <div className='flex space-x-2'>
                  <Button
                    size='sm'
                    variant='outline'
                    className='h-8 border-green-200 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700'
                    onClick={() =>
                      handleBatchUpdateStatus(selectedClass.id, 'present')
                    }
                  >
                    <Check className='mr-1 h-4 w-4' />
                    Todos Presentes
                  </Button>
                  <Button
                    size='sm'
                    variant='outline'
                    className='h-8 border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700'
                    onClick={() =>
                      handleBatchUpdateStatus(selectedClass.id, 'absent')
                    }
                  >
                    <X className='mr-1 h-4 w-4' />
                    Todos Ausentes
                  </Button>
                </div>
              </div>

              <Separator />

              <div className='space-y-4'>
                {getClassAttendanceRecords(selectedClass.id).length === 0 ? (
                  <div className='text-muted-foreground py-8 text-center'>
                    Nenhum aluno matriculado nesta modalidade.
                  </div>
                ) : (
                  getClassAttendanceRecords(selectedClass.id).map((record) => (
                    <Card
                      key={record.id}
                      className='border-border/40 overflow-hidden border'
                    >
                      <CardContent className='p-0'>
                        <div className='flex items-center p-4'>
                          <Avatar className='h-10 w-10 border'>
                            <AvatarImage
                              src={record.student.profilePicture || undefined}
                              alt={record.student.name}
                            />
                            <AvatarFallback className='bg-primary/10 text-primary'>
                              {record.student.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .toUpperCase()
                                .substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className='ml-4 flex-1'>
                            <p className='font-medium'>{record.student.name}</p>
                            <p className='text-muted-foreground text-sm'>
                              {record.student.email}
                            </p>
                          </div>
                          <div className='flex items-center space-x-2'>
                            <Button
                              size='sm'
                              variant={
                                record.status === 'present'
                                  ? 'default'
                                  : 'outline'
                              }
                              className={cn(
                                'h-9 rounded-l-md rounded-r-none px-3',
                                record.status === 'present' &&
                                  'bg-green-600 hover:bg-green-700'
                              )}
                              onClick={() =>
                                handleUpdateAttendanceStatus(
                                  record.id,
                                  'present'
                                )
                              }
                            >
                              <Check className='mr-1 h-4 w-4' />
                              Presente
                            </Button>
                            <Button
                              size='sm'
                              variant={
                                record.status === 'absent'
                                  ? 'default'
                                  : 'outline'
                              }
                              className={cn(
                                'h-9 rounded-l-none rounded-r-md px-3',
                                record.status === 'absent' &&
                                  'bg-red-600 hover:bg-red-700'
                              )}
                              onClick={() =>
                                handleUpdateAttendanceStatus(
                                  record.id,
                                  'absent'
                                )
                              }
                            >
                              <X className='mr-1 h-4 w-4' />
                              Ausente
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              <div className='flex justify-end gap-2 pt-2'>
                <Button
                  onClick={() => setIsAttendanceDialogOpen(false)}
                  className='bg-primary hover:bg-primary/90'
                >
                  Salvar e Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AttendanceManagement;
