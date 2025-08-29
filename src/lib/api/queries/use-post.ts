import { Post } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { strapiService } from '../services/strapi-service';

interface PostResponse {
  data: Post;
  meta: Record<string, unknown>;
}

export const usePost = (documentId: string) => {
  return useQuery({
    queryKey: ['post', documentId],
    queryFn: () => strapiService.getPost(documentId),
    enabled: !!documentId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
}; 