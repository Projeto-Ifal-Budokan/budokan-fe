import { ReactNode } from 'react';
import { Progress } from './progress';

interface Step {
  icon: ReactNode;
  label: string;
}

interface ProgressIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export function ProgressIndicator({
  steps,
  currentStep,
}: ProgressIndicatorProps) {
  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;
  return (
    <div className='rounded-xl border bg-gradient-to-r from-blue-900/90 to-blue-950/50 px-2 py-2 shadow-xl'>
      <div className='mb-2 flex items-center justify-between gap-1 overflow-x-auto'>
        {steps.map((step, index) => (
          <div key={`step-${index}`} className='min-w-[60px] flex-1'>
            <div className='flex flex-col items-center'>
              <div
                className={`mb-1 flex h-8 w-8 rounded-full ${
                  currentStep >= index + 1 ? 'bg-primary' : 'bg-white/30'
                }`}
              >
                <div
                  className={`flex flex-1 items-center justify-center ${
                    currentStep >= index + 1 ? 'text-white' : 'text-white/70'
                  }`}
                >
                  {step.icon}
                </div>
              </div>
              <span className='text-center text-xs leading-tight text-white'>
                {step.label}
              </span>
            </div>
          </div>
        ))}
      </div>
      <Progress value={progressPercentage} className='h-2' />
      <div className='mt-1 text-right text-xs text-white'>
        {Math.round(progressPercentage)}%
      </div>
    </div>
  );
}
