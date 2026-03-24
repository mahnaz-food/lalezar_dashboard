import { Skeleton, Stack, TableCell } from '@mui/material';
import { ColumnDef } from '@tanstack/react-table';

interface TableSkeletonProps<T> {
  columns: ColumnDef<T>[];
}

export default function TableSkeleton<T>({ columns }: TableSkeletonProps<T>) {
  return (
    <TableCell colSpan={columns.length}>
      <Stack spacing={1}>
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} height={40} variant="rounded" animation="wave" />
        ))}
      </Stack>
    </TableCell>
  );
}
