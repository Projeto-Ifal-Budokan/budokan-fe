'use client';

import { useDebounce } from '@/hooks/use-debounce';
import { usePosts } from '@/lib/api/queries/use-posts';
import { Post } from '@/types/api';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Pagination } from './pagination';
import { PostCard } from './post-card';
import { SearchFilters } from './search-filters';

export const PostsList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const pageSize = 9;

  // Reset para primeira página quando mudar a busca
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  const {
    data: posts,
    isLoading,
    error,
    isFetching,
  } = usePosts({
    page: currentPage,
    pageSize,
    search: debouncedSearchTerm,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  return (
    <section className='bg-gray-50 py-16'>
      <div className='container'>
        {/* Cabeçalho - Sempre visível */}
        <div className='mb-8 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-gray-900'>
            Posts Recentes
          </h2>
          <p className='text-lg text-gray-600'>
            Confira as últimas novidades e informações sobre artes marciais
          </p>
        </div>

        {/* Filtros - Sempre visível */}
        <SearchFilters
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onClearSearch={handleClearSearch}
          isLoading={isLoading}
        />

        {/* Conteúdo - Estados condicionais */}
        <div className='mb-8 text-center'>
          {isFetching && (
            <div className='flex justify-center'>
              <div className='flex items-center gap-2'>
                <Loader2 className='h-4 w-4 animate-spin text-blue-600' />
                <span className='text-sm text-gray-600'>Atualizando...</span>
              </div>
            </div>
          )}
        </div>

        {/* Estados de Loading, Error e Conteúdo */}
        {isLoading ? (
          <div className='flex justify-center py-16'>
            <div className='flex items-center gap-2'>
              <Loader2 className='h-6 w-6 animate-spin text-blue-600' />
              <span className='text-lg text-gray-600'>Carregando posts...</span>
            </div>
          </div>
        ) : error ? (
          <div className='py-16 text-center'>
            <h2 className='mb-4 text-2xl font-bold text-gray-900'>
              Erro ao carregar posts
            </h2>
            <p className='text-gray-600'>
              Não foi possível carregar os posts no momento. Tente novamente
              mais tarde.
            </p>
          </div>
        ) : !posts?.data || posts.data.length === 0 ? (
          <div className='py-16 text-center'>
            <h2 className='mb-4 text-2xl font-bold text-gray-900'>
              {debouncedSearchTerm
                ? 'Nenhum post encontrado'
                : 'Nenhum post encontrado'}
            </h2>
            <p className='text-gray-600'>
              {debouncedSearchTerm
                ? `Nenhum post encontrado para "${debouncedSearchTerm}". Tente outros termos.`
                : 'Ainda não há posts publicados. Volte em breve!'}
            </p>
          </div>
        ) : (
          <>
            {/* Contador de resultados */}
            <div className='mb-8 text-center'>
              <p className='text-sm text-gray-500'>
                Mostrando {posts.data.length} de {posts.meta.pagination.total}{' '}
                posts
                {debouncedSearchTerm && ` para "${debouncedSearchTerm}"`}
              </p>
            </div>

            {/* Grid de posts */}
            <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
              {posts.data.map((post: Post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {/* Paginação */}
            <div className='mt-12'>
              <Pagination
                currentPage={currentPage}
                totalPages={posts.meta.pagination.pageCount}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
};
