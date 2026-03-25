import { z } from 'zod';

const headingBlock = z.object({
  type: z.literal('heading'),
  level: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  text: z.string().min(1, 'Heading text is required')
});

const paragraphBlock = z.object({
  type: z.literal('paragraph'),
  text: z.string().min(1, 'Paragraph text is required')
});

const quoteBlock = z.object({
  type: z.literal('quote'),
  text: z.string().min(1, 'Quote text is required'),
  author: z.string().optional()
});

const imageBlock = z.object({
  type: z.literal('image'),
  src: z.string().url('Invalid image URL'),
  caption: z.string().optional()
});

const listBlock = z.object({
  type: z.literal('list'),
  items: z.array(z.string().min(1)).min(1, 'List must have at least one item'),
  ordered: z.boolean().optional()
});

const dividerBlock = z.object({
  type: z.literal('divider')
});

export const blockSchema = z.discriminatedUnion('type', [headingBlock, paragraphBlock, quoteBlock, imageBlock, listBlock, dividerBlock]);

export const createArticleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  excerpt: z.string().optional(),
  image: z.string().url('Invalid image URL').optional(),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  content: z.array(blockSchema).optional(),
  categoryIds: z.array(z.string().uuid('Invalid category ID')).min(1, 'Select at least one category'),
  tagIds: z.array(z.string().uuid('Invalid tag ID')).optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional()
});
