import { z } from 'zod';

// Define Zod schemas for each step
export const personalInfoSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
  lastName: z
    .string()
    .min(2, { message: 'Sobrenome deve ter pelo menos 2 caracteres' }),
  phone: z.string().min(1, { message: 'Telefone é obrigatório' }),
  birthDate: z.string().min(1, { message: 'Data de nascimento é obrigatória' }),
});

export const accountInfoSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z
    .string()
    .min(8, { message: 'Senha deve ter pelo menos 8 caracteres' })
    .regex(/[A-Z]/, {
      message: 'Senha deve conter pelo menos uma letra maiúscula',
    })
    .regex(/[a-z]/, {
      message: 'Senha deve conter pelo menos uma letra minúscula',
    })
    .regex(/[0-9]/, { message: 'Senha deve conter pelo menos um número' })
    .regex(/[^A-Za-z0-9]/, {
      message: 'Senha deve conter pelo menos um caractere especial',
    }),
  confirmPassword: z.string(),
});

export const confirmationSchema = z.object({
  isStudent: z.boolean().optional(),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: 'Você deve aceitar os termos para continuar' }),
  }),
});

// Combined schema for the entire form
export const signupSchema = z.object({
  ...personalInfoSchema.shape,
  ...accountInfoSchema.shape,
  ...confirmationSchema.shape,
});

// Type for the form data
export type SignupFormData = z.infer<typeof signupSchema>;
