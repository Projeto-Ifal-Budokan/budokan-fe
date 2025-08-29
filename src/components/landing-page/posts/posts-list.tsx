'use client';

import { usePosts } from '@/lib/api/queries/use-posts';
import { Post } from '@/types/api';
import { Loader2 } from 'lucide-react';
import { PostCard } from './post-card';

export const PostsList = () => {
  const { data: posts, isLoading, error } = usePosts();

  if (isLoading) {
    return (
      <section className='bg-gray-50 py-16'>
        <div className='container'>
          <div className='flex justify-center'>
            <div className='flex items-center gap-2'>
              <Loader2 className='h-6 w-6 animate-spin text-blue-600' />
              <span className='text-lg text-gray-600'>Carregando posts...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className='bg-gray-50 py-16'>
        <div className='container'>
          <div className='text-center'>
            <h2 className='mb-4 text-2xl font-bold text-gray-900'>
              Erro ao carregar posts
            </h2>
            <p className='text-gray-600'>
              Não foi possível carregar os posts no momento. Tente novamente
              mais tarde.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!posts?.data || posts.data.length === 0) {
    return (
      <section className='bg-gray-50 py-16'>
        <div className='container'>
          <div className='text-center'>
            <h2 className='mb-4 text-2xl font-bold text-gray-900'>
              Nenhum post encontrado
            </h2>
            <p className='text-gray-600'>
              Ainda não há posts publicados. Volte em breve!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='bg-gray-50 py-16'>
      <div className='container'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-gray-900'>
            Posts Recentes
          </h2>
          <p className='text-lg text-gray-600'>
            Confira as últimas novidades e informações sobre artes marciais
          </p>
        </div>

        <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
          {posts.data.map((post: Post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
};
