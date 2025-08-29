const STRAPI_BASE_URL = 'https://strapi.budokanryu.com.br/api';

export const strapiService = {
  async getPosts() {
    const response = await fetch(`${STRAPI_BASE_URL}/posts`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },
}; 