import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Switch from '@mui/material/Switch';
import NetWorthTableHead from './NetWorthTableHead';
import NetWorthTableToolbar from './NetWorthTableToolbar';
import { getComparator, stableSort } from '../helpers/networthPage.helper';
import { formatChanges, formatAmount } from '../helpers/networthPage.helper';
import { useState, useMemo } from 'react';
import useData from '../hooks/useData.hook';

export default function NetWorthTable() {
  const { netWorthTableView } = useData();
  const { page, setPage } = useData();
  const { selectedBalances, setSelectedBalances } = useData();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('year');
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = netWorthTableView.map((n) => n._id);
      setSelectedBalances(newSelected);
      return;
    }
    setSelectedBalances([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selectedBalances.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedBalances, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedBalances.slice(1));
    } else if (selectedIndex === selectedBalances.length - 1) {
      newSelected = newSelected.concat(selectedBalances.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedBalances.slice(0, selectedIndex),
        selectedBalances.slice(selectedIndex + 1),
      );
    }

    setSelectedBalances(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selectedBalances.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - netWorthTableView.length)
      : 0;

  const visibleRows = useMemo(
    () =>
      stableSort(netWorthTableView, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage, netWorthTableView],
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <NetWorthTableToolbar
          selectedArr={selectedBalances}
          numSelected={selectedBalances.length}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <NetWorthTableHead
              numSelected={selectedBalances.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={netWorthTableView.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row._id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row._id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row._id}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                      align="left"
                    >
                      {row.account}
                    </TableCell>
                    <TableCell align="left">
                      {row.createdAt.slice(0, 10)}
                    </TableCell>
                    <TableCell align="left">
                      {row.updatedAt.slice(0, 10)}
                    </TableCell>
                    <TableCell align="left">
                      {`$ ${formatAmount(row.amount)}`}
                    </TableCell>
                    <TableCell align="left">{row.category}</TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        color:
                          (row.netChg > 0 && row.category === 'Debt') ||
                          (row.netChg < 0 && row.category === 'Cash') ||
                          (row.netChg < 0 && row.category === 'Investment')
                            ? 'red'
                            : 'green',
                      }}
                    >
                      {row.netChg ? formatChanges(row.netChg) : '-'}
                    </TableCell>
                    <TableCell 
                      align="left"
                      sx={{
                        color:
                          (row.percentChg > 0 && row.category === 'Debt') ||
                          (row.percentChg < 0 && row.category === 'Cash') ||
                          (row.percentChg < 0 && row.category === 'Investment')
                            ? 'red'
                            : 'green',
                      }}
                    >
                      {row.percentChg ? formatChanges(row.percentChg * 100) + '%' : '-'}
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 15, 25]}
          component="div"
          count={netWorthTableView.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
  );
}
