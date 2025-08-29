import { PostsResponse } from '@/types/api';
import { api } from '../api';

export const postsService = {
  async getPosts(): Promise<PostsResponse> {
    const response = await api.get<PostsResponse>('/posts');
    return response.data;
  },
}; 