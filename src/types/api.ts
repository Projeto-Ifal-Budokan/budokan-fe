export interface Response {
  message: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
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
