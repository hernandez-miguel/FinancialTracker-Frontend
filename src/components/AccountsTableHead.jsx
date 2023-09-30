import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';

const AccountsTableHead = (props) => {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const headCells = [
    {
      id: 'account',
      numeric: false,
      disablePadding: true,
      label: 'Account',
    },
    {
      id: 'dateCreated',
      numeric: false,
      disablePadding: false,
      label: 'Created',
    },
    {
      id: 'dateUpdated',
      numeric: false,
      disablePadding: false,
      label: 'Updated',
    },
    {
      id: 'amount',
      numeric: false,
      disablePadding: false,
      label: 'Amount',
    },
    {
      id: 'category',
      numeric: false,
      disablePadding: false,
      label: 'Category',
    },
  ];

  const topRowArr = Array.from({ length: 6 }, () => '');

  return (
    <TableHead>
      <TableRow>
        {topRowArr.map((item, index) => (
          <TableCell key={index}>{item}</TableCell>
        ))}
        <TableCell colSpan={'2'} align="center" sx={{ pb: 0 }}>
          Since Last Update
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell align="left">Net Chg </TableCell>
        <TableCell align="left">% Chg</TableCell>
      </TableRow>
    </TableHead>
  );
};

AccountsTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default AccountsTableHead;