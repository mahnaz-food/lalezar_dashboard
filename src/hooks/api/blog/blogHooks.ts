import { useQuery } from '@tanstack/react-query';
import { getArticles } from './blogApi';
import { IGetArticlesParams } from 'types/blog';

export const useGetArticlesQuery = (params?: IGetArticlesParams) => {
  const queryKey = ['articles', params?.page, params?.limit, params?.query, params?.category];
  return useQuery({
    queryKey,
    queryFn: () => getArticles(params)
  });
};
