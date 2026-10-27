/**
 * Leitura dos feedbacks publicados.
 *
 * Roda no servidor do Next, direto pelo alias interno do Strapi na rede swag_default.
 * Isso importa por dois motivos: o site nao depende do dominio publico strapi. estar no
 * ar para mostrar depoimentos, e o navegador nunca fala com o CMS.
 */

export interface PublishedFeedback {
  id: string;
  authorName: string;
  discipline: string;
  rating: number | null;
  message: string;
  publishedAt: string | null;
}

const STRAPI_INTERNAL_URL =
  process.env.STRAPI_URL ?? 'http://budokan-cms:1337/api';

const DISCIPLINE_LABEL: Record<string, string> = {
  karate: 'Karate-Do',
  kendo: 'Kendo',
  archery: 'Arquearia',
  geral: 'Budokan-Ryu',
};

export const disciplineLabel = (value: string): string =>
  DISCIPLINE_LABEL[value] ?? 'Budokan-Ryu';

export async function getPublishedFeedbacks(
  limit = 6,
): Promise<PublishedFeedback[]> {
  const params = new URLSearchParams();
  params.append('pagination[page]', '1');
  params.append('pagination[pageSize]', String(limit));
  params.append('sort', 'publishedAt:desc');
  // redundante com o middleware do Strapi, mas diz o que queremos: se alguem remover o
  // middleware la, o site continua mostrando so o que foi aprovado
  params.append('status', 'published');
  for (const field of ['authorName', 'discipline', 'rating', 'message', 'publishedAt']) {
    params.append('fields', field);
  }

  try {
    const response = await fetch(
      `${STRAPI_INTERNAL_URL}/feedbacks?${params.toString()}`,
      // o painel aprova quando quer; 5 minutos para aparecer no site e suficiente
      { next: { revalidate: 300 } },
    );

    if (!response.ok) {
      console.error('feedbacks: Strapi respondeu', response.status);
      return [];
    }

    const payload = (await response.json()) as {
      data?: Array<Record<string, unknown>>;
    };

    return (payload.data ?? []).map((item) => ({
      id: String(item.documentId ?? item.id ?? ''),
      authorName: String(item.authorName ?? ''),
      discipline: String(item.discipline ?? 'geral'),
      rating: typeof item.rating === 'number' ? item.rating : null,
      message: String(item.message ?? ''),
      publishedAt: item.publishedAt ? String(item.publishedAt) : null,
    }));
  } catch (error) {
    // sem CMS no ar a pagina continua servindo, so sem depoimentos
    console.error('feedbacks: falha ao consultar o Strapi', error);
    return [];
  }
}
