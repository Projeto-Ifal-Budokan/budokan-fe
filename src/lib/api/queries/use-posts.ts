import { useQuery } from '@tanstack/react-query';
import { strapiService } from '../services/strapi-service';

export const usePosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: strapiService.getPosts,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
}; 