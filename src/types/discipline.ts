export interface Discipline {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Rank {
  id: number;
  idDiscipline: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  disciplineName: string;
}

export interface InstructorDiscipline {
  id: number;
  idInstructor: number;
  idDiscipline: number;
  idRank: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export type DisciplineStatus = 'active' | 'inactive';

export interface CreateDisciplineData {
  name: string;
  description: string;
  status: DisciplineStatus;
}

export interface UpdateDisciplineData {
  id: number;
  name: string;
  description: string;
  status: DisciplineStatus;
}

export interface StudentEnrollment {
  id: number;
  studentId: number;
  disciplineId: number;
  currentRankId?: number;
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'graduated';
  studentName: string;
  currentRank?: string;
}

export interface Schedule {
  id: number;
  disciplineId: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  location: string;
  instructorId: number;
  instructor: string;
  capacity: number;
  enrolled: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}
