export interface Attendance {
  id: number;
  idMatriculation: number;
  idSession: number;
  idStudent: number;
  status: 'present' | 'absent';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  studentName?: string;
  studentEmail?: string;
  studentAvatar?: string;
}

export interface CreateAttendanceData {
  idSession: number;
  idStudent: number;
  status: 'present' | 'absent';
  notes?: string;
}

export interface UpdateAttendanceData {
  idMatriculation: number;
  status: 'present' | 'absent';
  notes?: string;
}

export interface AttendanceFilters {
  status?: 'present' | 'absent' | 'all';
  idSession?: number;
  studentName?: string;
  page?: number;
  page_size?: number;
}

export interface AttendanceBatchUpdate {
  attendanceIds: number[];
  status: 'present' | 'absent';
}
