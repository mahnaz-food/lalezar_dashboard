import z from 'zod';
import { slideFormSchema } from '../../validators/hero-sliders-schema';

export interface Button {
  label: string;
  url: string;
  variant?: 'default' | 'outline';
}

export interface Slide {
  id: string;
  image: string;
  tag?: string;
  headline: string;
  sub?: string;
  isActive: boolean;
  buttons?: Button[];
}

export type HeroSlideFormValues = z.infer<typeof slideFormSchema>;
