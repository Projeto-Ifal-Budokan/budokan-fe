import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

interface PasswordStrengthMeterProps {
  password: string;
}

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

export function PasswordStrengthMeter({
  password,
}: PasswordStrengthMeterProps) {
  const passwordStrength = calculatePasswordStrength(password);

  if (!password) return null;

  return (
    <div className='mt-2'>
      <div className='mb-1 flex items-center justify-between'>
        <span className='text-xs text-gray-500'>Força da senha:</span>
        <span
          className={cn('text-xs font-medium', {
            'text-red-500': passwordStrength <= 1,
            'text-orange-500': passwordStrength === 2,
            'text-yellow-500': passwordStrength === 3,
            'text-green-500': passwordStrength >= 4,
          })}
        >
          {getPasswordStrengthLabel(passwordStrength)}
        </span>
      </div>
      <div className='h-1.5 w-full overflow-hidden rounded-full bg-gray-200'>
        <div
          className={cn(
            'h-full transition-all duration-300',
            getPasswordStrengthColor(passwordStrength)
          )}
          style={{ width: `${(passwordStrength / 5) * 100}%` }}
        />
      </div>
      <div className='mt-1 grid grid-cols-2 gap-x-2 gap-y-1'>
        <div
          className={cn('flex items-center text-xs', {
            'text-green-600': password.length >= 8,
            'text-gray-500': password.length < 8,
          })}
        >
          <CheckCircle2
            className={cn('mr-1 h-3 w-3', {
              'opacity-100': password.length >= 8,
              'opacity-40': password.length < 8,
            })}
          />
          <span>8+ caracteres</span>
        </div>
        <div
          className={cn('flex items-center text-xs', {
            'text-green-600': /[A-Z]/.test(password),
            'text-gray-500': !/[A-Z]/.test(password),
          })}
        >
          <CheckCircle2
            className={cn('mr-1 h-3 w-3', {
              'opacity-100': /[A-Z]/.test(password),
              'opacity-40': !/[A-Z]/.test(password),
            })}
          />
          <span>Letra maiúscula</span>
        </div>
        <div
          className={cn('flex items-center text-xs', {
            'text-green-600': /[a-z]/.test(password),
            'text-gray-500': !/[a-z]/.test(password),
          })}
        >
          <CheckCircle2
            className={cn('mr-1 h-3 w-3', {
              'opacity-100': /[a-z]/.test(password),
              'opacity-40': !/[a-z]/.test(password),
            })}
          />
          <span>Letra minúscula</span>
        </div>
        <div
          className={cn('flex items-center text-xs', {
            'text-green-600': /[0-9]/.test(password),
            'text-gray-500': !/[0-9]/.test(password),
          })}
        >
          <CheckCircle2
            className={cn('mr-1 h-3 w-3', {
              'opacity-100': /[0-9]/.test(password),
              'opacity-40': !/[0-9]/.test(password),
            })}
          />
          <span>Número</span>
        </div>
        <div
          className={cn('flex items-center text-xs', {
            'text-green-600': /[^A-Za-z0-9]/.test(password),
            'text-gray-500': !/[^A-Za-z0-9]/.test(password),
          })}
        >
          <CheckCircle2
            className={cn('mr-1 h-3 w-3', {
              'opacity-100': /[^A-Za-z0-9]/.test(password),
              'opacity-40': !/[^A-Za-z0-9]/.test(password),
            })}
          />
          <span>Caractere especial</span>
        </div>
      </div>
    </div>
  );
}
