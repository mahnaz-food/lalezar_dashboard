import { AppForm, FormFieldConfig } from 'components/form/AppFrom';
import { ArticleDetails, ArticleFormValues } from 'types/blog';
import { createArticleSchema } from '../../../validators/blog-schema';
import { BlockEditor } from 'components/form/BlockEditor';
import { useCreateArticleMutation, useGetBlogCategoriesQuery, useGetBlogTagsQuery } from 'hooks/api/blog/blogHooks';
import { IOption } from 'components/form/FormSingleSelect';
import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import FormSkeleton from 'components/skeleton/FormSkeleton';

const defaultValues: ArticleFormValues = {
  title: '',
  subtitle: '',
  readingTime: 0,
  excerpt: '',
  metaTitle: '',
  metaDescription: '',
  image: '',
  content: [],
  isFeatured: false,
  isPublished: true,
  categories: [],
  tags: []
};

interface ArticleFormProps {
  article?: ArticleDetails;
  isLoading?: boolean;
}

export default function ArticleForm({ article, isLoading }: ArticleFormProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: categories, isLoading: isLoadingCategories } = useGetBlogCategoriesQuery();
  const { data: tags, isLoading: isLoadingTags } = useGetBlogTagsQuery();
  const { mutate, isPending } = useCreateArticleMutation();

  const categoryOptions: IOption[] = (categories ?? []).map((c) => ({
    label: c.name,
    value: c.id
  }));

  const tagOptions: IOption[] = (tags ?? []).map((tag) => ({
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
      image: article.image ?? '',
      content: article.content ?? undefined,
      isFeatured: article.isFeatured ?? false,
      isPublished: article.isPublished ?? true,
      categories: article.categories.map((c) => c.id),
      tags: article.tags.map((tag) => tag.id) ?? undefined
    };
  }, [article]);

  const onSubmit = async (data: ArticleFormValues) => {
    mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['articles'] });
        navigate('/blog');
      }
    });
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
          submitLabel="Create Article"
          isPending={isPending}
        >
          <BlockEditor name="content" />
        </AppForm>
      )}
    </>
  );
}
