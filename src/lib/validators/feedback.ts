import { z } from 'zod';

/**
 * Um schema so, usado pelo formulario (para a mensagem aparecer na hora) e pela server
 * action (para valer de verdade). Duplicar essas regras em dois lugares e o caminho
 * classico para o navegador comecar a aceitar o que o servidor rejeita.
 */
export const MIN_NAME = 2;
export const MAX_NAME = 60;
export const MIN_MESSAGE = 20;
export const MAX_MESSAGE = 500;

export const feedbackSchema = z.object({
  authorName: z
    .string()
    .trim()
    .min(MIN_NAME, 'Informe seu nome.')
    .max(MAX_NAME, 'Nome longo demais.'),
  discipline: z.enum(['karate', 'kendo', 'archery', 'geral']),
  rating: z
    .union([z.literal(''), z.coerce.number().int().min(1).max(5)])
    .transform((value) => (value === '' ? null : value)),
  message: z
    .string()
    .trim()
    .min(MIN_MESSAGE, `Escreva pelo menos ${MIN_MESSAGE} caracteres.`)
    .max(MAX_MESSAGE, `O depoimento pode ter ate ${MAX_MESSAGE} caracteres.`),
});

export type FeedbackFormValues = z.input<typeof feedbackSchema>;
export type FeedbackPayload = z.output<typeof feedbackSchema>;

export const DISCIPLINE_OPTIONS = [
  { value: 'geral', label: 'Geral' },
  { value: 'karate', label: 'Karate-Do' },
  { value: 'kendo', label: 'Kendo' },
  { value: 'archery', label: 'Arquearia' },
] as const;
