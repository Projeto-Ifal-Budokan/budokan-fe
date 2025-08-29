'use client';

import { usePosts } from '@/lib/api/queries/use-posts';
import { Post } from '@/types/api';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Pagination } from './pagination';
import { PostCard } from './post-card';

export const PostsList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  const {
    data: posts,
    isLoading,
    error,
    isFetching,
  } = usePosts({ page: currentPage, pageSize });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  const totalPages = posts.meta.pagination.pageCount;
  const totalPosts = posts.meta.pagination.total;

  return (
    <section className='bg-gray-50 py-16'>
      <div className='container'>
        <div className='mb-8 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-gray-900'>
            Posts Recentes
          </h2>
          <p className='text-lg text-gray-600'>
            Confira as últimas novidades e informações sobre artes marciais
          </p>
          <p className='mt-2 text-sm text-gray-500'>
            Mostrando {posts.data.length} de {totalPosts} posts
          </p>
          {isFetching && (
            <div className='mt-4 flex justify-center'>
              <div className='flex items-center gap-2'>
                <Loader2 className='h-4 w-4 animate-spin text-blue-600' />
                <span className='text-sm text-gray-600'>Atualizando...</span>
              </div>
            </div>
          )}
        </div>

        <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
          {posts.data.map((post: Post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        <div className='mt-12'>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </section>
  );
};
