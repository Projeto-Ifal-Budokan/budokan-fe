'use client';

import { usePost } from '@/lib/api/queries/use-post';
import { ArrowLeft, Calendar, Clock, Loader2, Tag, User } from 'lucide-react';
import Link from 'next/link';

interface PostDetailProps {
  slug: string;
}

export const PostDetail = ({ slug }: PostDetailProps) => {
  const { data: postResponse, isLoading, error } = usePost(slug);

  if (isLoading) {
    return (
      <section className='bg-gray-50 py-16'>
        <div className='container'>
          <div className='flex justify-center'>
            <div className='flex items-center gap-2'>
              <Loader2 className='h-6 w-6 animate-spin text-blue-600' />
              <span className='text-lg text-gray-600'>Carregando post...</span>
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
              Erro ao carregar post
            </h2>
            <p className='text-gray-600'>
              Não foi possível carregar o post no momento. Tente novamente mais
              tarde.
            </p>
            <Link
              href='/posts'
              className='mt-4 inline-flex items-center text-blue-600 hover:text-blue-800'
            >
              <ArrowLeft className='mr-2 h-4 w-4' />
              Voltar para posts
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (!postResponse?.data) {
    return (
      <section className='bg-gray-50 py-16'>
        <div className='container'>
          <div className='text-center'>
            <h2 className='mb-4 text-2xl font-bold text-gray-900'>
              Post não encontrado
            </h2>
            <p className='text-gray-600'>
              O post que você está procurando não foi encontrado.
            </p>
            <Link
              href='/posts'
              className='mt-4 inline-flex items-center text-blue-600 hover:text-blue-800'
            >
              <ArrowLeft className='mr-2 h-4 w-4' />
              Voltar para posts
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const post = postResponse.data;

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Data não disponível';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return 'Data inválida';
    }
  };

  const stripHtml = (html: string | null | undefined) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '');
  };

  return (
    <>
      {/* Hero Section */}
      <section className='relative bg-gradient-to-r from-blue-900 to-blue-800 py-20'>
        <div className='container'>
          <div className='flex flex-col items-center text-center text-white'>
            <Link
              href='/posts'
              className='absolute top-4 left-4 flex items-center text-white transition-colors hover:text-yellow-500'
            >
              <ArrowLeft className='mr-2 h-4 w-4' />
              <span>Voltar para posts</span>
            </Link>
            <h1 className='mb-4 text-4xl font-bold md:text-6xl'>
              {post.title || 'Título não disponível'}
            </h1>
            <div className='h-1 w-20 bg-yellow-500'></div>
          </div>
        </div>
      </section>

      {/* Post Content */}
      <section className='bg-white py-16'>
        <div className='container'>
          <div className='mx-auto max-w-4xl'>
            {/* Post Meta */}
            <div className='mb-8 flex flex-wrap items-center gap-6 text-sm text-gray-500'>
              <div className='flex items-center gap-2'>
                <User className='h-4 w-4' />
                <span>{post.author || 'Autor desconhecido'}</span>
              </div>
              <div className='flex items-center gap-2'>
                <Calendar className='h-4 w-4' />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
              <div className='flex items-center gap-2'>
                <Clock className='h-4 w-4' />
                <span>{post.readingTime || 1} min de leitura</span>
              </div>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className='mb-8'>
                <div className='mb-3 flex items-center gap-2'>
                  <Tag className='h-4 w-4 text-gray-500' />
                  <span className='text-sm font-medium text-gray-700'>
                    Tags:
                  </span>
                </div>
                <div className='flex flex-wrap gap-2'>
                  {post.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className='rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800'
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Excerpt */}
            {post.excerpt && (
              <div className='mb-8'>
                <p className='text-lg leading-relaxed text-gray-600'>
                  {stripHtml(post.excerpt)}
                </p>
              </div>
            )}

            {/* Content */}
            <div className='prose prose-lg max-w-none'>
              <div
                className='leading-relaxed text-gray-800'
                dangerouslySetInnerHTML={{
                  __html: post.content || '<p>Conteúdo não disponível</p>',
                }}
              />
            </div>

            {/* Post Footer */}
            <div className='mt-12 border-t border-gray-200 pt-8'>
              <div className='flex flex-wrap items-center justify-between gap-4 text-sm text-gray-500'>
                <div className='flex items-center gap-4'>
                  <span>Publicado em: {formatDate(post.publishedAt)}</span>
                  <span>Atualizado em: {formatDate(post.updatedAt)}</span>
                </div>
                <Link
                  href='/posts'
                  className='inline-flex items-center text-blue-600 transition-colors hover:text-blue-800'
                >
                  <ArrowLeft className='mr-2 h-4 w-4' />
                  Voltar para posts
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
