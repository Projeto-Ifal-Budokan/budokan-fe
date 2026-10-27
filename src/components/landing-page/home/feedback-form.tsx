'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Star } from 'lucide-react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { submitFeedbackAction } from '@/app/actions/feedback';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DISCIPLINE_OPTIONS,
  feedbackSchema,
  MAX_MESSAGE,
  type FeedbackFormValues,
  type FeedbackPayload,
} from '@/lib/validators/feedback';

const inputClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none';

const labelClass = 'mb-1 block text-sm font-medium text-gray-700';

export const FeedbackForm = () => {
  const [open, setOpen] = useState(false);
  const renderedAt = useRef('');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FeedbackFormValues, unknown, FeedbackPayload>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: { authorName: '', discipline: 'geral', rating: '', message: '' },
  });

  const rating = watch('rating');

  const openDialog = () => {
    // carimbo usado na acao para descartar envio instantaneo (bot nao espera)
    renderedAt.current = String(Date.now());
    setOpen(true);
  };

  const onSubmit = async (values: FeedbackPayload) => {
    const formData = new FormData();
    formData.set('authorName', values.authorName);
    formData.set('discipline', values.discipline);
    formData.set('rating', values.rating === null ? '' : String(values.rating));
    formData.set('message', values.message);
    formData.set('renderedAt', renderedAt.current);

    const result = await submitFeedbackAction(formData);

    // a mensagem e sempre a mesma: dizer "recebido" tambem no caso da isca preenchida
    // evita que um bot aprenda qual campo o denunciou
    toast.success('Recebemos seu depoimento. Ele aparece aqui depois de aprovado.');
    setOpen(false);
    reset();

    if (!result.success && result.error) {
      toast.error(result.error);
    }
  };

  return (
    <>
      <div className='mt-10 text-center'>
        <Button onClick={openDialog} className='bg-blue-900 px-8 text-white hover:bg-blue-800'>
          Deixe seu depoimento
        </Button>
        <p className='mt-3 text-sm text-gray-500'>
          Seu depoimento passa por aprovacao antes de aparecer no site.
        </p>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='max-w-lg'>
          <DialogHeader>
            <DialogTitle className='text-blue-900'>Deixe seu depoimento</DialogTitle>
            <DialogDescription>
              Conte como esta sendo sua experiencia na Budokan-Ryu.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div>
              <label htmlFor='feedback-name' className={labelClass}>
                Seu nome
              </label>
              <input
                id='feedback-name'
                {...register('authorName')}
                className={inputClass}
                maxLength={60}
              />
              {errors.authorName && (
                <p className='mt-1 text-sm text-red-600'>{errors.authorName.message}</p>
              )}
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label htmlFor='feedback-discipline' className={labelClass}>
                  Modalidade
                </label>
                <select id='feedback-discipline' {...register('discipline')} className={inputClass}>
                  {DISCIPLINE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className={labelClass}>Nota (opcional)</span>
                <div className='flex gap-1 pt-1'>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type='button'
                      aria-label={`Nota ${value}`}
                      onClick={() => setValue('rating', value, { shouldValidate: true })}
                      className='text-amber-500'
                    >
                      <Star
                        className={
                          typeof rating === 'number' && rating >= value
                            ? 'fill-amber-400'
                            : 'text-gray-300'
                        }
                        size={22}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor='feedback-message' className={labelClass}>
                Depoimento
              </label>
              <textarea
                id='feedback-message'
                rows={4}
                maxLength={MAX_MESSAGE}
                {...register('message')}
                className={inputClass}
              />
              {errors.message ? (
                <p className='mt-1 text-sm text-red-600'>{errors.message.message}</p>
              ) : (
                <p className='mt-1 text-xs text-gray-400'>Entre 20 e {MAX_MESSAGE} caracteres.</p>
              )}
            </div>

            {/* isca anti-bot: humano nao ve e nao preenche; bot preenche e e descartado */}
            <input
              type='text'
              name='website'
              tabIndex={-1}
              autoComplete='off'
              aria-hidden='true'
              className='hidden'
            />

            <div className='flex justify-end gap-3 pt-2'>
              <Button type='button' variant='outline' onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type='submit' disabled={isSubmitting} className='bg-blue-900 text-white hover:bg-blue-800'>
                {isSubmitting ? 'Enviando...' : 'Enviar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
