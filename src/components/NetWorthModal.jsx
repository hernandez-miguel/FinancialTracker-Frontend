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

const BALANCES_URL = '/api/balances';
const REFRESHTOKEN_URL = '/refresh';

const YEAR_REGEX = /^\d{4}$/;
const AMOUNT_REGEX = /^(?:\d{2,}|\d+\.\d{2})$/;

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

const NetWorthModal = ({
  setShowModal,
  selectedArr,
  addBtnIsSelected,
  setAddBtnIsSelected,
}) => {
  const { netWorthData, setNetWorthData } = useData();
  const { setSelectedBalances } = useData();
  const { auth } = useAuth();

  const [account, setAccount] = useState('');
  const [accountFocus, setAccountFocus] = useState(false);

  const [year, setYear] = useState('');
  const [yearFocus, setYearFocus] = useState(false);
  const [validYear, setValidYear] = useState(false);

  const [amount, setAmount] = useState('');
  const [amountFocus, setAmountFocus] = useState(false);
  const [validAmount, setValidAmount] = useState(false);

  const [category, setCategory] = useState('');
  const [categoryFocus, setCategoryFocus] = useState(false);

  const [note, setNote] = useState('');

  const selectedItemId = selectedArr[0];

  const dateErrMsg = 'Format: yyyy';

  const categoryList = [
    'Cash',
    'Debt',
    'Investment'
  ];
  
  useEffect(() => {
    const yearResult = YEAR_REGEX.test(year);
    setValidYear(yearResult);
    const amountResult = AMOUNT_REGEX.test(amount);
    setValidAmount(amountResult);
  }, [year, amount]);

  if(!addBtnIsSelected) {
    useEffect(() => {
      const result = netWorthData.filter((balance) => {
        return balance._id === selectedItemId;
      });

      const foundBalance = result[0];

      setAccount(foundBalance.account);
      setAmount(foundBalance.amount);
      setYear(foundBalance.year);
      setCategory(foundBalance.category);
      setNote(foundBalance.note);
    }, [])
  }


  const handleClose = () => {
    setShowModal(false);
    setAddBtnIsSelected(false);
  };

  const handleEditBalance = async () => {
    setShowModal(false);
    setSelectedBalances([]);

    try {
      const firstResponse = await axios.get(REFRESHTOKEN_URL, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      const newAccessToken = firstResponse?.data?.accessToken;

      const secondResponse = await axios.put(
        BALANCES_URL + `/${selectedItemId}`,
        {
          account: account,
          year: Number(year),
          amount: Number(amount),
          category: category,
          note: note,
        },
        {
          headers: { Authorization: `Bearer ${newAccessToken}` },
          withCredentials: true,
        },
      );

     const updatedBalance = secondResponse?.data;

      const updatedBalanceObj = {
        _id: updatedBalance._id,
        account: updatedBalance.account,
        year: updatedBalance.year,
        amount: updatedBalance.amount,
        category: updatedBalance.category,
        note: updatedBalance.note
      }
      
      const foundIndex = netWorthData.findIndex((item) => {
        return item._id === selectedItemId;
      })

      setNetWorthData((prevData) => {
        const copyData = [...prevData];
        copyData.splice(foundIndex, 1, updatedBalanceObj)
        return (copyData);
      });
    } catch (err) {
      console.error(err);
    }
  }

  const handleAddBalance = async () => {
    setShowModal(false);

    try {
      const firstResponse = await axios.get(REFRESHTOKEN_URL, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      const newAccessToken = firstResponse?.data?.accessToken;

      const secondResponse = await axios.post(
        BALANCES_URL + `/${auth?.userId}`,
        {
          account: account,
          year: Number(year),
          amount: Number(amount),
          category: category,
          note: note,
        },
        {
          headers: { Authorization: `Bearer ${newAccessToken}` },
          withCredentials: true,
        },
      );

      const newData = secondResponse?.data;

      setNetWorthData((prevData) => {
        const copyData = [...prevData];
        return ([...copyData, newData]);
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal open={true} onClose={handleClose}>
      <Box sx={{ ...style, width: 300, borderRadius: '10px' }}>
        <Stack direction={'column'} spacing={2}>
          {addBtnIsSelected ? (
            <Typography sx={{ margin: '0 auto' }} variant="h6">
              Create New Balance
            </Typography>
          ) : (
            <Typography sx={{ margin: '0 auto' }} variant="h6">
              Update Balance
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
            value={account}
            onChange={(ev) => setAccount(ev.target.value)}
            error={accountFocus && !account ? true : false}
            helperText={accountFocus && !account ? 'Enter account' : ''}
            onFocus={() => setAccountFocus(true)}
            onBlur={() => setAccountFocus(false)}
          ></TextField>
          <TextField
            label="Year"
            type="text"
            name="year"
            id="year"
            autoComplete="off"
            fullWidth
            required
            value={year}
            onChange={(ev) => setYear(ev.target.value)}
            error={yearFocus && !YEAR_REGEX.test(year) ? true : false}
            helperText={yearFocus && !YEAR_REGEX.test(year) ? dateErrMsg : ''}
            onFocus={() => setYearFocus(true)}
            onBlur={() => setYearFocus(false)}
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
              amountFocus && !AMOUNT_REGEX.test(amount) ? 'Enter amount' : ''
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
          <TextField
            id="outlined-multiline-static"
            label="Note (Optional)"
            multiline
            fullWidth
            rows={4}
            value={note}
            onChange={(ev) => setNote(ev.target.value)}
          />
          <Stack
            direction={'row'}
            spacing={2}
            sx={{ width: '100%' }}
          >
            <Button
              onClick={handleAddBalance}
              variant="contained"
              disabled={
                validYear && validAmount && account && category && addBtnIsSelected
                  ? false : true
              }
            >
              Add
            </Button>
            <Button
              onClick={handleEditBalance}
              variant="contained"
              disabled={
                validYear && validAmount && account && category && !addBtnIsSelected
                  ? false : true
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

export default NetWorthModal;