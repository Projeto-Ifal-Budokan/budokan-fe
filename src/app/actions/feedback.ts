'use server';

import { createHash } from 'node:crypto';
import { headers } from 'next/headers';

import { feedbackSchema } from '@/lib/validators/feedback';

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
 *   5. no Strapi tudo nasce rascunho: nada aparece publico sem aprovacao no painel.
 */

const STRAPI_INTERNAL_URL =
  process.env.STRAPI_URL ?? 'http://budokan-cms:1337/api';

const MIN_AGE_MS = 4_000;
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const MAX_TRACKED_IPS = 2_000;

/** janela deslizante por hash de IP; aproximada, vive no processo do Next */
const attempts = new Map<string, number[]>();

const clientIpHash = async (): Promise<string> => {
  const h = await headers();
  const forwarded = h.get('x-forwarded-for') ?? '';
  const ip = forwarded.split(',')[0]?.trim() || h.get('x-real-ip') || 'desconhecido';
  return createHash('sha256').update(ip).digest('hex').slice(0, 24);
};

const rateLimited = async (): Promise<boolean> => {
  const key = await clientIpHash();
  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_PER_WINDOW) {
    attempts.set(key, recent);
    return true;
  }

  recent.push(now);
  attempts.set(key, recent);

  // sem isso o mapa cresce para sempre num processo longo
  if (attempts.size > MAX_TRACKED_IPS) {
    for (const [ip, times] of attempts) {
      const alive = times.filter((t) => now - t < WINDOW_MS);
      if (alive.length === 0) attempts.delete(ip);
      else attempts.set(ip, alive);
    }
  }

  return false;
};

export interface FeedbackResult {
  success: boolean;
  error?: string;
}

export async function submitFeedbackAction(
  formData: FormData,
): Promise<FeedbackResult> {
  const raw = {
    authorName: formData.get('authorName'),
    discipline: formData.get('discipline'),
    rating: formData.get('rating'),
    message: formData.get('message'),
    website: formData.get('website'),
    renderedAt: formData.get('renderedAt'),
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
    authorName: raw.authorName ?? '',
    discipline: raw.discipline || 'geral',
    rating: raw.rating ?? '',
    message: raw.message ?? '',
  });
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Dados invalidos.',
    };
  }

  // 4. limite por IP
  if (await rateLimited()) {
    return {
      success: false,
      error: 'Voce ja enviou depoimentos demais hoje. Tente novamente mais tarde.',
    };
  }

  const key = process.env.STRAPI_FEEDBACK_KEY;
  if (!key) {
    console.error('feedback: STRAPI_FEEDBACK_KEY ausente, envio desativado');
    return { success: false, error: 'Envio indisponivel no momento.' };
  }

  const h = await headers();

  try {
    const response = await fetch(`${STRAPI_INTERNAL_URL}/feedbacks`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-feedback-key': key,
      },
      body: JSON.stringify({
        data: {
          authorName: parsed.data.authorName,
          discipline: parsed.data.discipline,
          rating: parsed.data.rating,
          message: parsed.data.message,
        },
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error('feedback: Strapi recusou', response.status, detail.slice(0, 200));
      return { success: false, error: 'Nao conseguimos registrar agora. Tente em instantes.' };
    }

    // nunca dizemos se foi descartado por isca ou limite: a resposta e a mesma
    return { success: true };
  } catch (error) {
    console.error('feedback: falha ao enviar ao Strapi', error);
    return { success: false, error: 'Nao conseguimos registrar agora. Tente em instantes.' };
  }
}
