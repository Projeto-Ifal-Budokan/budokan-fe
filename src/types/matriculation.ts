import { z } from 'zod';

// Schema for creating matriculation
export const createMatriculationSchema = z.object({
  idUser: z.number().positive('Usuário é obrigatório'),
  idDiscipline: z.number().positive('Disciplina é obrigatória'),
  idRank: z.number().positive('Rank é obrigatório'),
  type: z.enum(['student', 'instructor'], {
    required_error: 'Tipo de matrícula é obrigatório',
  }),
  paymentExempt: z.boolean().optional(),
  isPaymentExempt: z.boolean().optional(),
});

// Schema for updating matriculation
export const updateMatriculationSchema = z.object({
  idUser: z.number().positive('Usuário é obrigatório'),
  idDiscipline: z.number().positive('Disciplina é obrigatória'),
  idRank: z.number().positive('Rank é obrigatório'),
  type: z.enum(['student', 'instructor']),
  status: z.enum(['active', 'inactive', 'graduated']),
  paymentExempt: z.boolean().default(false),
  isPaymentExempt: z.boolean().default(false),
});

// Types derived from schemas
export type CreateMatriculationData = z.infer<typeof createMatriculationSchema>;
export type UpdateMatriculationData = z.infer<typeof updateMatriculationSchema>;

// Interface for complete matriculation
export interface Matriculation {
  id: number;
  idUser: number;
  idDiscipline: number;
  idRank: number;
  type: 'student' | 'instructor';
  status: 'active' | 'inactive' | 'graduated';
  paymentExempt: boolean;
  isPaymentExempt: boolean;
  activatedBy: number | null;
  inactivatedBy: number | null;
  createdAt: string;
  updatedAt: string;

  // Related data
  userName: string;
  userEmail: string;
  disciplineName: string;
  rankName: string;
}

// Interface for matriculation stats
export interface MatriculationStats {
  totalMatriculations: number;
  activeStudents: number;
  activeInstructors: number;
  pendingMatriculations: number;
  graduatedStudents: number;
}

// Interface for matriculation filters
export interface MatriculationFilters {
  type?: 'student' | 'instructor' | 'all';
  status?: 'active' | 'inactive' | 'graduated' | 'all';
  discipline?: number | 'all';
  search?: string;
}

export type MatriculationType = 'student' | 'instructor';
export type MatriculationStatus = 'active' | 'inactive' | 'graduated';
