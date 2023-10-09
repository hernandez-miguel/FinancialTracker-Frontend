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
import AddAccountModal from './AddAccountModal';
import UpdateAccountModal from './UpdateAccountModal';
import AccountsDeleteDialog from './AccountsDeleteDialog';
import TextField from '@mui/material/TextField';
import { useDebounceValue } from '../helpers/networthPage.helper';
import { useState, useEffect } from 'react';
import useData from '../hooks/useData.hook';

const AccountsTableToolbar = (props) => {
  const { numSelected, selectedArr } = props;
  const { accountsData, setAccountsTableView } = useData();
  const { setPage } = useData();
  const [debounceValue, setDebounceValue] = useState('')
  const [showAddAcctModal, setShowAddAcctModal] = useState(false);
  const [showUpdateAcctModal, setShowUpdateAcctModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const searchAccount = useDebounceValue(debounceValue, 350); 
  
  useEffect(() => {
    const foundAccountArr = accountsData.filter((account) => {
      if (account.account.toUpperCase().includes(searchAccount.toUpperCase())) {
        return true;
      }
    });

    setAccountsTableView([...foundAccountArr]);
    setPage(0);
  }, [searchAccount])

  const handleEditBtn = () => {
    setShowUpdateAcctModal(true);
  }

  const handleAddBtn = () => {
    setShowAddAcctModal(true);
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
                  ADD ACCOUNT
                </Button>
              </Grid>
              <Grid item xs={5.8} sm={2.5}>
                <TextField
                  autoComplete='off'
                  type='search'
                  label="Search by account" 
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
        <AccountsDeleteDialog
          showDeleteDialog={showDeleteDialog}
          setShowDeleteDialog={setShowDeleteDialog}
          selectedArr={selectedArr}
        />
      }

      {showAddAcctModal && 
        <AddAccountModal setShowModal={setShowAddAcctModal}/>
      }

      {showUpdateAcctModal && 
        <UpdateAccountModal 
          setShowModal={setShowUpdateAcctModal} 
          selectedArr={selectedArr}
        />
      }
    </>
  );
}

AccountsTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  selectedArr: PropTypes.array.isRequired,
};

export default AccountsTableToolbar;