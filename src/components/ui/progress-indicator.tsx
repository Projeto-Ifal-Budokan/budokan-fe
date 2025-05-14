interface Step {
  icon: React.ReactNode;
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
  return (
    <div className='rounded-xl border bg-gradient-to-r from-blue-900/90 to-blue-950/50 px-6 py-4 shadow-xl'>
      <div className='mb-4 flex items-center justify-between'>
        {steps.map((step, index) => (
          <div key={`step-${index}`}>
            <div className='flex flex-col items-center'>
              <div
                className={`mb-2 flex h-10 w-10 rounded-full ${
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
              <span className='text-sm text-white'>{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`mx-2 h-1 flex-1 ${
                  currentStep >= index + 2 ? 'bg-primary' : 'bg-white/30'
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
