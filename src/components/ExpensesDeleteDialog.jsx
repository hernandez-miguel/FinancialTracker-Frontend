import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useData from '../hooks/useData.hook';
import axios from '../api/axios';

const EXPENSES_URL = '/api/expenses';
const REFRESHTOKEN_URL = '/refresh';

const ExpensesDeleteDialog = ({ showDeleteDialog, setShowDeleteDialog, selectedArr }) => {
  const { expensesData, setExpensesData } = useData();
  const { setSelectedExpenses } = useData();
  const removeList = [];

  for(let i = 0; i < selectedArr.length; i++) {
    const foundIndex = expensesData.findIndex((item) => {
      return item._id === selectedArr[i];
    })

    removeList.push(foundIndex);
  }

  const removeItemsByIndices = (arr, indices) => {
    // Sort indices in descending order to avoid index shifting issues
    indices.sort((a, b) => b - a);

    // Remove elements from the array based on the sorted indices
    for (let i = 0; i < indices.length; i++) {
      const index = indices[i];
      if (index >= 0 && index < arr.length) {
        arr.splice(index, 1);
      }
    }

    return arr;
  }
  
  const handleCancel = () => {
    setShowDeleteDialog(false);
  };

  const handleDelete = async () => {
    setShowDeleteDialog(false);
    setSelectedExpenses([]);

    try {
      const firstResponse = await axios.get(REFRESHTOKEN_URL, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      
      const newAccessToken = firstResponse?.data?.accessToken;
      
      for(let i = 0; i < selectedArr.length; i++) {
        const secondResponse = await axios.delete(
          EXPENSES_URL + `/${selectedArr[i]}`,
          {
            headers: { Authorization: `Bearer ${newAccessToken}` },
            withCredentials: true,
          },
        );
      }

      setExpensesData((prevData) => {
        const copyState = [...prevData];
        const newArr = removeItemsByIndices(copyState, removeList);
        return (newArr);
      });
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <Dialog
        open={showDeleteDialog}
        onClose={handleCancel}
      >
        <DialogTitle>
          {"Delete"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete item(s)?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button 
          onClick={handleDelete}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ExpensesDeleteDialog;