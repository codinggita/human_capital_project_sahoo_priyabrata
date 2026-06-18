import React from 'react';
import {
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel,
  useTheme,
} from '@mui/material';
import EmptyState from '../common/EmptyState';

const Table = ({
  columns,
  data = [],
  emptyMessage = 'No data available.',
  // Pagination Props
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  // Sorting Props
  sortBy,
  sortOrder,
  onSort,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const rowShadow = isDark
    ? '4px 4px 10px #080b11, -4px -4px 10px #1e2535'
    : '4px 4px 10px #cad2dd, -4px -4px 10px #ffffff';

  const hoverShadow = isDark
    ? 'inset 3px 3px 6px #080b11, inset -3px -3px 6px #1e2535'
    : 'inset 3px 3px 6px #cad2dd, inset -3px -3px 6px #ffffff';

  return (
    <Paper elevation={0} sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
      <TableContainer sx={{ maxHeight: 700, width: '100%', overflowX: 'auto', px: 1, py: 1 }}>
        <MuiTable sx={{ minWidth: 650, borderCollapse: 'separate', borderSpacing: '0 12px' }}>
          <TableHead>
            <TableRow>
              {columns.map((col, index) => (
                <TableCell
                  key={index}
                  sx={{
                    fontWeight: '950',
                    fontSize: '0.82rem',
                    color: 'text.secondary',
                    borderBottom: 'none',
                    pb: 1,
                    px: 3,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  {col.sortable ? (
                    <TableSortLabel
                      active={sortBy === col.accessor}
                      direction={sortBy === col.accessor ? sortOrder : 'asc'}
                      onClick={() => onSort && onSort(col.accessor)}
                      sx={{
                        '&.MuiTableSortLabel-active': { color: 'primary.main' },
                        '& .MuiTableSortLabel-icon': { color: 'primary.main !important' }
                      }}
                    >
                      {col.header}
                    </TableSortLabel>
                  ) : (
                    col.header
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  align="center"
                  sx={{ py: 6, borderBottom: 'none' }}
                >
                  <EmptyState message={emptyMessage} />
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  sx={{
                    '& td': {
                      backgroundColor: 'background.paper',
                      borderTop: isDark ? '1px solid rgba(255,255,255,0.10)' : '1px solid rgba(0,0,0,0.01)',
                      borderBottom: isDark ? '1px solid rgba(255,255,255,0.10)' : '1px solid rgba(0,0,0,0.01)',
                      boxShadow: rowShadow,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      py: 2.2,
                      px: 3,
                    },
                    '& td:first-of-type': {
                      borderLeft: isDark ? '1px solid rgba(255,255,255,0.10)' : '1px solid rgba(0,0,0,0.01)',
                      borderTopLeftRadius: '16px',
                      borderBottomLeftRadius: '16px',
                    },
                    '& td:last-of-type': {
                      borderRight: isDark ? '1px solid rgba(255,255,255,0.10)' : '1px solid rgba(0,0,0,0.01)',
                      borderTopRightRadius: '16px',
                      borderBottomRightRadius: '16px',
                    },
                    '&:hover td': {
                      boxShadow: hoverShadow,
                      transform: 'scale(0.995)',
                    },
                  }}
                >
                  {columns.map((col, colIndex) => (
                    <TableCell key={colIndex}>
                      {col.render ? col.render(row) : row[col.accessor]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </MuiTable>
      </TableContainer>

      {/* Conditionally render pagination only if count is provided */}
      {count !== undefined && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          sx={{
            mt: 2,
            borderTop: 'none',
            '& .MuiTablePagination-selectRoot': {
              boxShadow: hoverShadow,
              borderRadius: 2,
              px: 1,
            },
            '& .MuiTablePagination-actions button': {
              mx: 0.5,
              borderRadius: 2,
              boxShadow: rowShadow,
              transition: 'all 0.2s',
              '&:hover': {
                boxShadow: hoverShadow,
              }
            }
          }}
        />
      )}
    </Paper>
  );
};

export default Table;
