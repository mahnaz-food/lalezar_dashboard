import { z } from 'zod';

// ─── Inline Nodes ─────────────────────────────────────────────────────────────

const inlineTextNode = z.object({
  type: z.literal('text'),
  value: z.string()
});

const inlineLinkNode = z.object({
  type: z.literal('link'),
  value: z.string().min(1, 'Link text is required'),
  href: z.string().min(1, 'Link href is required'),
  external: z.boolean().optional(),
  newTab: z.boolean().optional()
});

const inlineNode = z.discriminatedUnion('type', [inlineTextNode, inlineLinkNode]);

// At least one inline node must have a non-empty value
const inlineChildren = z
  .array(inlineNode)
  .min(1)
  .refine((nodes) => nodes.some((n) => n.value.trim().length > 0), { message: 'Content is required' });

// ─── Blocks ───────────────────────────────────────────────────────────────────

const headingBlock = z.object({
  type: z.literal('heading'),
  level: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  children: inlineChildren
});

const paragraphBlock = z.object({
  type: z.literal('paragraph'),
  children: inlineChildren
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
  items: z.array(z.string().min(1, 'List item cannot be empty')).min(1, 'List must have at least one item'),
  ordered: z.boolean().optional()
});

const linkBlock = z.object({
  type: z.literal('link'),
  label: z.string().min(1, 'Link label is required'),
  href: z.string().min(1, 'Link href is required'),
  external: z.boolean().optional(),
  newTab: z.boolean().optional()
});

const dividerBlock = z.object({
  type: z.literal('divider')
});

export const blockSchema = z.discriminatedUnion('type', [
  headingBlock,
  paragraphBlock,
  quoteBlock,
  imageBlock,
  listBlock,
  linkBlock,
  dividerBlock
]);

// ─── Article ──────────────────────────────────────────────────────────────────

export const createArticleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  excerpt: z.string().optional(),
  image: z.string().url('Invalid image URL').optional().or(z.literal('')),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  content: z.array(blockSchema).optional(),
  categories: z.array(z.string().uuid('Invalid category ID')).min(1, 'Select at least one category'),
  tags: z.array(z.string().uuid('Invalid tag ID')).optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  readingTime: z.number().optional()
});
