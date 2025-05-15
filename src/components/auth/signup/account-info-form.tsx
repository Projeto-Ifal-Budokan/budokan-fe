import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordStrengthMeter } from '@/components/ui/password-strength-meter';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { AlertCircle, Eye, EyeOff, Info, Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { SignupFormData } from '../../../types/signup-types';

export function AccountInfoForm() {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<SignupFormData>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const password = watch('password');

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
        <>
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
          </div>

          {errors.password && (
            <div className='mt-1 flex items-center text-xs text-red-500'>
              <AlertCircle className='mr-1 h-3 w-3' />
              {errors.password.message}
            </div>
          )}
        </>

        <PasswordStrengthMeter password={password} />
      </div>

      <div className='space-y-2'>
        <Label
          htmlFor='confirmPassword'
          className='flex items-center text-base font-medium text-gray-700'
        >
          <Lock className='text-primary mr-2 h-4 w-4' />
          Confirmar Senha<span className='ml-1 text-red-500'>*</span>
        </Label>
        <div>
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
              aria-label={
                showConfirmPassword ? 'Hide password' : 'Show password'
              }
            >
              {showConfirmPassword ? (
                <EyeOff className='h-5 w-5' />
              ) : (
                <Eye className='h-5 w-5' />
              )}
            </button>
          </div>
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
}
