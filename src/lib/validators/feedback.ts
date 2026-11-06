import { z } from 'zod';

/**
 * Um schema so, usado pelo formulario (para a mensagem aparecer na hora) e pela server
 * action (para valer de verdade). Duplicar essas regras em dois lugares e o caminho
 * classico para o navegador comecar a aceitar o que o servidor rejeita.
 *
 * `authorName` saiu daqui de proposito. Nome e foto agora vem do ID token do Google,
 * verificado no servidor: deixar o campo no formulario permitiria entrar com uma conta
 * Google e assinar como outra pessoa.
 */
export const MIN_NAME = 2;
export const MAX_NAME = 60;
export const MIN_MESSAGE = 20;
/** 600 e o limite do proprio CMS (schema e controller). Alguem ja escreveu 502. */
export const MAX_MESSAGE = 600;

/**
 * Texto do consentimento. Publicar nome e rosto de alguem e publicacao de dado pessoal,
 * entao o aceite e registrado com a data e com a versao do texto que estava em vigor —
 * provar que a pessoa concordou sem saber com o que concordou nao prova nada.
 * Mudou o texto, mudou a versao.
 */
export const CONSENT_VERSION = '2026-10-28';
export const CONSENT_TEXT =
  'Autorizo a publicacao do meu nome e da minha foto neste site depois da aprovacao pela equipe da Budokan-Ryu. Posso pedir a remocao a qualquer momento.';

export const feedbackSchema = z.object({
  discipline: z.enum(['karate', 'kendo', 'archery', 'geral']),
  rating: z
    .union([z.literal(''), z.coerce.number().int().min(1).max(5)])
    .transform((value) => (value === '' ? null : value)),
  message: z
    .string()
    .trim()
    .min(MIN_MESSAGE, `Escreva pelo menos ${MIN_MESSAGE} caracteres.`)
    .max(MAX_MESSAGE, `O depoimento pode ter ate ${MAX_MESSAGE} caracteres.`),
  consent: z.boolean().refine((value) => value, {
    message: 'E preciso autorizar a publicacao para enviar.',
  }),
});

export type FeedbackFormValues = z.input<typeof feedbackSchema>;
export type FeedbackPayload = z.output<typeof feedbackSchema>;

/**
 * O que a primeira etapa do formulario pede.
 *
 * O formulario e em duas etapas, e a validacao acompanha a divisao: cobrar o consentimento
 * na tela onde ainda nao se falou em identidade faz aparecer erro sobre algo que a pessoa
 * ainda nao viu. As regras continuam sendo as mesmas do `feedbackSchema` — um schema so, do
 * qual este e um recorte. Duplicar regra em dois lugares e o caminho classico para o
 * navegador comecar a aceitar o que o servidor rejeita.
 */
export const stepOneSchema = feedbackSchema.pick({
  discipline: true,
  rating: true,
  message: true,
});

export const DISCIPLINE_OPTIONS = [
  { value: 'geral', label: 'Geral' },
  { value: 'karate', label: 'Karate-Do' },
  { value: 'kendo', label: 'Kendo' },
  { value: 'archery', label: 'Arquearia' },
] as const;
