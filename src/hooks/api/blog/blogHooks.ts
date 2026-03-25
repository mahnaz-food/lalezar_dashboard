import { useQuery } from '@tanstack/react-query';
import { getArticles, getBlogCategories, getBlogTags } from './blogApi';
import { IGetArticlesParams } from 'types/blog';

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
