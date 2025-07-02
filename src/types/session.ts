export interface Session {
  id: number;
  idInstructor: number;
  idDiscipline: number;
  date: string;
  startingTime: string;
  endingTime: string;
  isLastSessionOfDay: boolean;
  createdAt: string;
  updatedAt: string;
  instructorName?: string;
  disciplineName?: string;
}

export interface CreateSessionData {
  idInstructor: number;
  idDiscipline: number;
  date: string;
  startingTime: string;
  endingTime: string;
  isLastSessionOfDay: boolean;
}

export interface UpdateSessionData extends Partial<CreateSessionData> {
  id: number;
}

export interface SessionFilters {
  initialDate?: string;
  finalDate?: string;
  idInstructor?: number;
  idDiscipline?: number;
  page?: number;
  page_size?: number;
}
