import { PostDetail } from '@/components/landing-page/posts/post-detail';
import { Metadata } from 'next';

interface PostPageProps {
  params: Promise<{
    slug: string; // Este é o documentId
  }>;
}

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
      return {
        title: `${postData.data.title} - Budokan-Ryu`,
        description:
          postData.data.metaDescription ||
          postData.data.excerpt ||
          'Detalhes do post',
        openGraph: {
          title: postData.data.metaTitle || postData.data.title,
          description: postData.data.metaDescription || postData.data.excerpt,
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
