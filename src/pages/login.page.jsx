import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import '../styles/login.style.css';

function LoginPage() {

  return (
    <Paper 
      elevation={0}
      sx={{
        p: 2.5,
        width: '350px',
        margin: '64px auto',
        border: '1px solid red'
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
          label="Email"
          type='email'
          placeholder="Email Address"
          fullWidth
          required
        >
        </TextField>
        <TextField
          label="Password"
          placeholder="Password"
          type="password"
          fullWidth
          required
        > 
        </TextField>
        <Button variant='contained' fullWidth>Sign in</Button>
        <Stack spacing={3} direction={'row'}>
          <Typography variant='caption'>
            <Link href="">Forgot password?</Link>
          </Typography>
          <Typography variant='caption'>
            <Link href="">Don't have an account? Sign up</Link>
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default LoginPage;
