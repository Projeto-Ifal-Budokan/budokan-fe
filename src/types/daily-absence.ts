export interface DailyAbsence {
  id: number;
  date: string;
  idMatriculation: number;
  justification: 'medical' | 'personal' | 'family' | 'work' | 'other';
  justificationDescription: string;
  createdAt: string;
  updatedAt: string;
  studentName?: string;
  studentEmail?: string;
}

export interface CreateDailyAbsenceData {
  date: string;
  idMatriculation: number;
  justification: 'medical' | 'personal' | 'family' | 'work' | 'other';
  justificationDescription: string;
}

export interface UpdateDailyAbsenceData {
  justification?: 'medical' | 'personal' | 'family' | 'work' | 'other';
  justificationDescription?: string;
}

export interface DailyAbsenceFilters {
  startDate?: string;
  endDate?: string;
  idMatriculation?: number;
  justification?: 'medical' | 'personal' | 'family' | 'work' | 'other';
  page?: number;
  page_size?: number;
}

export interface ProcessDateData {
  date: string;
}

export interface ProcessDateRangeData {
  startDate: string;
  endDate: string;
}
