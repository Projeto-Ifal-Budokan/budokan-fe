'use client';

import { AccountInfoForm } from '@/components/auth/signup/account-info-form';
import { ConfirmationForm } from '@/components/auth/signup/confirmation-form';
import { PersonalInfoForm } from '@/components/auth/signup/personal-info-form';
import { Button } from '@/components/ui/button';
import { ProgressIndicator } from '@/components/ui/progress-indicator';
import {
  SignupFormData,
  accountInfoSchema,
  confirmationSchema,
  personalInfoSchema,
  signupSchema,
} from '@/types/signup-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  Loader2,
  Lock,
  User,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

const steps = [
  {
    icon: <User />,
    label: 'Dados Pessoais',
  },
  {
    icon: <Lock />,
    label: 'Acesso',
  },
  {
    icon: <CheckCircle2 />,
    label: 'Confirmação',
  },
];

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
    let isValid = false;

    // Validate only the fields in the current step
    if (currentStep === 1) {
      const result = await methods.trigger(
        ['firstName', 'lastName', 'phone', 'birthDate'],
        { shouldFocus: true }
      );
      isValid = result;
    } else if (currentStep === 2) {
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
    } else if (currentStep === 3) {
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
                src='/logo.jpg'
                alt='Budokan Logo'
                width={60}
                height={60}
                className='relative rounded-full transition-transform duration-300 hover:scale-105'
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

        <ProgressIndicator steps={steps} currentStep={currentStep} />

        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className='mt-4 rounded-2xl border border-gray-100 bg-white p-8 shadow-lg'
          >
            <AnimatePresence mode='wait'>
              {currentStep === 1 && <PersonalInfoForm key='step1' />}
              {currentStep === 2 && <AccountInfoForm key='step2' />}
              {currentStep === 3 && <ConfirmationForm key='step3' />}
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className='mt-8 flex justify-between'>
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
                      <Loader2 className='animate-spin' />
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

        <div className='mt-6 text-center'>
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

        <div className='mt-4 border-t border-gray-200 pt-4'>
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
