export interface Instructor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  biography?: string;
  avatar?: string;
  status: InstructorStatus;
  createdAt: string;
  updatedAt: string;
}

export interface InstructorDiscipline {
  id: number;
  idInstructor: number;
  instructorName: string;
  idDiscipline: number;
  disciplineName: string;
  idRank: number;
  rankName: string;
  status: 'active' | 'inactive';
  activatedBy?: number | null;
  inactivatedBy?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface InstructorStats {
  totalStudents: number;
  activeClasses: number;
  totalExperienceYears: number;
  totalDisciplines: number;
}

export interface CreateInstructorRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  biography?: string;
}

export interface UpdateInstructorRequest
  extends Partial<CreateInstructorRequest> {
  id: number;
}

export interface CreateInstructorDisciplineRequest {
  idInstructor: number;
  idDiscipline: number;
  idRank: number;
}

export interface UpdateInstructorDisciplineRequest {
  id: number;
  idRank?: number;
  status?: 'active' | 'inactive';
}

export type InstructorStatus = 'active' | 'inactive' | 'on_leave';

export interface InstructorFilters extends Record<string, unknown> {
  status?: InstructorStatus;
  disciplineId?: number;
  search?: string;
}
