import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { AlertCircle, Calendar, Phone } from 'lucide-react';
import { Controller, useFormContext } from 'react-hook-form';
import { PatternFormat } from 'react-number-format';
import { SignupFormData } from '../../../types/signup-types';

export function PersonalInfoForm() {
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
              <PatternFormat
                id='phone'
                placeholder='(99) 99999-9999'
                format='(##) #####-####'
                mask='_'
                className={cn(
                  'w-full rounded-lg border py-3 pr-4 pl-4 text-sm transition-all duration-200',
                  errors.phone
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                )}
                onValueChange={(values) => {
                  field.onChange(values.value);
                }}
                value={field.value}
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
          <Calendar className='text-primary mr-2 h-4 w-4' />
          Data de Nascimento<span className='ml-1 text-red-500'>*</span>
        </Label>
        <div className='relative'>
          <Controller
            name='birthDate'
            control={control}
            render={({ field }) => (
              <PatternFormat
                id='birthDate'
                placeholder='DD/MM/AAAA'
                format='##/##/####'
                mask='_'
                className={cn(
                  'w-full rounded-lg border py-3 pr-4 pl-4 text-sm transition-all duration-200',
                  errors.birthDate
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                )}
                onValueChange={(values) => {
                  field.onChange(values.value);
                }}
                value={field.value}
              />
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
}
