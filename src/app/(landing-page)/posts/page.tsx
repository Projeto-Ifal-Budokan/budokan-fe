import { HeroSection } from '@/components/landing-page/posts/hero';
import { PostsList } from '@/components/landing-page/posts/posts-list';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - Budokan-Ryu',
  description:
    'Fique por dentro das novidades, eventos e informações sobre artes marciais na Budokan-Ryu',
  openGraph: {
    title: 'Blog - Budokan-Ryu',
    description:
      'Fique por dentro das novidades, eventos e informações sobre artes marciais na Budokan-Ryu',
    url: 'https://www.budokanryu.com.br/posts',
  },
};

export default function Posts() {
  return (
    <>
      <HeroSection />
      <PostsList />
    </>
  );
}
