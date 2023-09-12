import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CreateIcon from '@mui/icons-material/Create';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import ExpensesModal from './ExpensesModal';
import DeleteDialog from './DeleteDialog';
import { useState } from 'react';

const ExpensesTableToolbar = (props) => {
  const { numSelected, selectedArr } = props;
  const [addBtnIsSelected, setAddBtnIsSelected] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleEditBtn = () => {
    setShowModal(true);
  }

  const handleAddBtn = () => {
    setAddBtnIsSelected(true);
    setShowModal(true);
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
        <Stack direction={'row'} sx={{ width: '100%', alignItems: 'center' }}>
          {numSelected > 0 ? (
            <Typography
              sx={{ flex: '1 1 100%' }}
              color="inherit"
              variant="subtitle1"
              component="div"
            >
              {numSelected} selected
            </Typography>
          ) : (
            <Button
              variant='contained'
              startIcon={<AddIcon />}
              onClick={handleAddBtn}
            >
              ADD EXPENSE
            </Button>
          )}

          {numSelected === 1 && 
            <Tooltip title="Edit" >
              <IconButton color='primary' onClick={handleEditBtn}>
                <CreateIcon />
              </IconButton>
            </Tooltip>
          }

          {numSelected >= 1 && 
            <Tooltip title="Delete">
              <IconButton color='primary' onClick={handleDeleteBtn}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          }
        </Stack>
      </Toolbar>

      {showDeleteDialog && 
        <DeleteDialog 
          showDeleteDialog={showDeleteDialog}
          setShowDeleteDialog={setShowDeleteDialog}
          selectedArr={selectedArr}
        />
      }

      {showModal && 
        <ExpensesModal 
          addBtnIsSelected={addBtnIsSelected}
          setAddBtnIsSelected={setAddBtnIsSelected}
          setShowModal={setShowModal}
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