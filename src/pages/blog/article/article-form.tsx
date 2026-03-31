import { AppForm, FormFieldConfig } from 'components/form/AppFrom';
import { ArticleDetails, ArticleFormValues } from 'types/blog';
import { BlockEditor } from 'components/form/BlockEditor';
import {
  useCreateArticleMutation,
  useGetBlogCategoriesQuery,
  useGetBlogTagsQuery,
  useUpdateArticleMutation
} from 'hooks/api/blog/blogHooks';
import { Option } from 'components/form/FormSingleSelect';
import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import FormSkeleton from 'components/skeleton/FormSkeleton';
import { toast } from 'sonner';
import { createArticleSchema } from '../../../../validators/blog-schema';

interface ArticleFormProps {
  article?: ArticleDetails;
  isLoading?: boolean;
  slug?: string;
}

const defaultValues: ArticleFormValues = {
  title: '',
  subtitle: '',
  readingTime: undefined,
  excerpt: '',
  metaTitle: '',
  metaDescription: '',
  image: undefined,
  content: [],
  isFeatured: false,
  isPublished: true,
  categories: [],
  tags: []
};

export default function ArticleForm({ article, isLoading, slug }: ArticleFormProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: categories, isLoading: isLoadingCategories } = useGetBlogCategoriesQuery();
  const { data: tags, isLoading: isLoadingTags } = useGetBlogTagsQuery();
  const { mutate: createArticle, isPending: isCreating } = useCreateArticleMutation();
  const { mutate: updateArticle, isPending: isUpdating } = useUpdateArticleMutation();

  const categoryOptions: Option[] = (categories ?? []).map((c) => ({
    label: c.name,
    value: c.id
  }));

  const tagOptions: Option[] = (tags ?? []).map((tag) => ({
    label: tag.name,
    value: tag.id
  }));

  const fields: FormFieldConfig<ArticleFormValues>[] = useMemo(
    () => [
      { name: 'title', label: 'Title', placeholder: 'Enter title', type: 'text', md: 4 },
      { name: 'subtitle', label: 'Subtitle', type: 'text', md: 4 },
      { name: 'metaTitle', label: 'Meta Title', type: 'text', md: 4 },
      { name: 'excerpt', label: 'Excerpt', type: 'multiLineText', md: 6 },
      { name: 'metaDescription', label: 'Meta Description', type: 'multiLineText', md: 6 },
      { name: 'image', label: 'Cover Image Url', type: 'text', md: 12 },
      { name: 'isFeatured', label: 'Is Featured', type: 'switch', md: 3 },
      { name: 'isPublished', label: 'Is Published', type: 'switch', md: 3, disabled: true },
      { name: 'readingTime', label: 'Reading Time (minutes)', type: 'number', md: 3 },
      { name: 'categories', label: 'Categories', type: 'multiselect', options: categoryOptions, disabled: isLoadingCategories, md: 6 },
      { name: 'tags', label: 'Tags', type: 'multiselect', options: tagOptions, disabled: isLoadingTags, md: 6 }
    ],
    [categoryOptions, isLoadingCategories, isLoadingTags, tagOptions]
  );

  const formValues: ArticleFormValues = useMemo(() => {
    if (!article) return defaultValues;

    return {
      title: article.title,
      subtitle: article.subtitle ?? '',
      readingTime: article.readingTime ?? undefined,
      excerpt: article.excerpt ?? '',
      metaTitle: article.metaTitle ?? '',
      metaDescription: article.metaDescription ?? '',
      image: article.image ?? undefined,
      content: article.content ?? undefined,
      isFeatured: article.isFeatured ?? false,
      isPublished: article.isPublished ?? true,
      categories: article.categories.map((c) => c.id),
      tags: article.tags.map((tag) => tag.id) ?? undefined
    };
  }, [article]);

  const onSubmit = async (data: ArticleFormValues) => {
    if (article && slug) {
      // Update mode
      updateArticle(
        { slug, data },
        {
          onSuccess: (data: { message: string }) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ['article', slug] });
          }
        }
      );
    } else {
      // Create mode
      createArticle(data, {
        onSuccess: (data: { message: string }) => {
          toast.success(data.message);
          queryClient.invalidateQueries({ queryKey: ['articles'] });
          navigate('/blog');
        }
      });
    }
  };
  return (
    <>
      {isLoading ? (
        <FormSkeleton hasBlockEditor fields={fields.map((f) => (f.md ? { md: f.md } : { md: 12 }))} />
      ) : (
        <AppForm
          fields={fields}
          defaultValues={formValues}
          onSubmit={onSubmit}
          schema={createArticleSchema}
          submitLabel={article ? 'Update Article' : 'Create Article'}
          isPending={isCreating || isUpdating}
        >
          <BlockEditor name="content" />
        </AppForm>
      )}
    </>
  );
}
