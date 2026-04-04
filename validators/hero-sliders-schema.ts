import z from 'zod';

export const slideFormSchema = z.object({
  image: z.string().min(1, 'Image is required').url('Image must be a valid URL'),
  tag: z.string().optional(),
  headline: z.string().min(6, 'Healine must be at least 6 characters'),
  sub: z.string().optional(),
  isActive: z.boolean().optional(),
  buttons: z
    .array(
      z.object({
        label: z.string().min(1, 'Button label is required'),
        url: z.string().min(1, 'URL is requried'),
        variant: z.enum(['default', 'outline']).optional()
      })
    )
    .optional()
});

export const reorderSlidesSchema = z
  .object({
    slides: z
      .array(
        z.object({
          id: z.string().uuid('Invalid slide ID'),
          order: z.number().int().min(0, 'Order must be 0 or greater')
        })
      )
      .min(1, 'At least one slide is required')
  })
  .refine(
    (data) => {
      const orders = data.slides.map((s) => s.order);
      return new Set(orders).size === orders.length;
    },
    { message: 'Order values must be unique', path: ['slides'] }
  );
