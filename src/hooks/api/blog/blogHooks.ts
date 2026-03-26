import { useMutation, useQuery } from '@tanstack/react-query';
import { createArticle, deleteArticle, getArticles, getBlogCategories, getBlogTags } from './blogApi';
import { ArticleFormValues, IGetArticlesParams } from 'types/blog';

export const useGetArticlesQuery = (params?: IGetArticlesParams) => {
  const queryKey = ['articles', params?.page, params?.limit, params?.query, params?.category];
  return useQuery({
    queryKey,
    queryFn: () => getArticles(params)
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

export const useDeleteArticleMutation = () => {
  const mutationKey = ['delete-article'];
  return useMutation({
    mutationKey,
    mutationFn: ({ id }: { id: string }) => deleteArticle({ id })
  });
};
