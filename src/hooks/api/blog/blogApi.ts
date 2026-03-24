import { IPaginated } from 'types/api';
import { IArticle, IGetArticlesParams } from 'types/blog';
import axios from 'utils/axios';
import { BLOG_BASE_API_ENDPOINT } from 'utils/constants';

export const getArticles = async (params?: IGetArticlesParams): Promise<IPaginated<IArticle>> => {
  const res = await axios.get(BLOG_BASE_API_ENDPOINT, { params });
  return res.data;
};
