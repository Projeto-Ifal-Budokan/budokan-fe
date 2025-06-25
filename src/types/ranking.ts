import { z } from 'zod';

// Schema para criação de ranking
export const createRankSchema = z.object({
  idDiscipline: z.number().positive('Disciplina é obrigatória'),
  name: z.string().min(2, 'Nome é obrigatório').max(100),
  description: z.string().min(2, 'Descrição é obrigatória').max(100),
});

// Schema para atualização de ranking
export const updateRankSchema = z.object({
  idDiscipline: z.number().positive('Disciplina é obrigatória'),
  name: z.string().min(2, 'Nome é obrigatório').max(100),
  description: z.string().min(2, 'Descrição é obrigatória').max(100),
});

// Tipos derivados dos schemas
export type CreateRankData = z.infer<typeof createRankSchema>;
export type UpdateRankData = z.infer<typeof updateRankSchema>;

// Interface para o ranking completo
export interface Ranking {
  id: number;
  idDiscipline: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  disciplineName: string;
}

// Interface para estatísticas do ranking
export interface RankingStats {
  totalStudents: number;
  activeStudents: number;
  lastExam: string;
  nextExam: string;
}
