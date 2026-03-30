import { Add, Trash, Export } from 'iconsax-react';
import { CSVExport } from 'components/third-party/react-table';
import { Box } from '@mui/material';
import Search from 'layout/Dashboard/Header/HeaderContent/Search';

export interface TableActionsParams<T> {
  showSearchBar?: boolean;
  query?: string;
  setQuery?: (value: string) => void;

  onAdd?: () => void;
  addButtonLabel?: string;

  enableExport?: boolean;
  data?: T[];
  headers?: any[];
  tableTitle?: string;

  selectedRows?: any[];
  selectedData?: T[];
}

export const getTableActions = <T,>({
  showSearchBar,
  query,
  setQuery,
  onAdd,
  addButtonLabel = 'Add',
  enableExport,
  data = [],
  headers = [],
  tableTitle,
  selectedRows = [],
  selectedData = []
}: TableActionsParams<T>) => {
  return [
    showSearchBar && {
      key: 'search',
      render: () => (
        <Box sx={{ minWidth: 200 }}>
          <Search query={query || ''} setQuery={setQuery!} />
        </Box>
      )
    },

    onAdd && {
      key: 'add',
      label: addButtonLabel,
      icon: <Add />,
      onClick: onAdd
    },

    enableExport && {
      key: 'export',
      label: 'Export',
      icon: <Export />,
      render: () => <CSVExport data={data} headers={headers} filename={tableTitle ? `${tableTitle}.csv` : 'export.csv'} />
    },

    selectedRows.length > 0 && {
      key: 'delete',
      label: `Delete (${selectedRows.length})`,
      icon: <Trash />,
      color: 'error',
      onClick: () => {
        console.log('Delete these:', selectedData);
      }
    }
  ].filter(Boolean);
};
