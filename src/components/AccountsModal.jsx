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
import { getNetChg, getPercentChg, capitalizeFirstLetter } from '../helpers/networthPage.helper';

const ACCOUNTS_URL = '/api/accounts';
const REFRESHTOKEN_URL = '/refresh';

const AMOUNT_REGEX = /^(?:\d{1,}|\d+\.\d{2})$/;

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
  const { setSelectedAccounts } = useData();
  const { auth } = useAuth();

  const [accountName, setAccountName] = useState('');
  const [accountNameFocus, setAccountNameFocus] = useState(false);

  const [amount, setAmount] = useState('');
  const [amountFocus, setAmountFocus] = useState(false);
  const [validAmount, setValidAmount] = useState(false);

  const [category, setCategory] = useState('');
  const [categoryFocus, setCategoryFocus] = useState(false);

  const selectedItemId = selectedArr[0];

  const amountErrMsg = 'Format: xxxx.xx, or xxxx';
  const categoryList = ['Cash', 'Debt', 'Investment'];
  
  if (!addBtnIsSelected) {
    const result = accountsData.filter((balance) => {
      return balance._id === selectedItemId;
    });
  
    const foundAccount = result[0];

    useEffect(() => {
      setAccountName(foundAccount.account);
      setAmount(foundAccount.amount.toFixed(2));
      setCategory(capitalizeFirstLetter(foundAccount.category));
    }, []);
  }

  const handleClose = () => {
    setShowModal(false);
    setAddBtnIsSelected(false);
  };

  const handleEditBalance = async () => {
    setShowModal(false);
    setSelectedAccounts([]);

    const result = accountsData.filter((balance) => {
      return balance._id === selectedItemId;
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
          amount: Number(amount),
          category: category.toLowerCase(),
          netChg: getNetChg(foundAccount.amount, Number(amount)),
          percentChg: getPercentChg(foundAccount.amount, Number(amount))
        },
        {
          headers: { Authorization: `Bearer ${newAccessToken}` },
          withCredentials: true,
        },
      );

      const updatedAccount = secondResponse?.data;

      const foundIndex = accountsData.findIndex((item) => {
        return item._id === selectedItemId;
      });

      setAccountsData((prevData) => {
        const copyData = [...prevData];
        copyData.splice(foundIndex, 1, updatedAccount);
        return copyData;
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddBalance = async () => {
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
          amount: Number(amount),
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
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const amountResult = AMOUNT_REGEX.test(amount);
    setValidAmount(amountResult);
  }, [amount]);

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
            label="Amount"
            type="text"
            name="amount"
            id="amount"
            autoComplete="off"
            fullWidth
            required
            value={amount}
            onChange={(ev) => setAmount(ev.target.value)}
            error={amountFocus && !AMOUNT_REGEX.test(amount) ? true : false}
            helperText={
              amountFocus && !AMOUNT_REGEX.test(amount) ? amountErrMsg : ''
            }
            onFocus={() => setAmountFocus(true)}
            onBlur={() => setAmountFocus(false)}
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
              onClick={handleAddBalance}
              variant="contained"
              disabled={
                validAmount &&
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
              onClick={handleEditBalance}
              variant="contained"
              disabled={
                validAmount &&
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