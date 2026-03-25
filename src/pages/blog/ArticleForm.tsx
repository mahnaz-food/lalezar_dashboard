import { AppForm, FormFieldConfig } from 'components/form/AppFrom';
import { ArticleFormValues } from 'types/blog';
import { createArticleSchema } from '../../../validators/blog-schema';
import { BlockEditor } from 'components/form/BlockEditor';
import { useGetBlogCategoriesQuery, useGetBlogTagsQuery } from 'hooks/api/blog/blogHooks';
import { IOption } from 'components/form/FormSingleSelect';
import { useMemo } from 'react';

const defaultValues: ArticleFormValues = {
  title: '',
  subtitle: '',
  excerpt: '',
  metaTitle: '',
  metaDescription: '',
  image: '',
  content: [],
  isFeatured: false,
  isPublished: true,
  categoryIds: [],
  tagIds: []
};

export default function ArticleForm() {
  const { data: categories, isLoading: isLoadingCategories } = useGetBlogCategoriesQuery();
  const { data: tags, isLoading: isLoadingTags } = useGetBlogTagsQuery();

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
      { name: 'categoryIds', label: 'Categories', type: 'multiselect', options: categoryOptions, disabled: isLoadingCategories, md: 3 },
      { name: 'tagIds', label: 'Tags', type: 'multiselect', options: tagOptions, disabled: isLoadingTags, md: 3 }
    ],
    [categoryOptions, tagOptions]
  );

  const onSubmit = async (data: ArticleFormValues) => {
    console.log(data);
  };
  return (
    <>
      <AppForm fields={fields} defaultValues={defaultValues} onSubmit={onSubmit} schema={createArticleSchema} submitLabel="Create Article">
        <BlockEditor name="content" />
      </AppForm>
    </>
  );
}
