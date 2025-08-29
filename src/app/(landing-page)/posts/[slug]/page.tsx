import { PostDetail } from '@/components/landing-page/posts/post-detail';
import { Metadata } from 'next';

interface PostPageProps {
  params: Promise<{
    slug: string; // Este é o documentId
  }>;
}

import { decode } from 'he';

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const response = await fetch(
      `https://strapi.budokanryu.com.br/api/posts/${slug}`
    );
    const postData = await response.json();

    if (postData.data) {
      // Decodifica entidades HTML para metadata
      const decodedTitle = decode(postData.data.title || '');
      const decodedMetaTitle = decode(postData.data.metaTitle || '');
      const decodedMetaDescription = decode(
        postData.data.metaDescription || ''
      );
      const decodedExcerpt = decode(postData.data.excerpt || '');

      return {
        title: `${decodedTitle} - Budokan-Ryu`,
        description:
          decodedMetaDescription || decodedExcerpt || 'Detalhes do post',
        openGraph: {
          title: decodedMetaTitle || decodedTitle,
          description: decodedMetaDescription || decodedExcerpt,
          url: `https://www.budokanryu.com.br/posts/${slug}`,
        },
      };
    }
  } catch (error) {
    console.error('Error fetching post metadata:', error);
  }

  return {
    title: 'Post - Budokan-Ryu',
    description: 'Detalhes do post',
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  return <PostDetail slug={slug} />;
}
