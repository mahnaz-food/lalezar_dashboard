import { z } from 'zod';
import { IBaseQueryParams } from './api';
import { createArticleSchema } from '../../validators/blog-schema';

export interface IGetArticlesParams extends IBaseQueryParams {
  category?: string;
}

export interface IArticle {
  id: string;
  title: string;
  content: Block[];
  slug: string;
  subtitle: string;
  excerpt: null | string;
  image: null | string;
  readingTime: null | number;
  views: number;
  categories: IBlogCategory[];
  tags: IBlogTag[];
  createdAt: string;
  updatedAt: string;
  metaTitle: string;
  metaDescription: string;
  author: { id: string; name: string };
  commentsCount: number;
}

export interface IBlogCategory {
  id: string;
  name: string;
  slug: string;
  articleCount: number;
}

export interface IBlogTag {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export type Block =
  | { type: 'heading'; level: 1 | 2 | 3 | 4; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'quote'; text: string; author?: string }
  | { type: 'image'; src: string; caption?: string }
  | { type: 'list'; items: string[]; ordered?: boolean }
  | { type: 'divider' };

export type ArticleFormValues = z.infer<typeof createArticleSchema>;
