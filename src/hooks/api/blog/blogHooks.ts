import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createArticle,
  createCategory,
  deleteArticle,
  deleteCategory,
  getArticleBySlug,
  getArticles,
  getBlogCategories,
  getBlogTags,
  updateArticle,
  updateCategory
} from './blogApi';
import { ArticleCategoryFormValues, ArticleFormValues, IGetArticlesParams } from 'types/blog';

export const useGetArticlesQuery = (params?: IGetArticlesParams) => {
  const queryKey = ['articles', params?.page, params?.limit, params?.query, params?.category];
  return useQuery({
    queryKey,
    queryFn: () => getArticles(params)
  });
};

export const useGetArticleBySlugQuery = ({ slug }: { slug?: string }) => {
  return useQuery({
    queryKey: ['article', slug],
    queryFn: () => {
      if (!slug) throw new Error('slug is required');
      return getArticleBySlug({ slug });
    },
    enabled: !!slug
  });
};

export const useGetBlogCategoriesQuery = () => {
  const queryKey = ['blog-categories'];
  return useQuery({
    queryKey,
    queryFn: () => getBlogCategories()
  });
};

export const useGetBlogTagsQuery = () => {
  const queryKey = ['blog-tags'];
  return useQuery({
    queryKey,
    queryFn: () => getBlogTags()
  });
};

export const useCreateArticleMutation = () => {
  const mutationKey = ['create-article'];
  return useMutation({
    mutationKey,
    mutationFn: (data: ArticleFormValues) => createArticle(data)
  });
};

export const useUpdateArticleMutation = () => {
  return useMutation({
    mutationKey: ['update-article'],
    mutationFn: ({ slug, data }: { slug: string; data: ArticleFormValues }) => updateArticle({ slug, data })
  });
};

export const useDeleteArticleMutation = () => {
  const mutationKey = ['delete-article'];
  return useMutation({
    mutationKey,
    mutationFn: ({ id }: { id: string }) => deleteArticle({ id })
  });
};

export const useCreateArticleCategoryMutation = () => {
  return useMutation({
    mutationKey: ['create-article-category'],
    mutationFn: (data: ArticleCategoryFormValues) => createCategory(data)
  });
};

export const useUpdateArticleCategoryMutation = () => {
  return useMutation({
    mutationKey: ['update-article-category'],
    mutationFn: ({ id, data }: { id: string; data: ArticleCategoryFormValues }) => updateCategory({ id, data })
  });
};

export const useDeleteArticleCategoryMutation = () => {
  return useMutation({
    mutationKey: ['delete-article-category'],
    mutationFn: ({ id }: { id: string }) => deleteCategory({ id })
  });
};
