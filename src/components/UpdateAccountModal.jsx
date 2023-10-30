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
import axios from '../api/axios';
import { getNetChg, getPercentChg, modalStyle } from '../helpers/networthPage.helper';
import { capitalizeFirstLetter, updateBalance } from '../helpers/networthPage.helper';

const ACCOUNTS_URL = '/api/accounts';
const BALANCES_URL = '/api/balances';
const REFRESHTOKEN_URL = '/refresh';

const BALANCE_REGEX = /^(?:\d{1,}|\d+\.\d{2})$/;

const UpdateAccountModal = ({ setShowModal, selectedArr }) => {
  const { accountsData, setAccountsData } = useData();
  const { balancesData, setBalancesData } = useData();
  const { setSelectedAccounts } = useData();

  const [accountName, setAccountName] = useState('');
  const [accountNameFocus, setAccountNameFocus] = useState(false);

  const [balance, setBalance] = useState('');
  const [balanceFocus, setBalanceFocus] = useState(false);
  const [validBalance, setValidBalance] = useState(false);

  const [category, setCategory] = useState('');
  const [categoryFocus, setCategoryFocus] = useState(false);

  const selectedItemId = selectedArr[0];
  
  const result = accountsData.filter((balance) => {
    return balance._id === selectedItemId;
  });

  const foundAccount = result[0];

  function compareBalances(str1, str2) {
    const num1 = parseFloat(str1);
    const num2 = parseFloat(str2);
    return num1 === num2;
  }

  const isSameName = foundAccount.account === accountName;
  const isSameBalance = compareBalances(foundAccount.balance, balance);
  
  const balanceErrMsg = 'Format: xxxx.xx, or xxxx';
  const categoryList = ['Cash', 'Debt', 'Investment'];

  const handleClose = () => {
    setShowModal(false);
  };

  const handleEditButton = async () => {
    setShowModal(false);
    setSelectedAccounts([]);

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
          balance: Number(balance),
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
          cash: categoryKey === 'cash' ? 
            updateBalance(cash, netChg, 'update') : cash,
          debt: categoryKey === 'debt' ? 
            updateBalance(debt, netChg, 'update') : debt,
          investment: categoryKey === 'investment' ? 
            updateBalance(investment, netChg, 'update') : investment
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

  useEffect(() => {
    setAccountName(foundAccount.account);
    setBalance(foundAccount.balance.toFixed(2));
    setCategory(capitalizeFirstLetter(foundAccount.category));
  }, []);

  useEffect(() => {
    const balanceResult = BALANCE_REGEX.test(balance);
    setValidBalance(balanceResult);
  }, [balance, accountName]);

  return (
    <Modal open={true} onClose={handleClose}>
      <Box sx={{ ...modalStyle, width: 300, borderRadius: '10px' }}>
        <Stack direction={'column'} spacing={2}>
          <Typography variant="h6" textAlign={'center'}>
            Update Account
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
              disabled={true}
            >
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
              onClick={handleEditButton}
              variant="contained"
              disabled={
                (validBalance && accountName && category) &&
                (!isSameBalance || !isSameName)
                ? false : true}
            >
              Update
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

export default UpdateAccountModal;