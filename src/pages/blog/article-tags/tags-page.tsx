import { ColumnDef } from '@tanstack/react-table';
import ReactTable from 'components/table/Table';
import { useModal } from 'contexts/ModalContext';
import {
  useCreateArticleTagMutation,
  useDeleteArticleTagMutation,
  useGetBlogTagsQuery,
  useUpdateArticleTagMutation
} from 'hooks/api/blog/blogHooks';
import { ArticleTagFormValues, BlogCategory, BlogTag } from 'types/blog';
import { createArticleTagSchema } from '../../../../validators/blog-schema';
import { FormFieldConfig } from 'components/form/AppFrom';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export const columns: ColumnDef<BlogTag>[] = [
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

const defaultValues: ArticleTagFormValues = {
  name: ''
};

const fields: FormFieldConfig<ArticleTagFormValues>[] = [{ name: 'name', label: 'Name', placeholder: 'Enter name', type: 'text', md: 12 }];

export default function ArticleTagsPage() {
  const queryClient = useQueryClient();
  const { data = [], isLoading } = useGetBlogTagsQuery();
  const { openForm, confirm } = useModal();

  const { mutate: createTag, isPending: isCreating } = useCreateArticleTagMutation();
  const { mutate: updateTag, isPending: isUpdating } = useUpdateArticleTagMutation();
  const { mutate: deleteTag, isPending: isSingleDeleting } = useDeleteArticleTagMutation();

  const handleAddClick = () => {
    openForm({
      title: 'Create Article Tag',
      schema: createArticleTagSchema,
      defaultValues,
      fields,
      isPending: isCreating,
      onSubmit: (data: ArticleTagFormValues) => {
        createTag(data, {
          onSuccess: (data: { message: string }) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ['blog-tags'] });
          }
        });
      }
    });
  };

  const handleViewRow = (row: BlogTag) => {
    openForm({
      title: `${row.name} tag`,
      schema: createArticleTagSchema,
      defaultValues: { ...defaultValues, name: row.name },
      fields,
      isPending: isUpdating,
      onSubmit: (data: ArticleTagFormValues) => {
        updateTag(
          { id: row.id, data },
          {
            onSuccess: (data: { message: string }) => {
              toast.success(data.message);
              queryClient.invalidateQueries({ queryKey: ['blog-tags'] });
            }
          }
        );
      }
    });
  };

  const handleDelete = async (id: string) => {
    await confirm({
      title: 'Delete Tag',
      description: 'Are you sure you want to delete this tag?',
      isPending: isSingleDeleting,
      onConfirm: () => {
        deleteTag(
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
        tableTitle="Tag List"
        onAdd={handleAddClick}
        enableExport
        addButtonLabel="Create Tag"
        isLoading={isLoading}
        onViewRow={(row) => handleViewRow(row)}
        onDeleteRow={(row) => {
          handleDelete(row.id);
        }}
      />
    </>
  );
}
