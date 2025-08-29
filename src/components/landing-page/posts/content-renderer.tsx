'use client';

import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ContentRendererProps {
  content: string | null;
}

export const ContentRenderer = ({ content }: ContentRendererProps) => {
  if (!content) {
    return <p className='text-gray-500 italic'>Conteúdo não disponível</p>;
  }

  // Verifica se o conteúdo contém HTML
  const hasHtml = /<[^>]*>/g.test(content);

  // Se contém HTML, renderiza como HTML
  if (hasHtml) {
    return (
      <div
        className='prose prose-lg max-w-none leading-relaxed text-gray-800'
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  // Se não contém HTML, renderiza como Markdown
  return (
    <div className='prose prose-lg max-w-none leading-relaxed text-gray-800'>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Customiza a renderização de imagens
          img: ({ src, alt }) => {
            if (!src) return null;

            return (
              <div className='my-6 flex justify-center'>
                <div className='relative w-full max-w-2xl'>
                  <Image
                    src={src}
                    alt={alt || 'Imagem do post'}
                    width={800}
                    height={600}
                    className='rounded-lg shadow-lg'
                    style={{ width: '100%', height: 'auto' }}
                  />
                </div>
              </div>
            );
          },
          // Customiza a renderização de parágrafos
          p: ({ children, ...props }) => (
            <p className='mb-4 leading-relaxed' {...props}>
              {children}
            </p>
          ),
          // Customiza a renderização de títulos
          h1: ({ children, ...props }) => (
            <h1
              className='mt-8 mb-4 text-3xl font-bold text-gray-900'
              {...props}
            >
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2
              className='mt-6 mb-3 text-2xl font-bold text-gray-900'
              {...props}
            >
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3
              className='mt-4 mb-3 text-xl font-bold text-gray-900'
              {...props}
            >
              {children}
            </h3>
          ),
          // Customiza a renderização de listas
          ul: ({ children, ...props }) => (
            <ul className='mb-4 list-inside list-disc space-y-1' {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className='mb-4 list-inside list-decimal space-y-1' {...props}>
              {children}
            </ol>
          ),
          // Customiza a renderização de links
          a: ({ href, children, ...props }) => (
            <a
              href={href}
              className='text-blue-600 underline hover:text-blue-800'
              target='_blank'
              rel='noopener noreferrer'
              {...props}
            >
              {children}
            </a>
          ),
          // Customiza a renderização de blockquotes
          blockquote: ({ children, ...props }) => (
            <blockquote
              className='my-4 border-l-4 border-blue-500 pl-4 text-gray-700 italic'
              {...props}
            >
              {children}
            </blockquote>
          ),
          // Customiza a renderização de código
          code: ({ children, ...props }) => (
            <code
              className='rounded bg-gray-100 px-2 py-1 font-mono text-sm'
              {...props}
            >
              {children}
            </code>
          ),
          pre: ({ children, ...props }) => (
            <pre
              className='my-4 overflow-x-auto rounded-lg bg-gray-100 p-4'
              {...props}
            >
              {children}
            </pre>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
