import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import IMask from 'imask';
import { AlertCircle, Phone, Plus, Shield, Trash2 } from 'lucide-react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { SignupFormData } from '../../../types/signup-types';

export function EmergencyContactsForm() {
  const {
    control,
    formState: { errors },
  } = useFormContext<SignupFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'emergencyContacts',
  });

  const maxContacts = 3;
  const canAddMore = fields.length < maxContacts;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className='space-y-6'
    >
      <div className='text-center'>
        <div className='mb-4 flex justify-center'>
          <div className='rounded-full bg-gradient-to-br from-blue-100 to-blue-200 p-2 shadow-sm'>
            <Shield className='h-8 w-8 text-blue-600' />
          </div>
        </div>
        <h3 className='mb-2 text-2xl font-bold text-gray-900'>
          Contatos de Emergência
        </h3>
      </div>

      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <div>
            <Label className='text-base font-semibold text-gray-800'>
              Contatos de Emergência
            </Label>
            <p className='mt-1 text-sm text-gray-500'>
              {fields.length} de {maxContacts} contatos adicionados
            </p>
          </div>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => append({ phone: '', relationship: '' })}
            disabled={!canAddMore}
            className={cn(
              'flex items-center gap-2 transition-all duration-200',
              canAddMore
                ? 'border-blue-200 bg-white text-blue-700 hover:border-blue-300 hover:bg-gray-50 hover:text-blue-800'
                : 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400'
            )}
          >
            <Plus className='h-4 w-4' />
            Adicionar
          </Button>
        </div>

        <div className='max-h-64 space-y-3 overflow-y-auto pr-2'>
          {fields.map((field, index) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className='group relative'
            >
              <div className='rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-blue-200 hover:shadow-md'>
                <div className='mb-4 flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-100'>
                      <span className='text-sm font-semibold text-blue-600'>
                        {index + 1}
                      </span>
                    </div>
                    <h4 className='text-sm font-semibold text-gray-700'>
                      Contato {index + 1}
                    </h4>
                  </div>
                  {fields.length > 1 && (
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      onClick={() => remove(index)}
                      className='text-red-500 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-red-50 hover:text-red-700'
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  )}
                </div>

                <div className='grid grid-cols-1 gap-4'>
                  <div className='space-y-2'>
                    <Label className='flex items-center gap-2 text-sm font-medium text-gray-700'>
                      <Phone className='h-4 w-4 text-blue-500' />
                      Telefone
                      <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                      name={`emergencyContacts.${index}.phone`}
                      control={control}
                      render={({ field: { ref, ...field } }) => (
                        <Input
                          placeholder='(99) 99999-9999'
                          type='tel'
                          className={cn(
                            'w-full rounded-lg border py-3 pr-4 pl-4 text-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500/20',
                            errors.emergencyContacts?.[index]?.phone
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                              : 'border-gray-300 focus:border-blue-500'
                          )}
                          {...field}
                          onFocus={(e) => {
                            const mask = IMask(e.target, {
                              mask: '(00) 00000-0000',
                            });
                            field.onChange(mask.value);
                            mask.on('accept', () => {
                              field.onChange(mask.value);
                            });
                          }}
                        />
                      )}
                    />
                    {errors.emergencyContacts?.[index]?.phone && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='flex items-center text-xs text-red-500'
                      >
                        <AlertCircle className='mr-1 h-3 w-3' />
                        {errors.emergencyContacts[index]?.phone?.message}
                      </motion.div>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label className='text-sm font-medium text-gray-700'>
                      Relacionamento
                      <span className='text-red-500'>*</span>
                    </Label>
                    <Controller
                      name={`emergencyContacts.${index}.relationship`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          placeholder='Ex: Pai, Mãe, Cônjuge, Amigo'
                          className={cn(
                            'w-full rounded-lg border py-3 pr-4 pl-4 text-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500/20',
                            errors.emergencyContacts?.[index]?.relationship
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                              : 'border-gray-300 focus:border-blue-500'
                          )}
                          {...field}
                        />
                      )}
                    />
                    {errors.emergencyContacts?.[index]?.relationship && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='flex items-center text-xs text-red-500'
                      >
                        <AlertCircle className='mr-1 h-3 w-3' />
                        {errors.emergencyContacts[index]?.relationship?.message}
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {errors.emergencyContacts &&
          !Array.isArray(errors.emergencyContacts) && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className='flex items-center rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-500'
            >
              <AlertCircle className='mr-2 h-4 w-4' />
              {errors.emergencyContacts.message}
            </motion.div>
          )}

        <div className='pt-2 text-center'>
          <p className='text-xs text-gray-500'>
            💡 Dica: Adicione contatos que possam ser facilmente alcançados em
            caso de emergência (máximo {maxContacts} contatos)
          </p>
        </div>
      </div>
    </motion.div>
  );
}
