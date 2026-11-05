'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Star } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
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
  CONSENT_TEXT,
  DISCIPLINE_OPTIONS,
  feedbackSchema,
  MAX_MESSAGE,
  type FeedbackFormValues,
  type FeedbackPayload,
} from '@/lib/validators/feedback';

const inputClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none';

const labelClass = 'mb-1 block text-sm font-medium text-gray-700';

/** publico: entra no bundle do navegador, o Google trata assim. nao e segredo */
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '';

interface GsiCredentialResponse {
  credential?: string;
}

interface GsiId {
  initialize: (options: {
    client_id: string;
    callback: (response: GsiCredentialResponse) => void;
    ux_mode?: 'popup' | 'redirect';
  }) => void;
  renderButton: (
    parent: HTMLElement,
    options: { theme?: string; size?: string; text?: string; shape?: string }
  ) => void;
}

declare global {
  interface Window {
    google?: { accounts?: { id?: GsiId } };
  }
}

/**
 * Decodifica a carga de um JWT no navegador, so para exibir.
 *
 * TextDecoder importa porque nome com acento vem como UTF-8: atob sozinho devolve latin1 e
 * "Jose Aparecido" viraria mojibake no espelho do que a pessoa vai publicar.
 */
const decodeJwtPayload = (segment: string): string => {
  const binary = atob(segment.replace(/-/g, '+').replace(/_/g, '/'));
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

/** o script do Google e carregado uma vez por pagina, nao por abertura de dialog */
let gsiLoader: Promise<void> | null = null;

const loadGsi = (): Promise<void> => {
  if (typeof window === 'undefined')
    return Promise.reject(new Error('sem window'));
  if (window.google?.accounts?.id) return Promise.resolve();

  if (!gsiLoader) {
    gsiLoader = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => {
        gsiLoader = null;
        reject(new Error('nao foi possivel carregar o login do Google'));
      };
      document.head.appendChild(script);
    });
  }

  return gsiLoader;
};

interface SignedIn {
  name: string;
  picture: string;
}

export const FeedbackForm = () => {
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState<SignedIn | null>(null);
  const [credential, setCredential] = useState('');
  const [gsiUnavailable, setGsiUnavailable] = useState(false);
  const renderedAt = useRef('');
  const buttonRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FeedbackFormValues, unknown, FeedbackPayload>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      discipline: 'geral',
      rating: '',
      message: '',
      consent: false,
    },
  });

  const rating = watch('rating');
  const consent = watch('consent');

  const openDialog = () => {
    // carimbo usado na acao para descartar envio instantaneo (bot nao espera)
    renderedAt.current = String(Date.now());
    setOpen(true);
  };

  /**
   * O botao do Google e renderizado quando o dialog monta: o container so existe ai.
   * O callback recebe o ID token ja assinado pela conta que a pessoa escolheu — nome e foto
   * vem dai, e o servidor confere. Nada de campo de nome: digitado, seria nome de terceiros.
   */
  useEffect(() => {
    if (!open || GOOGLE_CLIENT_ID === '') return;

    loadGsi()
      .then(() => {
        const gsi = window.google?.accounts?.id;
        const container = buttonRef.current;
        if (!gsi || !container) {
          setGsiUnavailable(true);
          return;
        }

        gsi.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => {
            const token = response.credential ?? '';
            if (token === '') {
              toast.error('O Google nao devolveu seu login. Tente de novo.');
              return;
            }
            setCredential(token);
            // decodifica so a carga para exibir — a confianca esta na verificacao do
            // servidor, esta aqui e espelho para a pessoa ver o que vai publicar
            try {
              const payload = JSON.parse(
                decodeJwtPayload(token.split('.')[1])
              ) as { name?: string; picture?: string };
              setSignedIn({
                name: payload.name ?? '',
                picture: payload.picture ?? '',
              });
            } catch {
              setSignedIn({ name: '', picture: '' });
            }
          },
        });

        container.innerHTML = '';
        gsi.renderButton(container, {
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'pill',
        });
      })
      .catch(() => setGsiUnavailable(true));
  }, [open]);

  const onSubmit = async (values: FeedbackPayload) => {
    if (credential === '') {
      toast.error('Entre com o Google para enviar.');
      return;
    }

    const formData = new FormData();
    formData.set('discipline', values.discipline);
    formData.set('rating', values.rating === null ? '' : String(values.rating));
    formData.set('message', values.message);
    formData.set('consent', values.consent ? 'true' : '');
    formData.set('renderedAt', renderedAt.current);
    formData.set('googleCredential', credential);

    const result = await submitFeedbackAction(formData);

    // a mensagem e sempre a mesma: dizer "recebido" tambem no caso da isca preenchida
    // evita que um bot aprenda qual campo o denunciou
    toast.success(
      'Recebemos seu depoimento. Ele aparece aqui depois de aprovado.'
    );
    setOpen(false);
    reset();
    setCredential('');
    setSignedIn(null);

    if (!result.success && result.error) {
      toast.error(result.error);
    }
  };

  return (
    <>
      <div className='mt-10 text-center'>
        <Button
          onClick={openDialog}
          className='bg-blue-900 px-8 text-white hover:bg-blue-800'
        >
          Deixe seu depoimento
        </Button>
        <p className='mt-3 text-sm text-gray-500'>
          Entre com o Google. Seu depoimento passa por aprovacao antes de
          aparecer no site.
        </p>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='max-w-lg'>
          <DialogHeader>
            <DialogTitle className='text-blue-900'>
              Deixe seu depoimento
            </DialogTitle>
            <DialogDescription>
              Conte como esta sendo sua experiencia na Budokan-Ryu.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div>
              <span className={labelClass}>Login com o Google</span>
              {GOOGLE_CLIENT_ID === '' || gsiUnavailable ? (
                <p className='rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800'>
                  Login com o Google indisponivel no momento, entao nao da para
                  enviar depoimento.
                </p>
              ) : signedIn ? (
                <div className='flex items-center gap-3 rounded-md border border-gray-200 p-3'>
                  {/* img simples, nao next/image: a foto e servida pelo CMS, e cada dominio
                      novo no next.config e uma chance a mais de quebrar o build */}
                  {signedIn.picture && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={signedIn.picture}
                      alt=''
                      width={48}
                      height={48}
                      className='h-12 w-12 rounded-full object-cover'
                    />
                  )}
                  <span className='text-sm text-gray-700'>{signedIn.name}</span>
                </div>
              ) : (
                <div ref={buttonRef} />
              )}
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label htmlFor='feedback-discipline' className={labelClass}>
                  Modalidade
                </label>
                <select
                  id='feedback-discipline'
                  {...register('discipline')}
                  className={inputClass}
                >
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
                      onClick={() =>
                        setValue('rating', value, { shouldValidate: true })
                      }
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
                <p className='mt-1 text-sm text-red-600'>
                  {errors.message.message}
                </p>
              ) : (
                <p className='mt-1 text-xs text-gray-400'>
                  Entre 20 e {MAX_MESSAGE} caracteres.
                </p>
              )}
            </div>

            <label className='flex items-start gap-2 text-sm text-gray-600'>
              <input
                type='checkbox'
                {...register('consent')}
                className='mt-1'
              />
              <span>{CONSENT_TEXT}</span>
            </label>
            {errors.consent && (
              <p className='text-sm text-red-600'>{errors.consent.message}</p>
            )}

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
              <Button
                type='button'
                variant='outline'
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type='submit'
                disabled={isSubmitting || credential === '' || consent !== true}
                className='bg-blue-900 text-white hover:bg-blue-800'
              >
                {isSubmitting ? 'Enviando...' : 'Enviar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
