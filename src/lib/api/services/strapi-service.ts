const STRAPI_BASE_URL = 'https://strapi.budokanryu.com.br/api';

interface GetPostsParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export const strapiService = {
  async getPosts({ page = 1, pageSize = 9, search = '' }: GetPostsParams = {}) {
    const params = new URLSearchParams({
      'pagination[page]': page.toString(),
      'pagination[pageSize]': pageSize.toString(),
      'populate': 'featuredImage',
    });

    // Adiciona filtros de busca se houver termo de pesquisa
    if (search.trim()) {
      // Usando OR para buscar em múltiplos campos
      params.append('filters[$or][0][title][$contains]', search);
      params.append('filters[$or][1][content][$contains]', search);
      params.append('filters[$or][2][excerpt][$contains]', search);
    }
    
    const response = await fetch(`${STRAPI_BASE_URL}/posts?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },

  async getPost(documentId: string) {
    const params = new URLSearchParams({
      'populate': 'featuredImage',
    });
    
    const response = await fetch(`${STRAPI_BASE_URL}/posts/${documentId}?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },
}; 