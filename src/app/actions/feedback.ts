'use server';

import { createHash } from 'node:crypto';
import { headers } from 'next/headers';

import { sizedPictureUrl, verifyGoogleIdToken } from '@/lib/google-id-token';
import {
  CONSENT_VERSION,
  feedbackSchema,
  MAX_NAME,
} from '@/lib/validators/feedback';

/**
 * Entrada de feedback do site.
 *
 * O navegador fala com o Next, nunca com o Strapi. O Strapi so aceita gravacao com o
 * cabecalho X-Feedback-Key, que existe apenas aqui, dentro do container. Assim o papel
 * Public do CMS pode ate ter `create` liberado, que nao ha endpoint de escrita alcancavel
 * de fora sem a chave.
 *
 * Camadas, na ordem em que barateiam:
 *   1. isca (campo "website"): bot preenche, humano nao. Responde ok sem gravar.
 *   2. tempo minimo entre renderizar o formulario e enviar: robot nao espera.
 *   3. validacao com zod AQUI, nao no navegador: validacao de navegador e decoracao.
 *   4. limite por IP: poucas entradas por hora.
 *   5. login com Google verificado: nome e foto vem do ID token, nao do que alguem digitou.
 *   6. limite por `sub`: o IP e a camada fraca (NAT de operadora junta todo mundo no mesmo
 *      endereco), a identidade e a forte.
 *   7. no Strapi tudo nasce rascunho: nada aparece publico sem aprovacao no painel.
 *
 * A verificacao do token fica aqui, e nao no CMS, de proposito. O provider Google do
 * users-permissions faria o fluxo por redirecionamento: o navegador iria a strapi. e
 * voltaria com um JWT do Strapi, e a escrita autenticada passaria a vir do navegador — o
 * contrario exato do paragrafo acima. Aqui o Google e uma afirmacao de identidade no
 * momento do envio, nao um segundo sistema de contas: nenhuma tabela nova, nenhum JWT do
 * Strapi, e o navegador continua sem encostar no CMS.
 */

const STRAPI_INTERNAL_URL =
  process.env.STRAPI_URL ?? 'http://budokan-cms:1337/api';

/** publico por natureza (vai no bundle do navegador); nao e segredo */
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '';

const MIN_AGE_MS = 4_000;
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_IP = 3;
const MAX_PER_SUBJECT = 3;
const MAX_TRACKED_KEYS = 2_000;

/** janelas deslizantes; aproximadas, vivem no processo do Next e zeram no restart */
const byIp = new Map<string, number[]>();
const bySubject = new Map<string, number[]>();

/**
 * Janela deslizante generica. Reiniciar o container zera as janelas — aceitavel porque
 * nada aqui e controle de acesso: e custo de spam. A barreira real de publicacao e a
 * aprovacao no painel do CMS.
 */
const slidingWindowFull = (
  store: Map<string, number[]>,
  key: string,
  maxPerWindow: number
): boolean => {
  const now = Date.now();
  const recent = (store.get(key) ?? []).filter((at) => now - at < WINDOW_MS);

  if (recent.length >= maxPerWindow) {
    store.set(key, recent);
    return true;
  }

  recent.push(now);
  store.set(key, recent);

  // sem isso o mapa cresce para sempre num processo longo
  if (store.size > MAX_TRACKED_KEYS) {
    for (const [tracked, times] of store) {
      const alive = times.filter((at) => now - at < WINDOW_MS);
      if (alive.length === 0) store.delete(tracked);
      else store.set(tracked, alive);
    }
  }

  return false;
};

const clientIpHash = async (): Promise<string> => {
  const h = await headers();
  const forwarded = h.get('x-forwarded-for') ?? '';
  const ip =
    forwarded.split(',')[0]?.trim() || h.get('x-real-ip') || 'desconhecido';
  return createHash('sha256').update(ip).digest('hex').slice(0, 24);
};

export interface FeedbackResult {
  success: boolean;
  error?: string;
}

export async function submitFeedbackAction(
  formData: FormData
): Promise<FeedbackResult> {
  const raw = {
    discipline: formData.get('discipline'),
    rating: formData.get('rating'),
    message: formData.get('message'),
    consent: formData.get('consent'),
    website: formData.get('website'),
    renderedAt: formData.get('renderedAt'),
    googleCredential: formData.get('googleCredential'),
  };

  // 1. isca
  if (typeof raw.website === 'string' && raw.website.trim() !== '') {
    return { success: true };
  }

  // 2. tempo minimo
  const renderedAt = Number(raw.renderedAt);
  if (!Number.isFinite(renderedAt) || Date.now() - renderedAt < MIN_AGE_MS) {
    return { success: true };
  }

  // 3. validacao de servidor
  const parsed = feedbackSchema.safeParse({
    discipline: raw.discipline || 'geral',
    rating: raw.rating ?? '',
    message: raw.message ?? '',
    consent: raw.consent === 'on' || raw.consent === 'true',
  });
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Dados invalidos.',
    };
  }

  // 4. limite por IP, antes de gastar uma ida ao Google
  if (slidingWindowFull(byIp, await clientIpHash(), MAX_PER_IP)) {
    return {
      success: false,
      error:
        'Voce ja enviou depoimentos demais hoje. Tente novamente mais tarde.',
    };
  }

  // 5. identidade
  if (GOOGLE_CLIENT_ID === '') {
    console.error(
      'feedback: NEXT_PUBLIC_GOOGLE_CLIENT_ID ausente, envio desativado'
    );
    return { success: false, error: 'Envio indisponivel no momento.' };
  }

  const credential =
    typeof raw.googleCredential === 'string' ? raw.googleCredential : '';
  if (credential === '') {
    return {
      success: false,
      error: 'Entre com o Google para enviar seu depoimento.',
    };
  }

  let profile;
  try {
    profile = await verifyGoogleIdToken(credential, GOOGLE_CLIENT_ID);
  } catch (error) {
    console.error(
      'feedback: token do Google recusado',
      (error as Error).message
    );
    return {
      success: false,
      error: 'Nao conseguimos confirmar seu login com o Google.',
    };
  }

  // 6. limite pela identidade
  if (slidingWindowFull(bySubject, profile.sub, MAX_PER_SUBJECT)) {
    return {
      success: false,
      error:
        'Voce ja enviou depoimentos demais hoje. Tente novamente mais tarde.',
    };
  }

  const key = process.env.STRAPI_FEEDBACK_KEY;
  if (!key) {
    console.error('feedback: STRAPI_FEEDBACK_KEY ausente, envio desativado');
    return { success: false, error: 'Envio indisponivel no momento.' };
  }

  try {
    const response = await fetch(`${STRAPI_INTERNAL_URL}/feedbacks`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-feedback-key': key,
      },
      body: JSON.stringify({
        data: {
          // nome e foto vem do token verificado; o usuario nao digita nenhum dos dois
          authorName: profile.name.slice(0, MAX_NAME),
          authorPhotoUrl: sizedPictureUrl(profile.picture),
          googleSub: profile.sub,
          consentAt: new Date().toISOString(),
          consentVersion: CONSENT_VERSION,
          discipline: parsed.data.discipline,
          rating: parsed.data.rating,
          message: parsed.data.message,
        },
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error(
        'feedback: Strapi recusou',
        response.status,
        detail.slice(0, 200)
      );
      return {
        success: false,
        error: 'Nao conseguimos registrar agora. Tente em instantes.',
      };
    }

    // nunca dizemos se foi descartado por isca ou limite: a resposta e a mesma
    return { success: true };
  } catch (error) {
    console.error('feedback: falha ao enviar ao Strapi', error);
    return {
      success: false,
      error: 'Nao conseguimos registrar agora. Tente em instantes.',
    };
  }
}
