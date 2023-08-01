import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { NavLink } from "react-router-dom";

function RegisterPage() {

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
            Sign up
          </Typography>
        </Stack>
        <Stack spacing={3} direction={'row'}>
          <TextField
            label="First Name"
            type='text'
            fullWidth
            required
          >
          </TextField>
          <TextField
            label="Last Name"
            type='text'
            fullWidth
            required
          >
          </TextField>
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
        <Typography variant='caption'>
          <NavLink to='/login'>
            <Link>Already have an account? Sign in</Link>
          </NavLink>
        </Typography>
      </Stack>
    </Paper>
  );
}

export default RegisterPage;
