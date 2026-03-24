import { Fragment, useState } from 'react';
import { alpha, useTheme } from '@mui/material/styles';
import { Stack, Button, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Checkbox, Typography } from '@mui/material';

import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, RowSelectionState, useReactTable } from '@tanstack/react-table';

import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { CSVExport, EmptyTable } from 'components/third-party/react-table';
import { Add } from 'iconsax-react';
import TableSkeleton from './TableSkeleton';

interface ReactTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  tableTitle?: string;

  onAdd?: () => void;
  addButtonLabel?: string;

  enableExport?: boolean;

  isLoading?: boolean;

  emptyTableMsg?: string;
}

export default function ReactTable<T>({
  data,
  columns,
  tableTitle,
  onAdd,
  addButtonLabel = 'Add',
  enableExport = false,
  isLoading,
  emptyTableMsg
}: ReactTableProps<T>) {
  const theme = useTheme();
  const backColor = alpha(theme.palette.primary.lighter, 0.1);

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const selectionColumn: ColumnDef<T> = {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllRowsSelected()}
        indeterminate={table.getIsSomeRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} disabled={!row.getCanSelect()} onChange={row.getToggleSelectedHandler()} />
  };

  const table = useReactTable({
    data,
    columns: [selectionColumn, ...columns],
    state: { rowSelection },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  // CSV headers
  const headers = columns
    .filter((col: any) => col.accessorKey)
    .map((col: any) => ({
      label: typeof col.header === 'string' ? col.header : '#',
      key: col.accessorKey
    }));

  const selectedRows = table.getSelectedRowModel().rows;
  const selectedData = selectedRows.map((row) => row.original);

  return (
    <MainCard content={false}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          {tableTitle && <Typography variant="h4">{tableTitle}</Typography>}

          {onAdd && (
            <Button variant="contained" startIcon={<Add />} onClick={onAdd}>
              {addButtonLabel}
            </Button>
          )}

          {enableExport && <CSVExport data={data} headers={headers} filename={tableTitle ? `${tableTitle}.csv` : 'export.csv'} />}

          {/* Multiple Delete Button */}
          {selectedRows.length > 0 && (
            <Button
              color="error"
              variant="contained"
              onClick={() => {
                console.log('Delete these:', selectedData);
              }}
            >
              Delete ({selectedRows.length})
            </Button>
          )}
        </Stack>
      </Stack>

      <ScrollX>
        <TableContainer>
          <Table>
            {/* Table Head */}
            <TableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableCell key={header.id} sx={{ fontWeight: 600 }}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>

            {/* Table Body */}
            <TableBody>
              {isLoading ? (
                <TableSkeleton columns={columns} />
              ) : table.getRowModel().rows.length === 0 ? (
                <EmptyTable msg={emptyTableMsg || 'Table is empty'} numOfColumns={columns.length} />
              ) : (
                table.getRowModel().rows.map((row) => (
                  <Fragment key={row.id}>
                    <TableRow>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                      ))}
                    </TableRow>

                    {row.getIsExpanded() && (
                      <TableRow sx={{ bgcolor: backColor }}>
                        <TableCell colSpan={row.getVisibleCells().length}>{/* expandable content */}</TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </ScrollX>
    </MainCard>
  );
}
