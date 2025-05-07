'use client';

import { Button } from '@/components/ui/button';
import {
  AttendanceRecord,
  mockAttendanceRecords,
} from '@/data/mocks/attendances-mocks';
import { Class, mockClasses } from '@/data/mocks/classes-mocks';
import { Discipline, mockDisciplines } from '@/data/mocks/disciplines-mocks';
import { Student, mockStudents } from '@/data/mocks/students-mocks';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { FiltersCard } from './filters-card';

export function AttendanceManagement() {
  // State for classes and attendance records
  const [classes, setClasses] = useState<Class[]>(mockClasses);
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >(mockAttendanceRecords);
  const [disciplines] = useState<Discipline[]>(mockDisciplines);
  const [students] = useState<Student[]>(mockStudents);

  // State for dialogs
  const [isNewClassDialogOpen, setIsNewClassDialogOpen] = useState(false);
  const [isAttendanceDialogOpen, setIsAttendanceDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);

  // State for new class form
  const [newClass, setNewClass] = useState({
    disciplineId: '',
    date: new Date(),
    sessionTime: '',
    notes: '',
  });

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

  // Handle opening attendance management for a class
  const handleManageAttendance = (cls: Class) => {
    setSelectedClass(cls);
    setIsAttendanceDialogOpen(true);
  };

  // Handle deleting a class
  const handleDeleteClass = (classId: string) => {
    setClasses(classes.filter((cls) => cls.id !== classId));
    // Also delete all attendance records for this class
    setAttendanceRecords(
      attendanceRecords.filter((record) => record.classId !== classId)
    );
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

  // Get attendance records for a specific class
  const getClassAttendanceRecords = (classId: string) => {
    return attendanceRecords.filter((record) => record.classId === classId);
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
      <FiltersCard />

      {/* New Class Dialog */}

      {/* Attendance Management Dialog */}
    </div>
  );
}

export default AttendanceManagement;
