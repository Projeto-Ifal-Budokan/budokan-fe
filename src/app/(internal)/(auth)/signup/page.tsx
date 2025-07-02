'use client';

import { AccountInfoForm } from '@/components/auth/signup/account-info-form';
import { ConfirmationForm } from '@/components/auth/signup/confirmation-form';
import { EmergencyContactsForm } from '@/components/auth/signup/emergency-contacts-form';
import { PersonalInfoForm } from '@/components/auth/signup/personal-info-form';
import { PractitionerSelectionForm } from '@/components/auth/signup/practitioner-selection-form';

import { Button } from '@/components/ui/button';
import { ProgressIndicator } from '@/components/ui/progress-indicator';
import { authService } from '@/lib/api/services/auth-service';
import { SignupFormData, signupSchema } from '@/types/signup-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  Loader2,
  Lock,
  Phone,
  User,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';

const SignupSuccessPage = () => {
  return (
    <div className='flex h-screen w-full items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-8 lg:w-1/2'>
      <div className='w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-lg'>
        <div className='mb-6 flex justify-center'>
          <div className='rounded-full bg-green-100 p-3'>
            <CheckCircle2 className='h-12 w-12 text-green-600' />
          </div>
        </div>

        <h1 className='mb-4 text-2xl font-bold text-gray-900'>
          Conta criada com sucesso!
        </h1>

        <p className='mb-8 text-gray-600'>
          Aguarde o administrador ativa-la para você poder ter acesso!
        </p>

        <Link href='/login'>
          <Button className='w-full bg-gradient-to-r from-blue-800 to-blue-900 text-white hover:from-blue-900 hover:to-blue-950'>
            Voltar para o login
          </Button>
        </Link>
      </div>
    </div>
  );
};

const SignupForm = ({ onSuccess }: { onSuccess: () => void }) => {
  // const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPractitioner, setIsPractitioner] = useState<boolean | null>(null);

  // Create form methods with React Hook Form and Zod resolver
  const methods = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      surname: '',
      phone: '',
      birthDate: '',
      email: '',
      password: '',
      confirmPassword: '',
      isPractitioner: false,
      emergencyContacts: [{ phone: '', relationship: '' }],
    },
    mode: 'onChange',
  });

  // Dynamic steps based on practitioner status
  const getSteps = () => {
    const baseSteps = [
      {
        icon: <User />,
        label: 'Dados Pessoais',
      },
      {
        icon: <Users />,
        label: 'Tipo de Usuário',
      },
      {
        icon: <Lock />,
        label: 'Acesso',
      },
    ];

    // Add emergency contacts step only if practitioner
    if (isPractitioner === true) {
      baseSteps.push({
        icon: <Phone />,
        label: 'Emergência',
      });
    }

    baseSteps.push({
      icon: <CheckCircle2 />,
      label: 'Confirmação',
    });

    return baseSteps;
  };

  // Handle next step
  const handleNextStep = async () => {
    let isValid = false;

    // Validate only the fields in the current step
    if (currentStep === 1) {
      const result = await methods.trigger(
        ['firstName', 'surname', 'phone', 'birthDate'],
        { shouldFocus: true }
      );
      isValid = result;
    } else if (currentStep === 2) {
      // Practitioner selection step - no validation needed as it's handled by the component
      isValid = isPractitioner !== null;
    } else if (currentStep === 3) {
      const result = await methods.trigger(
        ['email', 'password', 'confirmPassword'],
        { shouldFocus: true }
      );

      // Additional check for password matching
      const { password, confirmPassword } = methods.getValues();
      if (result && password !== confirmPassword) {
        methods.setError('confirmPassword', {
          type: 'manual',
          message: 'Senhas não coincidem',
        });
        isValid = false;
      } else {
        isValid = result;
      }
    } else if (currentStep === 4 && isPractitioner) {
      // Emergency contacts step (only for practitioners)
      const result = await methods.trigger(['emergencyContacts'], {
        shouldFocus: true,
      });
      isValid = result;
    } else if (
      (currentStep === 4 && !isPractitioner) ||
      (currentStep === 5 && isPractitioner)
    ) {
      // Confirmation step
      const result = await methods.trigger(['termsAccepted'], {
        shouldFocus: true,
      });
      isValid = result;
    }

    // If current step is valid, move to next step
    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  // Handle practitioner selection
  const handlePractitionerSelection = (practitioner: boolean) => {
    setIsPractitioner(practitioner);
    methods.setValue('isPractitioner', practitioner);

    // If not practitioner, clear emergency contacts
    if (!practitioner) {
      methods.setValue('emergencyContacts', []);
    } else {
      methods.setValue('emergencyContacts', [{ phone: '', relationship: '' }]);
    }
  };

  // Handle form submission
  const onSubmit = async (data: SignupFormData) => {
    setIsSubmitting(true);
    try {
      const response = await authService.register({
        ...data,
        birthDate: data.birthDate,
        healthObservations: data.healthObservations || '',
        emergencyContacts: isPractitioner ? data.emergencyContacts : [],
        profileImageUrl: '',
      });

      if (response.ok) {
        toast.success('Conta criada com sucesso!');
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Erro ao criar conta. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = getSteps();
  const totalSteps = steps.length;

  return (
    <div className='flex h-screen w-full flex-col justify-center overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100 lg:w-1/2'>
      {/* Header fixo - ajustado para ocupar menos espaço */}
      <div className='flex-shrink-0 px-4 lg:px-8'>
        {/* Back to home link for mobile */}
        <div className='pt-2 lg:hidden'>
          <Link
            href='/'
            className='flex items-center text-blue-800 transition-colors hover:text-orange-500'
          >
            <ChevronLeft className='mr-1 h-4 w-4' />
            <span>Voltar</span>
          </Link>
        </div>

        {/* Header compacto */}
        <div className='py-4'>
          <div className='mx-auto w-full max-w-md'>
            <div className='mb-4 flex items-center justify-center lg:justify-start'>
              <div className='relative mr-3 lg:hidden'>
                <div className='absolute -inset-1 rounded-full bg-orange-200 blur-sm'></div>
                <Link href='/'>
                  <Image
                    src='/logo.jpg'
                    alt='Budokan Logo'
                    width={48}
                    height={48}
                    className='relative rounded-full transition-transform duration-300 hover:scale-105'
                  />
                </Link>
              </div>
              <div>
                <h2 className='text-2xl font-bold text-blue-900 lg:text-3xl'>
                  Cadastro de Usuário
                </h2>
                <p className='text-sm text-gray-500'>
                  Preencha o formulário para se cadastrar na Budokan
                </p>
              </div>
            </div>

            {/* Progress indicator mais compacto */}
            <div className='mb-4'>
              <ProgressIndicator steps={steps} currentStep={currentStep} />
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal com scroll controlado */}
      <div className='flex items-center px-4 pb-4 lg:px-8'>
        <div className='mx-auto w-full max-w-md'>
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className='rounded-2xl border border-gray-100 bg-white shadow-lg'
            >
              {/* Só o conteúdo do formulário tem scroll */}
              <div
                className='p-4 lg:p-6'
                style={{
                  maxHeight: 'calc(100vh - 340px)',
                  minHeight: '400px',
                  overflowY: 'auto',
                }}
              >
                <AnimatePresence mode='wait'>
                  {currentStep === 1 && <PersonalInfoForm key='step1' />}
                  {currentStep === 2 && (
                    <PractitionerSelectionForm
                      key='step2'
                      onSelection={handlePractitionerSelection}
                      selectedValue={isPractitioner}
                    />
                  )}
                  {currentStep === 3 && <AccountInfoForm key='step3' />}
                  {currentStep === 4 && isPractitioner && (
                    <EmergencyContactsForm key='step4' />
                  )}
                  {((currentStep === 4 && !isPractitioner) ||
                    (currentStep === 5 && isPractitioner)) && (
                    <ConfirmationForm key='step5' />
                  )}
                </AnimatePresence>
              </div>

              {/* Navigation buttons fixos na parte inferior */}
              <div className='border-t border-gray-100 p-4 lg:p-6'>
                <div className='flex justify-between'>
                  {currentStep > 1 && (
                    <Button
                      onClick={() => setCurrentStep((prev) => prev - 1)}
                      variant='outline'
                      className='flex items-center hover:bg-gray-50'
                    >
                      <ChevronLeft className='mr-2 h-4 w-4' />
                      Voltar
                    </Button>
                  )}

                  {currentStep < totalSteps ? (
                    <Button
                      type='button'
                      onClick={handleNextStep}
                      className='group ml-auto flex items-center justify-center bg-gradient-to-r from-blue-800 to-blue-900 text-white shadow-md transition-all duration-300 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg'
                    >
                      <span className='flex items-center'>
                        Próximo
                        <ArrowRight className='ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1' />
                      </span>
                    </Button>
                  ) : (
                    <Button
                      type='submit'
                      disabled={isSubmitting}
                      aria-label='Cadastrar conta'
                      className='group ml-auto flex items-center justify-center bg-gradient-to-r from-blue-800 to-blue-900 text-white shadow-md transition-all duration-300 hover:from-green-500 hover:to-green-600 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70'
                    >
                      <span className='flex items-center'>
                        {isSubmitting ? (
                          <>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Cadastrando...
                          </>
                        ) : (
                          <>
                            Cadastrar
                            <ArrowRight className='ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1' />
                          </>
                        )}
                      </span>
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </FormProvider>

          {/* Footer compacto */}
          <div className='mt-3 text-center'>
            <p className='text-sm text-gray-600'>
              Já tem uma conta?{' '}
              <Link
                href='/login'
                className='text-primary hover:text-primary/80 font-medium transition-colors duration-200 hover:underline'
              >
                Faça login
              </Link>
            </p>
            <p className='mt-1 text-xs text-gray-500'>
              &copy; {new Date().getFullYear()} Associação de Artes Marciais
              Budokan. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function SignupPage() {
  const [isSuccess, setIsSuccess] = useState(false);

  if (isSuccess) {
    return <SignupSuccessPage />;
  }

  return <SignupForm onSuccess={() => setIsSuccess(true)} />;
}
