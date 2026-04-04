import { HeroSlideFormValues, Slide } from 'types/admin';
import axios from 'utils/axios';
import { HERO_SLIDES_BASE_API_ENDPOINT } from 'utils/constants';

export const getHeroSlides = async (): Promise<Slide[]> => {
  const res = await axios.get(HERO_SLIDES_BASE_API_ENDPOINT);
  return res.data;
};

export const getSingleHeroSlide = async ({ id }: { id: string }): Promise<Slide> => {
  const res = await axios.get(`${HERO_SLIDES_BASE_API_ENDPOINT}/${id}`);
  return res.data;
};

export const addHeroSlide = async (data: HeroSlideFormValues): Promise<any> => {
  const res = await axios.post(HERO_SLIDES_BASE_API_ENDPOINT, data);
  return res.data;
};

export const updateHeroSlide = async ({ id, data }: { id: string; data: HeroSlideFormValues }) => {
  const res = await axios.put(`${HERO_SLIDES_BASE_API_ENDPOINT}/${id}`, data);
  return res.data;
};

export const deleteHeroSlide = async ({ id }: { id: string }) => {
  const res = await axios.delete(`${HERO_SLIDES_BASE_API_ENDPOINT}/${id}`);
  return res.data;
};
