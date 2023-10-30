import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useAuth from '../hooks/useAuth.hook';
import useData from '../hooks/useData.hook';
import axios from '../api/axios';

const LOGIN_URL = '/auth';
const GETEXPENSES_URL = '/api/expenses';
const GETACCOUNTS_URL = '/api/accounts';
const GETBALANCES_URL = '/api/balances';

function LoginPage() {
  const { setAuth } = useAuth();
  const { setExpensesData, setAccountsData } = useData();
  const { setBalancesData } = useData();

  const navigate = useNavigate();
  const from = '/';

  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showErrMsg, setShowErrMsg] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (ev) => {
    ev.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setEmail('');
    setPassword('');
    setOpen(true);

    try {
      const firstResponse = await axios.post(
        LOGIN_URL,
        JSON.stringify({ email, password }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        },
      );

      const accessToken = firstResponse?.data?.accessToken;
      const roles = firstResponse?.data?.roles;
      const userId = firstResponse?.data?.userId;

      const secondResponse = await axios.get(GETEXPENSES_URL + `/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      });

      const thirdResponse = await axios.get(GETACCOUNTS_URL + `/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      });

      const fourthResponse = await axios.get(GETBALANCES_URL + `/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      });

      const expensesData = secondResponse?.data;
      const accountsData = thirdResponse?.data;
      const balancesData = fourthResponse?.data;

      setExpensesData((prevData) => {
        const copyState = [...prevData];
        return [...copyState, ...expensesData];
      });

      setAccountsData((prevData) => {
        const copyState = [...prevData];
        return [...copyState, ...accountsData];
      });

      setBalancesData((prevData) => {
        const copyState = [...prevData];
        return [...copyState, ...balancesData];
      });

      setAuth({ userId, roles, accessToken });
      navigate(from, { replace: true });
      setOpen(false);
    } catch (err) {
      if (!err?.response) {
        setOpen(false);
        setShowErrMsg(true);
        setErrMsg('No server response');
      } else if (err.response?.status === 401) {
        setOpen(false);
        setShowErrMsg(true);
        setErrMsg('Incorrect email or password');
      } else {
        setOpen(false);
        setShowErrMsg(true);
        setErrMsg('Login failed');
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: '64px auto',
        maxWidth: '445px',
      }}
    >
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Avatar sx={{ bgcolor: '#9c27b0', m: 1 }}>
        <LockOutlinedIcon></LockOutlinedIcon>
      </Avatar>
      <Typography variant="h5" component={'h1'}>
        Sign In
      </Typography>
      <form onSubmit={handleSubmit} style={{ marginTop: '24px' }}>
        <Grid container spacing={2}>
          {showErrMsg && (
            <Grid item xs={12}>
              <Alert severity="error">{errMsg}</Alert>
            </Grid>
          )}
          <Grid item xs={12}>
            <TextField
              label="Email Address"
              type="email"
              name="email"
              id="email"
              fullWidth
              required
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
            ></TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              id="password"
              fullWidth
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
            ></TextField>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" fullWidth>
              Sign In
            </Button>
          </Grid>
          {/* <Grid item xs={5} sx={{ textAlign: 'left' }}>
            <NavLink to='' style={{ color: '#1976d2' }}>
              <Typography variant='caption'>
                Forgot password?
              </Typography>
            </NavLink>
          </Grid> */}
          <Grid item xs={12} sx={{ textAlign: 'right' }}>
            <NavLink to="/register" style={{ color: '#1976d2' }}>
              <Typography variant="caption">
                Don't have an account? Sign up
              </Typography>
            </NavLink>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}

export default LoginPage;
