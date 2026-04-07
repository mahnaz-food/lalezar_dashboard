import { useMutation, useQuery } from '@tanstack/react-query';
import { addHeroSlide, deleteHeroSlide, getHeroSlides, reorderSlides, updateHeroSlide } from './slidersApi';
import { HeroSlideFormValues } from 'types/admin';

export const useGetHeroSlidesQuery = () => {
  return useQuery({
    queryKey: ['hero-slides'],
    queryFn: () => getHeroSlides()
  });
};

export const useAddHeroSlideMutation = () => {
  return useMutation({
    mutationKey: ['add-slide'],
    mutationFn: (data: HeroSlideFormValues) => addHeroSlide(data)
  });
};

export const useUpdateHeroSlideMutation = () => {
  return useMutation({
    mutationKey: ['update-slide'],
    mutationFn: ({ id, data }: { id: string; data: HeroSlideFormValues }) => updateHeroSlide({ id, data })
  });
};

export const useDeleteHeroSlideMutation = () => {
  return useMutation({
    mutationKey: ['delete-slide'],
    mutationFn: ({ id }: { id: string }) => deleteHeroSlide({ id })
  });
};

export const useReorderSlidesMutation = () => {
  return useMutation({
    mutationKey: ['reorder-slides'],
    mutationFn: ({ ids }: { ids: string[] }) => reorderSlides({ ids })
  });
};
