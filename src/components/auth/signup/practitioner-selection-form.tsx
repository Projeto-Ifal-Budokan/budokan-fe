import { Check, User, Users } from 'lucide-react';

interface PractitionerSelectionFormProps {
  onSelection: (isPractitioner: boolean) => void;
  selectedValue: boolean | null;
}

export function PractitionerSelectionForm({
  onSelection,
  selectedValue,
}: PractitionerSelectionFormProps) {
  return (
    <div className='mx-auto max-w-md space-y-4'>
      <div className='text-center'>
        <div className='mb-3 flex justify-center'>
          <div className='rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-3 shadow-lg'>
            <Users className='h-6 w-6 text-white' />
          </div>
        </div>

        <p className='mt-1 text-sm text-gray-600'>
          Selecione o tipo de usuário que melhor descreve você
        </p>
      </div>

      <div className='space-y-3'>
        {/* Practitioner Option */}
        <button
          type='button'
          onClick={() => onSelection(true)}
          className={`group relative w-full rounded-xl border-2 p-4 text-left transition-all duration-200 hover:shadow-lg ${
            selectedValue === true
              ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg'
              : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
          }`}
        >
          <div className='flex items-center space-x-4'>
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200 ${
                selectedValue === true
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
              }`}
            >
              <User className='h-6 w-6' />
            </div>
            <div className='flex-1'>
              <h4 className='text-lg font-semibold text-gray-900'>
                Sou o Aluno
              </h4>
              <p className='mt-1 text-sm text-gray-600'>
                Contatos de emergência obrigatórios
              </p>
            </div>
            {selectedValue === true && (
              <div className='flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white'>
                <Check className='h-4 w-4' />
              </div>
            )}
          </div>
        </button>

        {/* Non-Practitioner Option */}
        <button
          type='button'
          onClick={() => onSelection(false)}
          className={`group relative w-full rounded-xl border-2 p-4 text-left transition-all duration-200 hover:shadow-lg ${
            selectedValue === false
              ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg'
              : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
          }`}
        >
          <div className='flex items-center space-x-4'>
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200 ${
                selectedValue === false
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
              }`}
            >
              <Users className='h-6 w-6' />
            </div>
            <div className='flex-1'>
              <h4 className='text-lg font-semibold text-gray-900'>
                Sou Responsável/Familiar
              </h4>
              <p className='mt-1 text-sm text-gray-600'>
                Contatos de emergência não obrigatórios
              </p>
            </div>
            {selectedValue === false && (
              <div className='flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white'>
                <Check className='h-4 w-4' />
              </div>
            )}
          </div>
        </button>
      </div>
    </div>
  );
}
