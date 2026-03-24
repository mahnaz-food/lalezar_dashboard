import { ColumnDef } from '@tanstack/react-table';
import ReactTable from 'components/table/Table';
import { useGetArticlesQuery } from 'hooks/api/blog/blogHooks';
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
    header: 'Created At',
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return date.toLocaleDateString();
    }
  }
];

export default function BlogPage() {
  const { data, isLoading } = useGetArticlesQuery();

  const formatted = data ? data.data.map((item) => ({ ...item, author: item.author.name })) : [];
  return (
    <ReactTable
      data={formatted}
      columns={columns as IArticle[]}
      tableTitle="Articles List"
      onAdd={() => {}}
      enableExport
      addButtonLabel="Create Blog"
      isLoading={isLoading}
    />
  );
}
