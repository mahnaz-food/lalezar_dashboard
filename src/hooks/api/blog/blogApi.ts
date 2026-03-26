import { IPaginated } from 'types/api';
import { ArticleFormValues, IArticle, IBlogCategory, IBlogTag, IGetArticlesParams } from 'types/blog';
import axios from 'utils/axios';
import { BLOG_BASE_API_ENDPOINT } from 'utils/constants';

export const getArticles = async (params?: IGetArticlesParams): Promise<IPaginated<IArticle>> => {
  const res = await axios.get(BLOG_BASE_API_ENDPOINT, { params });
  return res.data;
};

export const getBlogCategories = async (): Promise<IBlogCategory[]> => {
  const res = await axios.get(`${BLOG_BASE_API_ENDPOINT}/categories`);
  return res.data;
};

export const getBlogTags = async (): Promise<IBlogTag[]> => {
  const res = await axios.get(`${BLOG_BASE_API_ENDPOINT}/tags`);
  return res.data;
};

export const createArticle = async (data: ArticleFormValues) => {
  const res = await axios.post(BLOG_BASE_API_ENDPOINT, data);
  return res.data;
};

export const deleteArticle = async (id: string) => {
  const res = await axios.delete(`${BLOG_BASE_API_ENDPOINT}/${id}`);
  return res.data;
};
