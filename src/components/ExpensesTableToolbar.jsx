import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CreateIcon from '@mui/icons-material/Create';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import AddExpenseModal from './AddExpenseModal';
import UpdateExpenseModal from './UpdateExpenseModal';
import ExpensesDeleteDialog from './ExpensesDeleteDialog';
import TextField from '@mui/material/TextField';
import { useDebounceValue } from '../helpers/expensesPage.helper';
import { useState, useEffect } from 'react';
import useData from '../hooks/useData.hook';

const ExpensesTableToolbar = (props) => {
  const { numSelected, selectedArr } = props;
  const { expensesData, setExpensesTableView } = useData();
  const { setPage } = useData();
  const { filteredData } = useData();
  const [debounceValue, setDebounceValue] = useState('')
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const searchMerchant = useDebounceValue(debounceValue, 350); 
  
  useEffect(() => {
    if(filteredData.length > 0) {
      const foundMerchantArr = filteredData.filter((expense) => {
        if (expense.merchant.toUpperCase().includes(searchMerchant.toUpperCase())) {
          return true;
        }
      });

      setExpensesTableView([...foundMerchantArr]);
      setPage(0);
    } else {
      const foundMerchantArr = expensesData.filter((expense) => {
        if (expense.merchant.toUpperCase().includes(searchMerchant.toUpperCase())) {
          return true;
        }
      });

      setExpensesTableView([...foundMerchantArr]);
      setPage(0);
    }
  }, [searchMerchant])

  const handleEditBtn = () => {
    setShowUpdateModal(true);
  }

  const handleAddBtn = () => {
    setShowAddModal(true);
  }

  const handleDeleteBtn = () => {
    setShowDeleteDialog(true);
  }
  return (
    <>
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
          }),
        }}
      >
        <Grid 
          container
          spacing={2}
          sx={{ 
            width: '100%', 
            alignItems: 'center',
          }}
        >
          {numSelected > 0 ? (
            <Grid item sm={numSelected > 1 ? 11.25 : 10.5} xs={numSelected > 1 ? 10.5 : 9}>
              <Typography
                color="inherit"
                variant="subtitle1"
                component="div"
              >
                {numSelected} selected
              </Typography>
            </Grid>
          ) : (
            <>
              <Grid item xs={6.2} sm={9.5}>
                <Button
                  variant='contained'
                  startIcon={<AddIcon />}
                  onClick={handleAddBtn}
                >
                  ADD EXPENSE
                </Button>
              </Grid>
              <Grid item xs={5.8} sm={2.5}>
                <TextField
                  autoComplete='off'
                  type='search'
                  label="Search by merchant" 
                  variant="standard"  
                  value={debounceValue}
                  onChange={(ev) => setDebounceValue(ev.target.value)}
                />
              </Grid>
            </>
          )}

          {numSelected === 1 && 
            <Grid item sm={.75} xs={1.5}>
              <Tooltip title="Edit" >
                <IconButton color='primary' onClick={handleEditBtn}>
                  <CreateIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          }

          {numSelected >= 1 && 
            <Grid item sm={.75} xs={1.5}>
              <Tooltip title="Delete">
                <IconButton color='primary' onClick={handleDeleteBtn}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          }
        </Grid>
      </Toolbar>

      {showDeleteDialog && 
        <ExpensesDeleteDialog
          showDeleteDialog={showDeleteDialog}
          setShowDeleteDialog={setShowDeleteDialog}
          selectedArr={selectedArr}
        />
      }

      {showAddModal && 
        <AddExpenseModal 
          setShowModal={setShowAddModal}
        />
      }

      {showUpdateModal && 
        <UpdateExpenseModal
          setShowModal={setShowUpdateModal}
          selectedArr={selectedArr}
        />
      }
    </>
  );
}

ExpensesTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  selectedArr: PropTypes.array.isRequired,
};

export default ExpensesTableToolbar