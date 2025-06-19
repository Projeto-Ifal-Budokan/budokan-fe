import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Controller, useFormContext } from 'react-hook-form';
import { SignupFormData } from '../../../types/signup-types';

export function ConfirmationForm() {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<SignupFormData>();
  const { firstName, surname, phone, birthDate, email } = watch();

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
              {firstName} {surname}
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
                ? // ?
                  birthDate
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
        <div className='mt-4 flex items-center space-x-2'>
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
            <div className='ml-2 flex items-center text-xs text-red-500'>
              <AlertCircle className='mr-1 h-3 w-3' />
              {errors.termsAccepted.message}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
