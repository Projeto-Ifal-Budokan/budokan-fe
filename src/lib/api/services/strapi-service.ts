const STRAPI_BASE_URL = 'https://strapi.budokanryu.com.br/api';

export const strapiService = {
  async getPosts(page: number = 1, pageSize: number = 9) {
    const params = new URLSearchParams({
      'pagination[page]': page.toString(),
      'pagination[pageSize]': pageSize.toString(),
    });
    
    const response = await fetch(`${STRAPI_BASE_URL}/posts?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },
}; 