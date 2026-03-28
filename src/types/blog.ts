import { z } from 'zod';
import { IBaseQueryParams } from './api';
import { blockSchema, createArticleCategorySchema, createArticleSchema, createArticleTagSchema } from '../../validators/blog-schema';

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
  categories: BlogCategory[];
  tags: BlogTag[];
  createdAt: string;
  updatedAt: string;
  metaTitle: string;
  metaDescription: string;
  author: { id: string; name: string };
  commentsCount: number;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  articleCount: number;
}

export interface BlogTag {
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

export type ArticleCategoryFormValues = z.infer<typeof createArticleCategorySchema>;
export type ArticleTagFormValues = z.infer<typeof createArticleTagSchema>;
