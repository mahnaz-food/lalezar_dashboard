import { z } from 'zod';
import { IBaseQueryParams } from './api';
import { blockSchema, createArticleSchema } from '../../validators/blog-schema';

export interface IGetArticlesParams extends IBaseQueryParams {
  category?: string;
}

export interface ArticleSummary {
  id: string;
  title: string;
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

export type Block = z.infer<typeof blockSchema>;

export type ArticleFormValues = z.infer<typeof createArticleSchema>;

export interface ArticleDetails extends ArticleSummary {
  content: Block[];
  isFeatured: boolean;
  isPublished: boolean;
}
