import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { NavLink } from "react-router-dom";
import '../styles/login.style.css';

function LoginPage() {

  return (
    <Paper 
      elevation={0}
      sx={{
        p: 2.5,
        width: '350px',
        margin: '64px auto',
      }} 
    >
      <Stack spacing={3} direction={'column'} alignItems={'center'}>
        <Stack spacing={0} direction={'column'} alignItems={'center'}>
          <Avatar sx={{ bgcolor: 'purple' }}>
            <LockOutlinedIcon></LockOutlinedIcon>
          </Avatar>
          <Typography variant='h6' component={'h1'}>
            Sign in
          </Typography>
        </Stack>
        <TextField
          label="Email Address"
          type='email'
          fullWidth
          required
        >
        </TextField>
        <TextField
          label="Password"
          type="password"
          fullWidth
          required
        > 
        </TextField>
        <Button variant='contained' fullWidth>Sign in</Button>
        <Stack spacing={3} direction={'row'}>
          <NavLink to='' style={{color: '#1976d2'}}>
            <Typography variant='caption'>
              Forgot password?
            </Typography>
          </NavLink>
          <NavLink to='/register' style={{color: '#1976d2'}}>
            <Typography variant='caption'>
              Don't have an account? Sign up
            </Typography>
          </NavLink>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default LoginPage;
