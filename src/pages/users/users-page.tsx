import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { ColumnDef } from '@tanstack/react-table';
import { toast } from 'sonner';
import ReactTable from 'components/table/Table';
import { useModal } from 'contexts/ModalContext';
import { ArticleSummary } from 'types/blog';
import { useState } from 'react';
import { useDeleteUserMutation, useGetUsersQuery } from 'hooks/api/user/userHooks';
import { User } from 'types/user';

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'name'
  },
  {
    accessorKey: 'role',
    header: 'role'
  },
  {
    accessorKey: 'email',
    header: 'email'
  },
  {
    accessorKey: 'createdAt',
    header: 'date of registration',
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return date.toLocaleDateString();
    }
  }
];

export default function UsersPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { confirm } = useModal();

  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');

  const { data, isLoading } = useGetUsersQuery({ page, query });

  const { mutate: deleteSingleUser, isPending: isSingleDeleting } = useDeleteUserMutation();

  const handleDelete = async (id: string) => {
    await confirm({
      title: 'Delete Article',
      description: 'Are you sure you want to delete this article?',
      onConfirm: async () => {
        deleteSingleUser(
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
    <ReactTable
      data={data?.data || []}
      columns={columns as ArticleSummary[]}
      tableTitle="Users List"
      onAdd={() => navigate('/users/add-user')}
      enableExport
      addButtonLabel="Add User"
      isLoading={isLoading || isSingleDeleting}
      onViewRow={(row) => navigate(`/users/${row.id}`)}
      onDeleteRow={(row) => {
        handleDelete(row.id);
      }}
      page={page}
      setPage={setPage}
      query={query}
      setQuery={setQuery}
      numOfPages={data?.totalPages}
    />
  );
}
