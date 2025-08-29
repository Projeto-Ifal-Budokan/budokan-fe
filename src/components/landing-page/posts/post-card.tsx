'use client';

import { Post } from '@/types/api';
import { getStrapiImageFormat } from '@/utils/image-utils';
import { decode } from 'he';
import { Calendar, Clock, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface PostCardProps {
  post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Data não disponível';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch (error) {
      return 'Data inválida';
    }
  };

  const stripHtml = (html: string | null | undefined) => {
    if (!html) return '';
    // Remove HTML tags using regex for SSR compatibility
    return html.replace(/<[^>]*>/g, '');
  };

  // Decodifica entidades HTML
  const decodedTitle = decode(post.title || '');
  const decodedExcerpt = decode(post.excerpt || '');
  const decodedAuthor = decode(post.author || '');

  const excerpt = stripHtml(decodedExcerpt).substring(0, 150) + '...';

  // Obtém a URL da imagem destacada ou usa placeholder
  const featuredImageUrl = post.featuredImage
    ? getStrapiImageFormat(post.featuredImage, 'medium')
    : '/placeholder-image.png';

  return (
    <article className='group overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 hover:shadow-xl'>
      {/* Imagem destacada ou placeholder */}
      <div className='relative h-48 overflow-hidden'>
        <Image
          src={featuredImageUrl}
          alt={
            post.featuredImage?.alternativeText ||
            decodedTitle ||
            'Imagem do post'
          }
          fill
          className='object-cover transition-transform duration-300 group-hover:scale-105'
        />
      </div>

      <div className='p-6'>
        <div className='mb-4 flex items-center gap-4 text-sm text-gray-500'>
          <div className='flex items-center gap-1'>
            <User className='h-4 w-4' />
            <span>{decodedAuthor || 'Autor desconhecido'}</span>
          </div>
          <div className='flex items-center gap-1'>
            <Calendar className='h-4 w-4' />
            <span>
              {post.publishedAt
                ? formatDate(post.publishedAt)
                : 'Data não disponível'}
            </span>
          </div>
          <div className='flex items-center gap-1'>
            <Clock className='h-4 w-4' />
            <span>{post.readingTime || 1} min de leitura</span>
          </div>
        </div>

        <h2 className='mb-3 text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-800'>
          {decodedTitle || 'Título não disponível'}
        </h2>

        <p className='mb-4 line-clamp-3 text-gray-600'>{excerpt}</p>

        {post.tags && post.tags.length > 0 && (
          <div className='mb-4 flex flex-wrap gap-2'>
            {post.tags.slice(0, 3).map((tag: string) => (
              <span
                key={tag}
                className='rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800'
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <Link
          href={`/posts/${post.documentId}`}
          className='inline-flex items-center font-medium text-blue-600 transition-colors hover:text-blue-800'
        >
          Ler mais
          <svg
            className='ml-2 h-4 w-4'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 5l7 7-7 7'
            />
          </svg>
        </Link>
      </div>
    </article>
  );
};
