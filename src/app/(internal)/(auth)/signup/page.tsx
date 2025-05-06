'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowRight,
  CalendarIcon,
  CalendarPlus2Icon as CalendarIcon2,
  CheckCircle2,
  ChevronLeft,
  Eye,
  EyeOff,
  Info,
  Lock,
  Mail,
  Phone,
  User,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from 'react-hook-form';
import { z } from 'zod';

// Define Zod schemas for each step
const personalInfoSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
  lastName: z
    .string()
    .min(2, { message: 'Sobrenome deve ter pelo menos 2 caracteres' }),
  phone: z.string().min(1, { message: 'Telefone é obrigatório' }),
  birthDate: z.string().min(1, { message: 'Data de nascimento é obrigatória' }),
});

const accountInfoSchema = z.object({
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
// .refine((data) => data.password === data.confirmPassword, {
//   message: 'As senhas não coincidem',
//   path: ['confirmPassword'],
// });

const confirmationSchema = z.object({
  isStudent: z.boolean().optional(),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: 'Você deve aceitar os termos para continuar' }),
  }),
});

// Combined schema for the entire form
const signupSchema = z.object({
  ...personalInfoSchema.shape,
  ...accountInfoSchema.shape,
  ...confirmationSchema.shape,
});

// Type for the form data
type SignupFormData = z.infer<typeof signupSchema>;

// Password strength calculation
const calculatePasswordStrength = (password: string): number => {
  if (!password) return 0;

  let strength = 0;

  // Length check
  if (password.length >= 8) strength += 1;
  if (password.length >= 12) strength += 1;

  // Character variety checks
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[a-z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;

  return Math.min(strength, 5);
};

// Password strength label
const getPasswordStrengthLabel = (strength: number): string => {
  switch (strength) {
    case 0:
      return 'Muito fraca';
    case 1:
      return 'Fraca';
    case 2:
      return 'Razoável';
    case 3:
      return 'Média';
    case 4:
      return 'Forte';
    case 5:
      return 'Muito forte';
    default:
      return '';
  }
};

// Password strength color
const getPasswordStrengthColor = (strength: number): string => {
  switch (strength) {
    case 0:
      return 'bg-gray-200';
    case 1:
      return 'bg-red-500';
    case 2:
      return 'bg-primary';
    case 3:
      return 'bg-yellow-500';
    case 4:
      return 'bg-green-500';
    case 5:
      return 'bg-emerald-500';
    default:
      return 'bg-gray-200';
  }
};

// Progress Indicator Component

// Step 1: Personal Information Form
const PersonalInfoForm = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<SignupFormData>();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className='space-y-6'
    >
      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label
            htmlFor='firstName'
            className='flex items-center text-base font-medium text-gray-700'
          >
            Nome<span className='ml-1 text-red-500'>*</span>
          </Label>
          <div className='relative'>
            <Controller
              name='firstName'
              control={control}
              render={({ field }) => (
                <Input
                  id='firstName'
                  placeholder='João'
                  className={cn(
                    'w-full rounded-lg border py-3 pr-4 pl-4 transition-all duration-200',
                    errors.firstName
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  )}
                  {...field}
                />
              )}
            />
            {errors.firstName && (
              <div className='mt-1 flex items-center text-xs text-red-500'>
                <AlertCircle className='mr-1 h-3 w-3' />
                {errors.firstName.message}
              </div>
            )}
          </div>
        </div>

        <div className='space-y-2'>
          <Label
            htmlFor='lastName'
            className='flex items-center text-base font-medium text-gray-700'
          >
            Sobrenome<span className='ml-1 text-red-500'>*</span>
          </Label>
          <div className='relative'>
            <Controller
              name='lastName'
              control={control}
              render={({ field }) => (
                <Input
                  id='lastName'
                  placeholder='Silva'
                  className={cn(
                    'w-full rounded-lg border py-3 pr-4 pl-4 transition-all duration-200',
                    errors.lastName
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  )}
                  {...field}
                />
              )}
            />
            {errors.lastName && (
              <div className='mt-1 flex items-center text-xs text-red-500'>
                <AlertCircle className='mr-1 h-3 w-3' />
                {errors.lastName.message}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className='space-y-2'>
        <Label
          htmlFor='phone'
          className='flex items-center text-base font-medium text-gray-700'
        >
          <Phone className='text-primary mr-2 h-4 w-4' />
          Telefone<span className='ml-1 text-red-500'>*</span>
        </Label>
        <div className='relative'>
          <Controller
            name='phone'
            control={control}
            render={({ field }) => (
              <Input
                id='phone'
                placeholder='(99) 99999-9999'
                className={cn(
                  'w-full rounded-lg border py-3 pr-4 pl-4 transition-all duration-200',
                  errors.phone
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                )}
                {...field}
              />
            )}
          />
          {errors.phone && (
            <div className='mt-1 flex items-center text-xs text-red-500'>
              <AlertCircle className='mr-1 h-3 w-3' />
              {errors.phone.message}
            </div>
          )}
        </div>
      </div>

      <div className='space-y-2'>
        <Label
          htmlFor='birthDate'
          className='flex items-center text-base font-medium text-gray-700'
        >
          <CalendarIcon2 className='text-primary mr-2 h-4 w-4' />
          Data de Nascimento<span className='ml-1 text-red-500'>*</span>
        </Label>
        <div className='relative'>
          <Controller
            name='birthDate'
            control={control}
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-full justify-start rounded-lg border py-6 pr-4 pl-4 text-left font-normal transition-all duration-200',
                      !field.value && 'text-muted-foreground',
                      errors.birthDate
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    )}
                  >
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {field.value ? (
                      format(new Date(field.value), 'PPP', { locale: ptBR })
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                    mode='single'
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) =>
                      field.onChange(date ? format(date, 'yyyy-MM-dd') : '')
                    }
                    initialFocus
                    locale={ptBR}
                    captionLayout='dropdown-buttons'
                    fromYear={1920}
                    toYear={new Date().getFullYear()}
                  />
                </PopoverContent>
              </Popover>
            )}
          />
          {errors.birthDate && (
            <div className='mt-1 flex items-center text-xs text-red-500'>
              <AlertCircle className='mr-1 h-3 w-3' />
              {errors.birthDate.message}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Step 2: Account Information Form
const AccountInfoForm = () => {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<SignupFormData>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const password = watch('password');
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(password || ''));
  }, [password]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className='space-y-6'
    >
      <div className='space-y-2'>
        <Label
          htmlFor='email'
          className='flex items-center text-base font-medium text-gray-700'
        >
          <Mail className='text-primary mr-2 h-4 w-4' />
          Email<span className='ml-1 text-red-500'>*</span>
        </Label>
        <div className='relative'>
          <Controller
            name='email'
            control={control}
            render={({ field }) => (
              <Input
                id='email'
                type='email'
                placeholder='seu.email@exemplo.com'
                className={cn(
                  'w-full rounded-lg border py-3 pr-4 pl-4 transition-all duration-200',
                  errors.email
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                )}
                autoComplete='email'
                {...field}
              />
            )}
          />
          {errors.email && (
            <div className='mt-1 flex items-center text-xs text-red-500'>
              <AlertCircle className='mr-1 h-3 w-3' />
              {errors.email.message}
            </div>
          )}
        </div>
      </div>

      <div className='space-y-2'>
        <Label
          htmlFor='password'
          className='flex items-center text-base font-medium text-gray-700'
        >
          <Lock className='text-primary mr-2 h-4 w-4' />
          Senha<span className='ml-1 text-red-500'>*</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className='ml-1 h-4 w-4 cursor-help text-gray-400' />
              </TooltipTrigger>
              <TooltipContent className='max-w-xs'>
                <p>Sua senha deve conter:</p>
                <ul className='mt-1 list-disc pl-4 text-xs'>
                  <li>Pelo menos 8 caracteres</li>
                  <li>Letras maiúsculas e minúsculas</li>
                  <li>Números</li>
                  <li>Caracteres especiais</li>
                </ul>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Label>
        <div className='relative'>
          <Controller
            name='password'
            control={control}
            render={({ field }) => (
              <Input
                id='password'
                type={showPassword ? 'text' : 'password'}
                placeholder='••••••••'
                className={cn(
                  'w-full rounded-lg border py-3 pr-10 pl-4 transition-all duration-200',
                  errors.password
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                )}
                autoComplete='new-password'
                {...field}
              />
            )}
          />
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none'
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className='h-5 w-5' />
            ) : (
              <Eye className='h-5 w-5' />
            )}
          </button>
          {errors.password && (
            <div className='mt-1 flex items-center text-xs text-red-500'>
              <AlertCircle className='mr-1 h-3 w-3' />
              {errors.password.message}
            </div>
          )}
        </div>

        {/* Password strength meter */}
        {password && (
          <div className='mt-2'>
            <div className='mb-1 flex items-center justify-between'>
              <span className='text-xs text-gray-500'>Força da senha:</span>
              <span
                className={`text-xs font-medium ${
                  passwordStrength <= 1
                    ? 'text-red-500'
                    : passwordStrength <= 2
                      ? 'text-orange-500'
                      : passwordStrength <= 3
                        ? 'text-yellow-500'
                        : 'text-green-500'
                }`}
              >
                {getPasswordStrengthLabel(passwordStrength)}
              </span>
            </div>
            <div className='h-1.5 w-full overflow-hidden rounded-full bg-gray-200'>
              <div
                className={`h-full ${getPasswordStrengthColor(passwordStrength)} transition-all duration-300`}
                style={{ width: `${(passwordStrength / 5) * 100}%` }}
              />
            </div>
            <div className='mt-1 grid grid-cols-2 gap-x-2 gap-y-1'>
              <div
                className={`flex items-center text-xs ${password.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}
              >
                <CheckCircle2
                  className={`mr-1 h-3 w-3 ${password.length >= 8 ? 'opacity-100' : 'opacity-40'}`}
                />
                <span>8+ caracteres</span>
              </div>
              <div
                className={`flex items-center text-xs ${/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-500'}`}
              >
                <CheckCircle2
                  className={`mr-1 h-3 w-3 ${/[A-Z]/.test(password) ? 'opacity-100' : 'opacity-40'}`}
                />
                <span>Letra maiúscula</span>
              </div>
              <div
                className={`flex items-center text-xs ${/[a-z]/.test(password) ? 'text-green-600' : 'text-gray-500'}`}
              >
                <CheckCircle2
                  className={`mr-1 h-3 w-3 ${/[a-z]/.test(password) ? 'opacity-100' : 'opacity-40'}`}
                />
                <span>Letra minúscula</span>
              </div>
              <div
                className={`flex items-center text-xs ${/[0-9]/.test(password) ? 'text-green-600' : 'text-gray-500'}`}
              >
                <CheckCircle2
                  className={`mr-1 h-3 w-3 ${/[0-9]/.test(password) ? 'opacity-100' : 'opacity-40'}`}
                />
                <span>Número</span>
              </div>
              <div
                className={`flex items-center text-xs ${
                  /[^A-Za-z0-9]/.test(password)
                    ? 'text-green-600'
                    : 'text-gray-500'
                }`}
              >
                <CheckCircle2
                  className={`mr-1 h-3 w-3 ${/[^A-Za-z0-9]/.test(password) ? 'opacity-100' : 'opacity-40'}`}
                />
                <span>Caractere especial</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className='space-y-2'>
        <Label
          htmlFor='confirmPassword'
          className='flex items-center text-base font-medium text-gray-700'
        >
          <Lock className='text-primary mr-2 h-4 w-4' />
          Confirmar Senha<span className='ml-1 text-red-500'>*</span>
        </Label>
        <div className='relative'>
          <Controller
            name='confirmPassword'
            control={control}
            render={({ field }) => (
              <Input
                id='confirmPassword'
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder='••••••••'
                className={cn(
                  'w-full rounded-lg border py-3 pr-10 pl-4 transition-all duration-200',
                  errors.confirmPassword
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                )}
                autoComplete='new-password'
                {...field}
              />
            )}
          />
          <button
            type='button'
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className='absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none'
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            {showConfirmPassword ? (
              <EyeOff className='h-5 w-5' />
            ) : (
              <Eye className='h-5 w-5' />
            )}
          </button>
          {errors.confirmPassword && (
            <div className='mt-1 flex items-center text-xs text-red-500'>
              <AlertCircle className='mr-1 h-3 w-3' />
              {errors.confirmPassword.message}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Step 3: Confirmation Form
const ConfirmationForm = () => {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<SignupFormData>();
  const { firstName, lastName, phone, birthDate, email } = watch();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className='space-y-6'
    >
      <div className='rounded-lg border border-blue-100 bg-blue-50 p-6'>
        <h3 className='mb-4 flex items-center font-bold text-blue-900'>
          <CheckCircle2 className='mr-2 h-5 w-5 text-blue-600' />
          Revise suas informações
        </h3>

        <div className='space-y-4'>
          <div className='flex items-center justify-between border-b border-blue-100 pb-2'>
            <span className='text-gray-600'>Nome completo:</span>
            <span className='font-medium text-blue-900'>
              {firstName} {lastName}
            </span>
          </div>
          <div className='flex items-center justify-between border-b border-blue-100 pb-2'>
            <span className='text-gray-600'>Telefone:</span>
            <span className='font-medium text-blue-900'>{phone}</span>
          </div>
          <div className='flex items-center justify-between border-b border-blue-100 pb-2'>
            <span className='text-gray-600'>Data de nascimento:</span>
            <span className='font-medium text-blue-900'>
              {birthDate
                ? format(new Date(birthDate), 'PPP', { locale: ptBR })
                : ''}
            </span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-gray-600'>Email:</span>
            <span className='font-medium text-blue-900'>{email}</span>
          </div>
        </div>
      </div>

      <div className='space-y-4'>
        <div className='flex items-center space-x-2'>
          <Controller
            name='isStudent'
            control={control}
            render={({ field }) => (
              <Checkbox
                id='isStudent'
                checked={field.value}
                onCheckedChange={field.onChange}
                className='text-primary rounded border-gray-300 focus:ring-orange-500'
              />
            )}
          />
          <Label
            htmlFor='isStudent'
            className='text-sm font-medium text-gray-700'
          >
            Sou o aluno
          </Label>
        </div>
        <p className='ml-6 text-xs text-gray-500'>
          Marque esta opção se você é o aluno que irá frequentar as aulas.
        </p>

        <div className='mt-4 flex items-start space-x-2'>
          <div className='mt-1'>
            <Controller
              name='termsAccepted'
              control={control}
              render={({ field }) => (
                <Checkbox
                  id='termsAccepted'
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className={cn(
                    'text-primary rounded border-gray-300 focus:ring-orange-500',
                    errors.termsAccepted && 'border-red-500'
                  )}
                />
              )}
            />
          </div>
          <div>
            <Label
              htmlFor='termsAccepted'
              className={cn(
                'text-sm font-medium text-gray-700',
                errors.termsAccepted && 'text-red-500'
              )}
            >
              Concordo com os{' '}
              <Link href='/terms' className='text-blue-600 hover:underline'>
                Termos de Uso
              </Link>{' '}
              e{' '}
              <Link href='/privacy' className='text-blue-600 hover:underline'>
                Política de Privacidade
              </Link>
            </Label>
            {errors.termsAccepted && (
              <div className='mt-1 flex items-center text-xs text-red-500'>
                <AlertCircle className='mr-1 h-3 w-3' />
                {errors.termsAccepted.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function SignupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create form methods with React Hook Form and Zod resolver
  const methods = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      birthDate: '',
      email: '',
      password: '',
      confirmPassword: '',
      isStudent: false,
      //    termsAccepted: false,
    },
    mode: 'onChange',
  });

  // Get current schema based on step
  const getCurrentSchema = () => {
    switch (currentStep) {
      case 1:
        return personalInfoSchema;
      case 2:
        return accountInfoSchema;
      case 3:
        return confirmationSchema;
      default:
        return personalInfoSchema;
    }
  };

  // Handle next step
  const handleNextStep = async () => {
    const schema = getCurrentSchema();
    const formData = methods.getValues();

    // Extract only the fields for the current step
    const currentStepData: any = {};
    Object.keys(schema.shape).forEach((key) => {
      currentStepData[key] = formData[key as keyof SignupFormData];
    });

    try {
      // Validate only the current step fields
      await schema.parseAsync(currentStepData);
      setCurrentStep((prev) => prev + 1);
    } catch (error) {
      // Trigger validation for the fields in the current step
      if (currentStep === 1) {
        methods.trigger(['firstName', 'lastName', 'phone', 'birthDate']);
      } else if (currentStep === 2) {
        methods.trigger(['email', 'password', 'confirmPassword']);
      } else if (currentStep === 3) {
        methods.trigger(['isStudent', 'termsAccepted']);
      }
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // Handle form submission
  const onSubmit = async (data: SignupFormData) => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('Form submitted successfully:', data);

      // Redirect to success page
      router.push('/signup/success');
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex w-full items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-8 lg:w-1/2'>
      {/* Back to home link for mobile */}
      <div className='absolute top-4 left-4 lg:hidden'>
        <Link
          href='/'
          className='flex items-center text-blue-800 transition-colors hover:text-orange-500'
        >
          <ChevronLeft className='mr-1 h-4 w-4' />
          <span>Voltar</span>
        </Link>
      </div>

      <div className='w-full max-w-md'>
        <div className='mb-10 flex items-center justify-center lg:justify-start'>
          <div className='relative mr-4 lg:hidden'>
            <div className='absolute -inset-1 rounded-full bg-orange-200 blur-sm'></div>
            <Link href='/'>
              <Image
                src='https://hebbkx1anhila5yf.public.blob.vercel-storage.com/budokan.jpg-agJBqgCaSEzyDWGHfvAUrKFDnFWaS2.jpeg'
                alt='Budokan Logo'
                width={60}
                height={60}
                className='relative rounded-full ring-2 ring-orange-500/30 transition-transform duration-300 hover:scale-105'
              />
            </Link>
          </div>
          <div>
            <h2 className='text-3xl font-bold text-blue-900'>
              Cadastro de Usuário
            </h2>
            <p className='mt-1 text-gray-500'>
              Preencha o formulário para se cadastrar na Budokan
            </p>
          </div>
        </div>

        {/* Adicionar o indicador de progresso aqui */}
        <div className='to-primary/80 mb-6 rounded-xl border bg-gradient-to-r from-blue-900/90 p-6 shadow-xl'>
          <div className='mb-4 flex items-center justify-between'>
            <div className='flex flex-col items-center'>
              <div
                className={`mb-2 flex h-10 w-10 items-center justify-center rounded-full ${
                  currentStep >= 1 ? 'bg-blue-900' : 'bg-white/30'
                }`}
              >
                <User
                  className={`h-5 w-5 ${currentStep >= 1 ? 'text-white' : 'text-white/70'}`}
                />
              </div>
              <span className='text-sm text-white'>Dados Pessoais</span>
            </div>
            <div
              className={`mx-2 h-1 flex-1 ${currentStep >= 2 ? 'bg-primary' : 'bg-white/30'}`}
            ></div>
            <div className='flex flex-col items-center'>
              <div
                className={`mb-2 flex h-10 w-10 items-center justify-center rounded-full ${
                  currentStep >= 2 ? 'bg-blue-900' : 'bg-white/30'
                }`}
              >
                <Lock
                  className={`h-5 w-5 ${currentStep >= 2 ? 'text-white' : 'text-white/70'}`}
                />
              </div>
              <span className='text-sm text-white'>Acesso</span>
            </div>
            <div
              className={`mx-2 h-1 flex-1 ${currentStep >= 3 ? 'bg-primary' : 'bg-white/30'}`}
            ></div>
            <div className='flex flex-col items-center'>
              <div
                className={`mb-2 flex h-10 w-10 items-center justify-center rounded-full ${
                  currentStep >= 3 ? 'bg-blue-900' : 'bg-white/30'
                }`}
              >
                <CheckCircle2
                  className={`h-5 w-5 ${currentStep >= 3 ? 'text-white' : 'text-white/70'}`}
                />
              </div>
              <span className='text-sm text-white'>Confirmação</span>
            </div>
          </div>

          {/* <div className='text-white'>
            <h3 className='mb-1 text-lg font-bold'>
              {currentStep === 1 && 'Passo 1: Informações Pessoais'}
              {currentStep === 2 && 'Passo 2: Dados de Acesso'}
              {currentStep === 3 && 'Passo 3: Revisão e Confirmação'}
            </h3>
            <p className='text-sm opacity-90'>
              {currentStep === 1 &&
                'Preencha seus dados pessoais para começarmos seu cadastro.'}
              {currentStep === 2 &&
                'Crie suas credenciais de acesso à plataforma Budokan.'}
              {currentStep === 3 &&
                'Revise suas informações e confirme seu cadastro.'}
            </p>
          </div> */}
        </div>

        {/* Remover o indicador de progresso mobile, já que agora temos um único indicador */}
        {/* <div className="lg:hidden mb-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${currentStep >= 1 ? "bg-blue-800" : "bg-gray-300"}`}
                >
                  <User className={`h-4 w-4 ${currentStep >= 1 ? "text-white" : "text-gray-500"}`} />
                </div>
                <span className="text-xs">Pessoal</span>
              </div>
              <div className={`h-1 flex-1 mx-1 ${currentStep >= 2 ? "bg-blue-800" : "bg-gray-300"}`}></div>
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${currentStep >= 2 ? "bg-blue-800" : "bg-gray-300"}`}
                >
                  <Lock className={`h-4 w-4 ${currentStep >= 2 ? "text-white" : "text-gray-500"}`} />
                </div>
                <span className="text-xs">Acesso</span>
              </div>
              <div className={`h-1 flex-1 mx-1 ${currentStep >= 3 ? "bg-blue-800" : "bg-gray-300"}`}></div>
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${currentStep >= 3 ? "bg-blue-800" : "bg-gray-300"}`}
                >
                  <CheckCircle2 className={`h-4 w-4 ${currentStep >= 3 ? "text-white" : "text-gray-500"}`} />
                </div>
                <span className="text-xs">Confirmar</span>
              </div>
            </div>
          </div> */}

        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className='rounded-2xl border border-gray-100 bg-white p-8 shadow-lg'
          >
            <AnimatePresence mode='wait'>
              {currentStep === 1 && <PersonalInfoForm key='step1' />}
              {currentStep === 2 && <AccountInfoForm key='step2' />}
              {currentStep === 3 && <ConfirmationForm key='step3' />}
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className='mt-8 flex justify-between'>
              {/* {currentStep > 1 ? (
                <Button
                  type='button'
                  onClick={handlePrevStep}
                  variant='outline'
                  className='flex items-center justify-center'
                >
                  <ArrowLeft className='mr-2 h-4 w-4' />
                  Voltar
                </Button>
              ) : (
                <Link href='/login'>
                  <Button
                    type='button'
                    variant='outline'
                    className='flex items-center justify-center'
                  >
                    <ArrowLeft className='mr-2 h-4 w-4' />
                    Login
                  </Button>
                </Link>
              )} */}

              {currentStep < 3 ? (
                <Button
                  type='button'
                  onClick={handleNextStep}
                  className='group hover:from-primary hover:to-primary/80 flex items-center justify-center bg-gradient-to-r from-blue-800 to-blue-900 text-white shadow-md transition-all duration-300 hover:shadow-lg'
                >
                  Próximo
                  <ArrowRight className='ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1' />
                </Button>
              ) : (
                <Button
                  type='submit'
                  disabled={isSubmitting}
                  className='group flex items-center justify-center bg-gradient-to-r from-blue-800 to-blue-900 text-white shadow-md transition-all duration-300 hover:from-orange-600 hover:to-orange-700 hover:shadow-lg'
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className='mr-2 -ml-1 h-4 w-4 animate-spin text-white'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                      >
                        <circle
                          className='opacity-25'
                          cx='12'
                          cy='12'
                          r='10'
                          stroke='currentColor'
                          strokeWidth='4'
                        ></circle>
                        <path
                          className='opacity-75'
                          fill='currentColor'
                          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                        ></path>
                      </svg>
                      Cadastrando...
                    </>
                  ) : (
                    <>
                      Cadastrar
                      <ArrowRight className='ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1' />
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </FormProvider>

        <div className='mt-8 text-center'>
          <p className='text-gray-600'>
            Já tem uma conta?{' '}
            <Link
              href='/login'
              className='text-primary hover:text-primary/80 font-medium transition-colors duration-200 hover:underline'
            >
              Faça login
            </Link>
          </p>
        </div>

        <div className='mt-12 border-t border-gray-200 pt-6'>
          <p className='text-center text-sm text-gray-500'>
            &copy; {new Date().getFullYear()} Associação de Artes Marciais
            Budokan.
            <br />
            Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
