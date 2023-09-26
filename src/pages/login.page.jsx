import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useAuth from '../hooks/useAuth.hook';
import useData from '../hooks/useData.hook';
import axios from '../api/axios';

const LOGIN_URL = '/auth';
const GETEXPENSES_URL = '/api/expenses';
const GETBALANCES_URL = '/api/balances';

function LoginPage() {
  const { setAuth } = useAuth();
  const { setExpensesData, setNetWorthData }  = useData();
  
  const navigate = useNavigate();
  const from = '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showErrMsg, setShowErrMsg] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setEmail('');
    setPassword('');

    try {
      const firstResponse = await axios.post(
        LOGIN_URL, 
        JSON.stringify({ email, password }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );

      const accessToken = firstResponse?.data?.accessToken;
      const roles = firstResponse?.data?.roles;
      const userId = firstResponse?.data?.userId;

      const secondResponse = await axios.get(
        GETEXPENSES_URL + `/${userId}`, 
        {
          headers: { 'Authorization': `Bearer ${accessToken}` },
          withCredentials: true
        }
      );

      const thirdResponse = await axios.get(
        GETBALANCES_URL + `/${userId}`, 
        {
          headers: { 'Authorization': `Bearer ${accessToken}` },
          withCredentials: true
        }
      );
        
      const expensesData = secondResponse?.data;
      const netWorthData = thirdResponse?.data;

      setExpensesData((prevData) => {
        const copyState = [...prevData];
        return ([...copyState, ...expensesData ]);
      });

      setNetWorthData((prevData) => {
        const copyState = [...prevData];
        return ([...copyState, ...netWorthData]);
      });

      setAuth({ userId, roles, accessToken });
      navigate(from, { replace: true });

    } catch (err) {
        if (!err?.response) {
            setShowErrMsg(true);
            setErrMsg('No server response');
        } else if (err.response?.status === 401) {
            setShowErrMsg(true);
            setErrMsg('Incorrect email or password');
        } else {
            setShowErrMsg(true);
            setErrMsg('Login failed');
        }
    }
  }
 
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
      <Avatar sx={{ bgcolor: '#9c27b0', m: 1 }}>
        <LockOutlinedIcon></LockOutlinedIcon>
      </Avatar>
      <Typography variant="h5" component={'h1'}>
        Sign In
      </Typography>
      <form onSubmit={handleSubmit} style={{ marginTop: '24px' }}>
        <Grid container spacing={2}>
          { showErrMsg && 
            <Grid item xs={12}>
              <Alert severity='error'>{errMsg}</Alert>
            </Grid>
          }
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
              type="password"
              name="password"
              id="password"
              fullWidth
              required
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
            ></TextField>
          </Grid>
          <Grid item xs={12}>
            <Button 
              type="submit" 
              variant="contained" 
              fullWidth
            >
              Sign In
            </Button>
          </Grid>
          <Grid item xs={5} sx={{ textAlign: 'left' }}>
            <NavLink to='' style={{ color: '#1976d2' }}>
              <Typography variant='caption'>
                Forgot password?
              </Typography>
            </NavLink>
          </Grid>
          <Grid item xs={7} sx={{ textAlign: 'right' }}>
            <NavLink to='/register' style={{ color: '#1976d2' }}>
              <Typography variant='caption'>
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
