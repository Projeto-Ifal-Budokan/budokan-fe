import { useQuery } from '@tanstack/react-query';
import { strapiService } from '../services/strapi-service';

interface UsePostsParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export const usePosts = ({ page = 1, pageSize = 9, search = '' }: UsePostsParams = {}) => {
  return useQuery({
    queryKey: ['posts', page, pageSize, search],
    queryFn: () => strapiService.getPosts({ page, pageSize, search }),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
}; 