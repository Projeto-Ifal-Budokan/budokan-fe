export interface Response {
  message: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
}

export interface StrapiImage {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    large?: {
      url: string;
      width: number;
      height: number;
    };
    small?: {
      url: string;
      width: number;
      height: number;
    };
    medium?: {
      url: string;
      width: number;
      height: number;
    };
    thumbnail?: {
      url: string;
      width: number;
      height: number;
    };
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Post {
  id: number;
  documentId: string;
  title: string | null;
  slug: string;
  content: string | null;
  excerpt: string | null;
  publishedAt: string | null;
  author: string | null;
  categories: string[];
  tags: string[];
  status: string;
  metaTitle: string | null;
  metaDescription: string | null;
  readingTime: number | null;
  createdAt: string;
  updatedAt: string;
  featuredImage?: StrapiImage | null;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface PostsResponse {
  data: Post[];
  meta: {
    pagination: PaginationMeta;
  };
}
