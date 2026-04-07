import { Fragment, useEffect, useMemo, useState } from 'react';
import { Theme } from '@mui/material/styles';
import {
  Stack,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Checkbox,
  Typography,
  IconButton,
  Box,
  Pagination,
  useMediaQuery
} from '@mui/material';

import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, RowSelectionState, useReactTable } from '@tanstack/react-table';

import { DndContext, closestCenter } from '@dnd-kit/core';

import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';

import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { EmptyTable } from 'components/third-party/react-table';
import { Trash, Eye, Menu } from 'iconsax-react';
import TableSkeleton from '../skeleton/TableSkeleton';
import TableMobileMenu from './table-mobile-menu';
import { getTableActions } from './table-actions';

interface ReactTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  tableTitle?: string;

  onViewRow?: (row: T) => void;
  onDeleteRow?: (row: T) => void;

  onAdd?: () => void;
  addButtonLabel?: string;

  enableExport?: boolean;

  isLoading?: boolean;

  emptyTableMsg?: string;

  // Pagination props
  page?: number;
  setPage?: (state: number) => void;
  query?: string;
  setQuery?: (state: string) => void;
  category?: string;
  setCategory?: (state: string) => void;
  numOfPages?: number;

  hasFilter?: boolean;

  // For drag & drop reordering
  enableRowReordering?: boolean;
  getRowId?: (row: T) => string;
  onReorder?: (newData: T[]) => void;
}

export default function ReactTable<T>({
  data,
  columns,
  tableTitle,
  onViewRow,
  onDeleteRow,
  onAdd,
  addButtonLabel = 'Add',
  enableExport = false,
  isLoading,
  emptyTableMsg,
  page,
  setPage,
  query,
  setQuery,
  category,
  setCategory,
  numOfPages = 0,
  hasFilter = false,
  enableRowReordering = false,
  getRowId = (row: any) => row.id,
  onReorder
}: ReactTableProps<T>) {
  const downLG = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

  const showSearchBar = query !== undefined && setQuery !== undefined;

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [tableData, setTableData] = useState(data);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  // =============================
  // Drag End Handler
  // =============================
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = tableData.findIndex((item) => getRowId(item) === active.id);
    const newIndex = tableData.findIndex((item) => getRowId(item) === over.id);

    const newData = arrayMove(tableData, oldIndex, newIndex);

    setTableData(newData);
    onReorder?.(newData);
  };

  // =============================
  // Columns
  // =============================
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

  const actionColumn: ColumnDef<T> = {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const data = row.original;

      return (
        <Stack direction="row" spacing={1}>
          {onViewRow && (
            <IconButton color="primary" onClick={() => onViewRow(data)}>
              <Eye size="20" />
            </IconButton>
          )}

          {onDeleteRow && (
            <IconButton color="error" onClick={() => onDeleteRow(data)}>
              <Trash size="20" />
            </IconButton>
          )}
        </Stack>
      );
    }
  };

  const dragColumn: ColumnDef<T> = {
    id: 'drag',
    header: 'drag',
    cell: () => (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'grab',
          color: 'text.secondary'
        }}
        className="drag-handle"
      >
        <Menu size="18" />
      </Box>
    )
  };

  const finalColumns = [...(enableRowReordering ? [dragColumn] : []), selectionColumn, ...columns, actionColumn];

  const table = useReactTable({
    data: tableData,
    columns: finalColumns,
    state: { rowSelection },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  // =============================
  // Actions
  // =============================
  const headers = columns
    .filter((col: any) => col.accessorKey)
    .map((col: any) => ({
      label: typeof col.header === 'string' ? col.header : '#',
      key: col.accessorKey
    }));

  const selectedRows = table.getSelectedRowModel().rows;
  const selectedData = selectedRows.map((row) => row.original);

  const actions = useMemo(() => {
    return getTableActions({
      showSearchBar,
      query,
      setQuery,
      onAdd,
      addButtonLabel,
      enableExport,
      data,
      headers,
      tableTitle,
      selectedData,
      selectedRows
    });
  }, [addButtonLabel, data, enableExport, headers, onAdd, query, selectedData, selectedRows, setQuery, showSearchBar, tableTitle]);

  // =============================
  // Draggable Row
  // =============================
  function DraggableRow({ row }: any) {
    const { setNodeRef, transform, transition, attributes, listeners } = useSortable({
      id: getRowId(row.original)
    });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition
    };

    return (
      <TableRow ref={setNodeRef} style={style}>
        {row.getVisibleCells().map((cell: any) => {
          const isDragCell = cell.column.id === 'drag';

          return (
            <TableCell key={cell.id}>
              <Box
                {...(isDragCell ? { ...attributes, ...listeners } : {})}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: isDragCell ? 'grab' : 'default',
                  '&:active': {
                    cursor: isDragCell ? 'grabbing' : 'default'
                  }
                }}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Box>
            </TableCell>
          );
        })}
      </TableRow>
    );
  }

  // =============================
  // Render Rows
  // =============================
  const renderRows = () => {
    return table.getRowModel().rows.map((row) =>
      enableRowReordering ? (
        <DraggableRow key={row.id} row={row} />
      ) : (
        <TableRow key={row.id}>
          {row.getVisibleCells().map((cell, idx) => {
            const isSelectionCell = idx === 0;
            const isActionCell = cell.column.id === 'actions';
            const clickable = !!onViewRow && !isSelectionCell && !isActionCell;

            return (
              <TableCell
                key={cell.id}
                onClick={() => clickable && onViewRow?.(row.original)}
                sx={{ cursor: clickable ? 'pointer' : 'default' }}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            );
          })}
        </TableRow>
      )
    );
  };

  // =============================
  // UI
  // =============================
  return (
    <>
      <MainCard content={false}>
        <Stack direction="row" justifyContent="space-between" sx={{ p: 3 }}>
          {tableTitle && <Typography variant="h4">{tableTitle}</Typography>}

          {downLG ? (
            <TableMobileMenu actions={actions} />
          ) : (
            <Stack direction="row" spacing={2}>
              {actions.map((action: any) =>
                action.render ? (
                  <Box key={action.key}>{action.render()}</Box>
                ) : (
                  <Button key={action.key} variant="contained" onClick={action.onClick}>
                    {action.label}
                  </Button>
                )
              )}
            </Stack>
          )}
        </Stack>

        <ScrollX>
          <TableContainer>
            <Table>
              <TableHead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableCell key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableHead>

              {enableRowReordering ? (
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={tableData.map((item) => getRowId(item))} strategy={verticalListSortingStrategy}>
                    <TableBody>{renderRows()}</TableBody>
                  </SortableContext>
                </DndContext>
              ) : (
                <TableBody>
                  {isLoading ? (
                    <TableSkeleton columns={columns} numOfAllColumns={table.getAllColumns().length} />
                  ) : table.getRowModel().rows.length === 0 ? (
                    <EmptyTable msg={emptyTableMsg || 'Table is empty'} numOfColumns={columns.length} />
                  ) : (
                    renderRows()
                  )}
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </ScrollX>
      </MainCard>

      {numOfPages ? (
        <Box sx={{ mt: 4 }}>
          <Pagination count={numOfPages} page={page} onChange={(_, v) => setPage?.(v)} />
        </Box>
      ) : null}
    </>
  );
}
