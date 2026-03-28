import { ColumnDef } from '@tanstack/react-table';
import ReactTable from 'components/table/Table';
import { useModal } from 'contexts/ModalContext';
import {
  useCreateArticleCategoryMutation,
  useDeleteArticleCategoryMutation,
  useGetBlogCategoriesQuery,
  useUpdateArticleCategoryMutation
} from 'hooks/api/blog/blogHooks';
import { ArticleCategoryFormValues, BlogCategory } from 'types/blog';
import { createArticleCategorySchema } from '../../../../validators/blog-schema';
import { FormFieldConfig } from 'components/form/AppFrom';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export const columns: ColumnDef<BlogCategory>[] = [
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'slug',
    header: 'Slug'
  },
  {
    accessorKey: 'articleCount',
    header: 'Number Of Articles'
  }
];

const defaultValues: ArticleCategoryFormValues = {
  name: ''
};

const fields: FormFieldConfig<ArticleCategoryFormValues>[] = [
  { name: 'name', label: 'Name', placeholder: 'Enter name', type: 'text', md: 12 }
];

export default function ArticleCategoriesPage() {
  const queryClient = useQueryClient();
  const { data = [], isLoading } = useGetBlogCategoriesQuery();
  const { openForm, confirm } = useModal();

  const { mutate: createCategory, isPending: isCreating } = useCreateArticleCategoryMutation();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateArticleCategoryMutation();
  const { mutate: deleteCategory, isPending: isSingleDeleting } = useDeleteArticleCategoryMutation();

  const handleAddClick = () => {
    openForm({
      title: 'Create Article Category',
      schema: createArticleCategorySchema,
      defaultValues,
      fields,
      isPending: isCreating,
      onSubmit: (data: ArticleCategoryFormValues) => {
        createCategory(data, {
          onSuccess: (data: { message: string }) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ['blog-categories'] });
          }
        });
      }
    });
  };

  const handleViewRow = (row: BlogCategory) => {
    openForm({
      title: `${row.name} category`,
      schema: createArticleCategorySchema,
      defaultValues: { ...defaultValues, name: row.name },
      fields,
      isPending: isUpdating,
      onSubmit: (data: ArticleCategoryFormValues) => {
        updateCategory(
          { id: row.id, data },
          {
            onSuccess: (data: { message: string }) => {
              toast.success(data.message);
              queryClient.invalidateQueries({ queryKey: ['blog-categories'] });
            }
          }
        );
      }
    });
  };

  const handleDelete = async (id: string) => {
    await confirm({
      title: 'Delete Category',
      description: 'Are you sure you want to delete this category?',
      isPending: isSingleDeleting,
      onConfirm: () => {
        deleteCategory(
          { id },
          {
            onSuccess: (data: { message: string }) => {
              toast.success(data.message);
              queryClient.invalidateQueries({ queryKey: ['blog-categories'] });
            }
          }
        );
      }
    });
  };
  return (
    <>
      <ReactTable
        data={data}
        columns={columns as BlogCategory[]}
        tableTitle="Category List"
        onAdd={handleAddClick}
        enableExport
        addButtonLabel="Create Cat."
        isLoading={isLoading}
        onViewRow={(row) => handleViewRow(row)}
        onDeleteRow={(row) => {
          handleDelete(row.id);
        }}
      />
    </>
  );
}
