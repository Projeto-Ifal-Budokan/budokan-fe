import { useQuery } from '@tanstack/react-query';
import { strapiService } from '../services/strapi-service';

interface UsePostsParams {
  page?: number;
  pageSize?: number;
}

export const usePosts = ({ page = 1, pageSize = 9 }: UsePostsParams = {}) => {
  return useQuery({
    queryKey: ['posts', page, pageSize],
    queryFn: () => strapiService.getPosts(page, pageSize),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
}; 