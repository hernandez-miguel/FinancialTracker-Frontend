import Avatar from '@mui/material/Avatar';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth.hook';
import axios from '../api/axios';
import '../styles/register.page.css';

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_]).{8,24}$/;
const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const REGISTER_URL = '/register';

function RegisterPage() {
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const from = '/';

  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [showErrMsg, setShowErrMsg] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const [firstName, setFirstName] = useState('');
  const [firstNameFocus, setFirstNameFocus] = useState(false);

  const [lastName, setLastName] = useState('');
  const [lastNameFocus, setLastNameFocus] = useState(false);

  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const passwordErrMsg =
    '8 to 24 characters. Must include uppercase and lowercase letters, a number and a special character: !@#$%^&*()_';

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (ev) => {
    ev.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setOpen(true);

    const v1 = EMAIL_REGEX.test(email);
    const v2 = PASSWORD_REGEX.test(password);

    if (!v1 || !v2) {
      setOpen(false);
      setShowErrMsg(true);
      setErrMsg('Invalid Entry');
      return;
    }

    try {
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({ firstName, lastName, email, password }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        },
      );

      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles;
      const userId = response?.data?.userId;

      setAuth({ userId, roles, accessToken });
      navigate(from, { replace: true });
      setOpen(false);
    } catch (err) {
      if (!err?.response) {
        setOpen(false);
        setShowErrMsg(true);
        setErrMsg('No server response');
      } else if (err.response?.status === 409) {
        setOpen(false);
        setShowErrMsg(true);
        setErrMsg('Email already exists');
      } else {
        setOpen(false);
        setShowErrMsg(true);
        setErrMsg('Registration failed');
      }
    }
  };

  useEffect(() => {
    const passwordResult = PASSWORD_REGEX.test(password);
    const emailResult = EMAIL_REGEX.test(email);
    setValidPassword(passwordResult);
    setValidEmail(emailResult);
  }, [password, email]);

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
        Sign up
      </Typography>
      <form onSubmit={handleSubmit} style={{ marginTop: '24px' }}>
        <Grid container spacing={2}>
          {showErrMsg && (
            <Grid item xs={12}>
              <Alert severity="error">{errMsg}</Alert>
            </Grid>
          )}
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              type="text"
              name="firstName"
              id="firstName"
              fullWidth
              required
              value={firstName}
              onChange={(ev) => setFirstName(ev.target.value)}
              error={firstNameFocus && !firstName ? true : false}
              helperText={
                firstNameFocus && !firstName ? 'Enter first name' : ''
              }
              onFocus={() => setFirstNameFocus(true)}
              onBlur={() => setFirstNameFocus(false)}
            ></TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              type="text"
              name="lastName"
              id="lastName"
              fullWidth
              required
              value={lastName}
              onChange={(ev) => setLastName(ev.target.value)}
              error={lastNameFocus && !lastName ? true : false}
              helperText={lastNameFocus && !lastName ? 'Enter last name' : ''}
              onFocus={() => setLastNameFocus(true)}
              onBlur={() => setLastNameFocus(false)}
            ></TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email Address"
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              fullWidth
              required
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              error={
                emailFocus && EMAIL_REGEX.test(email) === false ? true : false
              }
              helperText={
                emailFocus && EMAIL_REGEX.test(email) === false
                  ? 'Enter email'
                  : ''
              }
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
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
              error={
                passwordFocus && PASSWORD_REGEX.test(password) === false
                  ? true
                  : false
              }
              helperText={
                passwordFocus && PASSWORD_REGEX.test(password) === false
                  ? passwordErrMsg
                  : ''
              }
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
            ></TextField>
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={
                validPassword && validEmail && firstName && lastName
                  ? false
                  : true
              }
            >
              Sign up
            </Button>
          </Grid>
        </Grid>
        <Grid item xs={3} sx={{ textAlign: 'right', py: 1.5 }}>
          <NavLink to="/login" style={{ color: '#1976d2' }}>
            <Typography variant="caption">
              Already have an account? Sign in
            </Typography>
          </NavLink>
        </Grid>
      </form>
    </Box>
  );
}

export default RegisterPage;
