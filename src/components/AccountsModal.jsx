import { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import useData from '../hooks/useData.hook';
import useAuth from '../hooks/useAuth.hook';
import axios from '../api/axios';
import { getNetChg, getPercentChg } from '../helpers/networthPage.helper';
import { capitalizeFirstLetter, formatBalances } from '../helpers/networthPage.helper';

const ACCOUNTS_URL = '/api/accounts';
const BALANCES_URL = '/api/balances';
const REFRESHTOKEN_URL = '/refresh';

const BALANCE_REGEX = /^(?:\d{1,}|\d+\.\d{2})$/;

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const AccountsModal = ({
  setShowModal,
  selectedArr,
  addBtnIsSelected,
  setAddBtnIsSelected,
}) => {
  const { accountsData, setAccountsData } = useData();
  const { balancesData, setBalancesData } = useData();
  const { setSelectedAccounts } = useData();
  const { auth } = useAuth();

  const [accountName, setAccountName] = useState('');
  const [accountNameFocus, setAccountNameFocus] = useState(false);

  const [balance, setBalance] = useState('');
  const [balanceFocus, setBalanceFocus] = useState(false);
  const [validBalance, setValidBalance] = useState(false);

  const [category, setCategory] = useState('');
  const [categoryFocus, setCategoryFocus] = useState(false);

  const selectedItemId = selectedArr[0];

  const balanceErrMsg = 'Format: xxxx.xx, or xxxx';
  const categoryList = ['Cash', 'Debt', 'Investment'];
  
  if (!addBtnIsSelected) {
    const result = accountsData.filter((balance) => {
      return balance._id === selectedItemId;
    });
  
    const foundAccount = result[0];

    if(foundAccount.balance < 0) {
      foundAccount.balance *= -1;
    }

    useEffect(() => {
      setAccountName(foundAccount.account);
      setBalance(foundAccount.balance.toFixed(2));
      setCategory(capitalizeFirstLetter(foundAccount.category));
    }, []);
  }

  const handleClose = () => {
    setShowModal(false);
    setAddBtnIsSelected(false);
  };

  const handleEditButton = async () => {
    setShowModal(false);
    setSelectedAccounts([]);

    const result = accountsData.filter((account) => {
      return account._id === selectedItemId;
    });
  
    const foundAccount = result[0];

    try {
      const firstResponse = await axios.get(REFRESHTOKEN_URL, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      const newAccessToken = firstResponse?.data?.accessToken;

      const secondResponse = await axios.put(
        ACCOUNTS_URL + `/${selectedItemId}`,
        {
          account: accountName,
          balance: category.toLowerCase() === 'debt' ?
            Number(balance) * -1 : Number(balance),
          category: category.toLowerCase(),
          prevBalance: foundAccount.balance,
          netChg: getNetChg(foundAccount.balance, Number(balance)),
          percentChg: getPercentChg(foundAccount.balance, Number(balance))
        },
        {
          headers: { Authorization: `Bearer ${newAccessToken}` },
          withCredentials: true,
        },
      );

      const updatedAccount = secondResponse?.data;
      const foundAccountIndex = accountsData.findIndex((item) => {
        return item._id === selectedItemId;
      });

      setAccountsData((prevData) => {
        const copyData = [...prevData];
        copyData.splice(foundAccountIndex, 1, updatedAccount);
        return copyData;
      });

      const categoryKey = updatedAccount.category;
      const year = Number(updatedAccount.updatedAt.slice(0, 4));
      let netChg = updatedAccount?.netChg || 0;

      if (categoryKey === 'debt') {
        netChg *= -1;
      }

      const result = balancesData.filter((item) => item.year === year);
      const balanceFound = result.length > 0 ? result[0] : undefined;
      const balanceId = balanceFound?._id;
      const cash = balanceFound?.cash || 0;
      const debt = balanceFound?.debt || 0;
      const investment = balanceFound?.investment || 0;

      const thirdResponse = await axios.put(
        BALANCES_URL + `/${balanceId}`,
        {
          year: year,
          cash: categoryKey === 'cash' ? formatBalances(cash, netChg) : cash,
          debt: categoryKey === 'debt' ? formatBalances(debt, netChg) : debt,
          investment: categoryKey === 'investment' ? formatBalances(investment, netChg) : investment
        },
        {
          headers: { Authorization: `Bearer ${newAccessToken}` },
          withCredentials: true,
        },
      );

      const updatedBalance = thirdResponse?.data;
      const foundBalanceIndex = balancesData.findIndex(item => item.year === year);

      setBalancesData((prevData) => {
        const copyState = [...prevData];
        copyState.splice(foundBalanceIndex, 1, updatedBalance);
        return copyState;
      })
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddButton = async () => {
    setShowModal(false);

    try {
      const firstResponse = await axios.get(REFRESHTOKEN_URL, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      const newAccessToken = firstResponse?.data?.accessToken;

      const secondResponse = await axios.post(
        ACCOUNTS_URL + `/${auth?.userId}`,
        {
          account: accountName,
          balance: category.toLowerCase() === 'debt' ? 
            Number(balance) * -1 : Number(balance),
          category: category.toLowerCase(),
        },
        {
          headers: { Authorization: `Bearer ${newAccessToken}` },
          withCredentials: true,
        },
      );

      const newAccount = secondResponse?.data;
      
      setAccountsData((prevData) => {
        const copyData = [...prevData];
        return [...copyData, newAccount];
      });

      const categoryKey = newAccount.category;
      const year = Number(newAccount.updatedAt.slice(0, 4));

      const result = balancesData.filter((item) => item.year === year);
      const balanceFound = result.length > 0 ? result[0] : undefined;
      const balanceId = balanceFound?._id;
      const hasBalance = balanceFound?.[newAccount.category] > 0 || 
        balanceFound?.[newAccount.category] < 0;
      const cash = balanceFound?.cash || 0;
      const debt = balanceFound?.debt || 0;
      const investment = balanceFound?.investment || 0;

      if( balanceFound === undefined ) {
        const thirdResponse = await axios.post(
          BALANCES_URL + `/${auth?.userId}`,
          {
            year: year,
            cash: categoryKey === 'cash' ? newAccount.balance : 0,
            debt: categoryKey === 'debt' ? newAccount.balance : 0,
            investment: categoryKey === 'investment' ? newAccount.balance : 0
          },
          {
            headers: { Authorization: `Bearer ${newAccessToken}` },
            withCredentials: true,
          },
        );
  
        const newBalance = thirdResponse?.data;
  
        setBalancesData((prevData) => {
          const copyData = [...prevData];
          return [...copyData, newBalance];
        });
      } else if (result.length > 0 && !hasBalance) {
        const fourthResponse = await axios.put(
          BALANCES_URL + `/${balanceId}`,
          {
            year: year,
            cash: categoryKey === 'cash' ? newAccount.balance : cash,
            debt: categoryKey === 'debt' ? newAccount.balance : debt,
            investment: categoryKey === 'investment' ? newAccount.balance : investment
          },
          {
            headers: { Authorization: `Bearer ${newAccessToken}` },
            withCredentials: true,
          },
        );
  
        const updatedBalance = fourthResponse?.data;
        const foundBalanceIndex = balancesData.findIndex((item) => {
          return item._id === balanceId;
        });
  
        setBalancesData((prevData) => {
          const copyData = [...prevData];
          copyData.splice(foundBalanceIndex, 1, updatedBalance);
          return copyData;
        });
      } else if (result.length > 0 && hasBalance) { 
        const fifthResponse = await axios.put(
          BALANCES_URL + `/${balanceId}`,
          {
            year: year,
            cash: categoryKey === 'cash' ? formatBalances(cash, newAccount.balance) : cash,
            debt: categoryKey === 'debt' ? formatBalances(debt, newAccount.balance) : debt,
            investment: categoryKey === 'investment' ? 
              formatBalances(investment, newAccount.balance) : investment
          },
          {
            headers: { Authorization: `Bearer ${newAccessToken}` },
            withCredentials: true,
          },
        );

        const updatedBalance = fifthResponse?.data;
        const foundBalanceIndex = balancesData.findIndex((item) => {
          return item._id === balanceId;
        });

        setBalancesData((prevData) => {
          const copyData = [...prevData];
          copyData.splice(foundBalanceIndex, 1, updatedBalance);
          return copyData;
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const balanceResult = BALANCE_REGEX.test(balance);
    setValidBalance(balanceResult);
  }, [balance]);

  return (
    <Modal open={true} onClose={handleClose}>
      <Box sx={{ ...style, width: 300, borderRadius: '10px' }}>
        <Stack direction={'column'} spacing={2}>
          {addBtnIsSelected ? (
            <Typography sx={{ margin: '0 auto' }} variant="h6">
              Create New Account
            </Typography>
          ) : (
            <Typography sx={{ margin: '0 auto' }} variant="h6">
              Update Account
            </Typography>
          )}
          <TextField
            label="Account"
            type="text"
            name="account"
            id="account"
            autoComplete="off"
            fullWidth
            required
            value={accountName}
            onChange={(ev) => setAccountName(ev.target.value)}
            error={accountNameFocus && !accountName ? true : false}
            helperText={accountNameFocus && !accountName ? 'Enter account' : ''}
            onFocus={() => setAccountNameFocus(true)}
            onBlur={() => setAccountNameFocus(false)}
          ></TextField>
          <TextField
            label="Balance"
            type="text"
            name="balance"
            id="balance"
            autoComplete="off"
            fullWidth
            required
            value={balance}
            onChange={(ev) => setBalance(ev.target.value)}
            error={balanceFocus && !BALANCE_REGEX.test(balance) ? true : false}
            helperText={
              balanceFocus && !BALANCE_REGEX.test(balance) ? balanceErrMsg : ''
            }
            onFocus={() => setBalanceFocus(true)}
            onBlur={() => setBalanceFocus(false)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
          />
          <FormControl required fullWidth>
            <InputLabel id="demo-simple-select-required-label">
              Category
            </InputLabel>
            <Select
              labelId="demo-simple-select-required-label"
              id="demo-simple-select-required"
              value={category}
              label="Category*"
              onChange={(ev) => setCategory(ev.target.value)}
              onFocus={() => setCategoryFocus(true)}
              onBlur={() => setCategoryFocus(false)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {categoryList.map((item, index) => {
                return (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                );
              })}
            </Select>
            {categoryFocus && !category && (
              <FormHelperText>Choose category</FormHelperText>
            )}
          </FormControl>
          <Stack direction={'row'} spacing={2} sx={{ width: '100%' }}>
            <Button
              onClick={handleAddButton}
              variant="contained"
              disabled={
                validBalance &&
                accountName &&
                category &&
                addBtnIsSelected
                  ? false
                  : true
              }
            >
              Add
            </Button>
            <Button
              onClick={handleEditButton}
              variant="contained"
              disabled={
                validBalance &&
                accountName &&
                category &&
                !addBtnIsSelected
                  ? false
                  : true
              }
            >
              Update
            </Button>
            <Button onClick={handleClose} variant="contained">
              Close
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

export default AccountsModal;