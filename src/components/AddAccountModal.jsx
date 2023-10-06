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
import { modalStyle } from '../helpers/networthPage.helper';
import { formatBalances } from '../helpers/networthPage.helper';

const ACCOUNTS_URL = '/api/accounts';
const BALANCES_URL = '/api/balances';
const REFRESHTOKEN_URL = '/refresh';

const BALANCE_REGEX = /^(?:\d{1,}|\d+\.\d{2})$/;

const AddAccountModal = ({ setShowModal }) => {
  const { setAccountsData } = useData();
  const { balancesData, setBalancesData } = useData();
  const { auth } = useAuth();

  const [accountName, setAccountName] = useState('');
  const [accountNameFocus, setAccountNameFocus] = useState(false);

  const [balance, setBalance] = useState('');
  const [balanceFocus, setBalanceFocus] = useState(false);
  const [validBalance, setValidBalance] = useState(false);

  const [category, setCategory] = useState('');
  const [categoryFocus, setCategoryFocus] = useState(false);

  const balanceErrMsg = 'Format: xxxx.xx, or xxxx';
  const categoryList = ['Cash', 'Debt', 'Investment'];

  const handleClose = () => {
    setShowModal(false);
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
          balance: Number(balance),
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
            debt: categoryKey === 'debt' ? newAccount.balance * -1 : 0,
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
            debt: categoryKey === 'debt' ? newAccount.balance * -1 : debt,
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
            debt: categoryKey === 'debt' ? formatBalances(debt, newAccount.balance * -1) : debt,
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
      <Box sx={{ ...modalStyle, width: 300, borderRadius: '10px' }}>
        <Stack direction={'column'} spacing={2}>
            <Typography sx={{ margin: '0 auto' }} variant="h6">
              Create New Account
            </Typography>
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
            helperText={accountNameFocus && !accountName ? 'Enter account name' : ''}
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
          <Stack 
            direction={'row'} 
            sx={{ width: '100%' }} 
            justifyContent={'space-between'}
          >
            <Button
              sx={{ width: '45%' }}
              onClick={handleAddButton}
              variant="contained"
              disabled={validBalance && accountName && category ? false : true}
            >
              Add
            </Button>
            <Button 
              onClick={handleClose} 
              variant="contained" 
              sx={{ width: '45%' }}
            >
              Close
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

export default AddAccountModal;