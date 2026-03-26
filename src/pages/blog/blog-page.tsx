import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { ColumnDef } from '@tanstack/react-table';
import { toast } from 'sonner';
import ReactTable from 'components/table/Table';
import { useModal } from 'contexts/ModalContext';
import { useDeleteArticleMutation, useGetArticlesQuery } from 'hooks/api/blog/blogHooks';
import { IArticle } from 'types/blog';

export const columns: ColumnDef<IArticle>[] = [
  {
    accessorKey: 'title',
    header: 'Title'
  },
  {
    accessorKey: 'author',
    header: 'Author'
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return date.toLocaleDateString();
    }
  }
];

export default function BlogPage() {
  const queryClient = useQueryClient();
  const { confirm } = useModal();
  const { data, isLoading } = useGetArticlesQuery();
  const navigate = useNavigate();

  const { mutate: deleteSingleArticle, isPending: isSingleDeletePending } = useDeleteArticleMutation();

  const formatted = data ? data.data.map((item) => ({ ...item, author: item.author.name })) : [];

  const handleDelete = async (id: string) => {
    await confirm({
      title: 'Delete Article',
      description: 'Are you sure you want to delete this article?',
      onConfirm: async () => {
        deleteSingleArticle(
          { id },
          {
            onSuccess: (data: { message: string }) => {
              queryClient.invalidateQueries({ queryKey: ['articles'] });
              toast.success(data.message);
            }
          }
        );
      }
    });
  };
  return (
    <>
      <ReactTable
        data={formatted}
        columns={columns as IArticle[]}
        tableTitle="Articles List"
        onAdd={() => navigate('/blog/create-article')}
        enableExport
        addButtonLabel="Create Blog"
        isLoading={isLoading || isSingleDeletePending}
        getRowLink={(row) => `/blog/${row.id}`}
        onDeleteRow={(row) => {
          handleDelete(row.slug);
        }}
      />
    </>
  );
}
