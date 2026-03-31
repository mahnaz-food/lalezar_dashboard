import { Paginated } from 'types/api';
import {
  ArticleCategoryFormValues,
  ArticleDetails,
  ArticleFormValues,
  ArticleSummary,
  ArticleTagFormValues,
  BlogCategory,
  BlogTag,
  GetArticlesParams
} from 'types/blog';
import axios from 'utils/axios';
import { BLOG_BASE_API_ENDPOINT } from 'utils/constants';

export const getArticles = async (params?: GetArticlesParams): Promise<Paginated<ArticleSummary>> => {
  const res = await axios.get(BLOG_BASE_API_ENDPOINT, { params });
  return res.data;
};

export const getArticleBySlug = async ({ slug }: { slug: string }): Promise<ArticleDetails> => {
  const res = await axios.get(`${BLOG_BASE_API_ENDPOINT}/${slug}`);
  return res.data;
};

export const getBlogCategories = async (): Promise<BlogCategory[]> => {
  const res = await axios.get(`${BLOG_BASE_API_ENDPOINT}/categories`);
  return res.data;
};

export const getBlogTags = async (): Promise<BlogTag[]> => {
  const res = await axios.get(`${BLOG_BASE_API_ENDPOINT}/tags`);
  return res.data;
};

export const createArticle = async (data: ArticleFormValues) => {
  const res = await axios.post(BLOG_BASE_API_ENDPOINT, data);
  return res.data;
};

export const updateArticle = async ({ slug, data }: { slug: string; data: ArticleFormValues }) => {
  const res = await axios.put(`${BLOG_BASE_API_ENDPOINT}/${slug}`, data);
  return res.data;
};

export const deleteArticle = async ({ id }: { id: string }) => {
  const res = await axios.delete(`${BLOG_BASE_API_ENDPOINT}/${id}`);
  return res.data;
};

export const createCategory = async (data: ArticleCategoryFormValues) => {
  const res = await axios.post(`${BLOG_BASE_API_ENDPOINT}/categories`, data);
  return res.data;
};

export const updateCategory = async ({ id, data }: { id: string; data: ArticleCategoryFormValues }) => {
  const res = await axios.put(`${BLOG_BASE_API_ENDPOINT}/categories/${id}`, data);
  return res.data;
};

export const deleteCategory = async ({ id }: { id: string }) => {
  const res = await axios.delete(`${BLOG_BASE_API_ENDPOINT}/categories/${id}`);
  return res.data;
};

export const createTag = async (data: ArticleTagFormValues) => {
  const res = await axios.post(`${BLOG_BASE_API_ENDPOINT}/tags`, data);
  return res.data;
};

export const updateTag = async ({ id, data }: { id: string; data: ArticleTagFormValues }) => {
  const res = await axios.put(`${BLOG_BASE_API_ENDPOINT}/tags/${id}`, data);
  return res.data;
};

export const deleteTag = async ({ id }: { id: string }) => {
  const res = await axios.delete(`${BLOG_BASE_API_ENDPOINT}/tags/${id}`);
  return res.data;
};
