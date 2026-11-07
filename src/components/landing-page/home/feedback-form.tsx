'use client';

import type { ZodError } from 'zod';

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
import { Progress } from '@/components/ui/progress';
import {
  CONSENT_TEXT,
  DISCIPLINE_OPTIONS,
  feedbackSchema,
  MAX_MESSAGE,
  stepOneSchema,
  type FeedbackFormValues,
} from '@/lib/validators/feedback';

const inputClass =
  'w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none';

const labelClass = 'mb-1 block text-sm font-medium text-gray-700';

// o textarea precisa de altura propria: rows={6} sozinho da ~90px, e em 1000 caracteres isso e
// um espaco de escrita menor que um tweet. resize-y deixa a pessoa puxar; min-h em dvh nenhum,
// so px, porque aqui dentro do modal o que importa e caber junto dos botoes de baixo.
const textareaClass = `${inputClass} min-h-28 resize-y sm:min-h-40`;

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
  /** esquece a escolha anterior — sem isso, "usar outra conta" volta para a mesma conta */
  disableAutoSelect?: () => void;
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

/**
 * O botao que abre o formulario, e o formulario em duas etapas.
 *
 * Duas etapas porque o formulario antigo empilhava login, modalidade, nota, texto e
 * autorizacao de uma vez: a pessoa via o Google pedir a conta dela antes de ter escrito
 * qualquer coisa, que e exatamente a ordem que faz recuar. Agora ela conta a experiencia
 * primeiro e so depois decide se assina com a conta — e a etapa dois mostra o espelho do
 * que vai ser publicado, com nome e foto, antes de apertar Enviar.
 *
 * A validacao acompanha a divisao (veja `stepOneSchema`): cobrar o aceite na tela onde ainda
 * nao se falou em identidade mostra erro sobre algo que a pessoa ainda nao viu.
 */
export const FeedbackForm = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [signedIn, setSignedIn] = useState<SignedIn | null>(null);
  const [credential, setCredential] = useState('');
  const [gsiUnavailable, setGsiUnavailable] = useState(false);
  const renderedAt = useRef('');
  const buttonRef = useRef<HTMLDivElement>(null);

  /**
   * Sem resolver do zod no useForm: com resolver, cada envio conferia o formulario inteiro,
   * inclusive o aceite, e a primeira etapa mostraria erro de autorizacao antes de a pessoa
   * chegar nela. As regras continuam no mesmo `feedbackSchema` — o que mudou e o momento
   * em que cada metade dele e aplicada.
   */
  const {
    register,
    handleSubmit,
    setError,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FeedbackFormValues>({
    defaultValues: {
      discipline: 'geral',
      rating: '',
      message: '',
      consent: false,
    },
  });

  const rating = watch('rating');
  const message = watch('message');

  const applyIssues = (error: ZodError) => {
    for (const issue of error.issues) {
      const field = issue.path[0];
      if (typeof field === 'string') {
        setError(
          field as keyof FeedbackFormValues,
          { message: issue.message },
          { shouldFocus: true }
        );
      }
    }
  };

  const openDialog = () => {
    // carimbo usado na acao para descartar envio instantaneo (bot nao espera)
    renderedAt.current = String(Date.now());
    setStep(1);
    setOpen(true);
  };

  const changeOpen = (next: boolean) => {
    setOpen(next);
    // fechar pelo X ou pelo Esc nao pode deixar a pessoa na etapa 2 da ultima vez
    if (!next) setStep(1);
  };

  /**
   * O botao do Google e renderizado na segunda etapa, quando o container existe e ainda nao
   * ha conta escolhida. O callback recebe o ID token ja assinado pela conta que a pessoa
   * escolheu — nome e foto vem dai, e o servidor confere. Nada de campo de nome: digitado,
   * seria nome de terceiros.
   */
  useEffect(() => {
    if (!open || step !== 2 || signedIn || GOOGLE_CLIENT_ID === '') return;

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
  }, [open, step, signedIn]);

  const useAnotherAccount = () => {
    window.google?.accounts?.id?.disableAutoSelect?.();
    setCredential('');
    setSignedIn(null);
  };

  const onStepOne = (values: FeedbackFormValues) => {
    const result = stepOneSchema.safeParse(values);
    if (!result.success) {
      applyIssues(result.error);
      return;
    }
    setStep(2);
  };

  const onSubmit = async (values: FeedbackFormValues) => {
    const result = feedbackSchema.safeParse(values);
    if (!result.success) {
      applyIssues(result.error);
      // erro em campo da primeira etapa devolve para la; erro no aceite fica onde o aceite esta
      const field = result.error.issues[0]?.path[0];
      setStep(field === 'consent' ? 2 : 1);
      return;
    }

    if (credential === '') {
      toast.error('Confirme sua conta no Google para enviar.');
      return;
    }

    const formData = new FormData();
    formData.set('discipline', result.data.discipline);
    formData.set(
      'rating',
      result.data.rating === null ? '' : String(result.data.rating)
    );
    formData.set('message', result.data.message);
    formData.set('consent', result.data.consent ? 'true' : '');
    formData.set('renderedAt', renderedAt.current);
    formData.set('googleCredential', credential);

    const response = await submitFeedbackAction(formData);

    // a mensagem e sempre a mesma: dizer "recebido" tambem no caso da isca preenchida
    // evita que um bot aprenda qual campo o denunciou
    toast.success(
      'Recebemos seu depoimento. Ele aparece aqui depois de aprovado.'
    );
    setOpen(false);
    reset();
    setCredential('');
    setSignedIn(null);
    setStep(1);

    if (!response.success && response.error) {
      toast.error(response.error);
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
      </div>

      <Dialog open={open} onOpenChange={changeOpen}>
        {/* so o variant sm e sobrescrito, de proposito. cn() usa tailwind-merge e dedup por
            grupo, nao por valor: passar um max-w sem variant derrubaria o
            max-w-[calc(100%-2rem)] da base, que e o que da a folga de cada lado em celular —
            foi exatamente assim que o modal ficou colado na borda. sm:max-w-xl e de outro
            grupo, entao o teto do desktop sobe para 576px e a folga do celular fica intacta. */}
        <DialogContent className='sm:max-w-xl'>
          <DialogHeader className='space-y-2'>
            <p className='text-xs font-semibold tracking-widest text-blue-700 uppercase'>
              Etapa {step} de 2
            </p>
            <DialogTitle className='text-blue-900'>
              Deixe seu depoimento
            </DialogTitle>
            <DialogDescription>
              {step === 1
                ? 'Conte como está sendo sua experiência na Budokan-Ryu.'
                : 'Confirme com o Google para assinar o que você escreveu.'}
            </DialogDescription>
            <Progress
              value={step === 1 ? 50 : 100}
              className='mt-1 h-1.5 bg-blue-100'
            />
          </DialogHeader>

          <form
            onSubmit={handleSubmit(step === 1 ? onStepOne : onSubmit)}
            className='space-y-5'
          >
            {step === 1 ? (
              <>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
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
                    <div className='flex gap-0.5 pt-0.5'>
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          type='button'
                          aria-label={`Nota ${value} de 5`}
                          onClick={() =>
                            setValue(
                              'rating',
                              rating === value ? '' : value,
                              { shouldValidate: true }
                            )
                          }
                          className='rounded-md p-2 text-amber-500'
                        >
                          <Star
                            className={
                              typeof rating === 'number' && rating >= value
                                ? 'fill-amber-400'
                                : 'text-gray-300'
                            }
                            size={26}
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
                    rows={6}
                    maxLength={MAX_MESSAGE}
                    {...register('message')}
                    className={textareaClass}
                  />
                  <div className='mt-1 flex items-center justify-between gap-3'>
                    {errors.message ? (
                      <p className='text-sm text-red-600'>
                        {errors.message.message}
                      </p>
                    ) : (
                      <p className='text-xs text-gray-400'>
                        Entre 20 e {MAX_MESSAGE} caracteres.
                      </p>
                    )}
                    <span className='text-xs text-gray-400'>
                      {typeof message === 'string' ? message.length : 0}/
                      {MAX_MESSAGE}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className='rounded-lg border border-gray-200 bg-gray-50 p-4'>
                  {GOOGLE_CLIENT_ID === '' || gsiUnavailable ? (
                    <p className='rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800'>
                      Login com o Google indisponível no momento, então não dá
                      para enviar depoimento.
                    </p>
                  ) : signedIn ? (
                    <div className='flex flex-wrap items-center gap-3'>
                      {/* img simples, nao next/image: a foto e servida pelo Google, e cada
                          dominio novo no next.config e uma chance a mais de quebrar o build */}
                      {signedIn.picture && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={signedIn.picture}
                          alt=''
                          width={48}
                          height={48}
                          className='h-12 w-12 shrink-0 rounded-full object-cover'
                        />
                      )}
                      <div className='min-w-0'>
                        <p className='truncate font-medium text-gray-800'>
                          {signedIn.name}
                        </p>
                        <p className='text-xs text-gray-500'>
                          É este nome e esta foto que vão aparecer junto do
                          depoimento, depois da aprovação.
                        </p>
                      </div>
                      <button
                        type='button'
                        onClick={useAnotherAccount}
                        className='ml-auto shrink-0 text-sm text-blue-700 underline-offset-2 hover:underline'
                      >
                        usar outra conta
                      </button>
                    </div>
                  ) : (
                    <div className='space-y-3'>
                      <p className='text-sm text-gray-600'>
                        Não criamos conta em lugar nenhum: usamos nome e foto da
                        sua conta só para assinar este depoimento aqui no site.
                      </p>
                      <div ref={buttonRef} className='flex justify-center' />
                    </div>
                  )}
                </div>

                <label className='flex items-start gap-2 text-sm text-gray-600'>
                  <input
                    type='checkbox'
                    {...register('consent')}
                    className='mt-1 size-4 shrink-0'
                  />
                  <span>{CONSENT_TEXT}</span>
                </label>
                {errors.consent && (
                  <p className='text-sm text-red-600'>
                    {errors.consent.message}
                  </p>
                )}
              </>
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

            <div className='flex flex-col-reverse gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3'>
              {step === 1 ? (
                <Button
                  type='button'
                  variant='ghost'
                  onClick={() => setOpen(false)}
                  className='w-full sm:w-auto'
                >
                  Cancelar
                </Button>
              ) : (
                <Button
                  type='button'
                  variant='ghost'
                  onClick={() => setStep(1)}
                  className='w-full sm:w-auto'
                >
                  Voltar
                </Button>
              )}
              {step === 1 ? (
                <Button
                  type='submit'
                  className='w-full bg-blue-900 px-6 text-white hover:bg-blue-800 sm:w-auto'
                >
                  Continuar
                </Button>
              ) : (
                <Button
                  type='submit'
                  disabled={isSubmitting || credential === ''}
                  className='w-full bg-blue-900 px-6 text-white hover:bg-blue-800 disabled:bg-blue-300 sm:w-auto'
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar depoimento'}
                </Button>
              )}
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
