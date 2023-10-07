import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useData from '../hooks/useData.hook';
import axios from '../api/axios';
import { updateBalance, getDeletedData } from '../helpers/networthPage.helper';
import { removeItemsByIndices } from '../helpers/networthPage.helper';

const ACCOUNT_URL = '/api/accounts';
const REFRESHTOKEN_URL = '/refresh';
const BALANCES_URL = '/api/balances';

const AccountsDeleteDialog = ({ showDeleteDialog, setShowDeleteDialog, selectedArr }) => {
  const { accountsData, setAccountsData } = useData();
  const { balancesData, setBalancesData } = useData();
  const { setSelectedAccounts } = useData();
  const removeList = [];
  const removedAccounts = [];

  for(let i = 0; i < selectedArr.length; i++) {
    const foundIndex = accountsData.findIndex((item) => {
      return item._id === selectedArr[i];
    })

    removeList.push(foundIndex);
  }
  
  const handleCancel = () => {
    setShowDeleteDialog(false);
  };

  const handleDelete = async () => {
    setShowDeleteDialog(false);
    setSelectedAccounts([]);

    try {
      const firstResponse = await axios.get(REFRESHTOKEN_URL, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      
      const newAccessToken = firstResponse?.data?.accessToken;

      if (balancesData.length < 2 && accountsData.length === selectedArr.length) {
        for(let i = 0; i < selectedArr.length; i++) {
          const secondResponse = await axios.delete(
            ACCOUNT_URL + `/${selectedArr[i]}`,
            {
              headers: { Authorization: `Bearer ${newAccessToken}` },
              withCredentials: true,
            },
          );
          const deletedAccount = secondResponse?.data;
          removedAccounts.push(deletedAccount);
        }
        
        const removedBalances = getDeletedData(removedAccounts);

        const foundBalance = balancesData.filter((balance) => {
          return balance.year === removedBalances[0].year
        })[0];
        const BalanceId = foundBalance._id;

        const thirdResponse = await axios.delete (
          BALANCES_URL + `/${BalanceId}`,
            {
              headers: { Authorization: `Bearer ${newAccessToken}` },
              withCredentials: true,
            },
          );

        setBalancesData([]);

        setAccountsData((prevData) => {
          const copyState = [...prevData];
          const newArr = removeItemsByIndices(copyState, removeList);
          return (newArr);
        });
      } else {
        for(let i = 0; i < selectedArr.length; i++) {
          const secondResponse = await axios.delete(
            ACCOUNT_URL + `/${selectedArr[i]}`,
            {
              headers: { Authorization: `Bearer ${newAccessToken}` },
              withCredentials: true,
            },
          );

          const deletedAccount = secondResponse?.data;
          removedAccounts.push(deletedAccount);
        }

        const removedBalances = getDeletedData(removedAccounts);

        for (let i = 0; i < removedBalances.length; i++) {
          const foundBalance = balancesData.filter((balance) => {
            return balance.year === removedBalances[i].year
          })[0];
          const BalanceId = foundBalance._id;
          const year = foundBalance.year;
          const cash = foundBalance.cash;
          const debt = foundBalance.debt;
          const investment = foundBalance.investment;

          const thirdResponse = await axios.put(
            BALANCES_URL + `/${BalanceId}`,
            {
              year: year,
              cash: updateBalance(cash, removedBalances[i].cash, 'delete'),
              debt: updateBalance(debt, removedBalances[i].debt, 'delete'),
              investment: updateBalance(investment, removedBalances[i].investment, 'delete')
            },
            {
              headers: { Authorization: `Bearer ${newAccessToken}` },
              withCredentials: true,
            },
          );

          const updatedBalance = thirdResponse?.data;
          const foundBalanceIndex = balancesData.findIndex((item) => {
            return item.year === year;
          });
        
          setBalancesData((prevData) => {
            const copyState = [...prevData];
            copyState.splice(foundBalanceIndex, 1, updatedBalance);
            return copyState;
          });
        }

        setAccountsData((prevData) => {
          const copyState = [...prevData];
          const newArr = removeItemsByIndices(copyState, removeList);
          return (newArr);
        });
      }
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

export default AccountsDeleteDialog;