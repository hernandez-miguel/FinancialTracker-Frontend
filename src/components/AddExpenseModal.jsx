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
import { modalStyle, categoryList} from '../helpers/expensesPage.helper';

const EXPENSES_URL = '/api/expenses';
const REFRESHTOKEN_URL = '/refresh';

const DATE_REGEX = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
const AMOUNT_REGEX = /^(?:\d{1,}|\d+\.\d{2})$/;

const AddExpenseModal = ({ setShowModal }) => {
  const { setExpensesData } = useData();
  const { auth } = useAuth();

  const [merchant, setMerchant] = useState('');
  const [merchantFocus, setMerchantFocus] = useState(false);

  const [date, setDate] = useState('');
  const [dateFocus, setDateFocus] = useState(false);
  const [validDate, setValidDate] = useState(false);

  const [amount, setAmount] = useState('');
  const [amountFocus, setAmountFocus] = useState(false);
  const [validAmount, setValidAmount] = useState(false);

  const [category, setCategory] = useState('');
  const [categoryFocus, setCategoryFocus] = useState(false);

  const [note, setNote] = useState('');

  const dateErrMsg = 'Format: yyyy-mm-dd';
  const amountErrMsg = 'Format: xxxx.xx, or xxxx';

  useEffect(() => {
    const dateResult = DATE_REGEX.test(date);
    setValidDate(dateResult);
    const amountResult = AMOUNT_REGEX.test(amount);
    setValidAmount(amountResult);
  }, [date, amount]);

  const handleClose = () => {
    setShowModal(false);
  };

  const handleAddExpense = async () => {
    setShowModal(false);

    try {
      const firstResponse = await axios.get(REFRESHTOKEN_URL, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      const newAccessToken = firstResponse?.data?.accessToken;

      const secondResponse = await axios.post(
        EXPENSES_URL + `/${auth?.userId}`,
        {
          merchant: merchant,
          date: date,
          amount: Number(amount),
          category: category.toLowerCase(),
          note: note,
        },
        {
          headers: { Authorization: `Bearer ${newAccessToken}` },
          withCredentials: true,
        },
      );

      const newData = secondResponse?.data;

      setExpensesData((prevData) => {
        const copyData = [...prevData];
        return [...copyData, newData];
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal open={true} onClose={handleClose}>
      <Box sx={{ ...modalStyle, width: 300, borderRadius: '10px' }}>
        <Stack direction={'column'} spacing={2}>
          <Typography variant="h6" textAlign={'center'}>
            Create New Expense
          </Typography>
          <TextField
            label="Merchant"
            type="text"
            name="merchant"
            id="merchant"
            autoComplete="off"
            fullWidth
            required
            value={merchant}
            onChange={(ev) => setMerchant(ev.target.value)}
            error={merchantFocus && !merchant ? true : false}
            helperText={merchantFocus && !merchant ? 'Enter merchant' : ''}
            onFocus={() => setMerchantFocus(true)}
            onBlur={() => setMerchantFocus(false)}
          ></TextField>
          <TextField
            label="Date"
            type="text"
            name="date"
            id="date"
            autoComplete="off"
            fullWidth
            required
            value={date}
            onChange={(ev) => setDate(ev.target.value)}
            error={dateFocus && !DATE_REGEX.test(date) ? true : false}
            helperText={dateFocus && !DATE_REGEX.test(date) ? dateErrMsg : ''}
            onFocus={() => setDateFocus(true)}
            onBlur={() => setDateFocus(false)}
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
            justifyContent={'space-between'}
            sx={{ width: '100%' }}
          >
            <Button
              onClick={handleAddExpense}
              sx={{ width: '45%' }}
              variant="contained"
              disabled={
                validDate && validAmount 
                && merchant && category 
                  ? false : true
              }
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

export default AddExpenseModal;
